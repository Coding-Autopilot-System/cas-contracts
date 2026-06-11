import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { jsonFilesRecursive, readJson } from "./lib.mjs";

const severity = { unchanged: 0, compatible: 1, review_required: 2, breaking: 3 };
const annotations = new Set([
  "$comment", "$schema", "default", "deprecated", "description", "examples",
  "readOnly", "title", "writeOnly"
]);
const handled = new Set([
  ...annotations, "$defs", "$id", "$ref", "additionalProperties", "const", "enum",
  "exclusiveMaximum", "exclusiveMinimum", "format", "items", "maxItems", "maxLength",
  "maxProperties", "maximum", "minItems", "minLength", "minProperties", "minimum",
  "multipleOf", "pattern", "properties", "required", "type", "unevaluatedProperties",
  "uniqueItems"
]);

function stable(value) {
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stable(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function equal(left, right) {
  return stable(left) === stable(right);
}

function add(changes, status, location, message) {
  changes.push({ status, location, message });
}

function asSet(value) {
  if (value === undefined) return null;
  return new Set(Array.isArray(value) ? value : [value]);
}

function compareSetKeyword(changes, keyword, before, after, location) {
  const oldSet = asSet(before);
  const newSet = asSet(after);
  if (equal(before, after)) return;
  if (!newSet) return add(changes, "compatible", location, `${keyword} constraint removed`);
  if (!oldSet) return add(changes, "breaking", location, `${keyword} constraint added`);
  const removed = [...oldSet].filter((item) => !newSet.has(item));
  add(changes, removed.length ? "breaking" : "compatible", location,
    removed.length ? `${keyword} narrowed by removing ${removed.join(", ")}` : `${keyword} widened`);
}

function compareBound(changes, keyword, before, after, location, lowerBound) {
  if (equal(before, after)) return;
  if (after === undefined) return add(changes, "compatible", location, `${keyword} constraint removed`);
  if (before === undefined) return add(changes, "breaking", location, `${keyword} constraint added`);
  const tighter = lowerBound ? after > before : after < before;
  add(changes, tighter ? "breaking" : "compatible", location, `${keyword} changed from ${before} to ${after}`);
}

function compareBooleanConstraint(changes, keyword, before, after, location) {
  if (equal(before, after)) return;
  if (after === undefined || after === false) {
    return add(changes, "compatible", location, `${keyword} constraint relaxed`);
  }
  add(changes, "breaking", location, `${keyword} constraint tightened`);
}

function compareSchema(before, after, location, changes) {
  if (equal(before, after)) return;
  if (typeof before !== "object" || before === null || typeof after !== "object" || after === null) {
    add(changes, "review_required", location, "schema shape changed");
    return;
  }

  compareSetKeyword(changes, "type", before.type, after.type, location);
  compareSetKeyword(changes, "enum", before.enum, after.enum, location);

  if (!equal(before.const, after.const)) {
    if (after.const === undefined) add(changes, "compatible", location, "const constraint removed");
    else add(changes, "breaking", location, "const constraint added or changed");
  }

  const oldRequired = new Set(before.required ?? []);
  const newRequired = new Set(after.required ?? []);
  for (const name of newRequired) {
    if (!oldRequired.has(name)) add(changes, "breaking", `${location}/required`, `required property added: ${name}`);
  }
  for (const name of oldRequired) {
    if (!newRequired.has(name)) add(changes, "compatible", `${location}/required`, `required property removed: ${name}`);
  }

  const oldProperties = before.properties ?? {};
  const newProperties = after.properties ?? {};
  for (const name of Object.keys(oldProperties)) {
    if (!(name in newProperties)) add(changes, "breaking", `${location}/properties/${name}`, "property removed");
    else compareSchema(oldProperties[name], newProperties[name], `${location}/properties/${name}`, changes);
  }
  for (const name of Object.keys(newProperties)) {
    if (!(name in oldProperties)) {
      add(changes, newRequired.has(name) ? "breaking" : "compatible", `${location}/properties/${name}`,
        newRequired.has(name) ? "required property added" : "optional property added");
    }
  }

  for (const keyword of ["additionalProperties", "unevaluatedProperties"]) {
    const oldValue = before[keyword];
    const newValue = after[keyword];
    if (equal(oldValue, newValue)) continue;
    if (newValue === false && oldValue !== false) add(changes, "breaking", location, `${keyword} tightened to false`);
    else if (oldValue === false && newValue !== false) add(changes, "compatible", location, `${keyword} relaxed`);
    else if (typeof oldValue === "object" && typeof newValue === "object") {
      compareSchema(oldValue, newValue, `${location}/${keyword}`, changes);
    } else add(changes, "review_required", location, `${keyword} changed`);
  }

  for (const [keyword, lower] of [
    ["minimum", true], ["exclusiveMinimum", true], ["minLength", true], ["minItems", true], ["minProperties", true],
    ["maximum", false], ["exclusiveMaximum", false], ["maxLength", false], ["maxItems", false], ["maxProperties", false]
  ]) compareBound(changes, keyword, before[keyword], after[keyword], location, lower);

  for (const keyword of ["pattern", "format", "multipleOf", "$ref", "$id"]) {
    if (equal(before[keyword], after[keyword])) continue;
    if (after[keyword] === undefined && !["$ref", "$id"].includes(keyword)) {
      add(changes, "compatible", location, `${keyword} constraint removed`);
    } else if (before[keyword] === undefined && !["$ref", "$id"].includes(keyword)) {
      add(changes, "breaking", location, `${keyword} constraint added`);
    } else add(changes, "review_required", location, `${keyword} changed`);
  }

  compareBooleanConstraint(changes, "uniqueItems", before.uniqueItems, after.uniqueItems, location);
  if (!equal(before.items, after.items)) {
    if (before.items === undefined) add(changes, "breaking", `${location}/items`, "items constraint added");
    else if (after.items === undefined) add(changes, "compatible", `${location}/items`, "items constraint removed");
    else compareSchema(before.items, after.items, `${location}/items`, changes);
  }

  if (!equal(before.$defs, after.$defs)) {
    const oldDefs = before.$defs ?? {};
    const newDefs = after.$defs ?? {};
    for (const name of Object.keys(oldDefs)) {
      if (!(name in newDefs)) add(changes, "breaking", `${location}/$defs/${name}`, "definition removed");
      else compareSchema(oldDefs[name], newDefs[name], `${location}/$defs/${name}`, changes);
    }
    for (const name of Object.keys(newDefs)) {
      if (!(name in oldDefs)) add(changes, "compatible", `${location}/$defs/${name}`, "definition added");
    }
  }

  for (const keyword of new Set([...Object.keys(before), ...Object.keys(after)])) {
    if (!handled.has(keyword) && !equal(before[keyword], after[keyword])) {
      add(changes, "review_required", `${location}/${keyword}`, "unsupported keyword changed");
    }
  }
}

export async function classifyDirectories(baseDirectory, headDirectory) {
  const baseFiles = await jsonFilesRecursive(baseDirectory);
  const headFiles = await jsonFilesRecursive(headDirectory);
  const base = new Map(baseFiles.map((file) => [path.relative(baseDirectory, file).replaceAll("\\", "/"), file]));
  const head = new Map(headFiles.map((file) => [path.relative(headDirectory, file).replaceAll("\\", "/"), file]));
  const changes = [];

  for (const [relative, file] of base) {
    if (!head.has(relative)) add(changes, "breaking", relative, "schema removed");
    else compareSchema(await readJson(file), await readJson(head.get(relative)), relative, changes);
  }
  for (const relative of head.keys()) {
    if (!base.has(relative)) add(changes, "compatible", relative, "schema added");
  }

  const status = changes.reduce((result, change) => severity[change.status] > severity[result] ? change.status : result, "unchanged");
  return {
    status,
    summary: Object.fromEntries(Object.keys(severity).map((key) => [key, changes.filter((change) => change.status === key).length])),
    changes
  };
}

function parseArguments(args) {
  if (args.includes("--help")) return { help: true };
  const result = {};
  for (let index = 0; index < args.length; index += 2) {
    const key = args[index]?.replace(/^--/, "");
    if (!key || !args[index + 1]) throw new Error(`Missing value for ${args[index] ?? "argument"}`);
    result[key] = args[index + 1];
  }
  if (!result.base || !result.head) throw new Error("--base and --head are required");
  return result;
}

async function main() {
  const args = parseArguments(process.argv.slice(2));
  if (args.help) {
    console.log("Usage: node scripts/compatibility.mjs --base <schemas> --head <schemas> [--output <report.json>]");
    console.log("Exit codes: 0 unchanged/compatible, 1 breaking, 2 review_required or usage error.");
    return;
  }
  const report = await classifyDirectories(path.resolve(args.base), path.resolve(args.head));
  const output = `${JSON.stringify(report, null, 2)}\n`;
  if (args.output) {
    await mkdir(path.dirname(path.resolve(args.output)), { recursive: true });
    await writeFile(path.resolve(args.output), output);
  }
  console.log(output.trim());
  process.exitCode = report.status === "breaking" ? 1 : report.status === "review_required" ? 2 : 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 2;
  });
}

