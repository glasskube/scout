#!/usr/bin/env -S npx tsx

import {execute} from '@oclif/core';

await execute({development: true, dir: import.meta.url});
