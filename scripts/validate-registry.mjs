import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createValidator, readJson, root } from "./lib.mjs";

async function validateDirectory(directory, expectedVersion) {
  const manifest = await readJson(path.join(directory, "manifest.json"));
  assert.equal(manifest.version, expectedVersion, `${directory} has the expected version`);
  const validator = await createValidator(directory);
  for (const entry of manifest.schemas) {
    const file = path.join(directory, entry.path);
    const content = await readFile(file);
    assert.equal(createHash("sha256").update(content).digest("hex"), entry.sha256, `${entry.path} digest matches`);
    const schema = JSON.parse(content);
    assert.equal(schema.$id, entry.id, `${entry.path} id matches`);
    assert.ok(validator.getSchema(entry.id), `${entry.id} compiles`);
  }
}

export async function validateRegistry(registry) {
  const directory = path.resolve(registry);
  const index = await readJson(path.join(directory, "index.json"));
  assert.equal(index.schemaVersion, "1.0.0");
  for (const version of index.releases) {
    assert.match(version, /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/);
    await validateDirectory(path.join(directory, "releases", `v${version}`), version);
  }
  for (const [line, version] of Object.entries(index.lines)) {
    assert.match(line, /^v(0|[1-9]\d*)\.(0|[1-9]\d*)$/);
    assert.ok(index.releases.includes(version), `${line} points to a released version`);
    await validateDirectory(path.join(directory, line), version);
  }
  return index;
}

async function main() {
  const index = process.argv.indexOf("--registry");
  const registry = index >= 0 ? process.argv[index + 1] : path.join(root, "registry");
  if (!registry) throw new Error("--registry requires a path");
  const result = await validateRegistry(registry);
  console.log(`Validated ${result.releases.length} release(s) and ${Object.keys(result.lines).length} stable line(s).`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}

