---
name: Content data rules
globs: "lib/data/**/*.ts"
alwaysApply: false
description: Rules for data-driven content files
---
- Each file exports a typed readonly array (`export const EMPLOYEES: readonly EmployeeDef[] = [...]`). Types come from `lib/game/types.ts` and docs/CONTENT_SCHEMA.md.
- ids are unique, lowercase, stable. Never rename or reuse an id.
- Effects are composable data objects (`{ type: 'prodMul', value: 1.15 }`), never custom code per item. If a needed effect type does not exist, add it to the Effect union AND to the single `applyEffects` function, with a test.
- Every upgrade and event must have: French name, French description, French side effect or joke (short, reactive, no long dialogue).
- Tone: mock absurd systems, meetings, indicators and bureaucracy, never the people who work.
- Costs and numbers are design parameters: keep them as named fields so balancing only edits data.
