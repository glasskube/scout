import {Package} from './artifacthub/index.js';
import {HttpsGlasskubeDevSchemasV1IndexJson} from './glasskube/index.js';
import {HttpsGlasskubeDevSchemasV1PackageManifestJson} from './glasskube/package-manifest.js';
import {HttpsGlasskubeDevSchemasV1VersionsJson} from './glasskube/versions.js';

type PackageManifest = HttpsGlasskubeDevSchemasV1PackageManifestJson;

type PackageIndex = HttpsGlasskubeDevSchemasV1IndexJson;

type PackageVersions = HttpsGlasskubeDevSchemasV1VersionsJson;

type ArtifactHubPackage = Package;
