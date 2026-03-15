import { readdirSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import { execSync } from "child_process";

const extensionsDir = join(import.meta.dirname, "..", "out", "extensions");
const packagesDir = join(import.meta.dirname, "..", "out", "packages");

if (!existsSync(extensionsDir)) {
  console.error("No built extensions found. Run `npm run build` first.");
  process.exit(1);
}

mkdirSync(packagesDir, { recursive: true });

const entries = readdirSync(extensionsDir, { withFileTypes: true });
let count = 0;

for (const entry of entries) {
  if (!entry.isDirectory()) continue;
  if (!entry.name.endsWith(".bkext")) continue;

  const extPath = join(extensionsDir, entry.name);
  const zipName = entry.name.replace(/\.bkext$/, ".bkext.zip");
  const zipPath = join(packagesDir, zipName);

  console.log(`Packaging ${entry.name} -> ${zipName}`);
  execSync(`ditto -c -k --keepParent "${extPath}" "${zipPath}"`);
  count++;
}

if (count === 0) {
  console.log("No extensions to package.");
} else {
  console.log(`\nPackaged ${count} extension(s) into out/packages/`);
}
