#!/usr/bin/env sh

wget https://raw.githubusercontent.com/artifacthub/hub/master/web/src/types.ts -O 'src/types/artifacthub/index.ts'
wget https://raw.githubusercontent.com/artifacthub/hub/master/web/src/jsonschema.ts -O 'src/types/artifacthub/jsonschema.d.ts'
