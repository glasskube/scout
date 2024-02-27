export class ArtifactHubReference {
  constructor(
    readonly raw: string,
    readonly owner: string,
    readonly repo: string,
  ) {}
}
