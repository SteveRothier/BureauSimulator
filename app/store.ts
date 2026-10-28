
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

export const INITIAL_CASH = 5;
export const BASE_INCOME = 0.03;
export const MAX_CASH = 999_999_999;

const SAVE_KEY = "bureau-simulator-save-v1";

const definitions: Omit<Upgrade, "owned">[] = [
  {
    id: "procedures",
    name: "Procédures standardisées",
    description: "Augmente les chances qu'un dossier soit rémunéré.",
    cost: 12,
    icon: "ClipboardList",
  },
  {
    id: "coffee",
    name: "Café de bureau",
    description: "Augmente les revenus de 20 %.",
    cost: 18,
    icon: "Coffee",
  },
  {
    id: "training",
    name: "Formation express",
    description: "Améliore les chances de rémunération.",
    cost: 35,
    icon: "GraduationCap",
  },
  {
    id: "stamp",
    name: "Tampon officiel",
    description: "Les dossiers rapportent davantage.",
    cost: 55,
    icon: "Stamp",
  },
  {
    id: "shortcuts",
    name: "Raccourcis clavier",
    description: "Optimise le travail quotidien.",
    cost: 90,
    icon: "Keyboard",
  },
  {
    id: "printer",
    name: "Imprimante laser",
    description: "Un équipement plus fiable.",
    cost: 150,
    icon: "Printer",
  },
  {
    id: "workflow",
    name: "Flux optimisé",
    description: "Augmente les revenus de 10 %.",
    cost: 250,
    icon: "Workflow",
  },
  {
    id: "dashboard",
    name: "Tableau de bord",
    description: "Améliore les chances et les revenus.",
    cost: 420,
    icon: "Chart",
  },
  {
    id: "anticipation",
    name: "Traitement anticipé",
    description: "Augmente les revenus de 15 %.",
    cost: 700,
    icon: "ScanSearch",
  },
  {
    id: "assistant",
    name: "Assistant administratif",
    description: "Débloque les revenus hors ligne.",
    cost: 1200,
    icon: "UserRound",
  },
  {
    id: "promotionReport",
    name: "Rapport de promotion",
    description: "Prépare votre candidature au poste supérieur.",
    cost: 2000,
    icon: "FileText",
  },
];

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

function isPaidDossier(
  dossier: number,
  upgrades: Record<UpgradeId, Upgrade>,
) {
  if (dossier <= 8) return false;

  const denominator =
    dossier < 25 ? 4 :
    dossier < 65 ? 3 :
    dossier < 150 ? 2 : 3;

  let numerator = dossier < 150 ? 1 : 2;

  if (upgrades.procedures.owned) numerator++;
  if (upgrades.training.owned) numerator++;
  if (upgrades.dashboard.owned) numerator++;

  numerator = Math.min(denominator, numerator);

  return dossier % denominator < numerator;
}

function dossierIncome(
  dossier: number,
  upgrades: Record<UpgradeId, Upgrade>,
) {
  const tiers = Math.max(
    0,
    Math.floor((dossier - 8) / 25),
  );

  let income = BASE_INCOME * Math.pow(1.35, tiers);

  if (upgrades.coffee.owned) income *= 1.2;
  if (upgrades.stamp.owned) income *= 1.15;
  if (upgrades.dashboard.owned) income *= 1.2;
  if (upgrades.anticipation.owned) income *= 1.15;
  if (upgrades.workflow.owned) income *= 1.1;

  return income;
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

export const useGameStore = create<GameState>((set, get) => ({
  ...freshState(),

  processDossier: () => {
    const state = get();
    const dossier = state.dossiers + 1;
    const paid = isPaidDossier(dossier, state.upgrades);
    const income = paid
      ? dossierIncome(dossier, state.upgrades)
      : 0;

    set({
      dossiers: dossier,
      paidDossiers: state.paidDossiers + (paid ? 1 : 0),
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
    const ownedCount = Object.values(state.upgrades)
      .filter((upgrade) => upgrade.owned).length;

    const eligible =
      state.dossiers >= 220 &&
      state.companyRevenue >= 10 &&
      state.upgrades.assistant.owned &&
      state.upgrades.promotionReport.owned &&
      ownedCount >= 7 &&
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

      const lastSavedAt =
        typeof saved.lastSavedAt === "number"
          ? saved.lastSavedAt
          : Date.now();

      const offlineSeconds = Math.min(
        8 * 60 * 60,
        Math.max(0, (Date.now() - lastSavedAt) / 1000),
      );

      const offlineIncome = upgrades.assistant.owned
        ? offlineSeconds * 0.02 *
          (upgrades.workflow.owned ? 1.5 : 1)
        : 0;

      set({
        cash: cap(saved.cash + offlineIncome),
        dossiers: Math.max(0, saved.dossiers),
        paidDossiers: Math.max(0, saved.paidDossiers ?? 0),
        companyRevenue: cap(
          (saved.companyRevenue ?? 0) + offlineIncome,
        ),
        totalEarned: cap(
          (saved.totalEarned ?? 0) + offlineIncome,
        ),
        careerLevel: Math.min(
          CAREER.length - 1,
          Math.max(0, saved.careerLevel ?? 0),
        ),
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
