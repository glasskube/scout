import * as changeKeys from 'change-case/keys';

import {ArtifactHubReference} from '../../models/artifact-hub-reference.js';
import {ArtifactHubPackage} from '../../types/types.js';

const BASE_URL = 'https://artifacthub.io/api/v1/packages/helm';

export async function getArtifactPackage(artifactHub: ArtifactHubReference) {
  const response = await fetch(`${BASE_URL}/${artifactHub.owner}/${artifactHub.repo}`);
  const newVar = await response.json();
  return changeKeys.camelCase(newVar) as ArtifactHubPackage;
}
