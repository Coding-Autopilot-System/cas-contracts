import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { classifyDirectories } from "../scripts/compatibility.mjs";

async function classify(before, after, additionalBefore = {}, additionalAfter = {}) {
  const root = await mkdtemp(path.join(os.tmpdir(), "cas-compat-"));
  const base = path.join(root, "base");
  const head = path.join(root, "head");
  await Promise.all([mkdir(base), mkdir(head)]);
  const write = (directory, name, value) => writeFile(path.join(directory, name), JSON.stringify(value));
  await write(base, "contract.schema.json", before);
  await write(head, "contract.schema.json", after);
  for (const [name, value] of Object.entries(additionalBefore)) await write(base, name, value);
  for (const [name, value] of Object.entries(additionalAfter)) await write(head, name, value);
  return classifyDirectories(base, head);
}

const objectSchema = {
  type: "object",
  additionalProperties: false,
  required: ["id"],
  properties: { id: { type: "string" } }
};

test("classifies identical trees as unchanged", async () => {
  assert.equal((await classify(objectSchema, objectSchema)).status, "unchanged");
});

test("classifies additive optional properties and schemas as compatible", async () => {
  const after = structuredClone(objectSchema);
  after.properties.label = { type: "string" };
  const report = await classify(objectSchema, after, {}, { "new.schema.json": { type: "string" } });
  assert.equal(report.status, "compatible");
  assert.equal(report.summary.compatible, 2);
});

test("classifies required additions, removals, narrowing, and tightened constraints as breaking", async () => {
  const cases = [
    [{ ...objectSchema }, { ...objectSchema, required: ["id", "label"], properties: { ...objectSchema.properties, label: { type: "string" } } }],
    [objectSchema, { ...objectSchema, properties: {} }],
    [{ type: ["string", "null"] }, { type: "string" }],
    [{ enum: ["a", "b"] }, { enum: ["a"] }],
    [{ type: "string", maxLength: 10 }, { type: "string", maxLength: 5 }],
    [{ type: "object" }, { type: "object", additionalProperties: false }]
  ];
  for (const [before, after] of cases) assert.equal((await classify(before, after)).status, "breaking");
  assert.equal((await classify(objectSchema, objectSchema, { "removed.schema.json": { type: "string" } })).status, "breaking");
});

test("classifies unsupported semantic keyword changes as review_required", async () => {
  const report = await classify({ oneOf: [{ type: "string" }] }, { oneOf: [{ type: "number" }] });
  assert.equal(report.status, "review_required");
  assert.match(report.changes[0].location, /oneOf/);
});

