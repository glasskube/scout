export class ArtifactHubReference {
  readonly owner: string;
  readonly raw: string;
  readonly repo: string;

  constructor(raw: string, owner: string, repo: string) {
    this.raw = raw;
    this.owner = owner;
    this.repo = repo;
  }
}

