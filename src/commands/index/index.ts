import {Command, Flags} from '@oclif/core';
import path from 'node:path';
import * as YAML from 'yaml';

import {getLatestManifest, getLatestVersion} from '../../manifest.js';
import {Paths, packagePaths} from '../../paths.js';
import {PackageRepoIndexItem} from '../../types/glasskube/index.js';
import {PackageIndex} from '../../types/types.js';
import {getFoldersIn, write} from '../../utils/io.js';

export default class Index extends Command {
  static override readonly aliases = ['update:index'];
  static override readonly description = 'updates the packages index';
  static override readonly examples = ['<%= config.bin %> <%= command.id %>'];
  static override readonly flags = {
    // flag with no value (-c, --create-version)
    'dry-run': Flags.boolean({description: 'do not make any changes'}),
    // flag to determine the base folder
    source: Flags.string({char: 's', default: '.', description: 'packages context'}),
  };

  private paths!: Paths;

  protected override async init(): Promise<void> {
    const {flags} = await this.parse(Index);
    this.paths = packagePaths(path.join(flags.source, 'packages'));
  }

  public override async run(): Promise<void> {
    const {flags} = await this.parse(Index);
    const packageFolders = await getFoldersIn(this.paths.dirName());

    const index: PackageIndex = {
      packages: await Promise.all(packageFolders.map(it => this.createPackageIndexItem(it))),
    };

    if (!flags['dry-run']) {
      const indexPath = this.paths.indexYaml();
      this.log('will rewrite index at', indexPath);
      await write(indexPath, YAML.stringify(index));
      this.log('index rewritten');
    }
  }

  private async createPackageIndexItem(packageFolder: string): Promise<PackageRepoIndexItem> {
    const packagePaths = this.paths.package(packageFolder);
    const latestVersion = await getLatestVersion(packagePaths);
    const packageManifest = await getLatestManifest(packagePaths);
    return {
      iconUrl: packageManifest.iconUrl,
      latestVersion: latestVersion.raw,
      name: packageFolder,
      scope: packageManifest.scope,
      shortDescription: packageManifest.shortDescription,
    };
  }
}
