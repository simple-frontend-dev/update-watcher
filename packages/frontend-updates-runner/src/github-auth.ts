import "dotenv/config";
import { App, Octokit } from "octokit";

export function getOctokitApp() {
  return new App({
    appId: process.env.ENV_GITHUB_APP_ID!,
    privateKey: process.env.ENV_GITHUB_PRIVATE_KEY!,
  });
}

type AppToken = {
  type: "token";
  tokenType: "installation";
  token: string;
  installationId: number;
  createdAt: string;
  expiresAt: string;
};

export async function getTokenAndOctokitWithAuth({
  octokit,
  installationId,
}: {
  octokit: Octokit;
  installationId: number;
}): Promise<{
  token: AppToken;
  octokitWithAuth: Octokit;
}> {
  const auth = (await octokit.auth({
    type: "installation",
    installationId,
  })) as AppToken;
  return {
    token: auth,
    octokitWithAuth: new Octokit({
      auth: auth.token,
    }),
  };
}
