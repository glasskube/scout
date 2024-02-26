import {PackageManifest} from '../../types/types.js';
import {parseYaml} from './index.js';

import assert = require('assert');

describe('utils/package', () => {
  it('should parse the package yaml correctly', async () => {
    const input =
      `
# yaml-language-server: $schema=../schema.json
name: test-package
shortDescription: Glasskube CI Test package
longDescription: |
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce ullamcorper magna sit amet mauris consectetur,
  ut fermentum arcu vehicula. Nullam euismod lacus ut velit varius, sit amet gravida sapien viverra.
references:
  - label: Github
    url: https://github.com/glasskube/glasskube
  - label: Website
    url: https://glasskube.dev/
defaultNamespace: default
iconUrl: https://glasskube.dev/img/logo.png
manifests:
entrypoints:
  - serviceName: example
    port: 8080
    name: test
            `

    const manifest = await parseYaml<PackageManifest>(input);
    assert.equal(manifest.name, "test-package");
  })
})
