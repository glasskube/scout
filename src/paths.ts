import path from 'node:path';

type StringSupplier = () => string;
type DirName = {readonly dirName: StringSupplier};
type IndexYaml = {readonly indexYaml: StringSupplier};
export type VersionsYaml = {readonly versionsYaml: StringSupplier};
export type ManifestYaml = {readonly packageYaml: StringSupplier};
export type TestDir = {readonly testDir: StringSupplier};
export type PackageVersionPaths = DirName & ManifestYaml & TestDir;
type WithPackageVersion = {readonly version: (version: string) => PackageVersionPaths};
export type PackagePaths = DirName & ManifestYaml & VersionsYaml & WithPackageVersion;
type WithPackage = {readonly package: (name: string) => PackagePaths};
export type Paths = DirName & IndexYaml & WithPackage;

export function packagePaths(base: string): Paths {
  return {
    dirName: () => base,
    indexYaml: () => path.join(base, 'index.yaml'),
    package: (name: string) => ({
      dirName: () => path.join(base, name),
      packageYaml: () => path.join(base, name, 'package.yaml'),
      version: (version: string) => ({
        dirName: () => path.join(base, name, version),
        packageYaml: () => path.join(base, name, version, 'package.yaml'),
        testDir: () => path.join(base, name, version, '.test'),
      }),
      versionsYaml: () => path.join(base, name, 'versions.yaml'),
    }),
  };
}
