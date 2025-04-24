## Worfklow

1. Install the [frontend-update Github App](https://github.com/apps/frontend-updates) in your repositories
2. When a new version of a package is released, we are notified and we analyze the release and if it's either a security update or a meaningful release then we provide a handcrafted release note
3. This in turns creates pull request to update the package and provide the release notes in repositories where the app is installed

## [Frontend Updates Runner](./packages/frontend-updates-runner/README.md)

## Setup

pnpm with workspaces: `pnpm install` at the root to install dependencies.
