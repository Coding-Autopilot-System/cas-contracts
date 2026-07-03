import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const moduleDir = path.dirname(fileURLToPath(import.meta.url));

export const root = path.resolve(moduleDir, "..");
export const schemaDirectory = path.join(root, "schemas");
export const exampleDirectory = path.join(root, "examples", "v0.1");

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

export async function createValidator(directory = schemaDirectory) {
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  addFormats(ajv);

  for (const schemaPath of (await jsonFilesRecursive(directory)).filter((file) => file.endsWith(".schema.json"))) {
    ajv.addSchema(await readJson(schemaPath));
  }

  return ajv;
}

export function schemaIdForExample(examplePath) {
  const name = path.basename(examplePath, ".json");
  return `https://schemas.coding-autopilot.dev/v0.1/${name}.schema.json`;
}
