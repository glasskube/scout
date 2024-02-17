import {SemVer} from 'semver';

export class ManifestUrl {
  readonly owner: string;
  readonly path: string;
  readonly raw: string;
  readonly repo: string;
  readonly semVer: SemVer;

  // eslint-disable-next-line  max-params
  constructor(raw: string, owner: string, repo: string, version: string, path: string) {
    this.raw = raw;
    this.owner = owner;
    this.repo = repo;
    this.semVer = new SemVer(version);
    this.path = path;
  }
}
