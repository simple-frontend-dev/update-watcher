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

const PACKAGE = "typescript";
const VERSION = "beta";

export async function updateDependencyInRepos({
  packageName,
  packageVersion,
}: {
  packageName: string;
  packageVersion: string;
}) {
  const app = getOctokitApp();

  for await (const { installation } of app.eachInstallation.iterator()) {
    for await (const { octokit, repository } of app.eachRepository.iterator({
      installationId: installation.id,
    })) {
      try {
        console.log(`Working on ${repository.full_name}`);

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

        await git.add("./*");
        await git.commit("chore: update dependencies");
        await git.push("origin", branchName);

        await createPullRequest({
          octokitWithAuth,
          owner: repository.owner.login,
          repo: repository.name,
          title: `chore: update ${packageName} to ${packageVersion}`,
          head: branchName,
          base: "main",
          packageName,
          packageVersion,
        });
      } catch (error) {
        console.error(error);
      }
    }
  }
}

updateDependencyInRepos({
  packageName: PACKAGE,
  packageVersion: VERSION,
});
