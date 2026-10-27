
"use client";

import { useEffect } from "react";
import {
  BriefcaseBusiness,
  Clock3,
  FileText,
  RotateCcw,
  Check,
  ArrowUpRight,
  Building2,
  Zap,
} from "lucide-react";

import {
  getGameClock,
  getGameDay,
  useGameStore,
} from "./store";

function euros(value: number) {
  return value.toLocaleString("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function Home() {
  const role = useGameStore((s) => s.role);
  const companyCash = useGameStore((s) => s.companyCash);
  const companyRevenue = useGameStore((s) => s.companyRevenue);
  const dossiers = useGameStore((s) => s.dossiers);
  const manualDossiers = useGameStore((s) => s.manualDossiers);
  const gameSeconds = useGameStore((s) => s.gameSeconds);
  const hasHydrated = useGameStore((s) => s.hasHydrated);
  const hasPromotionOffer = useGameStore((s) => s.hasPromotionOffer);
  const hasDeskOrganizer = useGameStore((s) => s.hasDeskOrganizer);
  const hasFastStamp = useGameStore((s) => s.hasFastStamp);

  const tick = useGameStore((s) => s.tick);
  const processDossier = useGameStore((s) => s.processDossier);
  const buyDeskOrganizer = useGameStore((s) => s.buyDeskOrganizer);
  const buyFastStamp = useGameStore((s) => s.buyFastStamp);
  const acceptPromotion = useGameStore((s) => s.acceptPromotion);
  const resetGame = useGameStore((s) => s.resetGame);

  useEffect(() => {
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [tick]);

  function handleReset() {
    if (
      window.confirm(
        "Recommencer la partie ? Toute la progression sera effacée.",
      )
    ) {
      resetGame();
    }
  }

  if (!hasHydrated) {
    return (
      <main className="office-page">
        <div className="office-loading">Chargement…</div>
      </main>
    );
  }

  const isIntern = role === "intern";
  const day = getGameDay(gameSeconds);
  const clock = getGameClock(gameSeconds);
  const promotionGoal = 150;
  const progress = Math.min(
    100,
    (manualDossiers / promotionGoal) * 100,
  );
  const revenueStarted = manualDossiers > 10;

  let revenuePerDossier = 0;

  if (revenueStarted) {
    revenuePerDossier = 0.1;
    if (hasDeskOrganizer) revenuePerDossier += 0.05;
    if (hasFastStamp) revenuePerDossier += 0.1;
  }

  return (
    <main className="office-page">
      <div className="office-shell">
        <header className="office-header">
          <div className="brand">
            <div className="brand-icon">
              <BriefcaseBusiness size={18} />
            </div>
            <div>
              <div className="brand-name">BUREAU SIMULATOR</div>
              <div className="brand-subtitle">Service administratif</div>
            </div>
          </div>

          <div className="header-actions">
            <div className="time-chip">
              <Clock3 size={14} />
              <span>J{day}</span>
              <strong>{clock}</strong>
            </div>

            <button
              className="reset-button"
              onClick={handleReset}
              type="button"
              aria-label="Recommencer"
              title="Recommencer"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </header>

        <section className="game">
          <div className="role-line">
            <div>
              <div className="eyebrow">
                {isIntern ? "POSTE ACTUEL" : "NOUVEAU POSTE"}
              </div>
              <h1>{isIntern ? "Stagiaire" : "Employé administratif"}</h1>
            </div>
            <span className="level-pill">
              {isIntern ? "Niveau 1" : "Niveau 2"}
            </span>
          </div>

          <section className="stats-grid">
            <div className="stat-box">
              <span>Trésorerie</span>
              <strong>{euros(companyCash)} €</strong>
            </div>
            <div className="stat-box">
              <span>Chiffre d'affaires</span>
              <strong>{euros(companyRevenue)} €</strong>
            </div>
            <div className="stat-box">
              <span>Dossiers</span>
              <strong>{dossiers.toLocaleString("fr-FR")}</strong>
            </div>
          </section>

          {isIntern ? (
            <>
              <section className="work-panel">
                <div className="work-top">
                  <div className="work-icon">
                    <FileText size={25} />
                  </div>
                  <div className="work-description">
                    <div className="eyebrow">TÂCHE DISPONIBLE</div>
                    <h2>Classer les dossiers</h2>
                    <p>
                      {revenueStarted
                        ? `+${euros(revenuePerDossier)} € de chiffre d'affaires par dossier`
                        : `${10 - manualDossiers} dossier(s) avant le premier revenu`}
                    </p>
                  </div>
                </div>

                <button
                  className="primary-action"
                  onClick={processDossier}
                  disabled={hasPromotionOffer}
                  type="button"
                >
                  <FileText size={16} />
                  Traiter un dossier
                </button>

                <div className="progress-label">
                  <span>Promotion</span>
                  <strong>
                    {Math.min(manualDossiers, promotionGoal)}/
                    {promotionGoal}
                  </strong>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </section>

              <section className="upgrade-section">
                <div className="section-heading">
                  <div>
                    <div className="eyebrow">DÉVELOPPEMENT</div>
                    <h2>Améliorations</h2>
                  </div>
                  <span className="subtle-count">
                    {Number(hasDeskOrganizer) + Number(hasFastStamp)}/2
                  </span>
                </div>

                <div className="upgrade-grid">
                  <article className="upgrade-card">
                    <div className="upgrade-icon">
                      <Building2 size={18} />
                    </div>
                    <div className="upgrade-info">
                      <strong>Organiseur</strong>
                      <span>
                        {hasDeskOrganizer
                          ? "+0,05 € / dossier"
                          : manualDossiers < 10
                            ? `Débloqué à 10 dossiers`
                            : "Améliore les revenus"}
                      </span>
                    </div>
                    {hasDeskOrganizer ? (
                      <span className="owned">
                        <Check size={14} />
                      </span>
                    ) : (
                      <button
                        className="buy-button"
                        onClick={buyDeskOrganizer}
                        disabled={
                          manualDossiers < 10 || companyCash < 2
                        }
                        type="button"
                      >
                        2 €
                      </button>
                    )}
                  </article>

                  <article className="upgrade-card">
                    <div className="upgrade-icon">
                      <Zap size={18} />
                    </div>
                    <div className="upgrade-info">
                      <strong>Tampon rapide</strong>
                      <span>
                        {hasFastStamp
                          ? "+0,10 € / dossier"
                          : manualDossiers < 25
                            ? "Débloqué à 25 dossiers"
                            : "Améliore les revenus"}
                      </span>
                    </div>
                    {hasFastStamp ? (
                      <span className="owned">
                        <Check size={14} />
                      </span>
                    ) : (
                      <button
                        className="buy-button"
                        onClick={buyFastStamp}
                        disabled={
                          manualDossiers < 25 || companyCash < 5
                        }
                        type="button"
                      >
                        5 €
                      </button>
                    )}
                  </article>
                </div>
              </section>

              <div className="company-line">
                <span className="company-dot" />
                <span>
                  {revenueStarted
                    ? "L'entreprise est rentable sur chaque nouveau dossier."
                    : "Les premiers dossiers servent à faire vos preuves."}
                </span>
              </div>

              {hasPromotionOffer && (
                <section className="promotion-panel">
                  <div>
                    <div className="eyebrow">OBJECTIF ATTEINT</div>
                    <strong>Promotion disponible</strong>
                  </div>
                  <button
                    className="promotion-button"
                    onClick={acceptPromotion}
                    type="button"
                  >
                    Accepter <ArrowUpRight size={15} />
                  </button>
                </section>
              )}
            </>
          ) : (
            <section className="work-panel employee-panel">
              <div className="work-icon">
                <BriefcaseBusiness size={25} />
              </div>
              <div>
                <div className="eyebrow">NOUVELLE FONCTION</div>
                <h2>Employé administratif</h2>
                <p>Vous avez passé votre période de stage.</p>
              </div>
              <div className="company-line">
                Prochainement : de nouvelles tâches et responsabilités.
              </div>
            </section>
          )}

          <footer className="office-footer">
            <span>Les dossiers ne se classent pas tout seuls.</span>
            <span>Jour {day}</span>
          </footer>
        </section>
      </div>
    </main>
  );
}
