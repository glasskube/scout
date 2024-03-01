# Scout Setup Action

This is a GitHub Workflow Action to setup @glasskube/scout.

## Inputs

- `token` (required): The GitHub Token used to authenticate against the GitHub package registry.
  You can use ${{ secrets.GITHUB_TOKEN }} or a custom personal access token.
  It needs permission to read public packages from the GitHub package registry.
