import { create } from "zustand";

export type UpgradeId =
  | "procedures"
  | "coffee"
  | "training"
  | "stamp"
  | "shortcuts"
  | "printer"
  | "workflow"
  | "dashboard"
  | "anticipation"
  | "assistant"
  | "promotionReport";

export type Upgrade = {
  id: UpgradeId;
  name: string;
  description: string;
  effect: string;
  cost: number;
  owned: boolean;
  icon: string;
};

type GameState = {
  cash: number;
  dossiers: number;
  paidDossiers: number;
  companyRevenue: number;
  totalEarned: number;
  careerLevel: number;
  upgrades: Record<UpgradeId, Upgrade>;
  lastSavedAt: number;

  processDossier: () => void;
  buyUpgrade: (id: UpgradeId) => void;
  promote: () => void;
  resetGame: () => void;
  hydrate: () => void;
};

/* ------------------------------------------------------------------ */
/*  Constantes d'équilibrage                                           */
/* ------------------------------------------------------------------ */

export const INITIAL_CASH = 5;
export const BASE_INCOME = 0.25; // gain d'un dossier rémunéré au départ
export const MAX_CASH = 999_999_999;

const BASE_PAID_SLOTS = 4; // dossiers rémunérés sur 10 au départ
const MAX_PAID_SLOTS = 10;
const INCOME_SCALE_CAP = 3000; // le gain de base progresse jusqu'à ce volume
const CAREER_BONUS = 0.1; // +10 % de revenus par promotion
const OFFLINE_RATE = 0.05; // dossiers/seconde simulés hors ligne
const OFFLINE_MAX_SECONDS = 8 * 60 * 60;

const SAVE_KEY = "bureau-simulator-save-v1";

/* ------------------------------------------------------------------ */
/*  Définition des améliorations                                       */
/* ------------------------------------------------------------------ */

type Effects = {
  slots?: number; // dossiers rémunérés supplémentaires sur 10
  mult?: number; // multiplicateur de revenus
  perClick?: number; // dossiers supplémentaires par clic
};

const EFFECTS: Record<UpgradeId, Effects> = {
  procedures: { slots: 2 },
  coffee: { mult: 1.25 },
  training: { slots: 2 },
  stamp: { mult: 1.25 },
  shortcuts: { perClick: 1 },
  printer: { slots: 1, mult: 1.2 },
  workflow: { mult: 1.3 },
  dashboard: { slots: 1, mult: 1.2 },
  anticipation: { mult: 1.4 },
  assistant: {},
  promotionReport: {},
};

const definitions: Omit<Upgrade, "owned">[] = [
  {
    id: "procedures",
    name: "Procédures standardisées",
    description: "Moins de paperasse inutile, plus de dossiers payés.",
    effect: "+2 dossiers rémunérés sur 10",
    cost: 8,
    icon: "ClipboardList",
  },
  {
    id: "coffee",
    name: "Café de bureau",
    description: "Un petit coup de fouet pour votre productivité.",
    effect: "+25 % de revenus",
    cost: 20,
    icon: "Coffee",
  },
  {
    id: "training",
    name: "Formation express",
    description: "Trois jours de stage pour gagner en efficacité.",
    effect: "+2 dossiers rémunérés sur 10",
    cost: 50,
    icon: "GraduationCap",
  },
  {
    id: "stamp",
    name: "Tampon officiel",
    description: "Un dossier tamponné est un dossier mieux payé.",
    effect: "+25 % de revenus",
    cost: 110,
    icon: "Stamp",
  },
  {
    id: "shortcuts",
    name: "Raccourcis clavier",
    description: "Ctrl+C, Ctrl+V : le travail va deux fois plus vite.",
    effect: "+1 dossier traité par clic",
    cost: 240,
    icon: "Keyboard",
  },
  {
    id: "printer",
    name: "Imprimante laser",
    description: "Plus de bourrage papier pendant les heures de pointe.",
    effect: "+1 dossier rémunéré sur 10 et +20 % de revenus",
    cost: 480,
    icon: "Printer",
  },
  {
    id: "workflow",
    name: "Flux optimisé",
    description: "Chaque étape a enfin un responsable identifié.",
    effect: "+30 % de revenus et gains hors ligne ×1,5",
    cost: 900,
    icon: "Workflow",
  },
  {
    id: "dashboard",
    name: "Tableau de bord",
    description: "Des graphiques que personne ne lit, mais ça rassure.",
    effect: "+1 dossier rémunéré sur 10 et +20 % de revenus",
    cost: 1600,
    icon: "Chart",
  },
  {
    id: "anticipation",
    name: "Traitement anticipé",
    description: "Vous traitez les dossiers avant même de les recevoir.",
    effect: "+40 % de revenus",
    cost: 2800,
    icon: "ScanSearch",
  },
  {
    id: "assistant",
    name: "Assistant administratif",
    description: "Il continue de travailler quand vous n'êtes pas là.",
    effect: "Débloque les revenus hors ligne (8 h max)",
    cost: 4500,
    icon: "UserRound",
  },
  {
    id: "promotionReport",
    name: "Rapport de promotion",
    description: "Prépare votre candidature au poste supérieur.",
    effect: "Requis pour la promotion",
    cost: 8000,
    icon: "FileText",
  },
];

export const UPGRADE_IDS: UpgradeId[] = definitions.map(
  (upgrade) => upgrade.id,
);

function makeUpgrades(
  owned: UpgradeId[] = [],
): Record<UpgradeId, Upgrade> {
  return Object.fromEntries(
    definitions.map((upgrade) => [
      upgrade.id,
      { ...upgrade, owned: owned.includes(upgrade.id) },
    ]),
  ) as Record<UpgradeId, Upgrade>;
}

const cap = (value: number) =>
  Math.min(MAX_CASH, Math.max(0, value));

/* ------------------------------------------------------------------ */
/*  Carrière                                                           */
/* ------------------------------------------------------------------ */

export const CAREER = [
  "Stagiaire administratif",
  "Employé confirmé",
  "Assistant administratif",
  "Gestionnaire de dossiers",
  "Chef d'équipe",
  "Responsable de service",
  "Directeur des opérations",
  "Directeur financier",
  "Directeur général",
  "Président du groupe",
];

// Les conditions augmentent à chaque promotion : impossible d'enchaîner.
export function promotionRequirements(level: number) {
  return {
    dossiers: 2000 * (level + 1),
    revenue: 10000 * (level + 1) * (level + 1),
    upgrades: 7,
  };
}

/* ------------------------------------------------------------------ */
/*  Calculs économiques (utilisables par l'interface)                  */
/* ------------------------------------------------------------------ */

type Upgrades = Record<UpgradeId, Upgrade>;

function owned(upgrades: Upgrades) {
  return UPGRADE_IDS.filter((id) => upgrades[id].owned);
}

export function paidSlots(upgrades: Upgrades) {
  const bonus = owned(upgrades).reduce(
    (sum, id) => sum + (EFFECTS[id].slots ?? 0),
    0,
  );

  return Math.min(MAX_PAID_SLOTS, BASE_PAID_SLOTS + bonus);
}

export function dossiersPerClick(upgrades: Upgrades) {
  return (
    1 +
    owned(upgrades).reduce(
      (sum, id) => sum + (EFFECTS[id].perClick ?? 0),
      0,
    )
  );
}

export function revenueMultiplier(
  upgrades: Upgrades,
  careerLevel: number,
) {
  const upgradesBonus = owned(upgrades).reduce(
    (product, id) => product * (EFFECTS[id].mult ?? 1),
    1,
  );

  return upgradesBonus * (1 + CAREER_BONUS * careerLevel);
}

// Répartition régulière des dossiers payés (ex. 4 sur 10 bien espacés).
function isPaidDossier(dossier: number, slots: number) {
  return (
    Math.floor((dossier * slots) / MAX_PAID_SLOTS) >
    Math.floor(((dossier - 1) * slots) / MAX_PAID_SLOTS)
  );
}

function dossierIncome(
  dossier: number,
  upgrades: Upgrades,
  careerLevel: number,
) {
  const scale = 1 + Math.min(dossier, INCOME_SCALE_CAP) / 200;

  return (
    BASE_INCOME * scale * revenueMultiplier(upgrades, careerLevel)
  );
}

// Gain moyen d'un dossier (payé ou non), utile pour l'affichage et le hors ligne.
export function averageIncome(
  dossiers: number,
  upgrades: Upgrades,
  careerLevel: number,
) {
  return (
    dossierIncome(dossiers + 1, upgrades, careerLevel) *
    (paidSlots(upgrades) / MAX_PAID_SLOTS)
  );
}

// Récompense du mini-jeu : proportionnelle au rythme du joueur.
export function getMineReward(
  dossiers: number,
  upgrades: Upgrades,
  careerLevel: number,
) {
  return Math.max(
    2,
    Math.round(averageIncome(dossiers, upgrades, careerLevel) * 12),
  );
}

function freshState() {
  return {
    cash: INITIAL_CASH,
    dossiers: 0,
    paidDossiers: 0,
    companyRevenue: 0,
    totalEarned: 0,
    careerLevel: 0,
    upgrades: makeUpgrades(),
    lastSavedAt: Date.now(),
  };
}

/* ------------------------------------------------------------------ */
/*  Store                                                              */
/* ------------------------------------------------------------------ */

export const useGameStore = create<GameState>((set, get) => ({
  ...freshState(),

  processDossier: () => {
    const state = get();
    const count = dossiersPerClick(state.upgrades);
    const slots = paidSlots(state.upgrades);

    let income = 0;
    let paidCount = 0;

    for (let i = 1; i <= count; i++) {
      const dossier = state.dossiers + i;

      if (isPaidDossier(dossier, slots)) {
        income += dossierIncome(
          dossier,
          state.upgrades,
          state.careerLevel,
        );
        paidCount++;
      }
    }

    set({
      dossiers: state.dossiers + count,
      paidDossiers: state.paidDossiers + paidCount,
      cash: cap(state.cash + income),
      companyRevenue: cap(state.companyRevenue + income),
      totalEarned: cap(state.totalEarned + income),
      lastSavedAt: Date.now(),
    });
  },

  buyUpgrade: (id) => {
    const state = get();
    const upgrade = state.upgrades[id];

    if (!upgrade || upgrade.owned || state.cash < upgrade.cost) {
      return;
    }

    set({
      cash: cap(state.cash - upgrade.cost),
      upgrades: {
        ...state.upgrades,
        [id]: { ...upgrade, owned: true },
      },
      lastSavedAt: Date.now(),
    });
  },

  promote: () => {
    const state = get();
    const ownedCount = owned(state.upgrades).length;
    const req = promotionRequirements(state.careerLevel);

    const eligible =
      state.dossiers >= req.dossiers &&
      state.companyRevenue >= req.revenue &&
      state.upgrades.assistant.owned &&
      state.upgrades.promotionReport.owned &&
      ownedCount >= req.upgrades &&
      state.careerLevel < CAREER.length - 1;

    if (!eligible) return;

    set({
      careerLevel: state.careerLevel + 1,
      lastSavedAt: Date.now(),
    });
  },

  resetGame: () => {
    set(freshState());

    if (typeof window !== "undefined") {
      window.localStorage.removeItem(SAVE_KEY);
    }
  },

  hydrate: () => {
    if (typeof window === "undefined") return;

    try {
      const raw = window.localStorage.getItem(SAVE_KEY);
      if (!raw) return;

      const saved = JSON.parse(raw);
      if (
        typeof saved.cash !== "number" ||
        typeof saved.dossiers !== "number"
      ) {
        return;
      }

      const upgrades = makeUpgrades();

      for (const id of Object.keys(upgrades) as UpgradeId[]) {
        const savedUpgrade = saved.upgrades?.[id];

        if (typeof savedUpgrade?.owned === "boolean") {
          upgrades[id].owned = savedUpgrade.owned;
        }
      }

      const careerLevel = Math.min(
        CAREER.length - 1,
        Math.max(0, saved.careerLevel ?? 0),
      );

      const dossiers = Math.max(0, saved.dossiers);

      const lastSavedAt =
        typeof saved.lastSavedAt === "number"
          ? saved.lastSavedAt
          : Date.now();

      const offlineSeconds = Math.min(
        OFFLINE_MAX_SECONDS,
        Math.max(0, (Date.now() - lastSavedAt) / 1000),
      );

      const offlineIncome = upgrades.assistant.owned
        ? offlineSeconds *
          OFFLINE_RATE *
          averageIncome(dossiers, upgrades, careerLevel) *
          (upgrades.workflow.owned ? 1.5 : 1)
        : 0;

      set({
        cash: cap(saved.cash + offlineIncome),
        dossiers,
        paidDossiers: Math.max(0, saved.paidDossiers ?? 0),
        companyRevenue: cap(
          (saved.companyRevenue ?? 0) + offlineIncome,
        ),
        totalEarned: cap(
          (saved.totalEarned ?? 0) + offlineIncome,
        ),
        careerLevel,
        upgrades,
        lastSavedAt: Date.now(),
      });
    } catch {
      // Une sauvegarde illisible ne bloque pas le jeu.
    }
  },
}));

if (typeof window !== "undefined") {
  useGameStore.subscribe((state) => {
    try {
      window.localStorage.setItem(
        SAVE_KEY,
        JSON.stringify({
          cash: state.cash,
          dossiers: state.dossiers,
          paidDossiers: state.paidDossiers,
          companyRevenue: state.companyRevenue,
          totalEarned: state.totalEarned,
          careerLevel: state.careerLevel,
          upgrades: state.upgrades,
          lastSavedAt: state.lastSavedAt,
        }),
      );
    } catch {
      // Le jeu reste jouable si le stockage local échoue.
    }
  });
}