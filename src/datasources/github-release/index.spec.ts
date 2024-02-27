import {expect} from 'chai';
import {HttpResponse, http} from 'msw';
import {setupServer} from 'msw/node';
import {SemVer} from 'semver';

import {getLatestRelease} from './index.js';

const handler = http.get(
  'https://api.github.com/repos/glasskube/glasskube/releases/latest',
  // eslint-disable-next-line camelcase
  () => HttpResponse.json({tag_name: '0.0.2'}),
);

const server = setupServer(handler);

describe('datasources/github', () => {
  before(() => server.listen());
  after(() => server.close());

  it('should download latest tag from GitHub', async () => {
    const version = await getLatestRelease({
      owner: 'glasskube',
      path: '',
      raw: '',
      repo: 'glasskube',
      semVer: new SemVer('0.0.2'),
    });

    expect(handler.isUsed).to.be.true;
    expect(version.version).to.eq('0.0.2');
  });
});
