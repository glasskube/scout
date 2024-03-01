import {ArtifactHubReference} from '../models/artifact-hub-reference.js';
import {ManifestUrl} from '../models/manifest-url.js';

const MANIFEST_REGEX =
  /^https:\/\/raw.githubusercontent.com\/(?<owner>[\da-z-]+)\/(?<repo>[\da-z-]+)\/(?<version>[\d.a-z-]+)(?<path>\/.*)/;

export function parseManifestUrl(manifestUrl: string): ManifestUrl {
  const group = MANIFEST_REGEX.exec(manifestUrl)?.groups;
  if (group !== undefined) {
    return new ManifestUrl(manifestUrl, group.owner, group.repo, group.version, group.path);
  }

  throw new Error(`Could not parse manifest version from url "${manifestUrl}"`);
}

const ARTIFACT_HUB_URL_REGEX = /^https:\/\/artifacthub.io\/packages\/helm\/(?<owner>[\da-z-]+)\/(?<repo>[\da-z-]+)/;

export function parseArtifactHubReferenceUrl(referenceUrl: string): ArtifactHubReference {
  const group = ARTIFACT_HUB_URL_REGEX.exec(referenceUrl)?.groups;
  if (group !== undefined) {
    return new ArtifactHubReference(referenceUrl, group.owner, group.repo);
  }

  throw new Error(`Could not parse Artifact Hub url "${referenceUrl}"`);
}
