---
name: fix-tests
description: Diagnose a failing test or type error from pasted output
invokable: true
---
I will paste the output of `npm test` or `npm run typecheck`.
Explain the root cause in two sentences, then give the smallest fix in the source file. Do not change a test to make it pass unless the test itself contradicts docs/SPEC.md; if so, explain why first.
