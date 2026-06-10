import { createValidator, exampleDirectory, jsonFiles, readJson, schemaIdForExample } from "./lib.mjs";

const ajv = await createValidator();
let validated = 0;

for (const examplePath of await jsonFiles(exampleDirectory)) {
  const validate = ajv.getSchema(schemaIdForExample(examplePath));
  if (!validate) {
    throw new Error(`No schema found for ${examplePath}`);
  }

  const example = await readJson(examplePath);
  if (!validate(example)) {
    throw new Error(`${examplePath} failed validation: ${ajv.errorsText(validate.errors)}`);
  }
  validated += 1;
}

console.log(`Validated ${validated} lifecycle examples.`);
