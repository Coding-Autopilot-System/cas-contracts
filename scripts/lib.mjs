import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

export const root = path.resolve(import.meta.dirname, "..");
export const schemaRoot = path.join(root, "schemas");
export const exampleRoot = path.join(root, "examples");
export const schemaDirectory = path.join(schemaRoot, "v0.1");
export const exampleDirectory = path.join(exampleRoot, "v0.1");
export const canonicalSchemaBase = "https://schemas.coding-autopilot.dev";
export const pagesRegistryBase = "https://coding-autopilot-system.github.io/cas-contracts/registry";

export async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

export async function jsonFiles(directory) {
  return (await readdir(directory))
    .filter((name) => name.endsWith(".json"))
    .sort()
    .map((name) => path.join(directory, name));
}

export async function jsonFilesRecursive(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map((entry) => {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory() ? jsonFilesRecursive(entryPath) : entry.name.endsWith(".json") ? [entryPath] : [];
  }));
  return files.flat().sort();
}

export async function createValidator(directory = schemaRoot) {
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  addFormats(ajv);

  for (const schemaPath of (await jsonFilesRecursive(directory)).filter((file) => file.endsWith(".schema.json"))) {
    ajv.addSchema(await readJson(schemaPath));
  }

  return ajv;
}

export function schemaId(version, name) {
  return `${pagesRegistryBase}/${version}/${name}.schema.json`;
}

export function schemaIdForExample(examplePath) {
  const name = path.basename(examplePath, ".json");
  const version = path.basename(path.dirname(examplePath));
  return schemaId(version, name);
}
