import {SemVer} from 'semver';

import {getLatestRelease} from './index.js';

import assert = require('assert');

describe('datasources/github', () => {
  it('should download latest tag from GitHub', async () => {
    const version = await getLatestRelease({
      owner: 'glasskube',
      path: '',
      raw: '',
      repo: 'glasskube',
      semVer: new SemVer("0.0.2")
    });
    assert.equal(version.version, new SemVer("0.0.2").version);
  })
})