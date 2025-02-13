import { readFileSync } from "fs";
import { join } from "path";

export function packageInRepo({
  packageName,
  repoPath,
}: {
  packageName: string;
  repoPath: string;
}) {
  try {
    const packageJson = readFileSync(join(repoPath, "package.json"), "utf8");
    const packageJsonObject = JSON.parse(packageJson);
    if (
      packageJsonObject.dependencies &&
      packageName in packageJsonObject.dependencies
    ) {
      return true;
    }
    if (
      packageJsonObject.devDependencies &&
      packageName in packageJsonObject.devDependencies
    ) {
      return true;
    }
    return false;
  } catch (error) {
    console.warn(`Unable to read package.json, error: ${error}`);
    return false;
  }
}
