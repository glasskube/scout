import * as fs from 'node:fs/promises';
import * as YAML from 'yaml';

export async function createDir(folderPath: string): Promise<void> {
  await fs.mkdir(folderPath);
}

export async function read(filePath: string): Promise<string> {
  return await fs.readFile(filePath, {encoding: 'utf8'});
}

export async function write(filePath: string, data: string): Promise<void> {
  await fs.writeFile(filePath, data);
}

export async function parseYaml<T>(yamlContent: string): Promise<T> {
  return (await YAML.parse(yamlContent)) as T;
}

export async function getFoldersIn(path: string): Promise<string[]> {
  const allFiles = await fs.readdir(path, {withFileTypes: true});
  return allFiles.filter(it => it.isDirectory()).map(it => it.name);
}
