import fastify from "fastify";
import fastifyHelmet from "@fastify/helmet";
import fastifyEnv from "@fastify/env";
import fastifyPostgres from "@fastify/postgres";
import { initGithubApp } from "./github-app.js";
import { initializeReleases } from "./releases/init.js";
import { initReleasesDatabase } from "./releases/db.js";
import { pollReleases } from "./releases/poll.js";

const RELEASES_POLL_INTERVAL = 1000 * 60 * 60 * 4; // 4 hours

async function serverSetup() {
  const fastifyServer = fastify({ logger: true });

  await fastifyServer.register(fastifyHelmet);

  await fastifyServer.register(fastifyEnv, {
    dotenv: true,
    schema: {
      type: "object",
      required: [
        "GITHUB_APP_ID",
        "GITHUB_PRIVATE_KEY",
        "GITHUB_INSTALLATION_ID",
        "DATABASE_URL",
      ],
      properties: {
        GITHUB_APP_ID: { type: "string" },
        GITHUB_PRIVATE_KEY: { type: "string" },
        GITHUB_INSTALLATION_ID: { type: "number" },
        DATABASE_URL: { type: "string" },
      },
    },
  });

  await fastifyServer.register(fastifyPostgres, {
    connectionString: process.env.DATABASE_URL,
  });

  await initReleasesDatabase(fastifyServer.pg);

  const octokit = await initGithubApp({ logger: fastifyServer.log });

  const initializeReleasesFlag = process.env.INITIALIZE_RELEASES === "true";
  if (initializeReleasesFlag) {
    await initializeReleases({
      octokit,
      pg: fastifyServer.pg,
      logger: fastifyServer.log,
    });
  }

  setInterval(() => {
    pollReleases({
      octokit,
      pg: fastifyServer.pg,
      logger: fastifyServer.log,
    });
  }, RELEASES_POLL_INTERVAL);
}

serverSetup();
