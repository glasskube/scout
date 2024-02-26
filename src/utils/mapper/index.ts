import {ArtifactHubReference} from '../../models/artifact-hub-reference.js';
import {ManifestUrl} from '../../models/manifest-url.js';

const MANIFEST_REGEX = /^https:\/\/raw.githubusercontent.com\/(?<owner>[\da-z-]+)\/(?<repo>[\da-z-]+)\/(?<version>[\d.a-z-]+)(?<path>\/.*)/

export function parseManifestUrl(manifestUrl: string): ManifestUrl {
  if (MANIFEST_REGEX.test(manifestUrl)) {
    const group = MANIFEST_REGEX.exec(manifestUrl)?.groups ?? {};
    return new ManifestUrl(manifestUrl, group.owner, group.repo, group.version, group.path);
  }

  throw new Error(`Could not parse manifest version from url "${manifestUrl}"`);
}

const ARTIFACTHUB_URL_REGEX = /^https:\/\/artifacthub.io\/packages\/helm\/(?<owner>[\da-z-]+)\/(?<repo>[\da-z-]+)/

export function parseArtifactHubReference(referenceUrl: string): ArtifactHubReference {
  if (ARTIFACTHUB_URL_REGEX.test(referenceUrl)) {
    const group = ARTIFACTHUB_URL_REGEX.exec(referenceUrl)?.groups ?? {};
    return new ArtifactHubReference(referenceUrl, group.owner, group.repo);
  }

  throw new Error(`Could not parse Artifact Hub url "${referenceUrl}"`);
}
