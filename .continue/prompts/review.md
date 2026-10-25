---
name: review
description: Review the current file or selection against the project rules
invokable: true
---
Review the code I selected against .continue/rules and docs/SPEC.md.
Report only real problems, ordered by severity: bugs, rule violations (purity, hydration, ids, hardcoded content), missing tests.
For each: line, why it is a problem, minimal fix. If nothing is wrong, say so in one line.
