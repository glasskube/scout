#!/usr/bin/env sh

BASE_URL="https://glasskube.dev/schemas/v1"
TARGET_DIR="src/types/glasskube"
for SCHEMA in "package-manifest" "index" "versions"; do
  OUT="$TARGET_DIR/$SCHEMA.d.ts"
  echo "update $OUT"
  curl -sf "$BASE_URL/$SCHEMA.json" | json2ts -o "$OUT"
done
