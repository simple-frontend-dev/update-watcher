import { simpleGit } from "simple-git";
import { join, resolve } from "path";
import { getOctokitApp, getTokenAndOctokitWithAuth } from "./github-auth.js";
import {
  getPackageManager,
  getPackageManagerInstallCommand,
  getPackageManagerUpdateCommand,
} from "./package-manager.js";
import { packageInRepo } from "./check-package-in-repo.js";
import { execSync } from "child_process";
import { createPullRequest } from "./create-pull-request.js";
import { getUpdateBody } from "./get-update-body.js";
import { getRepositoryPullRequestTemplate } from "./get-repository-pull-request-template.js";

const REPOSITORIES_PATH = resolve(process.env.GITHUB_WORKSPACE!, "repositories");

export async function updateDependencyInRepos({
  packageName,
  packageVersion,
  updateBody,
}: {
  packageName: string;
  packageVersion: string;
  updateBody: string;
}) {
  const app = getOctokitApp();

  for await (const { installation } of app.eachInstallation.iterator()) {
    for await (const { octokit, repository } of app.eachRepository.iterator({
      installationId: installation.id,
    })) {
      try {
        console.log(`Working on repository: ${repository.full_name}`);

        const { token, octokitWithAuth } = await getTokenAndOctokitWithAuth({
          octokit,
          installationId: installation.id,
        });

        const template = await getRepositoryPullRequestTemplate({
          octokitWithAuth,
          owner: repository.owner.login,
          repo: repository.name,
        });

        const git = simpleGit()
          .addConfig("user.email", "jeremypa.colin@gmail.com", false, "global")
          .addConfig("user.name", "Jeremy Colin (Simple Frontend)", false, "global");

        const cloneUrl = `https://x-access-token:${token.token}@github.com/${repository.full_name}.git`;
        const repoPath = join(REPOSITORIES_PATH, repository.full_name);
        await git.clone(cloneUrl, repoPath);

        if (!packageInRepo({ packageName, repoPath })) {
          console.log(`${packageName} not found in ${repository.full_name}`);
          continue;
        }

        git.cwd(repoPath);
        const branchName = `chore/update-${packageName}-to-${packageVersion}`;
        await git.checkoutLocalBranch(branchName);

        const packageManager = getPackageManager({
          repoPath,
        });
        if (packageManager === "unknown") {
          console.warn(`Unknown package manager for ${repository.full_name}`);
          continue;
        }

        const packageManagerVersion = execSync(`${packageManager} --version`).toString();
        console.log(`Package manager: ${packageManager} v${packageManagerVersion}`);

        const packageManagerInstallCommand = getPackageManagerInstallCommand({
          packageManager,
        });
        console.log(`Running ${packageManagerInstallCommand}`);
        execSync(`${packageManagerInstallCommand}`, {
          cwd: repoPath,
        });

        const packageManagerUpdateCommand = getPackageManagerUpdateCommand({
          packageManager,
          repoPath,
          packageName,
          packageVersion,
        });
        console.log(`Running ${packageManagerUpdateCommand}`);
        execSync(`${packageManagerUpdateCommand}`, {
          cwd: repoPath,
        });

        const diff = await git.diffSummary();
        if (diff.changed === 0) {
          console.log(`No changes for ${repository.full_name}`);
          continue;
        }

        await git.add("./*");

        const commitMessage = `chore: update ${packageName} to ${packageVersion}`;

        await git.commit(commitMessage);
        await git.push("origin", branchName);

        await createPullRequest({
          octokitWithAuth,
          owner: repository.owner.login,
          repo: repository.name,
          title: commitMessage,
          head: branchName,
          base: repository.default_branch,
          packageName,
          packageVersion,
          updateBody,
          template,
        });
      } catch (error) {
        console.error(error);
      }
    }
  }
}

async function run() {
  try {
    const commitMessage = process.env.ENV_COMMIT_MESSAGE!;
    const packageNameVersion = commitMessage.split(":")[1];

    const lastAt = packageNameVersion?.lastIndexOf("@")!;
    const packageName = packageNameVersion?.slice(0, lastAt);
    const packageVersion = packageNameVersion?.slice(lastAt + 1);

    if (!packageName || !packageVersion) {
      throw new Error("Invalid commit message");
    }

    const updateBody = await getUpdateBody({
      packageName,
      packageVersion,
    });

    console.log(`Updating dependency in repos: ${packageName}@${packageVersion}`);

    updateDependencyInRepos({
      packageName,
      packageVersion,
      updateBody,
    });
  } catch (error) {
    console.error(error);
  }
}

run();
