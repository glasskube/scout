import {Package} from './artifacthub/index.js';
import {HttpsGlasskubeDevSchemasV1IndexJson} from './glasskube/index.js';
import {HttpsGlasskubeDevSchemasV1PackageManifestJson} from './glasskube/package-manifest.js';
import {HttpsGlasskubeDevSchemasV1VersionsJson} from './glasskube/versions.js';

export interface PackageManifest extends HttpsGlasskubeDevSchemasV1PackageManifestJson {
}

export interface PackageIndex extends HttpsGlasskubeDevSchemasV1IndexJson {
}

export interface PackageVersions extends HttpsGlasskubeDevSchemasV1VersionsJson {
}

export interface ArtifactHubPackage extends Package {
}
