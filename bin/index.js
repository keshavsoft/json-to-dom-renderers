#!/usr/bin/env node

import { readdirSync, existsSync, mkdirSync, cpSync } from "node:fs";
import { dirname, resolve, relative } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcDir = resolve(__dirname, "../src");

if (!existsSync(srcDir)) {
    console.error(`\x1b[31m[json-to-dom-renderers] Error: Cannot find src directory at ${srcDir}\x1b[0m`);
    process.exit(1);
}

// Find highest version folder (e.g. v11)
const versions = readdirSync(srcDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^v\d+$/.test(entry.name))
    .map((entry) => ({ name: entry.name, n: Number(entry.name.slice(1)) }))
    .sort((a, b) => b.n - a.n);

if (versions.length === 0) {
    console.error("\x1b[31m[json-to-dom-renderers] Error: No version folders (e.g. v11) found in src\x1b[0m");
    process.exit(1);
}

// Parse command line arguments
const args = process.argv.slice(2);

if (args.includes("-h") || args.includes("--help")) {
    console.log(`
\x1b[36mjson-to-dom-renderers CLI\x1b[0m
Transports the latest renderer source code directly into your project.

\x1b[33mUsage:\x1b[0m
  npx json-to-dom-renderers [destination] [options]

\x1b[33mArguments:\x1b[0m
  destination          Target folder to copy files into (default: ./src)

\x1b[33mOptions:\x1b[0m
  -v, --version <vN>   Specify version to copy (default: latest, ${versions[0].name})
  -h, --help           Show this help message

\x1b[33mExamples:\x1b[0m
  npx json-to-dom-renderers
  npx json-to-dom-renderers ./src
  npx json-to-dom-renderers ./renderers
  npx json-to-dom-renderers . --version v11
`);
    process.exit(0);
}

let requestedVersion = versions[0].name;
const versionFlagIdx = args.findIndex((arg) => arg === "-v" || arg === "--version");
if (versionFlagIdx !== -1 && args[versionFlagIdx + 1]) {
    requestedVersion = args[versionFlagIdx + 1];
    args.splice(versionFlagIdx, 2);
}

const sourceVersionDir = resolve(srcDir, requestedVersion);
if (!existsSync(sourceVersionDir)) {
    console.error(`\x1b[31m[json-to-dom-renderers] Error: Version folder "${requestedVersion}" does not exist in src\x1b[0m`);
    process.exit(1);
}

// Target directory defaults to ./src if not specified
const targetArg = args[0];
let targetDir = resolve(process.cwd(), targetArg || "src");

console.log(`\x1b[36m[json-to-dom-renderers]\x1b[0m Transporting \x1b[32m${requestedVersion}\x1b[0m source code...`);
console.log(`  Source: \x1b[90m${sourceVersionDir}\x1b[0m`);
console.log(`  Target: \x1b[33m${targetDir}\x1b[0m`);

mkdirSync(targetDir, { recursive: true });
cpSync(sourceVersionDir, targetDir, { recursive: true, force: true });

console.log(`\x1b[32m✔ Successfully transported ${requestedVersion} into ${relative(process.cwd(), targetDir) || "."}!\x1b[0m\n`);
