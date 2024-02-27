#!/usr/bin/env sh

TAG="master"
BASE_URL="https://raw.githubusercontent.com/artifacthub/hub/$TAG/web/src"
TARGET_DIR="src/types/artifacthub"

echo "update $TARGET_DIR/index.ts"
curl -sfo "$TARGET_DIR/index.ts" "$BASE_URL/types.ts" &&
  sed -i "s/'\.\/jsonschema';/'\.\/jsonschema.js';\n\ndeclare namespace JSX { export type Element = never; }/g" "$TARGET_DIR/index.ts"
echo "update $TARGET_DIR/jsonschema.d.ts"
curl -sfo "$TARGET_DIR/jsonschema.d.ts" "$BASE_URL/jsonschema.ts"
