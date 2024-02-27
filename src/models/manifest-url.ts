import {SemVer} from 'semver';

export class ManifestUrl {
  readonly semVer: SemVer;

  // eslint-disable-next-line  max-params
  constructor(
    readonly raw: string,
    readonly owner: string,
    readonly repo: string,
    version: string,
    readonly path: string,
  ) {
    this.semVer = new SemVer(version);
  }
}
