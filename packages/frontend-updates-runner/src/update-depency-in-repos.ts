import { simpleGit } from "simple-git";
import { join } from "path";
import { getOctokitApp, getTokenAndOctokitWithAuth } from "./github-auth.js";
import {
  getPackageManager,
  getPackageManagerCommand,
} from "./package-manager.js";
import { packageInRepo } from "./check-package-in-repo.js";
import { execSync } from "child_process";
import { createPullRequest } from "./create-pull-request.js";
import { getUpdateBody } from "./get-update-body.js";

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

        const git = simpleGit()
          .addConfig(
            "user.email",
            "noreply@simplefrontend.dev",
            false,
            "global",
          )
          .addConfig("user.name", "Simple Frontend (Jeremy)", false, "global");

        const cloneUrl = `https://x-access-token:${token.token}@github.com/${repository.full_name}.git`;
        await git.clone(cloneUrl, `repositories/${repository.full_name}`);

        const repoPath = join(
          process.cwd(),
          "repositories",
          repository.full_name,
        );

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
        const packageManagerCommand = getPackageManagerCommand({
          packageManager,
          repoPath,
          packageName,
          packageVersion,
        });
        console.log(`Running ${packageManagerCommand}`);
        execSync(`${packageManagerCommand}`, {
          cwd: repoPath,
        });

        const diff = await git.diffSummary();
        if (diff.changed === 0) {
          console.log(`No changes for ${repository.full_name}`);
          continue;
        }

        const commitMessage = `chore: update ${packageName} to ${packageVersion}`;

        await git.add("./*");
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
    const [packageName, packageVersion] = commitMessage
      .split(":")[1]
      ?.split("@")!;

    if (!packageName || !packageVersion) {
      throw new Error("Invalid commit message");
    }

    const updateBody = await getUpdateBody({
      packageName,
      packageVersion,
    });

    console.log(
      `Updating dependency in repos: ${packageName}@${packageVersion}`,
    );

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
