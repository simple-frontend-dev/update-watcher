# Frontend Updates Runner

Syncs repositories where the github app is installed and creates pull request to update packages and provide meaningful release notes.

## Setup

pnpm with workspaces: `pnpm install` at the root to install.

## Worflow

1. Github app is installed on repositories
2. When a new version of a package is released, we are notified and we analyze the release and if it's either a security update or a meaningful release, creates an `md` file in `updates` with the name matching `packageName@releaseVersion.md`
3. We write the release note in the `packageName@releaseVersion.md` file
4. We commit it to this repository with the commit matching the following syntax: `trigger-frontend-updates:packageName@releaseVersion`, for example `trigger-frontend-updates:typescript@beta`
5. This in turns creates pull request to update packages and provide meaningful release notes in repositories where the app is installed.
