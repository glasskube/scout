import path from 'node:path';

type StringSupplier = () => string;
type DirName = {readonly dirName: StringSupplier};
type IndexYaml = {readonly indexYaml: StringSupplier};
type VersionsYaml = {readonly versionsYaml: StringSupplier};
type ManifestYaml = {readonly packageYaml: StringSupplier};
export type PackageVersionPaths = DirName & ManifestYaml;
type WithPackageVersion = {readonly version: (version: string) => PackageVersionPaths};
export type PackagePaths = DirName & VersionsYaml & ManifestYaml & WithPackageVersion;
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
      }),
      versionsYaml: () => path.join(base, name, 'versions.yaml'),
    }),
  };
}
