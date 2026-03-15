import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { execSync } from "child_process";

const packagesDir = join(import.meta.dirname, "..", "out", "packages");
const extensionsDir = join(import.meta.dirname, "..", "out", "extensions");

// Parse arguments: npm run release -- <extension-id>
const args = process.argv.slice(2);

if (args.length !== 1) {
  console.error("Usage: npm run release -- <extension-id>");
  console.error("");
  console.error("Examples:");
  console.error("  npm run release -- calendar");
  console.error("  npm run release -- d3");
  console.error("");
  console.error("Reads the version from the extension's manifest.json and creates");
  console.error("a GitHub Release tagged <id>-v<version> with the .bkext.zip attached.");
  console.error("");
  console.error("Requires: gh CLI (https://cli.github.com) authenticated");
  process.exit(1);
}

const id = args[0];

// Verify gh CLI is available
try {
  execSync("gh --version", { stdio: "ignore" });
} catch {
  console.error("Error: `gh` CLI not found. Install it from https://cli.github.com");
  process.exit(1);
}

// Verify we're in a git repo with a remote
try {
  execSync("gh repo view --json name", { stdio: "ignore" });
} catch {
  console.error("Error: not in a GitHub repository, or `gh` is not authenticated.");
  console.error("Run `gh auth login` to authenticate.");
  process.exit(1);
}

// Read manifest for version and description
const manifestPath = join(extensionsDir, `${id}.bkext`, "manifest.json");
if (!existsSync(manifestPath)) {
  console.error(`Error: manifest not found at ${manifestPath}`);
  console.error("Run `npm run build` first.");
  process.exit(1);
}

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const version = manifest.version;

if (!version) {
  console.error(`Error: no "version" field in ${manifestPath}`);
  process.exit(1);
}

// Verify ZIP exists
const zipName = `${id}.bkext.zip`;
const zipPath = join(packagesDir, zipName);

if (!existsSync(zipPath)) {
  console.error(`Error: ${zipName} not found in out/packages/`);
  console.error("Run `npm run package` first.");
  process.exit(1);
}

const tag = `${id}-v${version}`;

// Check if this version has already been released
try {
  execSync(`gh release view "${tag}"`, { stdio: "ignore" });
  console.error(`Error: release "${tag}" already exists.`);
  console.error(`Update the version in src/${id}.bkext/manifest.json, then rebuild and repackage.`);
  process.exit(1);
} catch {
  // Release doesn't exist yet — good
}

const title = `${id} v${version}`;
const notes = manifest.description || "";

console.log(`Releasing ${id} v${version}`);
console.log(`  Tag:   ${tag}`);
console.log(`  Asset: ${zipName}`);
console.log("");

const cmd = `gh release create "${tag}" "${zipPath}" --title "${title}" --notes "${notes.replace(/"/g, '\\"')}"`;

// Get repo URL for constructing download link
let repoUrl;
try {
  repoUrl = execSync("gh repo view --json url -q .url", { encoding: "utf8" }).trim();
} catch {
  repoUrl = null;
}

try {
  const output = execSync(cmd, { encoding: "utf8", stdio: ["inherit", "pipe", "inherit"] });
  console.log(`Release created: ${output.trim()}`);
} catch (e) {
  console.error(`Failed to create release. Does the tag "${tag}" already exist?`);
  process.exit(1);
}

// Print registry entry for bike-extensions
const downloadUrl = repoUrl
  ? `${repoUrl}/releases/download/${tag}/${zipName}`
  : `<download_url>`;

const entry = {
  id,
  version,
  download_url: downloadUrl,
};

if (manifest.api_version) entry.min_api_version = manifest.api_version;
if (manifest.description) entry.description = manifest.description;
if (manifest.author) entry.author = manifest.author;
if (manifest.url) entry.url = manifest.url;

console.log("");
console.log("To list in the Bike extensions registry, add this to extensions.json");
console.log("at https://github.com/jessegrosjean/bike-extensions:");
console.log("");
console.log(JSON.stringify(entry, null, 2));
