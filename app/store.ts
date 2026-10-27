
"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type Role = "intern" | "employee";

interface GameState {
  role: Role;
  companyCash: number;
  companyRevenue: number;
  dossiers: number;
  manualDossiers: number;
  gameSeconds: number;
  lastSavedAt: number;
  offlineSecondsEarned: number;
  hasPromotionOffer: boolean;
  hasDeskOrganizer: boolean;
  hasFastStamp: boolean;
  events: string[];
  financialCrisis: boolean;
  crisisTimeRemaining: number;
  gameOver: boolean;
  hasHydrated: boolean;

  tick: () => void;
  processDossier: () => void;
  acceptPromotion: () => void;
  buyDeskOrganizer: () => void;
  buyFastStamp: () => void;
  resetGame: () => void;
  applyOfflineProgress: () => void;
  setHasHydrated: (value: boolean) => void;
}

const STARTING_CASH = 10;
const ORGANIZER_UNLOCK = 10;
const ORGANIZER_COST = 2;
const STAMP_UNLOCK = 25;
const STAMP_COST = 5;
const REVENUE_START = 10;
const PROMOTION_GOAL = 150;
const BASE_REVENUE = 0.1;
const ORGANIZER_BONUS = 0.05;
const STAMP_BONUS = 0.1;
const SECONDS_PER_DAY = 20 * 60;
const MAX_OFFLINE_SECONDS = 8 * 60 * 60;

function roundMoney(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function addEvent(events: string[], message: string) {
  return [message, ...events].slice(0, 20);
}

function getInitialState() {
  return {
    role: "intern" as Role,
    companyCash: STARTING_CASH,
    companyRevenue: 0,
    dossiers: 0,
    manualDossiers: 0,
    gameSeconds: 0,
    lastSavedAt: Date.now(),
    offlineSecondsEarned: 0,
    hasPromotionOffer: false,
    hasDeskOrganizer: false,
    hasFastStamp: false,
    events: ["Premier jour : votre supérieur vous attend."],
    financialCrisis: false,
    crisisTimeRemaining: 0,
    gameOver: false,
    hasHydrated: false,
  };
}

export function getGameDay(gameSeconds: number) {
  return Math.floor(gameSeconds / SECONDS_PER_DAY) + 1;
}

export function getGameClock(gameSeconds: number) {
  const secondsInDay = gameSeconds % SECONDS_PER_DAY;
  const totalMinutes = Math.floor(
    (secondsInDay / SECONDS_PER_DAY) * 24 * 60,
  );
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...getInitialState(),

      setHasHydrated: (value) => set({ hasHydrated: value }),

      tick: () => {
        const state = get();
        if (!state.hasHydrated || state.gameOver) return;

        const now = Date.now();
        const elapsed = Math.max(
          0,
          Math.min(5, (now - state.lastSavedAt) / 1000),
        );

        if (elapsed <= 0) return;

        set({
          gameSeconds: state.gameSeconds + elapsed,
          lastSavedAt: now,
        });
      },

      processDossier: () => {
        const state = get();

        if (
          !state.hasHydrated ||
          state.gameOver ||
          state.role !== "intern" ||
          state.hasPromotionOffer
        ) {
          return;
        }

        const dossiers = state.dossiers + 1;
        const manualDossiers = state.manualDossiers + 1;

        // Le chiffre d'affaires démarre après les 10 premiers dossiers.
        const earnsRevenue = manualDossiers > REVENUE_START;

        let revenuePerDossier = BASE_REVENUE;

        if (state.hasDeskOrganizer) {
          revenuePerDossier += ORGANIZER_BONUS;
        }

        if (state.hasFastStamp) {
          revenuePerDossier += STAMP_BONUS;
        }

        const income = earnsRevenue ? revenuePerDossier : 0;
        const companyRevenue = roundMoney(
          state.companyRevenue + income,
        );
        const companyCash = roundMoney(state.companyCash + income);
        const hasPromotionOffer = manualDossiers >= PROMOTION_GOAL;

        let events = state.events;

        if (manualDossiers === REVENUE_START) {
          events = addEvent(
            events,
            "Objectif atteint : le prochain dossier générera du revenu.",
          );
        }

        if (manualDossiers === ORGANIZER_UNLOCK) {
          events = addEvent(
            events,
            "Organiseur débloqué : achetez-le pour augmenter les revenus.",
          );
        }

        if (manualDossiers === STAMP_UNLOCK) {
          events = addEvent(
            events,
            "Tampon rapide débloqué : améliorez encore les revenus.",
          );
        }

        if (hasPromotionOffer) {
          events = addEvent(
            events,
            "Promotion proposée : vous pouvez devenir employé administratif.",
          );
        }

        set({
          dossiers,
          manualDossiers,
          companyRevenue,
          companyCash,
          hasPromotionOffer,
          events,
          lastSavedAt: Date.now(),
        });
      },

      buyDeskOrganizer: () => {
        const state = get();

        if (
          !state.hasHydrated ||
          state.gameOver ||
          state.role !== "intern" ||
          state.manualDossiers < ORGANIZER_UNLOCK ||
          state.hasDeskOrganizer ||
          state.companyCash < ORGANIZER_COST
        ) {
          return;
        }

        set({
          companyCash: roundMoney(
            state.companyCash - ORGANIZER_COST,
          ),
          hasDeskOrganizer: true,
          events: addEvent(
            state.events,
            "Organiseur acheté : +0,05 € par dossier générateur de revenus.",
          ),
          lastSavedAt: Date.now(),
        });
      },

      buyFastStamp: () => {
        const state = get();

        if (
          !state.hasHydrated ||
          state.gameOver ||
          state.role !== "intern" ||
          state.manualDossiers < STAMP_UNLOCK ||
          state.hasFastStamp ||
          state.companyCash < STAMP_COST
        ) {
          return;
        }

        set({
          companyCash: roundMoney(
            state.companyCash - STAMP_COST,
          ),
          hasFastStamp: true,
          events: addEvent(
            state.events,
            "Tampon rapide acheté : +0,10 € par dossier générateur de revenus.",
          ),
          lastSavedAt: Date.now(),
        });
      },

      acceptPromotion: () => {
        const state = get();

        if (
          !state.hasHydrated ||
          state.gameOver ||
          state.role !== "intern" ||
          !state.hasPromotionOffer
        ) {
          return;
        }

        set({
          role: "employee",
          hasPromotionOffer: false,
          events: addEvent(
            state.events,
            "Promotion acceptée : vous devenez employé administratif.",
          ),
          lastSavedAt: Date.now(),
        });
      },

      applyOfflineProgress: () => {
        const state = get();
        const now = Date.now();

        if (!state.lastSavedAt || state.lastSavedAt <= 0) {
          set({
            lastSavedAt: now,
            offlineSecondsEarned: 0,
          });
          return;
        }

        const elapsed = Math.max(
          0,
          Math.floor((now - state.lastSavedAt) / 1000),
        );
        const offlineSeconds = Math.min(
          elapsed,
          MAX_OFFLINE_SECONDS,
        );

        set({
          gameSeconds: state.gameSeconds + offlineSeconds,
          offlineSecondsEarned: offlineSeconds,
          lastSavedAt: now,
        });
      },

      resetGame: () => {
        set({
          ...getInitialState(),
          hasHydrated: true,
        });
      },
    }),
    {
      name: "bureau-simulator-save",
      storage: createJSONStorage(() => localStorage),

      partialize: (state) => ({
        role: state.role,
        companyCash: state.companyCash,
        companyRevenue: state.companyRevenue,
        dossiers: state.dossiers,
        manualDossiers: state.manualDossiers,
        gameSeconds: state.gameSeconds,
        lastSavedAt: state.lastSavedAt,
        hasPromotionOffer: state.hasPromotionOffer,
        hasDeskOrganizer: state.hasDeskOrganizer,
        hasFastStamp: state.hasFastStamp,
        events: state.events,
        financialCrisis: state.financialCrisis,
        crisisTimeRemaining: state.crisisTimeRemaining,
        gameOver: state.gameOver,
      }),

      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error("Erreur de chargement :", error);
        }

        if (state) {
          state.applyOfflineProgress();
          state.setHasHydrated(true);
        }
      },
    },
  ),
);
