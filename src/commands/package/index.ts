import {Args, Command, Flags} from '@oclif/core'
import {SemVer} from 'semver';

import {getArtifactPackage} from '../../datasources/artifacthub/index.js';
import {getLatestRelease} from '../../datasources/github-release/index.js';
import {createNewManifestVersion, getLatestManifest, getLatestVersion, updateHelmManifest} from '../../manifest.js';
import {PackageReference, PlainManifest} from '../../types/glasskube/package-manifest.js';
import {parseArtifactHubReferenceUrl, parseManifestUrl} from '../../utils/url-parser.js';

export default class Package extends Command {
  static override readonly aliases = ['update:package'];

  static override readonly args = {
    package: Args.string({description: 'package to scout', required: true}),
  }

  static override readonly description = 'describe the command here'

  static override readonly examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static override readonly flags = {
    // flag with no value (-c, --create-version)
    'dry-run': Flags.boolean({description: 'do not make any changes'}),
    // flag with no value (-f, --force)
    force: Flags.boolean({char: 'f'}),
    // flag with a value (-n, --name=VALUE)
    name: Flags.string({char: 'n', description: 'name to print'}),
    // flag to determine the base folder
    source: Flags.string({char: 's', description: 'packages context'})
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(Package)

    const packageManifest = await getLatestManifest(args.package, flags.source);

    const newPackageManifests = [];

    let newPackageManifestAvailable = false;
    let newAppVersion = await getLatestVersion(args.package, flags.source)

    for await (const plainManifest of packageManifest.manifests ?? []) {
      const manifestUrl = parseManifestUrl(plainManifest.url);
      this.log(`found manifest ${manifestUrl.path} in ${manifestUrl.owner}/${manifestUrl.repo} with version ${manifestUrl.semVer}`);
      const latestRelease = await getLatestRelease(manifestUrl);

      if (newPackageManifestAvailable && latestRelease.compare(newAppVersion) !== 0) {
        this.error('found different manifest version - appVersion resolution needed', {exit: 1});
      }

      if (latestRelease.compare(manifestUrl.semVer)) {
        newAppVersion = latestRelease;
        newPackageManifestAvailable = true;
        this.log(`new release on GitHub: ${latestRelease}`);
        newPackageManifests.push({url: manifestUrl.raw.replace(manifestUrl.semVer.raw, latestRelease.raw)} as PlainManifest);
      } else {
        this.log('no newer manifest release found');
      }
    }

    packageManifest.manifests = newPackageManifests;

    if (packageManifest.helm) {
      this.log(`found Helm release of chart ${packageManifest.helm.chartName} with version ${packageManifest.helm.chartVersion}`);

      const artifactHubUrl = this.findArtifactHubReference(packageManifest.references || [])

      if (artifactHubUrl) {
        const artifactHub = parseArtifactHubReferenceUrl(artifactHubUrl.url);
        const latestChart = await getArtifactPackage(artifactHub);
        const latestChartVersion = new SemVer(latestChart.version!);

        if (latestChartVersion.compare(new SemVer(packageManifest.helm.chartVersion))) {
          this.log(`new release on Artifact Hub: ${latestChartVersion}`);
          newAppVersion = new SemVer(latestChart.appVersion!);
          newPackageManifestAvailable = true;
          updateHelmManifest(packageManifest, latestChart);
        } else {
          this.log('no newer chart release found');
        }
      }
    }

    if (!flags['dry-run'] && (newPackageManifestAvailable || flags.force)) {
      this.log('will create new version');
      await createNewManifestVersion(packageManifest, newAppVersion, flags.source);
      this.log('latest version created');
    }

  }

  private findArtifactHubReference(references: PackageReference[]): PackageReference | undefined {
    return references.find(it => it.label === 'ArtifactHub')
  }

}
