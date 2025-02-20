import { PostgresDb } from "@fastify/postgres";
import { FastifyBaseLogger } from "fastify";
import { initGithubApp } from "../github-app.js";
import { REPOS_TO_WATCH } from "./config.js";
import { createReleaseIssue } from "./create-release-issue.js";

export async function pollReleases({
  octokit,
  pg,
  logger,
}: {
  octokit: Awaited<ReturnType<typeof initGithubApp>>;
  pg: PostgresDb;
  logger: FastifyBaseLogger;
}) {
  logger.info("Polling releases");
  for (const { owner, repo } of REPOS_TO_WATCH) {
    const { data } = await octokit.rest.repos.listReleases({
      owner,
      repo,
      per_page: 10,
      page: 1,
    });

    for (const release of data) {
      const { rows } = await pg.query(
        `SELECT EXISTS(SELECT 1 FROM releases WHERE release_id = $1)`,
        [release.id]
      );

      if (rows[0].exists) {
        continue;
      }

      logger.info(`Found New release: ${release.name} for ${owner}/${repo}`);

      await createReleaseIssue({
        octokit,
        owner,
        repo,
        release,
        logger,
      });

      await pg.query(
        `INSERT INTO releases (release_id, name, repo) VALUES ($1, $2, $3)`,
        [release.id, release.tag_name, repo]
      );
    }
  }
}
