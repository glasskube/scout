import {ArtifactHubReference} from '../../models/artifact-hub-reference.js';
import {getArtifactPackage} from './index.js';

import assert = require('node:assert');

describe('datasources/artifacthub', () => {
  it('should download latest package from artifacthub', async () => {
    const data = await getArtifactPackage(new ArtifactHubReference('', 'k8sgpt', 'k8sgpt-operator'));
    assert.equal(data.version, "0.1.0");
  })
})
