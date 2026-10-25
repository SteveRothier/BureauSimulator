---
name: TypeScript and React rules
globs: "**/*.{ts,tsx}"
alwaysApply: false
description: Style rules for TypeScript and React files
---
- TypeScript strict. No `any`, no `// @ts-ignore`. Prefer `type` over `interface`. Use `@/` imports.
- Components that use hooks, the store or browser APIs start with `'use client'`.
- Hydration safety: never read localStorage, Date.now() or Math.random() during render. Load the save inside `useEffect`, render a neutral state first.
- Select the minimum from the Zustand store: `useGame(s => s.money)`, never the whole state.
- Never render one component per owned unit. Render one row per TYPE with a counter.
- Update the UI at most 4 times per second. The simulation never lives in React state.
- Keep files under 200 lines. Split by responsibility if larger.
- Accessibility: real `<button>` elements, visible focus, `aria-live="polite"` on the log, respect `prefers-reduced-motion`, support light and dark via CSS variables.
- Disabled purchase buttons must say why (« Fonds insuffisants »). Do not put a number that changes every frame inside a button label.
