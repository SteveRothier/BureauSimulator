# CONTENT_SCHEMA — formats de données

```ts
type EmployeeDef = {
  id: string; name: string; description: string; sideEffect: string;
  baseCost: number; costFactor: number;      // coût = ceil(baseCost × costFactor^n)
  production: number;                        // dossiers/s par unité
  salary: number;                            // € par seconde par unité
  era: number;                               // index d’ère de déblocage (0 = départ)
};

type BuildingDef = {
  id: string; name: string; description: string; sideEffect: string;
  baseCost: number; costFactor: number;
  production: number; rent: number; chaos?: number; era: number;
};

type UpgradeDef = {
  id: string; name: string; description: string; sideEffect?: string; joke?: string;
  cost: number; era: number; category: 'click'|'productivity'|'revenue'|'morale'|'stability'|'management'|'tech';
  effects: Effect[];                         // voir ARCHITECTURE.md
};

type GoalMetric = 'docs'|'earned'|'upgradesOwned'|'rate'|'employees'|'employeeType'|'morale'|'sat'|'chaosBelow'|'window';
type GoalDef = {
  id: string; label: string; metric: GoalMetric;
  target: number; hold?: number;             // secondes de maintien
  param?: string | number;                   // ex. id d’employé, durée de fenêtre
  big?: boolean;                             // objectif « irréaliste » de fin d’ère
};
type EraDef = { index: number; name: string; rank: string; goals: GoalDef[] };

type EventEffect =
  | { type: 'pay'; seconds: number; min: number }          // coût plafonné à l’argent disponible
  | { type: 'gain'; seconds: number; min: number }         // gain = max(min, revenu/s × seconds)
  | { type: 'pending'; value: number }                     // ajoute des dossiers
  | { type: 'pendingMul'; value: number }
  | { type: 'temp'; mult: number; seconds: number }        // multiplicateur de production temporaire
  | { type: 'morale'|'chaos'|'sat'; value: number }
  | { type: 'chance'; p: number; success: EventEffect[]; failure: EventEffect[] };
type EventChoice = { label: string; effects: EventEffect[]; result: string };
type EventDef = {
  id: string; title: string; description: string; minEra: number; negative: boolean;
  weight: (s: GameState) => number;          // fonction pure, 1 par défaut
  choices: EventChoice[];                    // le DERNIER est le choix par défaut
};

type RevealRule = { key: string; when: (s: GameState) => boolean; message?: string };
```
Règles : ids stables et uniques ; textes en français ; pas de logique dans les données hormis `weight` et `when` (fonctions pures).
