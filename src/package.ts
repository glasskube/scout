import {SemVer} from 'semver';

import {PackageVersions} from './types/types.js';
import {parseYaml, read} from './utils/io.js';

export async function getPackageVersions(packageName: string, source?: string) {
  const versionsContent = await read(`${source}packages/${packageName}/versions.yaml`);
  return parseYaml<PackageVersions>(versionsContent);
}

export async function getBuildNumbers(version: SemVer, versions: PackageVersions) {
  return versions.versions
    .filter(it => version.compare(it.version) === 0)
    .map(it => Number(new SemVer(it.version).build ?? 1))
}

export async function getNextBuildNumber(appVersion: SemVer, packageName: string, source?: string) {
  const packageVersions = await getPackageVersions(packageName, source);
  return Math.max(0, ...await getBuildNumbers(appVersion, packageVersions)) + 1;
}

