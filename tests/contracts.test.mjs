import assert from "node:assert/strict";
import test from "node:test";
import { createValidator, exampleRoot, jsonFilesRecursive, readJson, schemaIdForExample } from "../scripts/lib.mjs";

const ajv = await createValidator();
const examplePaths = await jsonFilesRecursive(exampleRoot);
const examples = await Promise.all(examplePaths.map(readJson));

test("all published examples satisfy their authoritative schemas", () => {
  for (let index = 0; index < examplePaths.length; index += 1) {
    const validate = ajv.getSchema(schemaIdForExample(examplePaths[index]));
    assert.ok(validate, `schema is registered for ${examplePaths[index]}`);
    assert.equal(validate(examples[index]), true, ajv.errorsText(validate.errors));
  }
});

test("each complete lifecycle preserves correlation and W3C trace context", () => {
  for (const version of ["0.1.0", "1.0.0"]) {
    const records = examples.filter((example) => example.schemaVersion === version);
    assert.ok(records.length > 0, `${version} examples exist`);
    const expected = records[0];
    for (const record of records) {
      assert.equal(record.correlationId, expected.correlationId);
      assert.equal(record.promptId, expected.promptId);
      assert.equal(record.runId, expected.runId);
      assert.equal(record.repo, expected.repo);
      assert.equal(record.traceContext.traceparent, expected.traceContext.traceparent);
    }
  }
});

test("contracts reject missing mandatory lifecycle metadata", () => {
  const invalid = structuredClone(examples.find((example) => example.kind === "PromptEnvelope" && example.schemaVersion === "0.1.0"));
  delete invalid.correlationId;
  const validate = ajv.getSchema("https://schemas.coding-autopilot.dev/v0.1/prompt-envelope.schema.json");

  assert.equal(validate(invalid), false);
  assert.match(ajv.errorsText(validate.errors), /correlationId/);
});

test("contracts reject malformed W3C traceparent values", () => {
  const invalid = structuredClone(examples.find((example) => example.kind === "RunEvent" && example.schemaVersion === "0.1.0"));
  invalid.traceContext.traceparent = "not-a-traceparent";
  const validate = ajv.getSchema("https://schemas.coding-autopilot.dev/v0.1/run-event.schema.json");

  assert.equal(validate(invalid), false);
  assert.match(ajv.errorsText(validate.errors), /pattern/);
});
