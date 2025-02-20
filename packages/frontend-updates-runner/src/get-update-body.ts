import { readFileSync } from "fs";
import { join } from "path";

export async function getUpdateBody({
  packageName,
  packageVersion,
}: {
  packageName: string;
  packageVersion: string;
}) {
  return readFileSync(
    join(
      import.meta.dirname,
      "..",
      "updates",
      `${packageName}@${packageVersion}.md`,
    ),
    "utf-8",
  );
}
