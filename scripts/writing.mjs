// Shared helpers for the writing archive: read a result's frontmatter and
// collect the deposited results. Dependency-free; the schema is controlled
// (see CLAUDE.md, "The writing (the Standard)").
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

// The fields every result's frontmatter must carry (routing + contentWarnings
// are optional). `language` is the author's choice per result, declared here.
export const REQUIRED_FIELDS = [
  "khai",
  "title",
  "house",
  "play",
  "source",
  "director",
  "cast",
  "language",
  "license",
  "created",
  "blurb",
];

// Minimal frontmatter reader for our controlled schema: scalars (`key: value`,
// surrounding quotes stripped) and inline lists (`key: [a, b]`). Matches only the
// leading `---` block, so a `---` licence-block separator in the body is ignored.
// Not a general YAML parser.
export function parseFrontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  const fm = {};
  for (const line of m[1].split("\n")) {
    const mm = line.match(/^([A-Za-z][A-Za-z0-9_]*):\s*(.*)$/);
    if (!mm) continue;
    let val = mm[2].trim();
    if (val.startsWith("[") && val.endsWith("]")) {
      val = val
        .slice(1, -1)
        .split(",")
        .map((s) => s.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
    } else {
      val = val.replace(/^["']|["']$/g, "");
    }
    fm[mm[1]] = val;
  }
  return fm;
}

const subdirs = (d) =>
  readdirSync(d)
    .filter((n) => statSync(join(d, n)).isDirectory())
    .sort();

// Collect deposited results: writing/<house>/<play>/<result>.md. Each carries its
// path segments and parsed frontmatter.
export function collectResults(root) {
  const dir = join(root, "writing");
  const out = [];
  if (!existsSync(dir)) return out;
  for (const house of subdirs(dir)) {
    for (const play of subdirs(join(dir, house))) {
      const playDir = join(dir, house, play);
      for (const file of readdirSync(playDir).sort()) {
        if (!file.endsWith(".md")) continue;
        const text = readFileSync(join(playDir, file), "utf8");
        out.push({
          house,
          play,
          result: file.replace(/\.md$/, ""),
          path: relative(root, join(playDir, file)).split("\\").join("/"),
          frontmatter: parseFrontmatter(text),
          text,
        });
      }
    }
  }
  return out;
}
