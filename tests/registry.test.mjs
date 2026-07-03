import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtemp, readFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { buildRegistry } from "../scripts/build-registry.mjs";
import { createValidator, jsonFiles, readJson, schemaDirectory } from "../scripts/lib.mjs";
import { validateRegistry } from "../scripts/validate-registry.mjs";

async function build() {
  const output = await mkdtemp(path.join(os.tmpdir(), "cas-registry-"));
  await buildRegistry({ version: "0.1.0", source: schemaDirectory, output });
  return output;
}

test("registry packages immutable and stable schema paths with verified digests", async () => {
  const output = await build();
  const index = await readJson(path.join(output, "index.json"));
  const stableManifest = await readJson(path.join(output, "v0.1", "manifest.json"));
  const immutableManifest = await readJson(path.join(output, "releases", "v0.1.0", "manifest.json"));

  assert.deepEqual(index, { schemaVersion: "1.0.0", releases: ["0.1.0"], lines: { "v0.1": "0.1.0" } });
  assert.deepEqual(stableManifest, immutableManifest);
  assert.equal(stableManifest.schemas.length, 14);
  assert.match(stableManifest.schemas[0].sha256, /^[\da-f]{64}$/);
  for (const schema of stableManifest.schemas) {
    const content = await readFile(path.join(output, "v0.1", schema.path));
    assert.equal(createHash("sha256").update(content).digest("hex"), schema.sha256);
  }
});

test("distributed stable schemas compile and retain authoritative ids", async () => {
  const output = await build();
  const directory = path.join(output, "v0.1");
  const validator = await createValidator(directory);
  for (const file of await jsonFiles(directory)) {
    const schema = await readJson(file);
    if (file.endsWith("manifest.json")) continue;
    assert.ok(validator.getSchema(schema.$id), `${schema.$id} compiles from distributed output`);
  }
});

test("registry builds are deterministic and append preserves immutable releases", async () => {
  const output = await build();
  const first = await readFile(path.join(output, "v0.1", "manifest.json"), "utf8");
  await buildRegistry({ version: "0.1.0", source: schemaDirectory, output });
  assert.equal(await readFile(path.join(output, "v0.1", "manifest.json"), "utf8"), first);
  await buildRegistry({ version: "0.1.1", source: schemaDirectory, output, append: true });
  const index = await readJson(path.join(output, "index.json"));
  assert.deepEqual(index.releases, ["0.1.0", "0.1.1"]);
  assert.equal(index.lines["v0.1"], "0.1.1");
  assert.equal((await readJson(path.join(output, "releases", "v0.1.0", "manifest.json"))).version, "0.1.0");
  assert.deepEqual(await validateRegistry(output), index);
});

test("registry rejects invalid release versions", async () => {
  await assert.rejects(() => buildRegistry({ version: "latest", source: schemaDirectory, output: "ignored" }), /semantic version/);
});

test("registry emits a custom-domain CNAME only when explicitly configured", async () => {
  const output = await mkdtemp(path.join(os.tmpdir(), "cas-registry-domain-"));
  await buildRegistry({ version: "0.1.0", source: schemaDirectory, output, domain: "schemas.example.com" });
  assert.equal(await readFile(path.join(output, "CNAME"), "utf8"), "schemas.example.com\n");
});
