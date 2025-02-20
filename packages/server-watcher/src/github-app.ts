import { App } from "octokit";
import { FastifyBaseLogger } from "fastify";

export async function initGithubApp({ logger }: { logger: FastifyBaseLogger }) {
  try {
    const app = new App({
      appId: process.env.GITHUB_APP_ID!,
      privateKey: process.env.GITHUB_PRIVATE_KEY!,
    });

    const octokit = await app.getInstallationOctokit(
      Number(process.env.GITHUB_INSTALLATION_ID)
    );

    return octokit;
  } catch (error) {
    logger.error(error);
    throw error;
  }
}
