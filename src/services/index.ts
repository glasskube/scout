import {SemVer} from 'semver';
import * as YAML from 'yaml';

import {HelmManifest} from '../types/glasskube/package-manifest.js';
import {PackageIndexItem} from '../types/glasskube/versions.js';
import {ArtifactHubPackage, PackageManifest, PackageVersions} from '../types/types.js';
import {createDir, parseYaml, read, write} from '../utils/io/index.js';

export async function createNewVersion(packageManifest: PackageManifest, latestAppVersion: SemVer, source?: string) {
  const packageName = packageManifest.name;

  const buildNumber = await getNextBuildNumber(latestAppVersion, packageName, source)
  const version = `v${latestAppVersion}+${buildNumber}`;
  const latestVersionPath = `${source}packages/${packageName}/${version}`;
  await writePackageManifestFile(latestVersionPath, packageManifest);
  await updateVersionsFile(packageName, version, source)

}

async function writePackageManifestFile(latestVersionPath: string, packageManifest: PackageManifest) {
  await createDir(latestVersionPath);
  await write(`${latestVersionPath}/package.yaml`, '# yaml-language-server: $schema=https://glasskube.dev/schemas/v1/package-manifest.json\n\n' + YAML.stringify(packageManifest));
}

async function updateVersionsFile(packageName: string, version: string, source?: string) {
  const packageVersions = await getVersions(packageName, source);
  packageVersions.versions.push({version} as PackageIndexItem);
  await write(`${source}packages/${packageName}/versions.yaml`, YAML.stringify(packageVersions));
}

export async function getVersions(packageName: string, source?: string) {
  const versionsContent = await read(`${source}packages/${packageName}/versions.yaml`);
  return parseYaml<PackageVersions>(versionsContent);
}

export async function getMatchingVersionsCount(version: SemVer, versions: PackageVersions) {
  return versions.versions.filter(it => version.compare(it.version) === 0).length
}

export async function getNextBuildNumber(appVersion: SemVer, packageName: string, source?: string) {
  const packageVersions = await getVersions(packageName, source);
  return await getMatchingVersionsCount(appVersion, packageVersions) + 1;
}

export function updateHelmManifest(packageData: PackageManifest, artifactHubData: ArtifactHubPackage) {
  packageData.longDescription = artifactHubData.description;
  packageData.helm = {
    chartName: artifactHubData.name,
    chartVersion: artifactHubData.version,
    repositoryUrl: artifactHubData.repository.url,
    values: packageData.helm?.values
  } as HelmManifest;
}

export async function getLatestVersion(name: string, source?: string) {
  const packageVersions = await getVersions(name, source);
  return new SemVer(packageVersions.latestVersion);
}

export async function getLatestManifest(name: string, source?: string) {
  const latestVersion = await getLatestVersion(name, source);
  const stringContent = await read(`${source}packages/${name}/${latestVersion.raw}/package.yaml`);
  return parseYaml<PackageManifest>(stringContent);
}
