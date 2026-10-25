# IMPLEMENTATION_PLAN

Règle : une tâche à la fois, dans l’ordre. Chaque tâche liste ses fichiers et son critère de réussite. Après chaque tâche réussie : `git commit`, puis cocher `docs/PROGRESS.md`.

Pour les phases 7 (T33 à T37), découper chaque version en sous-tâches de la même taille que T05 à T16 avant de commencer.


## Phase 0 — Mise en place

### T00 — Créer le projet
- Faire : `npx create-next-app@latest . --ts --app --eslint --no-tailwind --import-alias "@/*"`, puis `npm i zustand` et `npm i -D vitest`. Scripts : `test` (vitest run), `typecheck` (tsc --noEmit).
- Terminé quand : `npm run dev`, `npm test`, `npm run typecheck` fonctionnent.

### T01 — Squelette de dossiers
- Faire : Créer les dossiers et fichiers vides de `docs/ARCHITECTURE.md` avec une ligne de commentaire d’en-tête chacun.
- Terminé quand : `npm run typecheck` passe.


## Phase 1 — Types et calculs

### T02 — Types
- Faire : `lib/game/types.ts` : tous les types de `CONTENT_SCHEMA.md` + `GameState` + `Effect`. Fonction `createInitialState()`.
- Terminé quand : Typecheck OK ; test : l’état initial a `era=0`, `money=0`, `win.length=120`.

### T03 — Formatage des nombres
- Faire : `lib/game/format.ts` : `formatNumber`, `formatEuro` (K, M, Md, Bn, Bd, puis notation scientifique). Référence : fonctions `F` et `E` du prototype.
- Terminé quand : Tests : 0, 9,5, 999, 1 000, 1,5M, 2Md, 1e18+, NaN/Infinity.

### T04 — Formules
- Faire : `lib/game/formulas.ts` : `itemCost(base, factor, owned)`, `prestigeGain(life, currentPts)`.
- Terminé quand : Tests de coût pour n = 0, 1, 10 ; gain jamais négatif.


## Phase 2 — Données (port depuis le prototype)

### T05 — Employés
- Faire : `lib/data/employees.ts` : les 6 employés de `EMP`.
- Terminé quand : Ids uniques (test) ; valeurs identiques au prototype.

### T06 — Bâtiments
- Faire : `lib/data/buildings.ts` : les 5 bâtiments de `BLD`.
- Terminé quand : Idem T05.

### T07 — Améliorations
- Faire : `lib/data/upgrades.ts` : les 15 améliorations de `UPG`, effets en objets `Effect`.
- Terminé quand : Idem ; chaque amélioration a au moins un effet.

### T08 — Ères et objectifs
- Faire : `lib/data/eras.ts` : 5 ères et leurs objectifs, en `GoalDef` (métriques, pas de fonctions).
- Terminé quand : Test : chaque objectif `big` existe une fois par ère 0 à 3.

### T09 — Événements
- Faire : `lib/data/events.ts` : les 11 événements de `EV`, convertis en `EventEffect`.
- Terminé quand : Test : le dernier choix de chaque événement existe ; ids uniques.

### T10 — Règles de révélation
- Faire : `lib/data/reveal.ts` : le tableau §6 de `SPEC.md` en `RevealRule[]`.
- Terminé quand : Test : à l’état initial seul « dossiers traités » est visible.


## Phase 3 — Moteur pur

### T11 — Effets et statistiques
- Faire : `lib/game/effects.ts` (`applyEffects`) et `stats.ts` (`computeStats`) selon SPEC §2.
- Terminé quand : Tests : sans achat, prod = 0 ; Souris ergonomique donne clic 2 ; moral et chaos modifient la production.

### T12 — Clic et achat
- Faire : `lib/game/engine.ts` : `clickDoc`, `buyEmployee`, `buyBuilding`, `buyUpgrade`.
- Terminé quand : Tests : fonds insuffisants = état inchangé ; coût croissant ; amélioration non rachetable.

### T13 — Simulation
- Faire : `lib/game/simulation.ts` : `tick(state, dt)` dans l’ordre exact de SPEC §3.
- Terminé quand : Tests : file jamais négative ; argent ≥ 0 ; morale/chaos/sat entre 0 et 100 ; fenêtre glissante correcte.

### T14 — Objectifs et promotion
- Faire : `lib/game/progression.ts` : évaluation des métriques, `hold`, promotion d’ère (intégrée à `tick`).
- Terminé quand : Tests : un objectif avec hold se remet à 0 si la condition tombe ; promotion quand tous remplis ; un objectif rempli reste rempli.

### T15 — Événements
- Faire : `lib/game/events.ts` : `pickEvent(state, rng)`, `resolveEvent(state, choiceIndex)`, expiration par défaut après 60 s.
- Terminé quand : Tests avec rng à graine ; jamais deux événements ; paiement plafonné à l’argent ; événement négatif résoluble avec 0 €.

### T16 — Hors ligne
- Faire : `simulateOffline(state, seconds)` : plafond 8 h, 600 pas, sans événements.
- Terminé quand : Test : 10 h d’absence = 8 h simulées ; aucun événement créé.


## Phase 4 — Store, boucle, sauvegarde

### T17 — Store Zustand
- Faire : `lib/store/gameStore.ts` avec les actions de `ARCHITECTURE.md`.
- Terminé quand : Typecheck ; test : `click()` puis `buy()` via le store.

### T18 — Boucle de jeu
- Faire : `lib/store/useGameLoop.ts` : intervalle 250 ms, delta réel, bascule hors ligne si dt > 2 s, nettoyage de l’intervalle.
- Terminé quand : Dans le navigateur, l’argent monte avec un stagiaire ; un seul intervalle actif.

### T19 — Sauvegarde
- Faire : `lib/game/save.ts` + `migrations.ts` : `serialize`, `deserialize` validé, version, export/import JSON, autosave.
- Terminé quand : Tests : aller-retour identique ; JSON corrompu = état initial sans crash ; ancienne version migrée.


## Phase 5 — Interface

### T20 — Layout et thème
- Faire : `app/layout.tsx`, `globals.css` : variables CSS clair et sombre, grille auto-fit, `[hidden]{display:none!important}`. Palette du prototype.
- Terminé quand : Page lisible en clair et sombre, sur mobile.

### T21 — Zone de travail
- Faire : `WorkArea.tsx` : bouton « Traiter un dossier », pile de dossiers, ligne de clic.
- Terminé quand : Un clic ajoute des dossiers ; focus clavier visible.

### T22 — Barre de ressources
- Faire : `ResourceBar.tsx` : statistiques affichées selon `reveal`.
- Terminé quand : Les statistiques apparaissent aux seuils de SPEC §6.

### T23 — Boutique
- Faire : `Shop.tsx` : onglets masqués jusqu’au premier article vu, lignes par type, bouton désactivé avec « Fonds insuffisants ».
- Terminé quand : Aucun onglet au départ ; chaque onglet apparaît au bon moment.

### T24 — Objectifs
- Faire : `GoalsPanel.tsx` : barres de progression, maintien en secondes, objectif irréaliste signalé.
- Terminé quand : Les objectifs se remplissent et l’ère change.

### T25 — Événements et journal
- Faire : `EventPanel.tsx`, `LogPanel.tsx` (`aria-live="polite"`).
- Terminé quand : Un événement s’affiche, se résout, écrit dans le journal.

### T26 — Révélation progressive
- Faire : `lib/game/reveal.ts` + hook `useReveal` ; messages de déblocage dans le journal ; animation d’apparition désactivée si mouvement réduit.
- Terminé quand : Partie neuve = écran presque vide ; tout se débloque en jouant.

### T27 — Sauvegarde et restructuration (UI)
- Faire : `SavePanel.tsx`, `PrestigePanel.tsx`.
- Terminé quand : Recharger la page conserve la partie ; restructurer applique le bonus.


## Phase 6 — Contenu v1.0 et qualité

### T28 — Équilibrage
- Faire : `scripts/simulate.ts` : acheteur glouton qui joue 20 h simulées ; affiche le temps par ère. Ajuster les coûts dans `lib/data`.
- Terminé quand : Chaque ère dans ±30 % des durées cibles du GDD §4.

### T29 — Ère 5 : automatisation
- Faire : Ajouter données, ressource conformité, audits, archives (GDD §4 ère 5 et §6.7–6.8) en données et effets uniquement.
- Terminé quand : Ère jouable de bout en bout ; tests de conformité.

### T30 — Succès et statistiques
- Faire : Succès du GDD §11 (données + vérification pure) et écran de statistiques.
- Terminé quand : Un succès se débloque et survit au rechargement.

### T31 — Accessibilité
- Faire : Contraste, taille de texte, réduction des animations, navigation clavier complète.
- Terminé quand : Toutes les actions utilisables au clavier.

### T32 — Robustesse
- Faire : Tests : sauvegarde corrompue, très grands nombres, onglet suspendu 10 h, import invalide.
- Terminé quand : Aucune exception ; tous les tests passent.


## Phase 7 — Versions suivantes (GDD §16)

### T33 — v1.1 La direction
- Faire : Ère 6 : contrats, réputation, crédit, objectifs trimestriels. Données d’abord, puis moteur minimal.
- Terminé quand : Contrats jouables ; crédit remboursable.

### T34 — v1.2 Groupe national
- Faire : Ère 7 : filiales, acquisitions, parts de marché, multi-sites.
- Terminé quand : —

### T35 — v1.3 Multinationale
- Faire : Ère 8 : régions, contrats internationaux, conformité locale.
- Terminé quand : —

### T36 — v1.4 Institution économique
- Faire : Ère 9 : capital politique, projets nationaux.
- Terminé quand : —

### T37 — v1.5 Bureaucratie totale
- Faire : Ère 10 : fins alternatives, défis, prestiges avancés, améliorations absurdes (GDD §6.10).
- Terminé quand : Fin principale atteignable.
