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

test("v1.1 SDLC profile accepts a complete twelve-phase profile", () => {
  const validate = ajv.getSchema("https://schemas.coding-autopilot.dev/v1.1/sdlc-profile.schema.json");
  assert.ok(validate, "v1.1 profile schema is registered");
  const profile = {
    correlationId: "corr-1",
    promptId: "prompt-1",
    runId: "run-1",
    repo: "owner/repo",
    actor: { id: "system", type: "workflow" },
    timestamp: "2026-07-03T00:00:00Z",
    schemaVersion: "1.1.0",
    traceContext: { traceparent: "00-0123456789abcdef0123456789abcdef-0123456789abcdef-01" },
    kind: "SdlcProfile",
    profileId: "cas-sdlc-v1",
    profileVersion: "v1.1",
    goalBudget: 12,
    phases: [
      { id: "understand", name: "Understand", batch: "discovery", dependencies: [], verifier: "repo-verifier", requiredArtifacts: ["brief"], successCriteria: ["goal clarified"] },
      { id: "research", name: "Research", batch: "discovery", dependencies: ["understand"], verifier: "repo-verifier", requiredArtifacts: ["sources"], successCriteria: ["evidence collected"] },
      { id: "analyze", name: "Analyze", batch: "discovery", dependencies: ["research"], verifier: "repo-verifier", requiredArtifacts: ["analysis"], successCriteria: ["risks identified"] },
      { id: "plan", name: "Plan", batch: "design", dependencies: ["analyze"], verifier: "repo-verifier", requiredArtifacts: ["plan"], successCriteria: ["plan approved"] },
      { id: "risk-assessment", name: "Risk Assessment", batch: "design", dependencies: ["plan"], verifier: "repo-verifier", requiredArtifacts: ["risk"], successCriteria: ["risk documented"] },
      { id: "implement", name: "Implement", batch: "change", dependencies: ["plan", "risk-assessment"], verifier: "mutation-owner", requiredArtifacts: ["patch"], successCriteria: ["change applied"] },
      { id: "verify", name: "Verify", batch: "assurance", dependencies: ["implement"], verifier: "verifier", requiredArtifacts: ["results"], successCriteria: ["tests pass"] },
      { id: "review", name: "Review", batch: "assurance", dependencies: ["verify"], verifier: "verifier", requiredArtifacts: ["review"], successCriteria: ["review pass"] },
      { id: "improve", name: "Improve", batch: "assurance", dependencies: ["review"], verifier: "verifier", requiredArtifacts: ["repair"], successCriteria: ["repair bounded"] },
      { id: "document", name: "Document", batch: "closure", dependencies: ["improve"], verifier: "verifier", requiredArtifacts: ["docs"], successCriteria: ["docs updated"] },
      { id: "update-memory", name: "Update Memory", batch: "closure", dependencies: ["document"], verifier: "verifier", requiredArtifacts: ["memory"], successCriteria: ["candidate emitted"] },
      { id: "finished", name: "Finished", batch: "closure", dependencies: ["update-memory"], verifier: "verifier", requiredArtifacts: ["terminal"], successCriteria: ["terminal published"] }
    ]
  };

  assert.equal(validate(profile), true, ajv.errorsText(validate.errors));
});

test("v1.1 SDLC request rejects missing profile version", () => {
  const validate = ajv.getSchema("https://schemas.coding-autopilot.dev/v1.1/phase-execution-request.schema.json");
  assert.ok(validate, "v1.1 request schema is registered");
  const request = {
    correlationId: "corr-1",
    promptId: "prompt-1",
    runId: "run-1",
    repo: "owner/repo",
    actor: { id: "agent-1", type: "agent" },
    timestamp: "2026-07-03T00:00:00Z",
    schemaVersion: "1.1.0",
    traceContext: { traceparent: "00-0123456789abcdef0123456789abcdef-0123456789abcdef-01" },
    kind: "PhaseExecutionRequest",
    phase: "understand",
    batch: "discovery",
    goal: "Implement the loop engine",
    constraints: ["bounded retries"],
    verifier: "repo-verifier"
  };

  assert.equal(validate(request), false);
  assert.match(ajv.errorsText(validate.errors), /profileVersion/);
});
