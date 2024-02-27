import {SemVer} from 'semver';
import * as YAML from 'yaml';

import {getNextBuildNumber, getPackageVersions} from './package.js';
import {PackageIndexItem} from './types/glasskube/versions.js';
import {ArtifactHubPackage, PackageManifest} from './types/types.js';
import {createDir, parseYaml, read, write} from './utils/io.js';

export async function createNewManifestVersion(packageManifest: PackageManifest, latestAppVersion: SemVer, source?: string) {
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
  const packageVersions = await getPackageVersions(packageName, source);
  packageVersions.versions.push({version} as PackageIndexItem);
  await write(`${source}packages/${packageName}/versions.yaml`, YAML.stringify(packageVersions));
}

export async function getLatestVersion(name: string, source?: string) {
  const packageVersions = await getPackageVersions(name, source);
  return new SemVer(packageVersions.latestVersion);
}

export async function getLatestManifest(name: string, source?: string) {
  const latestVersion = await getLatestVersion(name, source);
  const stringContent = await read(`${source}packages/${name}/${latestVersion.raw}/package.yaml`);
  return parseYaml<PackageManifest>(stringContent);
}

export function updateHelmManifest(packageData: PackageManifest, artifactHubData: ArtifactHubPackage) {
  packageData.longDescription = artifactHubData.description;
  packageData.helm = {
    chartName: artifactHubData.name,
    chartVersion: artifactHubData.version ?? "0.0.0",
    repositoryUrl: artifactHubData.repository.url,
    values: packageData.helm?.values
  };
}

