import {PackageManifest} from '../../types/types.js';
import {parseYaml} from './index.js';

import assert = require('assert');

describe('utils/package', () => {
  it('should parse the package yaml correctly', async () => {
    const input =
      `
# yaml-language-server: $schema=../schema.json
name: cyclops
shortDescription: Developer friendly Kubernetes
longDescription: |
  Welcome to Cyclops, a powerful user interface for managing and interacting with Kubernetes clusters.
  Cyclops is designed to simplify the management of containerized applications on Kubernetes,
  providing an intuitive and user-friendly experience for developers, system administrators, and DevOps professionals.
  Divide the responsibility between your infrastructure and your developer teams so everyone can play to their strengths.
  Automate your processes and shrink the window for deployment mistakes.
references:
  - label: Github
    url: https://github.com/cyclops-ui/cyclops
  - label: Website
    url: https://cyclops-ui.com/
defaultNamespace: cyclops
iconUrl: https://cyclops-ui.com/img/logo.png
manifests:
  - url: https://raw.githubusercontent.com/cyclops-ui/cyclops/v0.0.1-alpha.10/install/cyclops-install.yaml
entrypoints:
  - serviceName: cyclops-ui
    port: 3000
    name: ui
  - serviceName: cyclops-ctrl
    port: 8080
    name: ctrl
            `

    const manifest = await parseYaml<PackageManifest>(input);
    assert.equal(manifest.name, "cyclops");
  })
})
