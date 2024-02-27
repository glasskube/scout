import * as path from 'node:path';

export function buildPath(pathToAdd: string, source?: string) {
  return source ? path.join(source, pathToAdd) : pathToAdd;
}
