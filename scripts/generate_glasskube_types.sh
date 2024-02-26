#!/usr/bin/env sh

curl https://glasskube.dev/schemas/v1/package-manifest.json | json2ts > src/types/glasskube/package-manifest.d.ts
curl https://glasskube.dev/schemas/v1/index.json | json2ts > src/types/glasskube/index.d.ts
curl https://glasskube.dev/schemas/v1/versions.json | json2ts > src/types/glasskube/versions.d.ts
