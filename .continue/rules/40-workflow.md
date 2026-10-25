---
name: Working method for a local model
alwaysApply: true
---
You are a small local model. Work in small, verifiable steps.

For every request:
1. Do ONE task from docs/IMPLEMENTATION_PLAN.md at a time. State the task id first.
2. Read only the files listed in that task. Do not scan the whole repo.
3. Change only the files listed. Do not refactor anything else.
4. Create new files in full, with the path as a header. For existing files over 150 lines, give targeted edits, never a full rewrite.
5. Never write placeholders, "TODO", "..." or "rest of the code here". Every file must be complete and compile.
6. After the code, list: files changed, the command to verify (`npm run typecheck`, `npm test`), and your assumptions.
7. When the user confirms it works, tick the task in docs/PROGRESS.md and stop. Do not start the next task unasked.

If a requirement is ambiguous, ask ONE question and wait. If a test fails, fix the cause, never weaken the test.
