import { PostgresDb } from "@fastify/postgres";

export async function initReleasesDatabase(pg: PostgresDb) {
  await pg.query(`
    CREATE TABLE IF NOT EXISTS releases (
      release_id BIGINT NOT NULL PRIMARY KEY,
      name TEXT NOT NULL,
      repo TEXT NOT NULL);
  `);
}
