import {Command, Flags} from '@oclif/core';
import path from 'node:path';
import {SemVer} from 'semver';

import {getArtifactPackage, getArtifactPackageVersion} from '../../datasources/artifacthub/index.js';
import {getLatestRelease} from '../../datasources/github-release/index.js';
import {createNewManifestVersion, getLatestManifest, getLatestVersion, updateHelmManifest} from '../../manifest.js';
import {Paths, packagePaths} from '../../paths.js';
import {PackageReference, PlainManifest} from '../../types/glasskube/package-manifest.js';
import {parseArtifactHubReferenceUrl, parseManifestUrl} from '../../utils/url-parser.js';

export default class Package extends Command {
  static override readonly aliases = ['update:package'];
  static override readonly description = 'describe the command here';
  static override readonly examples = ['<%= config.bin %> <%= command.id %>'];
  static override readonly flags = {
    // flag with no value (-c, --create-version)
    'dry-run': Flags.boolean({description: 'do not make any changes'}),
    // flag with no value (-f, --force)
    force: Flags.boolean({char: 'f'}),
    // flag with a value (-n, --name=VALUE)
    name: Flags.string({char: 'n', description: 'name to print', required: true}),
    // flag to determine the base folder
    source: Flags.string({char: 's', default: '.', description: 'packages context'}),
  };

  private paths!: Paths;

  protected override async init(): Promise<void> {
    const {flags} = await this.parse(Package);
    this.paths = packagePaths(path.join(flags.source, 'packages'));
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(Package);
    const packagePaths = this.paths.package(flags.name);
    const packageManifest = await getLatestManifest(packagePaths);
    const newPackageManifests: PlainManifest[] = [];

    let newPackageManifestAvailable = false;
    const currentAppVersion = await getLatestVersion(packagePaths);
    let newAppVersion = currentAppVersion;

    for await (const plainManifest of packageManifest.manifests ?? []) {
      const manifestUrl = parseManifestUrl(plainManifest.url);
      this.log(
        `found manifest ${manifestUrl.path} in ${manifestUrl.owner}/${manifestUrl.repo} with version ${manifestUrl.semVer}`,
      );
      const latestRelease = await getLatestRelease(manifestUrl);

      if (newPackageManifestAvailable && latestRelease.compare(newAppVersion) !== 0) {
        this.error('found different manifest version - appVersion resolution needed', {exit: 1});
      }

      if (latestRelease.compare(manifestUrl.semVer)) {
        newAppVersion = latestRelease;
        newPackageManifestAvailable = true;
        this.log(`new release on GitHub: ${latestRelease}`);
        newPackageManifests.push({
          url: manifestUrl.raw.replace(manifestUrl.semVer.raw, latestRelease.raw),
        });
      } else {
        this.log('no newer manifest release found');
      }
    }

    if (newPackageManifests.length > 0) {
      packageManifest.manifests = newPackageManifests;
    }

    if (packageManifest.helm) {
      const currentChartVersion = new SemVer(packageManifest.helm.chartVersion).format();
      this.log(`found Helm release of chart ${packageManifest.helm.chartName} with version ${currentChartVersion}`);

      const artifactHubUrl = this.findArtifactHubReference(packageManifest.references ?? []);

      if (artifactHubUrl) {
        const reference = parseArtifactHubReferenceUrl(artifactHubUrl.url);
        const latestChart = await getArtifactPackage(reference);
        const latestChartVersion = new SemVer(latestChart.version!);
        if (latestChartVersion.compare(new SemVer(packageManifest.helm.chartVersion)) > 0) {
          this.log(`new release on Artifact Hub: ${latestChartVersion} (old: ${currentChartVersion})`);
          const currentChart = await getArtifactPackageVersion(reference, currentChartVersion);
          if (currentAppVersion.compare(new SemVer(currentChart.version!)) === 0) {
            this.log(`using chart version as package version for ${flags.name}: ${latestChartVersion}`);
            newAppVersion = latestChartVersion;
            newPackageManifestAvailable = true;
          } else if (currentAppVersion.compare(new SemVer(currentChart.appVersion!)) === 0) {
            this.log(`using app version as package version for ${flags.name}: ${latestChart.appVersion}`);
            newAppVersion = new SemVer(latestChart.appVersion!);
            newPackageManifestAvailable = true;
          } else {
            this.warn(`can not determine version to use for ${flags.name}`);
          }

          updateHelmManifest(packageManifest, latestChart);
        } else {
          this.log('no newer chart release found');
        }
      } else {
        this.warn(`${flags.name} has no ArtifactHub reference`);
      }
    }

    if (!flags['dry-run'] && (newPackageManifestAvailable || flags.force)) {
      this.log('will create new version');
      await createNewManifestVersion(packagePaths, packageManifest, newAppVersion);
      this.log('latest version created');
    }
  }

  private findArtifactHubReference(references: PackageReference[]): PackageReference | undefined {
    return references.find(it => it.label === 'ArtifactHub');
  }
}
