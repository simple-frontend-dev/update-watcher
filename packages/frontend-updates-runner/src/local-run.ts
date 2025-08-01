import "dotenv/config";
import { rmSync } from "node:fs";
import { resolve } from "node:path";

rmSync(resolve(process.env.GITHUB_WORKSPACE!, "repositories"), { recursive: true, force: true });

import "./update-depency-in-repos.js";
