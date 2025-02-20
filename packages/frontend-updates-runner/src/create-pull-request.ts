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
  updateBody,
}: {
  octokitWithAuth: Octokit;
  owner: string;
  repo: string;
  title: string;
  head: string;
  base: string;
  packageName: string;
  packageVersion: string;
  updateBody: string;
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
    body: `${previousBody}This PR was created by Simple Frontend (Jeremy) following an important release for ${packageName}.\n\n${updateBody}`,
  });

  console.log(`Pull request created: ${owner}/${repo}#${data.number}`);
}
