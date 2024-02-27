import {SemVer} from 'semver';

import {PackageVersions} from '../types/types.js';
import {getBuildNumbers} from './index.js';

import assert = require('assert');

describe('services', () => {
  it('count versions correctly', async () => {
    const versions = {versions: [{version: 'v1.13.3+1'}, {version: 'v1.13.3+2'}, {version: 'v1.14.2+1'}]} as PackageVersions
    assert.deepEqual(await getBuildNumbers(new SemVer('v1.15.0'), versions), []);
    assert.deepEqual(await getBuildNumbers(new SemVer('v1.13.3'), versions), [1,2]);
    assert.deepEqual(await getBuildNumbers(new SemVer('v1.14.2'), versions), [1]);
  })
})
