import {Command, Flags} from '@oclif/core'
import * as YAML from 'yaml';

import {buildPath, getLatestManifest, getLatestVersion} from '../../services/index.js';
import {PackageRepoIndexItem} from '../../types/glasskube/index.js';
import {PackageIndex} from '../../types/types.js';
import {getFoldersIn, write} from '../../utils/io/index.js';

export default class Index extends Command {
  static override readonly description = 'updates packages index'

  static override readonly examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static override readonly flags = {
    // flag with no value (-c, --create-version)
    'dry-run': Flags.boolean({description: 'do not make any changes'}),
    // flag to determine the base folder
    source: Flags.string({char: 's', description: 'packages context'})
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(Index);

    const {source} = flags;
    const packageFolders = await getFoldersIn(buildPath('packages', source));

    const index = {
      packages: await Promise.all(packageFolders.map(it => this.createPackageIndexItem(it, source)))
    } as PackageIndex;

    if (!flags['dry-run']) {
      this.log('will rewrite index');
      await write(buildPath('index.yaml', source), YAML.stringify(index));
      this.log('index rewritten');
    }
  }

  private async createPackageIndexItem(packageFolder: string, source?: string) {
    const latestVersion = await getLatestVersion(packageFolder, source);
    const packageManifest = await getLatestManifest(packageFolder, source);
    return {
      name: packageFolder,
      // eslint-disable-next-line  perfectionist/sort-objects
      iconUrl: packageManifest.iconUrl,
      latestVersion: latestVersion.raw,
      shortDescription: packageManifest.shortDescription,
    } as PackageRepoIndexItem;
  }

}
