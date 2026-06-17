import { describe, it, expect } from "vitest";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { collectResults, REQUIRED_FIELDS } from "../scripts/writing.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p), "utf8");
const resultPaths = () =>
  collectResults(root)
    .map((r) => r.path)
    .sort();

// Tracked text files, for the committed-secret scan (skips deps and git).
function textFiles() {
  const skipDir = new Set(["node_modules", ".git", "dist"]);
  const exts = [".md", ".mjs", ".js", ".json", ".yml", ".yaml", ".txt"];
  const dotfiles = [".npmrc", ".nvmrc", ".gitignore", ".prettierrc", ".prettierignore"];
  const out = [];
  const walk = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      if (e.isDirectory()) {
        if (!skipDir.has(e.name)) walk(join(d, e.name));
        continue;
      }
      if (exts.some((x) => e.name.endsWith(x)) || dotfiles.includes(e.name))
        out.push(join(d, e.name));
    }
  };
  walk(root);
  return out;
}

// Management files of a given kind ("position" | "persona"), if management/ exists.
function mgmt(kind) {
  const dir = join(root, "management");
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((f) => f.startsWith(`${kind}_`) && f.endsWith(".md"));
}

describe("khai-writing: the Writing Archive conforms", () => {
  it("the Estate (README) names the Metroon", () => {
    expect(read("README.md")).toMatch(/Metroon/);
  });

  it("declares both licences", () => {
    expect(existsSync(join(root, "LICENSE"))).toBe(true);
    expect(existsSync(join(root, "LICENSE-CODE"))).toBe(true);
  });

  it("the ledger is a JSON object", () => {
    const ledger = JSON.parse(read("ledger.json"));
    expect(ledger && typeof ledger === "object" && !Array.isArray(ledger)).toBe(true);
  });

  it("the discovery index ships, is exported, and matches the package (the #482 guard)", () => {
    const pkg = JSON.parse(read("package.json"));
    const reg = JSON.parse(read("registry.json"));
    // Ship + export, or a consumer falls back to parsing the tree (the bug).
    expect(pkg.files).toContain("registry.json");
    expect(pkg.files).toContain("ledger.json");
    expect(pkg.exports["./registry.json"]).toBe("./registry.json");
    expect(reg.name).toBe(pkg.name);
    expect(reg.version).toBe(pkg.version);
    expect(Array.isArray(reg.writing)).toBe(true);
  });

  it("the index enumerates exactly the deposited results", () => {
    const reg = JSON.parse(read("registry.json"));
    expect(reg.writing.map((w) => w.path).sort()).toEqual(resultPaths());
  });

  it("every deposited result conforms to the Standard schema", () => {
    const errors = [];
    for (const r of collectResults(root)) {
      const fm = r.frontmatter;
      // [house, play] segments come from the path; the layout is
      // writing/<house>/<play>/<result>.md.
      for (const f of REQUIRED_FIELDS) {
        if (fm[f] === undefined || fm[f] === "")
          errors.push(`${r.path}: missing frontmatter "${f}"`);
      }
      if (fm.khai !== "writing") errors.push(`${r.path}: frontmatter "khai" must be "writing"`);
      if (fm.house !== r.house)
        errors.push(`${r.path}: frontmatter house "${fm.house}" != path "${r.house}"`);
      if (fm.play !== r.play)
        errors.push(`${r.path}: frontmatter play "${fm.play}" != path "${r.play}"`);
      if (!/^[a-z0-9-]+$/.test(r.house)) errors.push(`${r.path}: house "${r.house}" is not a slug`);
      if (fm.license && !/CC-BY-NC-SA/.test(String(fm.license)))
        errors.push(`${r.path}: license must be CC-BY-NC-SA`);
      if (!/CC-BY-NC-SA/.test(r.text)) errors.push(`${r.path}: missing the licence block`);
    }
    expect(errors).toEqual([]);
  });

  it("the index surfaces each result's front-of-house (title, blurb, language)", () => {
    const reg = JSON.parse(read("registry.json"));
    const byPath = new Map(reg.writing.map((w) => [w.path, w]));
    const errors = [];
    for (const r of collectResults(root)) {
      const idx = byPath.get(r.path);
      if (!idx) {
        errors.push(`${r.path}: not in the index`);
        continue;
      }
      for (const f of ["title", "blurb", "language"]) {
        if (idx[f] !== (r.frontmatter[f] ?? null))
          errors.push(`${r.path}: index ${f} out of sync with frontmatter`);
      }
    }
    expect(errors).toEqual([]);
  });

  it("every result's play resolves in its house registry (deep check, when the house package is present)", () => {
    const errors = [];
    for (const r of collectResults(root)) {
      const regPath = join(
        root,
        "node_modules",
        "@chbrain",
        `khai-plays-${r.house}`,
        "registry.json",
      );
      // The deep resolution runs where the house package is installed (CI, once a
      // result exists); it is skipped, not relaxed, when the package is absent.
      if (!existsSync(regPath)) continue;
      const ids = (JSON.parse(readFileSync(regPath, "utf8")).plays || []).map((p) => p.id);
      if (!ids.includes(r.play))
        errors.push(`${r.path}: play "${r.play}" not in the ${r.house} registry`);
    }
    expect(errors).toEqual([]);
  });

  it("every deposited result carries its licence block", () => {
    const missing = collectResults(root)
      .filter((r) => !/CC-BY-NC-SA/.test(r.text))
      .map((r) => r.path);
    expect(missing).toEqual([]);
  });

  it("no Venue API key value is committed (variable names only)", () => {
    const re = /GRIMOIRE_API_KEY[A-Z_]*\s*[:=]\s*["']?(?!\$\{)[A-Za-z0-9][A-Za-z0-9_-]{7,}/;
    const offenders = textFiles().filter(
      (f) => !f.endsWith("archive.test.mjs") && re.test(readFileSync(f, "utf8")),
    );
    expect(offenders).toEqual([]);
  });

  it("the management cast conforms: every position is cast, every persona links a real position", () => {
    const positions = mgmt("position");
    const personas = mgmt("persona");
    // Each persona's Taxonomy links a position_*.md that exists.
    const linkOf = (p) =>
      (read(join("management", p)).match(/\(position_[a-z0-9_-]+\.md\)/) || [])[0];
    const danglingPersona = personas.filter((p) => {
      const m = linkOf(p);
      return !m || !existsSync(join(root, "management", m.slice(1, -1)));
    });
    expect(danglingPersona).toEqual([]);
    // Each position is cast by at least one persona.
    const referenced = new Set(
      personas
        .map((p) => linkOf(p))
        .filter(Boolean)
        .map((m) => m.slice(1, -1)),
    );
    const uncast = positions.filter((pos) => !referenced.has(pos));
    expect(uncast).toEqual([]);
  });
});
