import { Octokit } from "octokit";

const PR_TEMPLATE_PATHS = [".github/pull_request_template.md", ".github/PULL_REQUEST_TEMPLATE.md"];

export async function getRepositoryPullRequestTemplate({
  octokitWithAuth,
  owner,
  repo,
}: {
  octokitWithAuth: Octokit;
  owner: string;
  repo: string;
}): Promise<string | null> {
  for (const path of PR_TEMPLATE_PATHS) {
    try {
      const res = await octokitWithAuth.rest.repos.getContent({
        owner,
        repo,
        path,
      });

      // check that it's a file content
      if ("content" in res.data) {
        return Buffer.from(res.data.content, res.data.encoding as BufferEncoding).toString("utf-8");
      }
    } catch (error) {
      console.warn(`Unable to read PR template at ${path} for ${owner}/${repo}`);
    }
  }

  return null;
}
