---
name: implement-task
description: Implement a task from the plan (usage: /implement-task T12)
invokable: true
---
Implement the task whose id I give you, following docs/IMPLEMENTATION_PLAN.md.
First restate in 3 lines: goal, files to touch, how it will be verified.
Then read only the files listed in the task and the matching section of docs/SPEC.md or docs/ARCHITECTURE.md.
Then write the code and the Vitest tests. Finish with the verification commands and your assumptions.
