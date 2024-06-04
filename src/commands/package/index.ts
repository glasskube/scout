import {Command, Flags} from '@oclif/core';
import path from 'node:path';
import {SemVer} from 'semver';

import {getArtifactPackage, getArtifactPackageVersion} from '../../datasources/artifacthub/index.js';
import {getLatestRelease} from '../../datasources/github-release/index.js';
import {
  copyUnmanagedFiles,
  createNewManifestVersion,
  getMaxVersion,
  getMaxVersionManifest,
  updateHelmManifest,
} from '../../manifest.js';
import {ManifestUrl} from '../../models/manifest-url.js';
import {withNextBuildNumber} from '../../package.js';
import {Paths, packagePaths} from '../../paths.js';
import {PackageReference} from '../../types/glasskube/package-manifest.js';
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
    const packageManifest = await getMaxVersionManifest(packagePaths);

    let newPackageManifestAvailable = false;
    const currentAppVersion = await getMaxVersion(packagePaths);
    let newAppVersion = currentAppVersion;

    if (packageManifest.helm) {
      const currentChartVersion = new SemVer(packageManifest.helm.chartVersion);
      this.log(`found Helm release of chart ${packageManifest.helm.chartName} with version ${currentChartVersion.raw}`);

      const artifactHubUrl = this.findArtifactHubReference(packageManifest.references ?? []);
      if (artifactHubUrl) {
        const referenceUrl = parseArtifactHubReferenceUrl(artifactHubUrl.url);
        const latestChart = await getArtifactPackage(referenceUrl);
        const latestChartVersion = new SemVer(latestChart.version!);
        if (latestChartVersion.compare(currentChartVersion) > 0) {
          this.log(`new release on Artifact Hub: ${latestChartVersion} (old: ${currentChartVersion.format()})`);
          // download the current chart and determine whether this package uses the chart version or app version for
          // the package version.
          // Versions from artifacthub are null-checked first, because SemVer.compare(undefined) returns 0 (equal)!
          const currentChart = await getArtifactPackageVersion(referenceUrl, currentChartVersion.format());
          if (currentChart.version && currentAppVersion.compare(currentChart.version) === 0) {
            this.log(`using chart version as package version for ${flags.name}: ${latestChartVersion}`);
            newAppVersion = latestChartVersion;
            newPackageManifestAvailable = true;
          } else if (
            currentChart.appVersion &&
            latestChart.appVersion &&
            currentAppVersion.compare(currentChart.appVersion) === 0
          ) {
            this.log(`using app version as package version for ${flags.name}: ${latestChart.appVersion}`);
            newAppVersion = new SemVer(latestChart.appVersion);
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
    } else {
      for await (const plainManifest of packageManifest.manifests ?? []) {
        let manifestUrl: ManifestUrl;
        try {
          manifestUrl = parseManifestUrl(plainManifest.url);
        } catch (error) {
          this.warn(error as Error);
          continue;
        }

        this.log(
          `found manifest ${manifestUrl.path} in ${manifestUrl.owner}/${manifestUrl.repo} with version ${manifestUrl.semVer}`,
        );
        const latestRelease = await getLatestRelease(manifestUrl);

        if (newPackageManifestAvailable && latestRelease.compare(newAppVersion) !== 0) {
          this.error('found different manifest version - appVersion resolution needed', {exit: 1});
        }

        if (latestRelease.compare(manifestUrl.semVer) > 0) {
          newAppVersion = latestRelease;
          newPackageManifestAvailable = true;
          this.log(`new release on GitHub: ${latestRelease}`);
          plainManifest.url = manifestUrl.raw.replace(manifestUrl.semVer.raw, latestRelease.raw);
        } else {
          this.log('no newer manifest release found');
        }
      }
    }

    if (newPackageManifestAvailable || flags.force) {
      newAppVersion = await withNextBuildNumber(newAppVersion, packagePaths);
      for (const manifest of packageManifest.manifests ?? []) {
        if (
          manifest.url.startsWith('https://packages.dl.glasskube.dev/') ||
          manifest.url.startsWith('https://glasskube.github.io/')
        ) {
          const newUrl = manifest.url.replace(currentAppVersion.raw, newAppVersion.raw);
          this.log(`update manifest URL: ${manifest.url} -> ${newUrl}`);
          manifest.url = newUrl;
        }
      }

      if (!flags['dry-run']) {
        this.log('will create new version');
        await createNewManifestVersion(packagePaths, packageManifest, newAppVersion);
        await copyUnmanagedFiles(packagePaths, currentAppVersion, newAppVersion);
        this.log('latest version created');
      }
    }
  }

  private findArtifactHubReference(references: PackageReference[]): PackageReference | undefined {
    return references.find(it => it.label === 'ArtifactHub');
  }
}
