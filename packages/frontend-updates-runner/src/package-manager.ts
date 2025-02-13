import { statSync, readFileSync } from "fs";
import { join } from "path";

type PackageManager = "npm" | "yarn" | "pnpm" | "unknown";

export function getPackageManager({
  repoPath,
}: {
  repoPath: string;
}): PackageManager {
  try {
    const packageLockfile = statSync(join(repoPath, "package-lock.json"));
    if (packageLockfile.isFile()) {
      return "npm";
    }
  } catch (e) {}
  try {
    const yarnLockfile = statSync(join(repoPath, "yarn.lock"));
    if (yarnLockfile.isFile()) {
      return "yarn";
    }
  } catch (e) {}
  try {
    const pnpmLockfile = statSync(join(repoPath, "pnpm-lock.yaml"));
    if (pnpmLockfile.isFile()) {
      return "pnpm";
    }
  } catch (e) {}
  console.warn("No know lockfile found");
  return "unknown";
}

function getPackageManagerInstallCommand({
  packageManager,
}: {
  packageManager: PackageManager;
}): string {
  switch (packageManager) {
    case "npm":
      return "npm install";
    case "yarn":
      return "yarn add";
    case "pnpm":
      return "pnpm add";
    default:
      throw new Error("Unknown package manager");
  }
}

export function getPackageManagerCommand({
  packageManager,
  repoPath,
  packageName,
  packageVersion,
}: {
  packageManager: PackageManager;
  repoPath: string;
  packageName: string;
  packageVersion: string;
}): string {
  const installCommand = `${getPackageManagerInstallCommand({
    packageManager,
  })} ${packageName}@${packageVersion}`;
  switch (packageManager) {
    case "yarn":
      const yarnWorkspaces = JSON.parse(
        readFileSync(join(repoPath, "package.json"), "utf8"),
      ).workspaces;
      if (yarnWorkspaces) {
        return `${installCommand} -W`;
      } else {
        return installCommand;
      }
    case "pnpm":
      try {
        const pnpmWorkspaces = statSync(join(repoPath, "pnpm-workspace.yaml"));
        if (pnpmWorkspaces.isFile()) {
          return `${installCommand} -w`;
        } else {
          return installCommand;
        }
      } catch (e) {
        return installCommand;
      }
    default:
      return installCommand;
  }
}
