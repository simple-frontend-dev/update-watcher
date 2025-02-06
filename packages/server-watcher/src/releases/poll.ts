import { PostgresDb } from "@fastify/postgres";
import { FastifyBaseLogger } from "fastify";
import { initGithubApp } from "../github-app.js";

// type Release = {
//   id: number;
//   html_url: string;
//   tag_name: string;
//   name: string;
//   draft: boolean;
//   prerelease: boolean;
//   published_at: string;
// };

export async function pollReleases({
  octokit,
  pg,
  logger,
}: {
  octokit: Awaited<ReturnType<typeof initGithubApp>>;
  pg: PostgresDb;
  logger: FastifyBaseLogger;
}) {
  const owner = "microsoft";
  const repo = "typescript";

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
      return;
    }

    logger.info(`Found New release: ${release.name} for ${repo}`);

    await pg.query(
      `INSERT INTO releases (release_id, name, repo) VALUES ($1, $2, $3)`,
      [release.id, release.tag_name, repo]
    );
  }
}
