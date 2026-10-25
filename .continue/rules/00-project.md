---
name: Project overview
alwaysApply: true
---
This repo is "Bureau Simulator : le travail ne finit jamais", a browser idle/incremental game (bureaucracy satire).

Stack: Next.js (App Router), React, TypeScript strict, Zustand, Vitest, plain CSS (no Tailwind). No other dependency without asking the user first.

Sources of truth (read on demand, do not paste them back):
- docs/PROGRESS.md (what is done / next), docs/IMPLEMENTATION_PLAN.md (task details)
- docs/SPEC.md (game rules and formulas), docs/ARCHITECTURE.md (code structure)
- docs/CONTENT_SCHEMA.md (data formats), prototype/bureau-simulator.html (reference implementation)

Conventions:
- Code, identifiers, comments, commit messages: English.
- Player-facing text: French, with typographic apostrophe (’) and « guillemets ».
- Content (employees, buildings, upgrades, events, goals) lives in lib/data/*.ts only. Never hardcode content in the engine or components.
- Never rename an existing content id (it would break saves).
- Never invent mechanics that are not in docs/SPEC.md. If something is missing, ask one short question.
