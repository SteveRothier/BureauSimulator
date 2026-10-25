---
name: Game engine rules
globs: "lib/game/**/*.ts"
alwaysApply: false
description: Rules for the pure game engine
---
- Engine functions are PURE: `(state, input) => newState`. No React, no store, no localStorage, no `Date.now()`, no `Math.random()` inside. Time comes in as `dt` (seconds), randomness as an injected `rng: () => number`.
- Never mutate the input state. Return a new object (shallow copies of changed branches are enough).
- Clamp morale, satisfaction, chaos, compliance to 0..100. Money never goes below 0.
- Cap `dt` per call (1 s live). Long absences go through `simulateOffline`, which loops in chunks and disables events.
- Simulation order inside `tick` is fixed by docs/SPEC.md section 3. Do not reorder.
- Do not store derived values (prod/s, income/s). Compute them with `computeStats(state)`.
- Every exported engine function needs a Vitest test in `tests/`. Use a seeded rng for event tests.
- Large numbers: plain JS `number` for now. Never use `toFixed` for logic, only for display in format.ts.
