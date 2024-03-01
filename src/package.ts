import {SemVer} from 'semver';

import {PackagePaths} from './paths.js';
import {PackageVersions} from './types/types.js';
import {parseYaml, read} from './utils/io.js';

export async function getPackageVersions(pkg: PackagePaths) {
  const versionsContent = await read(pkg.versionsYaml());
  return parseYaml<PackageVersions>(versionsContent);
}

export async function getBuildNumbers(version: SemVer, versions: PackageVersions) {
  return versions.versions
    .filter(it => version.compare(it.version) === 0)
    .map(it => Number(new SemVer(it.version).build ?? 1));
}

export async function getNextBuildNumber(appVersion: SemVer, pkg: PackagePaths) {
  const packageVersions = await getPackageVersions(pkg);
  return Math.max(0, ...(await getBuildNumbers(appVersion, packageVersions))) + 1;
}
