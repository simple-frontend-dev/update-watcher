import { simpleGit } from "simple-git";
import { join } from "path";
import { getOctokitApp, getTokenAndOctokitWithAuth } from "./github-auth.js";
import {
  getPackageManager,
  getPackageManagerCommand,
} from "./package-manager.js";
import { execSync } from "child_process";

const PACKAGE = "typescript";
const VERSION = "beta";

async function createPullRequest() {
  const app = getOctokitApp();

  for await (const { installation } of app.eachInstallation.iterator()) {
    for await (const { octokit, repository } of app.eachRepository.iterator({
      installationId: installation.id,
    })) {
      try {
        const { token, octokitWithAuth } = await getTokenAndOctokitWithAuth({
          octokit,
          installationId: installation.id,
        });

        let git = simpleGit();
        console.log(`Cloning ${repository.full_name}`);
        const cloneUrl = `https://x-access-token:${token.token}@github.com/${repository.full_name}.git`;
        await git.clone(cloneUrl, `repositories/${repository.full_name}`);

        const repoPath = join(
          process.cwd(),
          "repositories",
          repository.full_name,
        );

        git = simpleGit(repoPath);
        const branchName = `chore/update-${PACKAGE}-${VERSION}`;
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
          packageName: PACKAGE,
          packageVersion: VERSION,
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

        const pr = await octokitWithAuth.rest.pulls.create({
          owner: repository.owner.login,
          repo: repository.name,
          title: `chore: update dependencies`,
          head: branchName,
          base: "main",
          body: `This PR updates ${PACKAGE} to ${VERSION}.`,
        });

        console.log(`Created PR ${pr.data.html_url}`);
      } catch (error) {
        console.error(error);
      }
    }
  }
}

createPullRequest();
