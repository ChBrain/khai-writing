import { describe, it, expect } from "vitest";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { readFileSync } from "node:fs";
import { computeWritingRegistry } from "../scripts/build-writing-registry.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// Deterministic JSON for structural equality: object keys sorted (so key order
// and pretty-print formatting never cause a false diff), array order preserved
// (so a re-sorted or dropped entry IS a diff). Undefined keys are dropped to
// mirror JSON.stringify (how registry.json is written).
function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value)
      .filter((k) => value[k] !== undefined)
      .sort()
      .map((k) => `${JSON.stringify(k)}:${stableStringify(value[k])}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}

// The registry build-drift gate: registry.json is built, never hand-edited, so
// the committed file must equal what the builder produces from source. This
// catches a hand-edited or stale index (a wrong blurb, a missing/reordered
// result, a drifted version) at the content PR — not when the release `version`
// script rebuilds it. The build is the single writer; a hand edit is a finding.
describe("writing registry: build-drift gate", () => {
  it("committed registry.json equals a fresh build from source", () => {
    const committed = JSON.parse(readFileSync(join(root, "registry.json"), "utf8"));
    const { registry } = computeWritingRegistry(root);
    expect(stableStringify(committed)).toBe(stableStringify(registry));
  });
});
