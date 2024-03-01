import {SemVer} from 'semver';
import * as YAML from 'yaml';

import {getNextBuildNumber, getPackageVersions} from './package.js';
import {PackagePaths, PackageVersionPaths} from './paths.js';
import {ArtifactHubPackage, PackageManifest} from './types/types.js';
import {createDir, parseYaml, read, write} from './utils/io.js';

export async function createNewManifestVersion(
  packagePaths: PackagePaths,
  packageManifest: PackageManifest,
  latestAppVersion: SemVer,
) {
  const buildNumber = await getNextBuildNumber(latestAppVersion, packagePaths);
  const version = `v${latestAppVersion}+${buildNumber}`;
  await writePackageManifestFile(packagePaths.version(version), packageManifest);
  await updateVersionsFile(packagePaths, version);
}

async function writePackageManifestFile(paths: PackageVersionPaths, packageManifest: PackageManifest) {
  await createDir(paths.dirName());
  await write(
    paths.packageYaml(),
    '# yaml-language-server: $schema=https://glasskube.dev/schemas/v1/package-manifest.json\n\n' +
      YAML.stringify(packageManifest),
  );
}

async function updateVersionsFile(paths: PackagePaths, version: string) {
  const packageVersions = await getPackageVersions(paths);
  packageVersions.versions.push({version});
  await write(paths.versionsYaml(), YAML.stringify(packageVersions));
}

export async function getLatestVersion(paths: PackagePaths) {
  const packageVersions = await getPackageVersions(paths);
  return new SemVer(packageVersions.latestVersion);
}

export async function getLatestManifest(paths: PackagePaths) {
  const latestVersion = await getLatestVersion(paths);
  const stringContent = await read(paths.version(latestVersion.raw).packageYaml());
  return parseYaml<PackageManifest>(stringContent);
}

export function updateHelmManifest(packageData: PackageManifest, artifactHubData: ArtifactHubPackage) {
  packageData.longDescription = artifactHubData.description;
  packageData.helm = {
    chartName: artifactHubData.name,
    chartVersion: artifactHubData.version ?? '0.0.0',
    repositoryUrl: artifactHubData.repository.url,
    values: packageData.helm?.values,
  };
}
