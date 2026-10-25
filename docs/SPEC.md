# SPEC — règles condensées (source de vérité pour le code)

Le GDD complet est dans `docs/GDD.md`. Les valeurs initiales (coûts, productions, objectifs, événements) sont dans `prototype/bureau-simulator.html` : constantes `EMP`, `BLD`, `UPG`, `ERAS`, `EV`.

## 1. Ressources et métriques
- `money` (€), `pend` (dossiers en attente), `docs` (total traités), `earned` (argent gagné dans la partie), `life` (argent gagné toutes parties, sert au prestige).
- `rate` : dossiers traités par seconde, lissé (clics inclus).
- `morale`, `chaos`, `sat` (satisfaction) : 0 à 100. Le moral existe à partir de l’ère 2, chaos et satisfaction à partir de l’ère 3 (index 1 et 2 dans le code). Avant, valeurs neutres (morale 70, chaos 0, sat 90).
- `prest.pts` : points de restructuration, +10 % production et clic par point.
- Plus tard (voir GDD §3) : influence, réputation, données, conformité, parts de marché, capital politique.

## 2. Statistiques dérivées (`computeStats`)
```
pr  = 1 + 0.1 * prest.pts
mf  = 0.7 + 0.4 * morale/100            (facteur moral)
cf  = chaos>75 ? 0.65 : chaos>50 ? 0.85 : 1   (facteur chaos)
base = Σ employés (prod × n) + Σ bâtiments (prod × n)
prod = base × prodMul × pr × mf × cf × fxMult
click = (1 + Σ clickAdd) × clickMul × pr × mf
incoming = (1 + 0.9 × prod) × incomingMul
expenses = Σ employés (salaire × n) + Σ bâtiments (loyer × n)
value = revMul × (0.6 + 0.4 × sat/100)        (€ par dossier)
chaosBase = Σ chaosAdd des améliorations + Σ (chaos bâtiment × n)
```
Coût d’achat : `ceil(base × facteur ^ quantité)` ; facteurs 1,15 (employés de base), 1,17 (spécialisés), 1,18 (bâtiments), 1,22 (bâtiments globaux).

## 3. Ordre de `tick(state, dt)` (ne pas modifier)
1. `stats = computeStats(state)`.
2. `avail = pend + incoming×dt` ; `processed = min(prod×dt, avail)` ; `pend = avail − processed`.
3. Revenu `gain = processed × value` ; `money = max(0, money + gain − expenses×dt)` ; mise à jour `earned`, `life`, `docs`, tampon de fenêtre.
4. Débit lissé : `rate += ((processed + clicks)/dt − rate) × (1 − e^(−0.5·dt))`.
5. `overload = pend / (prod×30 + 300)` ; `oc = min(1, overload)`.
6. Moral (index d’ère ≥ 1) : cible `50 + moraleAdd − 20×oc`. Chaos (index ≥ 2) : cible `chaosBase + 60×oc + (morale<40 ? 10 : 0)`. Satisfaction (index ≥ 2) : cible `92 − 45×oc − max(0, chaos−25)×0.4`. Chaque valeur glisse vers sa cible avec `k = 1 − e^(−0.1·dt)`.
7. Effet temporaire : décrémenter, supprimer à 0.
8. Fenêtre glissante : un compartiment par seconde, 120 compartiments.
9. Objectifs d’ère (voir §4), puis promotion si tous remplis.
10. Événements : seulement en jeu en direct (jamais hors ligne).

Un clic : traite `click` dossiers, retire `min(pend, click)` de la file, paie `click × value`.

## 4. Objectifs et ères
- Un objectif = métrique + cible, avec une durée de maintien optionnelle (`hold`, en secondes, remis à 0 si la condition tombe). Une fois rempli, il reste rempli.
- Chaque ère a un objectif « irréaliste » (`big`) qui sert de condition de déblocage. Il doit être atteignable avec le contenu de l’ère en cours.
- L’ère suivante s’ouvre quand tous les objectifs sont remplis. Aucun événement aléatoire ne bloque une ère.
- Ères 1 à 4 : voir le prototype. Ère 5 « Direction » = fin du prototype. Ères 6 à 10 : GDD §4.

## 5. Événements
- Un seul à la fois. Délai entre deux : 80 à 140 s (premier : 120 s).
- Poids selon l’état (chaos, moral, file). Les améliorations `eventRisk` réduisent le poids des événements négatifs (plancher 0,3).
- Chaque événement négatif a au moins un choix qui reste possible sans argent (le paiement est plafonné à l’argent disponible).
- Le dernier choix est le choix par défaut, appliqué après 60 s sans décision.
- Aucun événement ne détruit la sauvegarde ni ne bloque la progression.

## 6. Révélation progressive de l’interface (style Universal Paperclips)
Un élément n’apparaît que lorsqu’une condition est vraie, puis reste visible (drapeau `ui[clé]` ou `seen[id]` sauvegardé). Un message du journal annonce certains déblocages.
| Élément | Condition |
|---|---|
| Dossiers traités, ligne de clic | dès le départ / après 1 dossier |
| Argent | `earned > 0` |
| Dossiers en attente | `docs ≥ 3` |
| Débit | `docs ≥ 20` |
| Revenu net | au moins un employé ou bâtiment |
| Objectifs et rang | `docs ≥ 10` |
| Boutique | un article atteint 60 % de son prix |
| Chaque onglet (Employés, Bâtiments, Améliorations) | son premier article « vu » |
| Article de boutique | ère atteinte ET (possédé OU argent ≥ 60 % du prix) |
| Moral / Satisfaction + Chaos | ère 2 / ère 3 |
| Sauvegarde | `docs ≥ 30` |
| Événements | premier événement survenu |
| Journal | au moins un message |
| Restructuration | ère 4 |

## 7. Sauvegarde
Clé `bureau_sim_v1` dans localStorage. Champ `version` obligatoire. Autosave toutes les 10 s et après achat, promotion, événement. Hors ligne : jusqu’à 8 h, simulé en 600 pas maximum, sans événements. Ne jamais écraser une sauvegarde avant d’avoir validé le chargement. Export et import en JSON.

## 8. Règles anti-blocage (à tester)
- Argent jamais négatif ; une crise se résout avec peu d’argent.
- Un objectif d’ère n’exige jamais un achat débloqué par l’ère suivante.
- Les coûts sont affichés avant achat ; un achat bloqué dit pourquoi.
