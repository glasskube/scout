import {Command, Flags} from '@oclif/core';
import path from 'node:path';

import {updateLatestVersion} from '../../../manifest.js';
import {Paths, packagePaths} from '../../../paths.js';

export default class Bump extends Command {
  static override readonly description = 'bump package latestVersion';
  static override readonly examples = ['<%= config.bin %> <%= command.id %>'];
  static override readonly flags = {
    // flag with no value (-c, --create-version)
    'dry-run': Flags.boolean({description: 'do not make any changes'}),
    // flag with no value (-f, --force)
    force: Flags.boolean({char: 'f'}),
    // flag with a value (-n, --name=VALUE)
    name: Flags.string({char: 'n', description: 'name to print', required: true}),
    // flag to determine the base folder
    source: Flags.string({char: 's', default: '.', description: 'packages context'}),
  };

  private paths!: Paths;

  protected override async init(): Promise<void> {
    const {flags} = await this.parse(Bump);
    this.paths = packagePaths(path.join(flags.source, 'packages'));
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(Bump);
    if (await updateLatestVersion(this.paths.package(flags.name))) {
      this.log(`latestVersion updated for ${flags.name}`);
    } else {
      this.log(`latestVersion update not required for ${flags.name}`);
    }
  }
}
