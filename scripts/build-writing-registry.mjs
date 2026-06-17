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
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { collectResults } from "./writing.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));

// Surface the front-of-house metadata a consumer needs to render the catalogue
// without opening every file; the body (the told story) stays in the file.
const writing = collectResults(root).map(({ house, play, result, path, frontmatter: fm }) => ({
  house,
  play,
  result,
  path,
  title: fm.title ?? null,
  blurb: fm.blurb ?? null,
  language: fm.language ?? null,
  created: fm.created ?? null,
  contentWarnings: Array.isArray(fm.contentWarnings) ? fm.contentWarnings : [],
  routing: fm.routing ?? null,
}));

const registry = {
  $schema: "http://json-schema.org/draft-07/schema#",
  name: pkg.name,
  version: pkg.version,
  writing,
};

writeFileSync(join(root, "registry.json"), JSON.stringify(registry, null, 2) + "\n");
console.log(`registry.json: ${writing.length} result(s) at ${pkg.version}`);
