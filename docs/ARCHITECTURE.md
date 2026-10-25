# ARCHITECTURE

## Arborescence cible
```
app/            page.tsx, layout.tsx, globals.css
components/game/ GameShell, ResourceBar, WorkArea, Shop (tabs), GoalsPanel, EventPanel, LogPanel, PrestigePanel, SavePanel
lib/game/       types.ts, formulas.ts, format.ts, stats.ts (computeStats), engine.ts (click, buy),
                simulation.ts (tick, simulateOffline), progression.ts, events.ts, effects.ts,
                reveal.ts, save.ts, migrations.ts
lib/data/       employees.ts, buildings.ts, upgrades.ts, eras.ts, events.ts, reveal.ts (règles d’affichage)
lib/store/      gameStore.ts, useGameLoop.ts
tests/          *.test.ts
scripts/        simulate.ts (équilibrage)
```

## Principes
1. Le moteur (`lib/game`) est pur : entrée `(state, dt, rng)`, sortie nouvel état. Aucun React, aucun stockage.
2. Le contenu (`lib/data`) est de la donnée typée. Le moteur lit les données et applique des effets génériques.
3. Le store Zustand détient `state` et expose des actions : `click()`, `buy(kind, id)`, `tick(dt)`, `resolveEvent(i)`, `restructure()`, `load()`, `save()`, `importSave(json)`, `reset()`.
4. L’UI lit le store par sélecteurs fins et se rafraîchit 4 fois par seconde au plus.

## Boucle de jeu (`useGameLoop`)
- `setInterval` 250 ms, mais le temps écoulé vient de `Date.now()` (jamais « 0,25 s fixe »).
- `dt ≤ 2 s` : `tick(dt)`. `dt > 2 s` (onglet suspendu, retour) : `simulateOffline(dt)` plafonné à 8 h.
- Autosave toutes les 10 s et à `pagehide`.

## Système d’effets
```ts
type Effect =
  | { type: 'clickAdd'; value: number }
  | { type: 'clickMul'; value: number }
  | { type: 'prodMul'; value: number }
  | { type: 'revMul'; value: number }
  | { type: 'incomingMul'; value: number }
  | { type: 'moraleAdd'; value: number }
  | { type: 'chaosAdd'; value: number }
  | { type: 'eventRisk'; value: number }; // réduction du poids des événements négatifs
```
Une seule fonction `applyEffects(effects[]) → Modifiers` ; `computeStats` s’en sert. Ajouter un type d’effet = modifier l’union, `applyEffects`, et ajouter un test.

## État (voir `CONTENT_SCHEMA.md` pour les définitions)
`GameState` : `version, savedAt, era, money, pend, docs, earned, life, rate, clickAcc, winAcc, sec, win[120], emp{}, bld{}, upg{}, morale, chaos, sat, done{}, hold{}, seen{}, ui{}, prest{n,pts}, fx|null, ev|null, evNext, log[], clicks`.
Les valeurs dérivées (production, revenus, dépenses) ne sont jamais stockées.

## Pièges Next.js à éviter
- Page de jeu = composant client. Ne pas lire `localStorage` au rendu serveur : charger dans `useEffect`, afficher un écran neutre jusqu’au chargement.
- Pas de `Date.now()`/`Math.random()` pendant le rendu (erreurs d’hydratation).
- Pas de timer qui s’accumule : nettoyer l’intervalle dans le `return` du `useEffect`.
- Export statique possible (`output: 'export'`) car aucun serveur n’est nécessaire.

## Tests
Vitest. Obligatoires : coûts, `computeStats`, `tick` (file, argent, plafonds 0–100), objectifs avec `hold`, promotion, événements (rng à graine), sauvegarde (aller-retour, sauvegarde corrompue, migration), hors ligne (pas d’événements, plafond 8 h).
