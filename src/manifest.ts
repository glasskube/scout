import {copyFile} from 'node:fs/promises';
import {join} from 'node:path';
import {SemVer} from 'semver';
import * as YAML from 'yaml';

import {getPackageVersions} from './package.js';
import {ManifestYaml, PackagePaths, PackageVersionPaths} from './paths.js';
import {ArtifactHubPackage, PackageManifest} from './types/types.js';
import {createDir, exists, getFilesIn, parseYaml, read, write} from './utils/io.js';

export async function createNewManifestVersion(
  packagePaths: PackagePaths,
  packageManifest: PackageManifest,
  latestAppVersion: SemVer,
) {
  await writePackageManifestFile(packagePaths.version(latestAppVersion.raw), packageManifest);
  await updateVersionsFile(packagePaths, latestAppVersion.raw);
}

export async function copyUnmanagedFiles(pkg: PackagePaths, oldVersion: SemVer, newVersion: SemVer) {
  const oldVersionDir = pkg.version(oldVersion.raw);
  const newVersionDir = pkg.version(newVersion.raw);
  await Promise.all(
    (await getFilesIn(oldVersionDir.dirName()))
      .filter(file => file !== 'package.yaml')
      .map(async file => await copyFile(join(oldVersionDir.dirName(), file), join(newVersionDir.dirName(), file))),
  );
}

export async function copyTestDirectory(pkg: PackagePaths, oldVersion: SemVer, newVersion: SemVer) {
  const oldVersionDir = pkg.version(oldVersion.raw);
  const newVersionDir = pkg.version(newVersion.raw);
  if (await exists(oldVersionDir.testDir())) {
    await createDir(newVersionDir.testDir());
    await Promise.all(
      (await getFilesIn(oldVersionDir.testDir())).map(
        async file => await copyFile(join(oldVersionDir.testDir(), file), join(newVersionDir.testDir(), file)),
      ),
    );
  }
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

export async function updateLatestVersion(paths: PackagePaths): Promise<boolean> {
  const packageVersions = await getPackageVersions(paths);
  if (packageVersions.versions.length > 0) {
    const maxVersion = packageVersions.versions
      .map(it => new SemVer(it.version))
      .sort((a, b) => a.compare(b) || a.compareBuild(b))[packageVersions.versions.length - 1];
    const currentLatestVersion = new SemVer(packageVersions.latestVersion);
    if ((maxVersion.compare(currentLatestVersion) || maxVersion.compareBuild(currentLatestVersion)) > 0) {
      packageVersions.latestVersion = maxVersion.raw;
      await write(paths.versionsYaml(), YAML.stringify(packageVersions));
      return true;
    }
  }

  return false;
}

export async function getLatestVersion(paths: PackagePaths): Promise<SemVer> {
  const packageVersions = await getPackageVersions(paths);
  return new SemVer(packageVersions.latestVersion);
}

export async function getMaxVersion(paths: PackagePaths): Promise<SemVer> {
  const versions = (await getPackageVersions(paths)).versions.map(it => new SemVer(it.version));
  versions.sort((a, b) => a.compare(b));
  const maxVersion = versions.at(-1);
  if (maxVersion) {
    return maxVersion;
  }

  throw new Error('versions must not be empty');
}

export async function getManifest(paths: ManifestYaml) {
  return parseYaml<PackageManifest>(await read(paths.packageYaml()));
}

export async function getLatestManifest(paths: PackagePaths) {
  return getManifest(paths.version((await getLatestVersion(paths)).raw));
}

export async function getMaxVersionManifest(paths: PackagePaths) {
  return getManifest(paths.version((await getMaxVersion(paths)).raw));
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
