import { Octokit } from "octokit";

export async function createPullRequest({
  octokitWithAuth,
  owner,
  repo,
  title,
  head,
  base,
  packageName,
  packageVersion,
}: {
  octokitWithAuth: Octokit;
  owner: string;
  repo: string;
  title: string;
  head: string;
  base: string;
  packageName: string;
  packageVersion: string;
}) {
  const { data } = await octokitWithAuth.rest.pulls.create({
    owner,
    repo,
    title,
    head,
    base,
  });

  const previousBody = data.body ? `${data.body}\n\n` : "";

  await octokitWithAuth.rest.pulls.update({
    owner,
    repo,
    pull_number: data.number,
    body: `${previousBody} - Chore: Update ${packageName} to ${packageVersion}\n\nThis PR was created by Simple Frontend (Jeremy) following an important release.`,
  });

  console.log(`Pull request created: ${owner}/${repo}#${data.number}`);
}
