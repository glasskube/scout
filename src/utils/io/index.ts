import fs from 'node:fs/promises';
import * as YAML from 'yaml';

export async function createDir(folderPath: string) {
  await fs.mkdir(folderPath);
}

export async function read(filePath: string) {
  return await fs.readFile(filePath, {encoding: 'utf8'});
}

export async function write(filePath: string, data: string) {
  return await fs.writeFile(filePath, data);
}

export async function parseYaml<Type>(yamlContent: string) {
  return await YAML.parse(yamlContent) as Type;
}

export async function getFoldersIn(path: string) {
  const allFiles = await fs.readdir(path, {withFileTypes: true});
  return allFiles.filter(it => it.isDirectory()).map(it => it.name);
}
