import fastify from "fastify";
import fastifyHelmet from "@fastify/helmet";
import fastifyEnv from "@fastify/env";
import fastifyPostgres from "@fastify/postgres";
import { initGithubApp } from "./github-app.js";
import { pollReleases } from "./releases/poll.js";
import { initReleasesDatabase } from "./releases/db.js";

async function serverSetup() {
  const fastifyServer = fastify({ logger: true });

  fastifyServer.register(fastifyHelmet);
  await fastifyServer.register(fastifyEnv, {
    dotenv: {
      path: ".env",
    },
    schema: {
      type: "object",
      required: ["GITHUB_APP_ID", "GITHUB_PRIVATE_KEY"],
      properties: {
        GITHUB_APP_ID: { type: "string" },
        GITHUB_PRIVATE_KEY: { type: "string" },
      },
    },
  });

  await fastifyServer.register(fastifyPostgres, {
    connectionString: process.env.DATABASE_URL,
  });

  await initReleasesDatabase(fastifyServer.pg);

  const octokit = await initGithubApp({ logger: fastifyServer.log });
  pollReleases({ octokit, pg: fastifyServer.pg, logger: fastifyServer.log });

  fastifyServer.get("/ping", async (_request, _reply) => {
    return "pong\n";
  });

  fastifyServer.listen({ port: 8080 }, (err, _address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
  });
}

serverSetup();
