import {HttpResponse, http} from 'msw';
import {setupServer} from 'msw/node';
import * as assert from 'node:assert';

import * as response from '../../../testdata/artifacthub.response.json';
import {ArtifactHubReference} from '../../models/artifact-hub-reference.js';
import {getArtifactPackage} from './index.js';

const handler = http.get('https://artifacthub.io/api/v1/packages/helm/k8sgpt/k8sgpt-operator', () =>
  HttpResponse.json(response),
);

const server = setupServer(handler);

describe('datasources/artifacthub', () => {
  before(() => server.listen());
  after(() => server.close());

  it('should download latest package from artifacthub', async () => {
    const data = await getArtifactPackage(new ArtifactHubReference('', 'k8sgpt', 'k8sgpt-operator'));
    assert.equal(data.version, '0.1.1');
  });
});
