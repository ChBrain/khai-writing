#!/usr/bin/env node
// Build the writing discovery index (registry.json) from package.json + the
// results deposited under writing/<house>/<play>/<result>.md.
//
// This is the npm-pull path's index: it ships (`files`) and is exported
// (`exports`) so a consumer (e.g. the website surface) enumerates the writing
// without parsing the tree itself. It is the SINGLE WRITER of registry.json AND
// of the version — never hand-edit either; the `version` script runs it so name
// + version stay in lockstep with package.json (the lesson of the registry
// packaging fix). The ledger.json (external placements) is a separate record,
// not built here.
//
// The minor version IS the writing count (the number of deposited results),
// computed not chosen, the same rule the plays/cultures/misfits houses follow:
// the minor is the count and the patch resets to 0 when the count moves, but a
// changeset-driven patch is preserved while the count holds. A fresh, empty
// archive stays 0.0.x.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { collectResults } from "./writing.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));

// Derive the version from the result count: preserve the major (the archive
// stays 0.x) and, when the count already equals the minor, the changeset-driven
// patch; otherwise move the minor to the count and reset the patch to 0.
function deriveVersion(currentVersion, count) {
  const m = /^(\d+)\.(\d+)\.(\d+)/.exec(currentVersion ?? "");
  const major = m ? Number(m[1]) : 0;
  const curMinor = m ? Number(m[2]) : 0;
  const patch = m ? Number(m[3]) : 0;
  return `${major}.${count}.${count === curMinor ? patch : 0}`;
}

// Surface the front-of-house metadata a consumer needs to render the catalogue
// without opening every file; the body (the told story) stays in the file.
const writing = collectResults(root).map(({ house, play, result, path, frontmatter: fm }) => ({
  house,
  play,
  result,
  path,
  title: fm.title ?? null,
  blurb: fm.blurb ?? null,
  director: fm.director ?? null,
  cast: fm.cast ?? null,
  language: fm.language ?? null,
  created: fm.created ?? null,
  contentWarnings: Array.isArray(fm.contentWarnings) ? fm.contentWarnings : [],
  routing: fm.routing ?? null,
}));

// Reconcile the version to the result count before stamping it into the index,
// and write it back to package.json so the two stay in lockstep (the build is
// the single writer of the number).
const version = deriveVersion(pkg.version, writing.length);
if (pkg.version !== version) {
  pkg.version = version;
  writeFileSync(join(root, "package.json"), JSON.stringify(pkg, null, 2) + "\n");
}

const registry = {
  $schema: "http://json-schema.org/draft-07/schema#",
  name: pkg.name,
  version,
  writing,
};

writeFileSync(join(root, "registry.json"), JSON.stringify(registry, null, 2) + "\n");
console.log(`registry.json: ${writing.length} result(s) at ${version}`);
