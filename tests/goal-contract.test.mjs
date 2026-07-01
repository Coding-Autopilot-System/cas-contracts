import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { createValidator, readJson, root } from "../scripts/lib.mjs";

const version = "v1.0";
const schemaDirectory = path.join(root, "schemas", version);
const examplePath = path.join(root, "examples", version, "work-request.json");
const schemaId = "https://schemas.coding-autopilot.dev/v1.0/work-request.schema.json";

const ajv = await createValidator(schemaDirectory);
const validGoal = await readJson(examplePath);
const validate = ajv.getSchema(schemaId);

test("v1 goal fixture declares every bounded default", () => {
  assert.ok(validate);
  assert.equal(validate(validGoal), true, ajv.errorsText(validate.errors));
  assert.deepEqual(validGoal.budget, {
    maxFanOut: 3,
    maxIterations: 3,
    maxAttemptsPerWorkItem: 3,
    maxRuntimeSeconds: 1800,
    maxModelCalls: 20
  });
  assert.equal(validGoal.stopPolicy.noProgressLimit, 2);
});

for (const field of [
  "objective",
  "targetRepositories",
  "successCriteria",
  "constraints",
  "riskLevel",
  "approvalPolicy",
  "verificationProfile",
  "requiredCapabilities",
  "budget",
  "stopPolicy"
]) {
  test(`v1 goal rejects missing ${field}`, () => {
    const invalid = structuredClone(validGoal);
    delete invalid[field];
    assert.equal(validate(invalid), false);
  });
}

for (const field of [
  "maxFanOut",
  "maxIterations",
  "maxAttemptsPerWorkItem",
  "maxRuntimeSeconds",
  "maxModelCalls"
]) {
  test(`v1 goal rejects non-positive ${field}`, () => {
    const invalid = structuredClone(validGoal);
    invalid.budget[field] = 0;
    assert.equal(validate(invalid), false);
  });
}

test("v1 lifecycle rejects incomplete metadata and malformed trace context", () => {
  const missingRun = structuredClone(validGoal);
  delete missingRun.runId;
  assert.equal(validate(missingRun), false);

  const malformedTrace = structuredClone(validGoal);
  malformedTrace.traceContext.traceparent = "invalid";
  assert.equal(validate(malformedTrace), false);
});

test("v1 verification and evaluation records require evidence URIs", async () => {
  const verification = await readJson(path.join(root, "examples", version, "verification-result.json"));
  const verificationValidator = ajv.getSchema("https://schemas.coding-autopilot.dev/v1.0/verification-result.schema.json");
  const noVerificationEvidence = structuredClone(verification);
  delete noVerificationEvidence.checks[0].evidenceUri;
  assert.equal(verificationValidator(noVerificationEvidence), false);

  const evaluation = await readJson(path.join(root, "examples", version, "evaluation-result.json"));
  const evaluationValidator = ajv.getSchema("https://schemas.coding-autopilot.dev/v1.0/evaluation-result.schema.json");
  const noEvaluationEvidence = structuredClone(evaluation);
  delete noEvaluationEvidence.evidence;
  assert.equal(evaluationValidator(noEvaluationEvidence), false);
});
