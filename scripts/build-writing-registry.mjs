#!/usr/bin/env node
// Build the writing discovery index (registry.json) from package.json + the
// results deposited under writing/<house>/<play>/<result>.md.
//
// This is the npm-pull path's index: it ships (`files`) and is exported
// (`exports`) so a consumer (e.g. the website surface) enumerates the writing
// without parsing the tree itself. It is the SINGLE WRITER of registry.json —
// never hand-edit it; the `version` script runs it so name + version stay in
// lockstep with package.json (the lesson of the registry packaging fix). The
// ledger.json (external placements) is a separate record, not built here.
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const writingDir = join(root, "writing");

const dirs = (d) =>
  readdirSync(d)
    .filter((n) => statSync(join(d, n)).isDirectory())
    .sort();

const writing = [];
if (existsSync(writingDir)) {
  for (const house of dirs(writingDir)) {
    for (const play of dirs(join(writingDir, house))) {
      const playDir = join(writingDir, house, play);
      for (const file of readdirSync(playDir).sort()) {
        if (!file.endsWith(".md")) continue;
        writing.push({
          house,
          play,
          result: file.replace(/\.md$/, ""),
          path: relative(root, join(playDir, file)).split("\\").join("/"),
        });
      }
    }
  }
}

const registry = {
  $schema: "http://json-schema.org/draft-07/schema#",
  name: pkg.name,
  version: pkg.version,
  writing,
};

writeFileSync(join(root, "registry.json"), JSON.stringify(registry, null, 2) + "\n");
console.log(`registry.json: ${writing.length} result(s) at ${pkg.version}`);
