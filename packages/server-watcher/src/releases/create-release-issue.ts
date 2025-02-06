import { initGithubApp } from "../github-app.js";
import { FastifyBaseLogger } from "fastify";

const OWNER = "simple-frontend-dev";
const REPO = "update-watcher";

type Release = {
  id: number;
  html_url: string;
  tag_name: string;
  name: string | null;
  draft: boolean;
  prerelease: boolean;
  published_at: string | null;
};

function createReleaseIssueBody({
  owner,
  repo,
  release,
}: {
  owner: string;
  repo: string;
  release: Release;
}) {
  const name = release.name ?? "";
  const published_at = release.published_at ?? "No published_at date";

  return `### ${name} release for ${owner}/${repo}
### Tag: ${release.tag_name}
### [Release URL](${release.html_url})
### Published at: ${published_at}
### Draft: ${release.draft}
### Prerelease: ${release.prerelease}
`;
}

export async function createReleaseIssue({
  octokit,
  owner,
  repo,
  release,
  logger,
}: {
  octokit: Awaited<ReturnType<typeof initGithubApp>>;
  owner: string;
  repo: string;
  release: Release;
  logger: FastifyBaseLogger;
}) {
  const body = createReleaseIssueBody({ owner, repo, release });

  await octokit.rest.issues.create({
    owner: OWNER,
    repo: REPO,
    title: `${release.tag_name} release for ${repo}`,
    body,
  });

  logger.info(`Created issue for ${release.name} for ${owner}/${repo}`);
}
