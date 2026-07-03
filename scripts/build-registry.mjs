import { copyFile, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { jsonFilesRecursive, readJson, root } from "./lib.mjs";

const versionPattern = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;

function parseArguments(args) {
  if (args.includes("--help")) return { help: true };
  if (args.length === 0 || args.includes("--all")) return { all: true, output: path.join(root, "registry") };
  const result = { output: path.join(root, "registry"), append: false };
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === "--append") result.append = true;
    else {
      const key = args[index].replace(/^--/, "");
      if (!args[index + 1]) throw new Error(`Missing value for ${args[index]}`);
      result[key] = args[++index];
    }
  }
  if (!versionPattern.test(result.version ?? "")) throw new Error("--version must be a semantic version such as 0.1.0");
  const [, major, minor] = result.version.match(versionPattern);
  result.line = `v${major}.${minor}`;
  result.source ??= path.join(root, "schemas", result.line);
  return result;
}

async function digest(file) {
  return createHash("sha256").update(await readFile(file)).digest("hex");
}

async function writeJson(file, value) {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, `${JSON.stringify(value, null, 2)}\n`);
}

async function packageSchemas(source, destination, version) {
  const files = await jsonFilesRecursive(source);
  if (!files.length) throw new Error(`No JSON schemas found in ${source}`);
  const schemas = [];
  for (const file of files) {
    const relative = path.relative(source, file).replaceAll("\\", "/");
    const output = path.join(destination, relative);
    const schema = await readJson(file);
    if (!schema.$id) throw new Error(`${relative} does not declare $id`);
    await mkdir(path.dirname(output), { recursive: true });
    await copyFile(file, output);
    schemas.push({ id: schema.$id, path: relative, sha256: await digest(file) });
  }
  const manifest = { version, schemas: schemas.sort((left, right) => left.path.localeCompare(right.path)) };
  await writeJson(path.join(destination, "manifest.json"), manifest);
  return manifest;
}

export async function buildRegistry({ version, source, output, append = false, domain }) {
  if (!versionPattern.test(version ?? "")) throw new Error("version must be a semantic version such as 0.1.0");
  const [, major, minor] = version.match(versionPattern);
  const line = `v${major}.${minor}`;
  const outputRoot = path.resolve(output);
  if (!append) await rm(outputRoot, { recursive: true, force: true });
  await mkdir(outputRoot, { recursive: true });

  const immutablePath = path.join(outputRoot, "releases", `v${version}`);
  const stablePath = path.join(outputRoot, line);
  await rm(immutablePath, { recursive: true, force: true });
  await rm(stablePath, { recursive: true, force: true });
  const immutable = await packageSchemas(path.resolve(source), immutablePath, version);
  const stable = await packageSchemas(path.resolve(source), stablePath, version);

  const indexPath = path.join(outputRoot, "index.json");
  let existing = { releases: [], lines: {} };
  if (append) {
    try { existing = JSON.parse(await readFile(indexPath, "utf8")); } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  }
  const releases = [...new Set([...existing.releases, version])].sort((left, right) =>
    left.localeCompare(right, undefined, { numeric: true }));
  const index = {
    schemaVersion: "1.0.0",
    releases,
    lines: { ...existing.lines, [line]: version }
  };
  await writeJson(indexPath, index);
  if (domain) await writeFile(path.join(outputRoot, "CNAME"), `${domain}\n`);
  return { index, immutable, stable, output: outputRoot };
}

export async function buildAllRegistry({ output = path.join(root, "registry"), domain } = {}) {
  const lines = (await readdir(path.join(root, "schemas"), { withFileTypes: true }))
    .filter((entry) => entry.isDirectory() && /^v\d+\.\d+$/.test(entry.name))
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right, undefined, { numeric: true }));
  if (!lines.length) throw new Error("No versioned schema directories found");

  let result;
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const version = `${line.slice(1)}.0`;
    result = await buildRegistry({
      version,
      source: path.join(root, "schemas", line),
      output,
      append: index > 0,
      domain: index === lines.length - 1 ? domain : undefined
    });
  }
  return result;
}

async function main() {
  const args = parseArguments(process.argv.slice(2));
  if (args.help) {
    console.log("Usage: node scripts/build-registry.mjs [--all] | --version <x.y.z> [--source <schemas>] [--output <registry>] [--append]");
    return;
  }
  const result = args.all ? await buildAllRegistry(args) : await buildRegistry(args);
  console.log(args.all
    ? `Built ${result.index.releases.length} contract releases at ${result.output}`
    : `Built ${result.stable.schemas.length} schemas for ${args.version} at ${result.output}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
