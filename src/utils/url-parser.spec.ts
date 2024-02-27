import * as assert from 'node:assert';

import {parseArtifactHubReferenceUrl, parseManifestUrl} from './url-parser.js';

describe('utils/manifest/parse', () => {
  it('should parse version from GitHub release manifest url', () => {
    const manifest = parseManifestUrl("https://raw.githubusercontent.com/username/repository/v0.0.1-alpha.10/path/to/file.yaml");
    assert.equal(manifest.owner, "username");
    assert.equal(manifest.repo, "repository");
    assert.equal(manifest.semVer.raw, "v0.0.1-alpha.10");
    assert.equal(manifest.path, "/path/to/file.yaml");
  });
  it('should parse actual cyclops manifest url', () => {
    const manifest = parseManifestUrl("https://raw.githubusercontent.com/cyclops-ui/cyclops/v0.0.1-alpha.10/install/cyclops-install.yaml");
    assert.equal(manifest.owner, "cyclops-ui");
    assert.equal(manifest.repo, "cyclops");
    assert.equal(manifest.semVer.raw, "v0.0.1-alpha.10");
    assert.equal(manifest.path, "/install/cyclops-install.yaml");
  })
})

describe('utils/manifest/parseArtifactHubReference', () => {
  it('should parse Artifact Hub data url', () => {
    const artifactHub = parseArtifactHubReferenceUrl("https://artifacthub.io/packages/helm/cert-manager/cert-manager");
    assert.equal(artifactHub.owner, "cert-manager");
    assert.equal(artifactHub.repo, "cert-manager");
  });
})

