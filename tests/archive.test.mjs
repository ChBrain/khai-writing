import { describe, it, expect } from "vitest";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { readFileSync, existsSync, readdirSync } from "node:fs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p), "utf8");

// Every deposited result: writing/<house>/<play>/<result>.md (paths relative to root).
function results() {
  const dir = join(root, "writing");
  const out = [];
  if (!existsSync(dir)) return out;
  const walk = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const full = join(d, e.name);
      if (e.isDirectory()) walk(full);
      else if (e.name.endsWith(".md"))
        out.push(
          full
            .slice(root.length + 1)
            .split("\\")
            .join("/"),
        );
    }
  };
  walk(dir);
  return out.sort();
}

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
    expect(reg.writing.map((w) => w.path).sort()).toEqual(results());
  });

  it("every deposited result carries its licence block", () => {
    const missing = results().filter((p) => !/CC-BY-NC-SA/.test(read(p)));
    expect(missing).toEqual([]);
  });

  it("no Venue API key value is committed (variable names only)", () => {
    const re = /GRIMOIRE_API_KEY[A-Z_]*\s*[:=]\s*["']?(?!\$\{)[A-Za-z0-9][A-Za-z0-9_-]{7,}/;
    const offenders = textFiles().filter(
      (f) => !f.endsWith("archive.test.mjs") && re.test(readFileSync(f, "utf8")),
    );
    expect(offenders).toEqual([]);
  });
});
