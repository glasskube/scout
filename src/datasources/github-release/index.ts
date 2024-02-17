import {Octokit} from '@octokit/rest';
import {SemVer} from 'semver';

import {ManifestUrl} from '../../models/manifest-url.js';


const oktokit = new Octokit();

export async function getLatestRelease(manifest: ManifestUrl): Promise<SemVer> {
  const response = await oktokit.rest.repos.getLatestRelease({owner: manifest.owner, repo: manifest.repo});
  return new SemVer(response.data.tag_name);
}
