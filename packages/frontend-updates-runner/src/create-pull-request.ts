import { Octokit } from "octokit";

export async function createPullRequest({
  octokitWithAuth,
  owner,
  repo,
  title,
  head,
  base,
}: {
  octokitWithAuth: Octokit;
  owner: string;
  repo: string;
  title: string;
  head: string;
  base: string;
}) {
  const { data } = await octokitWithAuth.rest.pulls.create({
    owner,
    repo,
    title,
    head,
    base,
  });

  await octokitWithAuth.rest.pulls.update({
    owner,
    repo,
    pull_number: data.number,
    body: `${data.body}\n\nThis PR was created by a bot. Please review and merge it if it is good.`,
  });

  console.log(`Pull request created: ${owner}/${repo}#${data.number}`);
}
