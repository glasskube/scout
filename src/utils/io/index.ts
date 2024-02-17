import fs from 'node:fs/promises';
import * as YAML from 'yaml';


export async function createDir(folderPath: string) {
  await fs.mkdir(folderPath);
}

export async function read(filePath: string) {
  return fs.readFile(filePath, {encoding: 'utf8'});
}

export async function write(filePath: string, data: string) {
  return fs.writeFile(filePath, data);
}

export async function parseYaml<Type>(yamlContent: string) {
  return YAML.parse(yamlContent) as Type;
}

export async function getPackageFolders(path: string) {
  const allFiles = await fs.readdir(path);
  return allFiles.filter(it => it !== 'index.yaml').filter(it => it !== 'schema.json');
}
