# Pitfalls Research

| Pitfall | Warning Sign | Prevention |
|---------|--------------|------------|
| Silent breaking changes | Existing examples or consumers fail after a minor release | Enforce semantic compatibility rules and tests |
| Divergent metadata | Components invent different trace fields | Centralize lifecycle metadata in common definitions |
| Schemas that only document happy paths | Invalid payloads pass unnoticed | Add negative contract tests |
| Secret leakage through examples | Tokens or credentials appear in fixtures | Use synthetic values and security review |
| Schema and docs drift | README examples no longer validate | Validate all examples in CI |
