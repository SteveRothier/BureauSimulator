# Bureau Simulator : Le travail ne finit jamais

## Cahier des charges fonctionnel et technique

**Version :** 1.0\
**Genre :** jeu incrémental, idle, gestion et automatisation\
**Plateforme :** navigateur web, priorité PC\
**Technologies envisagées :** Next.js, React, TypeScript, Zustand, CSS, Tailwind,
Lucide React, Apache ECharts\
**Direction artistique :** logiciels rétro inspirés de Windows 95/98

## 1. Vision du jeu

Le joueur commence comme stagiaire administratif avec 5 € et une seule
action : **Traiter un dossier**. Il débloque ensuite des améliorations,
automatise le travail, achète des applications pour son bureau virtuel,
recrute des employés, dirige des services, gère des contrats et des
finances, investit en bourse et finit par développer un groupe
d'entreprises.

L'interface évolue avec la progression : les nouveaux boutons,
applications et onglets apparaissent seulement lorsque les conditions
sont remplies. Le bureau virtuel est au cœur du jeu. Les applications
achetées apportent de vrais outils, bonus et mini-jeux rétro
traditionnels.

### Principes fondamentaux

1.  Prise en main immédiate et interface initiale presque vide.
2.  Progression régulière et lisible.
3.  Chaque application apporte une fonction réelle.
4.  Les décisions économiques impliquent des compromis.
5.  L'automatisation devient progressivement centrale.
6.  Identité visuelle rétro cohérente.
7.  Le jeu continue après le sommet de carrière avec des objectifs de
    long terme.

## 2. Direction artistique : logiciel rétro des années 90

### Style visuel

-   Fond de bureau turquoise ou bleu-vert.
-   Fenêtres gris clair, bordures en relief et boutons carrés.
-   Barres de titre bleu foncé et texte blanc.
-   Icônes pixelisées ou illustrations 2D simples et cohérentes.
-   Police système lisible ; monospace pour les chiffres techniques.
-   Graphiques intégrés dans des fenêtres classiques.
-   Effets sobres au survol et au clic.
-   Notifications système et humour bureaucratique.
-   Palette limitée : gris, bleu foncé, turquoise, vert pour les gains
    et rouge pour les erreurs.

### Éléments d'interface

  -----------------------------------------------------------------------
  Élément                             Fonction
  ----------------------------------- -----------------------------------
  Bureau virtuel                      Espace principal des raccourcis
                                      débloqués

  Icônes                              Ouvrent les applications

  Fenêtres                            Déplaçables, réduisibles,
                                      restaurables, agrandissables et
                                      fermables

  Barre des tâches                    Accès aux applications ouvertes

  Menu Démarrer                       Applications, paramètres,
                                      sauvegarde et progression

  Zone de notification                Événements, promotions, contrats et
                                      alertes

  Horloge                             Temps de jeu ou heure simulée

  Corbeille                           Retire un raccourci ; ne
                                      désinstalle pas sans confirmation
  -----------------------------------------------------------------------

Sur petits écrans, les fenêtres deviennent des panneaux adaptés. Le jeu
ne simule pas tout un système d'exploitation : React et CSS suffisent.

### Cohérence graphique

-   Réutiliser les mêmes styles de boutons, fenêtres et marges.
-   Éviter les dégradés modernes, les cartes trop arrondies et les
    effets lumineux excessifs.
-   Les animations servent une action : compteur qui monte, fenêtre qui
    s'ouvre, notification qui apparaît.
-   Les noms et textes doivent évoquer un logiciel professionnel rétro
    avec un humour original.

## 3. Progression de carrière

  -----------------------------------------------------------------------
  Rang                                Déblocages principaux
  ----------------------------------- -----------------------------------
  1\. Stagiaire administratif         Traitement manuel, trésorerie,
                                      consignes du supérieur

  2\. Employé confirmé                Améliorations et premières
                                      statistiques

  3\. Assistant administratif         Automatisation simple, applications
                                      et mini-jeux

  4\. Gestionnaire de dossiers        Files de traitement, contrôle
                                      qualité, contrats simples

  5\. Chef d'équipe                   Recrutement, salaires, compétences
                                      et équipes

  6\. Responsable de service          Budgets, machines et chaînes de
                                      production

  7\. Directeur des opérations        Plusieurs services, recherche,
                                      contrats importants

  8\. Directeur financier             Comptabilité complète, emprunts et
                                      bourse fictive

  9\. Directeur général               Immobilier, marketing, négociation
                                      et expansion

  10\. Président du groupe            Filiales, acquisitions,
                                      actionnaires et nouveaux marchés
  -----------------------------------------------------------------------

Les promotions combinent dossiers traités, revenus, objectifs,
réputation et capacité de production. Un panneau explique les conditions
restantes pour éviter tout blocage opaque.

## 4. Boucle de jeu et dossiers

### Début de partie

-   Trésorerie initiale : 5 €.
-   Dossiers traités : 0.
-   Une seule action : **Traiter un dossier**.
-   Certains dossiers sont rémunérés, d'autres non.
-   Les premiers gains financent les améliorations.
-   Les retours visuels restent simples : compteur animé, dossier
    validé, notification courte.

### Progression

Le joueur débloque plusieurs dossiers par clic, dossiers premium,
contrats, files d'attente, traitement par lots, vérification
automatique, employés, machines, logiciels spécialisés et IA.

### Données d'un dossier

-   Type et difficulté.
-   Rémunération potentielle.
-   Temps ou capacité nécessaire.
-   Qualité requise et risque d'erreur.
-   Échéance éventuelle.
-   Statut : reçu, en cours, à vérifier, validé ou archivé.

Les règles économiques sont centralisées dans le moteur de simulation,
et non dispersées dans les boutons.

## 5. Bureau virtuel et applications achetables

Les applications sont achetées dans un catalogue puis installées sur le
bureau. Elles peuvent être ouvertes, réduites, restaurées et fermées.
Les logiciels achetés restent acquis après rechargement. Supprimer un
raccourci ne désinstalle pas l'application.

  -----------------------------------------------------------------------
  Application             Fonction                Déblocage indicatif
  ----------------------- ----------------------- -----------------------
  **Tableur Pro**         Revenus, dépenses,      Premières améliorations
                          dossiers et             
                          statistiques            

  **TaskMaster 95**       Tâches automatiques et  Assistant administratif
                          macros                  

  **Compta 98**           Bénéfice net, salaires, Gestionnaire de
                          dépenses et prévisions  dossiers

  **Personnel.exe**       Employés, compétences,  Chef d'équipe
                          fatigue et salaires     

  **Projet Manager**      Objectifs, projets et   Gestionnaire de
                          échéances               dossiers

  **Courrier Express**    Consignes, contrats,    Début de partie
                          événements              

  **Bourse 2000**         Actions fictives,       Directeur financier
                          portefeuille et         
                          graphiques              

  **Bureau IA**           Classement, validation  Recherche avancée
                          et prédiction           
                          automatiques            

  **Maintenance.exe**     Pannes, machines et     Responsable de service
                          maintenance             

  **Groupe Manager**      Filiales, acquisitions  Président du groupe
                          et résultats consolidés 
  -----------------------------------------------------------------------

Chaque application définit un identifiant, nom, icône, prix, conditions
de déblocage, coûts récurrents, effets, niveaux d'amélioration,
dépendances et état d'installation. Chaque logiciel doit apporter une
mécanique, un bonus, une automatisation ou des informations utiles.

## 6. Mini-jeux rétro traditionnels

Les mini-jeux sont des jeux d'arcade ou de réflexion immédiatement
reconnaissables, présentés comme des applications de l'ordinateur de
travail. Ils sont facultatifs et donnent des bonus temporaires
plafonnés. Les graphismes, sons et codes doivent être originaux, sans
copier les ressources propriétaires des anciens jeux.

  -----------------------------------------------------------------------
  Mini-jeu                Principe                Récompense possible
  ----------------------- ----------------------- -----------------------
  **Snake.exe**           Guider le serpent,      Bonus temporaire de
                          ramasser des objets et  productivité
                          éviter les collisions   

  **Démineur 95**         Déduire les cases       Réduction temporaire
                          minées à partir des     des erreurs
                          indices numériques      

  **Pong Office**         Duel de raquettes       Bonus temporaire de
                          contre l'ordinateur     vitesse

  **Memory Bureau**       Retrouver les paires de Bonus temporaire de
                          cartes                  précision

  **Casse-Briques**       Détruire les briques    Petite prime plafonnée
                          avec une balle et une   
                          raquette                

  **Morpion.exe**         Morpion contre une IA   Expérience ou
                          simple                  réputation

  **2048 Bureau**         Fusionner les tuiles de Bonus de recherche
                          même valeur             

  **Space Invaders :      Survivre aux vagues     Bonus temporaire
  Réunion**               d'ennemis               d'automatisation

  **Tetris de dossiers**  Compléter des lignes    Bonus de capacité de
                          avec des formes qui     traitement
                          tombent                 

  **Solitaire du          Solitaire de cartes     Petit bonus de
  comptable**             classique               concentration ou gain
                                                  plafonné
  -----------------------------------------------------------------------

### Équilibrage des mini-jeux

-   Afficher le bonus potentiel avant la partie.
-   Le score détermine la récompense.
-   Les bonus ont une durée ou un plafond visible.
-   Ajouter une récupération ou une limite de tentatives pour éviter le
    farming.
-   Les mini-jeux ne doivent pas surpasser les systèmes de gestion sur
    le long terme.
-   Les joueurs qui les ignorent doivent pouvoir progresser.
-   Les valeurs de départ à tester peuvent être de +10 à +15 % de
    vitesse pendant 60 à 120 secondes, une petite prime plafonnée ou une
    réduction temporaire des erreurs. Ces valeurs restent à équilibrer.

### Ordre de développement conseillé

1.  Snake : boucle, clavier et score.
2.  Memory : clics, chronomètre et score.
3.  Démineur : grille et logique.
4.  Pong : animation et collisions.
5.  Casse-Briques : collisions et niveaux.
6.  Ajouter les autres jeux lorsque la boucle principale est stable.

## 7. Automatisation et chaîne de production

  Niveau   Technologie                 Effet
  -------- --------------------------- ------------------------------------
  1        Raccourcis                  Plusieurs dossiers par clic
  2        Macros                      Répétition d'actions simples
  3        Scripts                     Traitement automatique simple
  4        Employés                    Production passive avec salaires
  5        Chaîne de traitement        Étapes automatisées
  6        Logiciels spécialisés       Tri, vérification, archivage
  7        Intelligence artificielle   Vitesse accrue et erreurs réduites
  8        Système central             Coordination de services
  9        Entreprise autonome         Optimisation de production
  10       Groupe automatisé           Coordination des filiales

Étapes de production : réception → tri → vérification → validation →
archivage.

Chaque étape possède une capacité, un coût, une vitesse et un risque
d'erreur. Le débit total dépend de l'étape la plus lente. L'interface
visualise files d'attente et goulots d'étranglement.

Paramètres à suivre : capacité, vitesse, taux de réussite, coût par
dossier, taille de file, temps d'arrêt, maintenance et priorité.

## 8. Employés et ressources humaines

Profils possibles : assistant administratif, comptable, technicien,
analyste, responsable d'équipe, commercial, chercheur et directeur de
service.

Chaque employé possède salaire, vitesse, précision, compétence
principale, fatigue et expérience. Le joueur peut recruter, licencier,
affecter, former, promouvoir et définir les priorités. Une surcharge
peut augmenter erreurs, absences et départs. Les équipes peuvent
recevoir des bonus de synergie.

## 9. Finance et comptabilité

  Ressource                Fonction
  ------------------------ -------------------------------------------------
  Trésorerie               Argent disponible immédiatement
  Revenus                  Paiements des dossiers et contrats
  Dépenses                 Salaires, logiciels, maintenance, loyers
  Bénéfice net             Revenus moins dépenses et charges
  Budget de service        Enveloppe d'un département
  Dette                    Capital emprunté et intérêts
  Valeur de l'entreprise   Estimation de valeur globale
  Réputation               Influence contrats, recrutement et opportunités

**Compta 98** affiche compte de résultat, trésorerie, dépenses par
catégorie, coût par dossier, rentabilité des contrats, masse salariale
et prévisions. Les emprunts apportent des liquidités mais entraînent
intérêts et risques.

## 10. Bourse fictive

La bourse est simulée, sans connexion à des cours réels.

### Instruments et fonctions

-   Actions fictives, obligations et fonds diversifiés.
-   Achat, vente, prix moyen et historique.
-   Dividendes et frais de transaction.
-   Actualités, volatilité et risque.
-   Graphiques en courbes et chandeliers.
-   Comparaison avec les autres investissements.

  Société fictive   Secteur          Profil simulé
  ----------------- ---------------- -----------------------------------------
  TechNova          Logiciels        Croissance forte, volatilité élevée
  GreenEnergy       Énergie          Sensible aux événements réglementaires
  GlobalBank        Banque           Rendement plus stable, risque de crédit
  AutoNext          Automatisation   Dépend de la demande industrielle
  HealthPlus        Santé            Croissance modérée, contrats récurrents

Les cours évoluent selon résultats simulés, actualités, conjoncture,
événements sectoriels et technologies. L'historique est enregistré à
intervalles réguliers ; les cours ne changent pas à chaque rendu React.

## 11. Contrats et clients

Chaque contrat comporte volume de dossiers, paiement, échéance, qualité
requise, pénalités éventuelles et satisfaction client.

-   Début : le supérieur attribue les tâches.
-   Milieu : le joueur choisit des contrats.
-   Plus tard : négociation des prix et délais.
-   Fin : appels d'offres et contrats de longue durée.

Un contrat apparemment rentable peut devenir déficitaire si la capacité
manque ou si des recrutements urgents sont nécessaires.

## 12. Recherche et développement

Branches technologiques : - **Productivité :** raccourcis, macros,
lots. - **Automatisation :** scripts, robots logiciels, orchestration. -
**IA :** classification, validation et prédiction. - **Infrastructure
:** serveurs, capacité et fiabilité. - **Management :** coordination et
optimisation des équipes.

Les recherches peuvent demander du temps, un budget, un niveau de
service et des technologies préalables.

## 13. Immobilier, expansion et acquisitions

### Immobilier

Louer, acheter, agrandir des bureaux et ouvrir plusieurs sites. Chaque
bâtiment a un prix ou loyer, une capacité, des frais d'entretien, une
infrastructure et une capacité de production.

### Acquisitions

Chaque société cible possède un prix, une évaluation, des coûts
d'intégration, des synergies, des risques de départ, des passifs
éventuels et des objectifs de rentabilité. Une filiale peut rester
autonome ou être intégrée au groupe.

## 14. Événements et humour bureaucratique

Exemples : rapport inutile exigé avant 17 h, mise à jour qui désactive
temporairement une application, macro découverte par un employé, audit
révélant des erreurs, contrat exceptionnel, panne, concurrent plus
performant, nouvelle réglementation, demande d'augmentation ou mini-jeu
spécial.

Chaque événement possède une conséquence claire, une durée et si
possible plusieurs solutions. Maintenance, formation et trésorerie
doivent aider à réduire les effets.

## 15. Objectifs, succès et prestige

### Objectifs courts

-   Traiter cinq dossiers.
-   Gagner les premiers 100 €.
-   Acheter la première application.
-   Automatiser une tâche.
-   Recruter le premier employé.

### Objectifs moyens

-   Atteindre un volume de production.
-   Réduire le coût par dossier.
-   Obtenir une promotion.
-   Installer plusieurs logiciels.
-   Signer un gros contrat.
-   Créer un service autonome.

### Objectifs longs

-   Atteindre une valeur d'entreprise.
-   Gérer plusieurs services.
-   Construire un portefeuille d'investissement.
-   Acquérir un concurrent.
-   Créer un groupe international.
-   Atteindre un haut taux d'automatisation.

Le prestige peut permettre une nouvelle partie avec des bonus permanents
: productivité de départ, logiciels moins chers, recherche anticipée,
thèmes et succès. Il est facultatif et demande confirmation avant
réinitialisation.

## 16. Graphiques et visualisations

  Graphique                   Utilité
  --------------------------- --------------------------------------
  Trésorerie dans le temps    Anticiper les problèmes de liquidité
  Revenus et dépenses         Comprendre la rentabilité
  Production dans le temps    Détecter les ralentissements
  Files d'attente             Repérer les goulots
  Répartition des dépenses    Identifier les économies
  Productivité des employés   Repérer les besoins de formation
  Cours boursiers             Suivre les investissements
  Valeur du portefeuille      Mesurer gains et pertes
  Coût par dossier            Comparer les méthodes
  Réputation                  Comprendre les effets des contrats

Apache ECharts est recommandé pour les graphiques avancés. Des courbes
CSS simples suffisent au début. Le style reste rétro : fond gris clair,
grille discrète, palette limitée et légendes lisibles.

## 17. Sauvegarde et progression hors ligne

### Données à sauvegarder

Trésorerie, revenus, dossiers, rang, expérience, objectifs,
applications, améliorations, raccourcis, employés, contrats, services,
automatisations, recherches, historique financier, portefeuille, succès,
prestige et préférences.

Sauvegarde automatique périodique et après les achats importants.
Prévoir exportation et importation. Utiliser une sauvegarde versionnée
pour les futures migrations.

### Progression hors ligne

Calculer les gains en fonction du temps écoulé, avec une limite
configurable. Prendre en compte coûts, capacité et tâches réellement
automatisées. Ne pas supposer que toutes les activités restent
rentables.

### Paramètres

Volume sonore, animations, vitesse d'animation, format des nombres, mode
compact, réduction des animations, export/import et réinitialisation
avec confirmation.

## 18. Architecture technique

  Technologie                   Responsabilité
  ----------------------------- -------------------------------
  Next.js et React              Interface et fenêtres
  TypeScript                    Modèles de données et logique
  Zustand                       État global
  CSS                           Style rétro et fenêtres
  Motion (facultatif)           Animations
  Apache ECharts                Graphiques avancés
  Lucide React                  Icônes cohérentes
  IndexedDB ou stockage local   Sauvegarde navigateur

### Structure indicative

``` text
app/
  page.tsx
  layout.tsx
  globals.css
components/
  desktop/
    Desktop.tsx
    Taskbar.tsx
    StartMenu.tsx
    DesktopIcon.tsx
    WindowManager.tsx
  applications/
    AppStore.tsx
    StatisticsApp.tsx
    AccountingApp.tsx
    EmployeeApp.tsx
    AutomationApp.tsx
    StockMarketApp.tsx
    MiniGamesApp.tsx
  game/
    GameHUD.tsx
    UpgradeList.tsx
    DossierButton.tsx
    Objectives.tsx
lib/
  simulation/
    economy.ts
    production.ts
    automation.ts
    employees.ts
    stockMarket.ts
    offlineProgress.ts
  applications/
    catalog.ts
  save/
    saveManager.ts
store/
  gameStore.ts
  desktopStore.ts
types/
  game.ts
  employee.ts
  application.ts
  finance.ts
```

La structure est indicative : conserver les fichiers existants et les
déplacer seulement si cela améliore l'architecture.

### Séparer interface et simulation

Le moteur calcule revenus, coûts, dossiers, employés et effets. React
affiche les données et déclenche les actions. Le changement de design ne
doit pas modifier les règles économiques. La progression est calculée à
partir du temps écoulé plutôt que du seul nombre de rendus ou de
minuteries imprécises.

## 19. Équilibrage

-   Premières améliorations peu coûteuses et gratifiantes.
-   Applications qui apportent des fonctions, pas uniquement des
    multiplicateurs.
-   Salaires, loyers, maintenance et frais qui créent des choix.
-   Prix croissants et multiplicateurs contrôlés.
-   Les nouveaux systèmes ne rendent pas tous les anciens inutiles.
-   Possibilité de progresser même lorsque le rythme ralentit.

Indicateurs à tester : temps avant première application, temps avant
automatisation, durée entre promotions, rentabilité des employés,
amortissement des investissements, difficultés de trésorerie et
différence entre progression active et hors ligne.

## 20. Feuille de route

### Version 0.1 --- Prototype

-   Bouton « Traiter un dossier ».
-   Trésorerie et revenus.
-   Premières améliorations.
-   Sauvegarde locale.
-   Style Windows 95 de base.

### Version 0.2 --- Bureau rétro

-   Fenêtres déplaçables, réduisibles et restaurables.
-   Barre des tâches et menu Démarrer.
-   Applications achetables et catalogue.

### Version 0.3 --- Automatisation

-   Macros et traitement automatique.
-   Files de dossiers, premières machines et statistiques.

### Version 0.4 --- Gestion

-   Employés, salaires, services, contrats, recherche, promotions et
    événements.

### Version 0.5 --- Mini-jeux et graphiques

-   Snake, Memory, Démineur et Pong.
-   Bonus temporaires, historique financier et graphiques interactifs.

### Version 0.6 --- Finance avancée

-   Comptabilité, bourse fictive, investissements, dividendes, emprunts
    et prévisions.

### Version 0.7 --- Empire administratif

-   Immobilier, expansion, filiales, acquisitions, prestige et objectifs
    à long terme.

## 21. Critères d'acceptation

-   Début presque vide avec une action principale.
-   Fonctionnalités visibles uniquement après déblocage.
-   Applications conservées après rechargement.
-   Fenêtres ouvrables, fermables, réduisibles et restaurables.
-   Actions manuelles et automatiques utilisant le même moteur.
-   Mini-jeux avec bonus temporaires et plafonnés.
-   Historique des revenus et dépenses.
-   Graphiques fondés sur les données simulées.
-   Bourse fictive et historique cohérent.
-   Export/import des sauvegardes.
-   Progression hors ligne cohérente.
-   Interface utilisable sur petits écrans.
-   Erreurs de sauvegarde et réinitialisations accidentelles gérées
    proprement.

## 22. Hors périmètre du lancement

Pas de données boursières réelles, multijoueur, serveur obligatoire,
personnages 3D, simulation complète d'un système d'exploitation ou
animations complexes partout. Ces éléments pourront être étudiés
ultérieurement.

## 23. Résultat attendu

Le joueur commence avec un bureau presque vide et un seul bouton. Il
achète des applications, découvre des mini-jeux rétro traditionnels,
automatise le travail, recrute des employés, dirige des services,
surveille ses finances et finit par gérer un groupe d'entreprises.

Le bureau rétro reste le fil conducteur : les applications sont les
systèmes de jeu, les fenêtres les outils de gestion et la barre des
tâches le centre de navigation.

**Règle de conception essentielle : chaque nouvelle fenêtre doit
apporter une décision, un pouvoir ou une nouvelle façon de jouer.**

### Prochaine étape

Construire le socle technique : bureau rétro, bouton de traitement,
trésorerie, progression, sauvegarde et gestionnaire de fenêtres. Ajouter
ensuite le catalogue d'applications, puis les mini-jeux traditionnels,
avant les systèmes avancés de gestion.
