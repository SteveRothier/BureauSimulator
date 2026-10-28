// app/page.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent, ReactNode } from "react";
import {
  BriefcaseBusiness,
  ChartNoAxesCombined,
  Check,
  ChevronRight,
  CircleHelp,
  Coffee,
  FileText,
  GraduationCap,
  HardDrive,
  LockKeyhole,
  Minimize2,
  Minus,
  Monitor,
  Printer,
  RotateCcw,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Square,
  Stamp,
  TrendingUp,
  Users,
  X,
  Zap,
  Bomb,
  Trophy,
  Play,
} from "lucide-react";
import { useGameStore } from "./store";

type AppId =
  | "work"
  | "catalog"
  | "stats"
  | "personnel"
  | "minesweeper"
  | "help";

type AppDefinition = {
  id: AppId;
  name: string;
  description: string;
  icon: typeof BriefcaseBusiness;
  unlockAt: number;
};

type WindowBounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type WindowState = WindowBounds & {
  id: AppId;
  minimized: boolean;
  zIndex: number;
  maximized: boolean;
  restoreBounds?: WindowBounds;
};

const TASKBAR_HEIGHT = 48;
const MIN_WINDOW_WIDTH = 300;
const MIN_WINDOW_HEIGHT = 180;

const APPS: AppDefinition[] = [
  {
    id: "work",
    name: "Poste de travail",
    description: "Traitez vos dossiers",
    icon: BriefcaseBusiness,
    unlockAt: 0,
  },
  {
    id: "catalog",
    name: "Améliorations",
    description: "Améliorez votre bureau",
    icon: ShoppingCart,
    unlockAt: 0,
  },
  {
    id: "stats",
    name: "Statistiques",
    description: "Consultez vos résultats",
    icon: ChartNoAxesCombined,
    unlockAt: 10,
  },
  {
    id: "personnel",
    name: "Personnel",
    description: "Gérez votre carrière",
    icon: Users,
    unlockAt: 35,
  },
  {
    id: "minesweeper",
    name: "Démineur",
    description: "Une petite pause",
    icon: Bomb,
    unlockAt: 60,
  },
  {
    id: "help",
    name: "Aide",
    description: "Comment jouer",
    icon: CircleHelp,
    unlockAt: 0,
  },
];

const UPGRADE_LIST = [
  {
    id: "procedures",
    name: "Procédures optimisées",
    description: "Chaque dossier rapporte davantage.",
    cost: 12,
    icon: FileText,
  },
  {
    id: "coffee",
    name: "Café de bureau",
    description: "Un petit coup de fouet pour votre productivité.",
    cost: 18,
    icon: Coffee,
  },
  {
    id: "training",
    name: "Formation interne",
    description: "Améliore vos performances au travail.",
    cost: 35,
    icon: GraduationCap,
  },
  {
    id: "stamp",
    name: "Tampon officiel",
    description: "Accélérez le traitement administratif.",
    cost: 55,
    icon: Stamp,
  },
  {
    id: "shortcuts",
    name: "Raccourcis clavier",
    description: "Gagnez du temps sur les tâches répétitives.",
    cost: 90,
    icon: Zap,
  },
  {
    id: "printer",
    name: "Imprimante professionnelle",
    description: "Un équipement plus performant.",
    cost: 150,
    icon: Printer,
  },
  {
    id: "workflow",
    name: "Flux de travail avancé",
    description: "Améliore aussi les gains hors ligne.",
    cost: 250,
    icon: TrendingUp,
  },
  {
    id: "dashboard",
    name: "Tableau de bord",
    description: "Pilotez vos résultats plus efficacement.",
    cost: 420,
    icon: ChartNoAxesCombined,
  },
  {
    id: "anticipation",
    name: "Gestion prévisionnelle",
    description: "Anticipez les dossiers et les priorités.",
    cost: 700,
    icon: HardDrive,
  },
  {
    id: "assistant",
    name: "Assistant personnel",
    description: "Permet de générer des revenus hors ligne.",
    cost: 1200,
    icon: Users,
  },
  {
    id: "promotionReport",
    name: "Rapport de promotion",
    description: "Préparez votre prochaine promotion.",
    cost: 2000,
    icon: Trophy,
  },
] as const;

function formatMoney(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: value < 100 ? 2 : 0,
  }).format(value);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 0,
  }).format(value);
}

function getInitialBounds(id: AppId): WindowBounds {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  const preferredWidth =
    id === "catalog"
      ? 760
      : id === "minesweeper"
        ? 430
        : id === "personnel"
          ? 620
          : id === "stats"
            ? 620
            : id === "help"
              ? 570
              : 650;

  const width = Math.max(
    Math.min(MIN_WINDOW_WIDTH, viewportWidth - 16),
    Math.min(preferredWidth, viewportWidth - 24),
  );

  const height = Math.max(
    Math.min(MIN_WINDOW_HEIGHT, viewportHeight - TASKBAR_HEIGHT - 16),
    Math.min(620, viewportHeight - TASKBAR_HEIGHT - 24),
  );

  return {
    x: Math.max(8, (viewportWidth - width) / 2),
    y: Math.max(8, (viewportHeight - TASKBAR_HEIGHT - height) / 2),
    width,
    height,
  };
}

function WindowFrame({
  title,
  icon: Icon,
  onClose,
  onMinimize,
  onFocus,
  onToggleMaximize,
  onBoundsChange,
  bounds,
  maximized,
  zIndex,
  children,
  className = "",
}: {
  title: string;
  icon: typeof BriefcaseBusiness;
  onClose: () => void;
  onMinimize: () => void;
  onFocus: () => void;
  onToggleMaximize: () => void;
  onBoundsChange: (bounds: WindowBounds) => void;
  bounds: WindowBounds;
  maximized: boolean;
  zIndex: number;
  children: ReactNode;
  className?: string;
}) {
  const interaction = useRef<{
    type: "drag" | "resize";
    edge: string;
    pointerX: number;
    pointerY: number;
    bounds: WindowBounds;
  } | null>(null);

  const startInteraction = (
    event: PointerEvent<HTMLElement>,
    type: "drag" | "resize",
    edge = "",
  ) => {
    if (event.button !== 0 || maximized) return;

    event.preventDefault();
    event.stopPropagation();
    onFocus();

    interaction.current = {
      type,
      edge,
      pointerX: event.clientX,
      pointerY: event.clientY,
      bounds: { ...bounds },
    };

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const moveInteraction = (event: PointerEvent<HTMLElement>) => {
    const active = interaction.current;
    if (!active) return;

    event.preventDefault();

    const dx = event.clientX - active.pointerX;
    const dy = event.clientY - active.pointerY;
    const start = active.bounds;

    if (active.type === "drag") {
      const maxX = Math.max(0, window.innerWidth - 100);
      const maxY = Math.max(0, window.innerHeight - TASKBAR_HEIGHT - 30);

      onBoundsChange({
        ...start,
        x: Math.max(-start.width + 100, Math.min(maxX, start.x + dx)),
        y: Math.max(0, Math.min(maxY, start.y + dy)),
      });

      return;
    }

    let { x, y, width, height } = start;
    const edge = active.edge;

    if (edge.includes("e")) {
      width = Math.max(MIN_WINDOW_WIDTH, start.width + dx);
    }

    if (edge.includes("s")) {
      height = Math.max(MIN_WINDOW_HEIGHT, start.height + dy);
    }

    if (edge.includes("w")) {
      const nextWidth = Math.max(MIN_WINDOW_WIDTH, start.width - dx);
      x = start.x + start.width - nextWidth;
      width = nextWidth;
    }

    if (edge.includes("n")) {
      const nextHeight = Math.max(MIN_WINDOW_HEIGHT, start.height - dy);
      y = start.y + start.height - nextHeight;
      height = nextHeight;
    }

    const maxWidth = Math.max(MIN_WINDOW_WIDTH, window.innerWidth - x);
    const maxHeight = Math.max(
      MIN_WINDOW_HEIGHT,
      window.innerHeight - TASKBAR_HEIGHT - y,
    );

    width = Math.min(width, maxWidth);
    height = Math.min(height, maxHeight);

    onBoundsChange({ x, y, width, height });
  };

  const endInteraction = (event: PointerEvent<HTMLElement>) => {
    interaction.current = null;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const resizeHandles = [
    ["n", "resize-n"],
    ["s", "resize-s"],
    ["e", "resize-e"],
    ["w", "resize-w"],
    ["ne", "resize-ne"],
    ["nw", "resize-nw"],
    ["se", "resize-se"],
    ["sw", "resize-sw"],
  ];

  return (
    <section
      className={`window ${className} ${maximized ? "window-maximized" : ""}`}
      style={{
        zIndex,
        left: bounds.x,
        top: bounds.y,
        width: bounds.width,
        height: bounds.height,
        maxWidth: "none",
        maxHeight: "none",
        transform: "none",
      }}
      onMouseDown={onFocus}
    >
      <header
        className="window-titlebar"
        onPointerDown={(event) => {
          const target = event.target as HTMLElement;
          if (target.closest("button")) return;
          startInteraction(event, "drag");
        }}
        onPointerMove={moveInteraction}
        onPointerUp={endInteraction}
        onPointerCancel={endInteraction}
        onDoubleClick={(event) => {
          const target = event.target as HTMLElement;
          if (!target.closest("button")) onToggleMaximize();
        }}
        title="Glisser pour déplacer · Double-cliquer pour agrandir"
      >
        <div className="window-title">
          <Icon size={16} />
          <span>{title}</span>
        </div>

        <div className="window-controls">
          <button
            className="window-control"
            aria-label="Réduire"
            onClick={onMinimize}
          >
            <Minus size={13} />
          </button>
          <button
            className="window-control"
            aria-label={maximized ? "Restaurer" : "Agrandir"}
            onClick={onToggleMaximize}
          >
            {maximized ? <Minimize2 size={13} /> : <Square size={12} />}
          </button>
          <button
            className="window-control"
            aria-label="Fermer"
            onClick={onClose}
          >
            <X size={14} />
          </button>
        </div>
      </header>

      <div className="window-content">{children}</div>

      {!maximized &&
        resizeHandles.map(([edge, handleClass]) => (
          <div
            key={edge}
            className={`window-resize-handle ${handleClass}`}
            onPointerDown={(event) =>
              startInteraction(event, "resize", edge)
            }
            onPointerMove={moveInteraction}
            onPointerUp={endInteraction}
            onPointerCancel={endInteraction}
          />
        ))}
    </section>
  );
}

export default function HomePage() {
  const game = useGameStore();

  const [clock, setClock] = useState("--:--");
  const [currentDate, setCurrentDate] = useState("");
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [activeWindow, setActiveWindow] = useState<AppId | null>(null);
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [topZIndex, setTopZIndex] = useState(10);
  const [mines, setMines] = useState<number[]>([]);
  const [revealed, setRevealed] = useState<number[]>([]);
  const [mineGameOver, setMineGameOver] = useState(false);
  const [mineWon, setMineWon] = useState(false);
  const [mineRewardClaimed, setMineRewardClaimed] = useState(false);

  useEffect(() => {
    game.hydrate();

    const updateClock = () => {
      const now = new Date();
      setClock(
        now.toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
      setCurrentDate(now.toLocaleDateString("fr-FR"));
    };

    updateClock();
    const interval = window.setInterval(updateClock, 1000);

    return () => window.clearInterval(interval);
    // Hydrate once at application startup.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindows((current) =>
        current.map((item) => {
          if (item.maximized) {
            return {
              ...item,
              x: 0,
              y: 0,
              width: window.innerWidth,
              height: window.innerHeight - TASKBAR_HEIGHT,
            };
          }

          const width = Math.min(item.width, window.innerWidth);
          const height = Math.min(
            item.height,
            Math.max(MIN_WINDOW_HEIGHT, window.innerHeight - TASKBAR_HEIGHT),
          );

          return {
            ...item,
            width,
            height,
            x: Math.max(
              -width + 100,
              Math.min(item.x, window.innerWidth - 100),
            ),
            y: Math.max(
              0,
              Math.min(
                item.y,
                window.innerHeight - TASKBAR_HEIGHT - 30,
              ),
            ),
          };
        }),
      );
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const unlockedApps = APPS.filter(
    (app) => game.dossiers >= app.unlockAt,
  );

  const openApp = useCallback(
    (id: AppId) => {
      const definition = APPS.find((app) => app.id === id);
      if (!definition || game.dossiers < definition.unlockAt) return;

      setTopZIndex((previous) => {
        const next = previous + 1;

        setWindows((current) => {
          const existing = current.find((item) => item.id === id);

          if (existing) {
            return current.map((item) =>
              item.id === id
                ? {
                    ...item,
                    minimized: false,
                    zIndex: next,
                  }
                : item,
            );
          }

          const bounds = getInitialBounds(id);

          return [
            ...current,
            {
              id,
              minimized: false,
              zIndex: next,
              ...bounds,
              maximized: false,
            },
          ];
        });

        return next;
      });

      setActiveWindow(id);
      setStartMenuOpen(false);
    },
    [game.dossiers],
  );

  const closeWindow = (id: AppId) => {
    const remaining = windows.filter((item) => item.id !== id);
    setWindows(remaining);

    if (activeWindow === id) {
      const next = remaining
        .filter((item) => !item.minimized)
        .sort((a, b) => b.zIndex - a.zIndex)[0];

      setActiveWindow(next?.id ?? null);
    }
  };

  const minimizeWindow = (id: AppId) => {
    setWindows((current) =>
      current.map((item) =>
        item.id === id ? { ...item, minimized: true } : item,
      ),
    );

    if (activeWindow === id) {
      const next = windows
        .filter((item) => item.id !== id && !item.minimized)
        .sort((a, b) => b.zIndex - a.zIndex)[0];

      setActiveWindow(next?.id ?? null);
    }
  };

  const focusWindow = (id: AppId) => {
    setTopZIndex((previous) => {
      const next = previous + 1;

      setWindows((current) =>
        current.map((item) =>
          item.id === id
            ? { ...item, minimized: false, zIndex: next }
            : item,
        ),
      );

      return next;
    });

    setActiveWindow(id);
  };

  const updateWindowBounds = (id: AppId, bounds: WindowBounds) => {
    setWindows((current) =>
      current.map((item) =>
        item.id === id && !item.maximized
          ? { ...item, ...bounds }
          : item,
      ),
    );
  };

  const toggleMaximize = (id: AppId) => {
    setWindows((current) =>
      current.map((item) => {
        if (item.id !== id) return item;

        if (item.maximized && item.restoreBounds) {
          return {
            ...item,
            ...item.restoreBounds,
            maximized: false,
            restoreBounds: undefined,
          };
        }

        return {
          ...item,
          restoreBounds: {
            x: item.x,
            y: item.y,
            width: item.width,
            height: item.height,
          },
          x: 0,
          y: 0,
          width: window.innerWidth,
          height: window.innerHeight - TASKBAR_HEIGHT,
          maximized: true,
        };
      }),
    );

    focusWindow(id);
  };

  useEffect(() => {
    if (
      game.dossiers >= 10 &&
      !windows.some((item) => item.id === "stats")
    ) {
      openApp("stats");
    }
  }, [game.dossiers, windows, openApp]);

  const startMineGame = () => {
    const positions: number[] = [];

    while (positions.length < 4) {
      const position = Math.floor(Math.random() * 25);
      if (!positions.includes(position)) positions.push(position);
    }

    setMines(positions);
    setRevealed([]);
    setMineGameOver(false);
    setMineWon(false);
    setMineRewardClaimed(false);
  };

  const revealCell = (index: number) => {
    if (mineGameOver || revealed.includes(index)) return;

    const nextRevealed = [...revealed, index];
    setRevealed(nextRevealed);

    if (mines.includes(index)) {
      setMineGameOver(true);
      return;
    }

    if (nextRevealed.length >= 25 - mines.length) {
      setMineGameOver(true);
      setMineWon(true);
    }
  };

  const claimMineReward = () => {
    if (!mineWon || mineRewardClaimed) return;

    setMineRewardClaimed(true);

    useGameStore.setState((state) => ({
      cash: state.cash + 2,
      companyRevenue: state.companyRevenue + 2,
      totalEarned: state.totalEarned + 2,
      lastSavedAt: Date.now(),
    }));
  };

  const purchasedCount = UPGRADE_LIST.filter((upgrade) =>
    Boolean(
      game.upgrades[
        upgrade.id as keyof typeof game.upgrades
      ],
    ),
  ).length;

  const careerNames = [
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

  const careerName =
    careerNames[Math.min(game.careerLevel, careerNames.length - 1)] ??
    careerNames[0];

  const renderWork = () => (
    <div className="app-panel">
      <div className="welcome-panel">
        <div className="welcome-icon">
          <BriefcaseBusiness size={32} />
        </div>
        <div>
          <h2>Bienvenue au bureau !</h2>
          <p>Le travail ne finit jamais. À vous de jouer.</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Trésorerie</span>
          <strong>{formatMoney(game.cash)}</strong>
        </div>
        <div className="stat-card">
          <span className="stat-label">Dossiers traités</span>
          <strong>{formatNumber(game.dossiers)}</strong>
        </div>
        <div className="stat-card">
          <span className="stat-label">Chiffre d'affaires</span>
          <strong>{formatMoney(game.companyRevenue)}</strong>
        </div>
        <div className="stat-card">
          <span className="stat-label">Améliorations</span>
          <strong>{purchasedCount}/{UPGRADE_LIST.length}</strong>
        </div>
      </div>

      <div className="work-desk">
        <div className="work-document">
          <FileText size={38} />
          <div>
            <strong>Dossier administratif</strong>
            <p>
              Référence : DOS-{String(game.dossiers + 1).padStart(5, "0")}
            </p>
            <p>Statut : en attente de traitement</p>
          </div>
        </div>

        <button
          className="retro-button primary-button process-button"
          onClick={() => game.processDossier()}
        >
          <Check size={17} />
          Traiter le dossier
        </button>

        <p className="hint-text">
          Traitez les dossiers pour gagner de l'argent et débloquer de
          nouvelles applications.
        </p>
      </div>

      <div className="section-heading">
        <h3>Votre carrière</h3>
        <span className="level-tag">Niveau {game.careerLevel + 1}</span>
      </div>

      <div className="career-card">
        <div className="career-icon">
          <GraduationCap size={24} />
        </div>
        <div>
          <strong>{careerName}</strong>
          <p>Continuez à travailler pour gravir les échelons.</p>
        </div>
      </div>
    </div>
  );

  const renderCatalog = () => (
    <div className="app-panel">
      <div className="welcome-panel compact">
        <div className="welcome-icon">
          <ShoppingCart size={28} />
        </div>
        <div>
          <h2>Catalogue des améliorations</h2>
          <p>Investissez dans votre productivité.</p>
        </div>
      </div>

      <div className="catalog-balance">
        <span>Budget disponible</span>
        <strong>{formatMoney(game.cash)}</strong>
      </div>

      <div className="upgrade-list">
        {UPGRADE_LIST.map((upgrade) => {
          const Icon = upgrade.icon;
          const owned = Boolean(
            game.upgrades[
              upgrade.id as keyof typeof game.upgrades
            ],
          );
          const affordable = game.cash >= upgrade.cost;

          return (
            <div
              className={`upgrade-card ${owned ? "upgrade-owned" : ""}`}
              key={upgrade.id}
            >
              <div className="upgrade-icon">
                <Icon size={22} />
              </div>

              <div className="upgrade-info">
                <strong>{upgrade.name}</strong>
                <p>{upgrade.description}</p>
                <span className="upgrade-cost">
                  {formatMoney(upgrade.cost)}
                </span>
              </div>

              <button
                className="retro-button"
                disabled={owned || !affordable}
                onClick={() => game.buyUpgrade(upgrade.id)}
              >
                {owned ? (
                  <>
                    <Check size={14} /> Acheté
                  </>
                ) : (
                  "Acheter"
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderStats = () => (
    <div className="app-panel">
      <div className="welcome-panel compact">
        <div className="welcome-icon">
          <ChartNoAxesCombined size={28} />
        </div>
        <div>
          <h2>Statistiques du bureau</h2>
          <p>Les chiffres ne mentent jamais… normalement.</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Dossiers traités</span>
          <strong>{formatNumber(game.dossiers)}</strong>
        </div>
        <div className="stat-card">
          <span className="stat-label">Dossiers rémunérés</span>
          <strong>{formatNumber(game.paidDossiers)}</strong>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total gagné</span>
          <strong>{formatMoney(game.totalEarned)}</strong>
        </div>
        <div className="stat-card">
          <span className="stat-label">Chiffre d'affaires</span>
          <strong>{formatMoney(game.companyRevenue)}</strong>
        </div>
      </div>

      <div className="report-box">
        <h3>
          <TrendingUp size={18} />
          Rapport de productivité
        </h3>
        <div className="report-row">
          <span>Avancement de carrière</span>
          <strong>{careerName}</strong>
        </div>
        <div className="report-row">
          <span>Améliorations achetées</span>
          <strong>{purchasedCount}</strong>
        </div>
        <div className="report-row">
          <span>Part des dossiers rémunérés</span>
          <strong>
            {game.dossiers > 0
              ? `${Math.round(
                  (game.paidDossiers / game.dossiers) * 100,
                )} %`
              : "0 %"}
          </strong>
        </div>
      </div>
    </div>
  );

  const renderPersonnel = () => {
    const canPromote =
      game.dossiers >= 220 &&
      game.companyRevenue >= 10 &&
      Boolean(game.upgrades.assistant) &&
      Boolean(game.upgrades.promotionReport) &&
      purchasedCount >= 7;

    const requirements = [
      {
        label: "Traiter 220 dossiers",
        met: game.dossiers >= 220,
      },
      {
        label: "Atteindre 10 € de chiffre d'affaires",
        met: game.companyRevenue >= 10,
      },
      {
        label: "Acheter l'assistant personnel",
        met: Boolean(game.upgrades.assistant),
      },
      {
        label: "Acheter le rapport de promotion",
        met: Boolean(game.upgrades.promotionReport),
      },
      {
        label: "Posséder 7 améliorations",
        met: purchasedCount >= 7,
      },
    ];

    return (
      <div className="app-panel">
        <div className="welcome-panel compact">
          <div className="welcome-icon">
            <Users size={28} />
          </div>
          <div>
            <h2>Service du personnel</h2>
            <p>Votre avenir professionnel est entre vos mains.</p>
          </div>
        </div>

        <div className="career-card large-career-card">
          <div className="career-icon">
            <ShieldCheck size={30} />
          </div>
          <div>
            <span className="stat-label">Poste actuel</span>
            <strong>{careerName}</strong>
            <p>Niveau {game.careerLevel + 1}</p>
          </div>
        </div>

        <div className="report-box">
          <h3>Conditions de promotion</h3>
          {requirements.map((requirement) => (
            <div className="requirement-row" key={requirement.label}>
              {requirement.met ? (
                <Check size={17} className="requirement-met" />
              ) : (
                <LockKeyhole size={16} />
              )}
              <span>{requirement.label}</span>
              <strong>{requirement.met ? "Validé" : "En attente"}</strong>
            </div>
          ))}
        </div>

        <button
          className="retro-button primary-button"
          disabled={!canPromote}
          onClick={() => game.promote()}
        >
          <TrendingUp size={16} />
          Demander une promotion
        </button>

        {!canPromote && (
          <p className="hint-text">
            Remplissez toutes les conditions pour demander votre promotion.
          </p>
        )}
      </div>
    );
  };

  const renderMinesweeper = () => (
    <div className="app-panel">
      <div className="welcome-panel compact">
        <div className="welcome-icon">
          <Bomb size={28} />
        </div>
        <div>
          <h2>Démineur</h2>
          <p>Faites une pause entre deux dossiers.</p>
        </div>
      </div>

      <div className="mine-toolbar">
        <span>
          <Bomb size={16} /> {mines.length || 4} mines
        </span>
        <button className="retro-button" onClick={startMineGame}>
          <RotateCcw size={14} /> Nouvelle partie
        </button>
      </div>

      {mines.length === 0 ? (
        <div className="mine-intro">
          <Bomb size={42} />
          <p>Commencez une partie pour générer une grille.</p>
          <button
            className="retro-button primary-button"
            onClick={startMineGame}
          >
            <Play size={15} /> Jouer
          </button>
        </div>
      ) : (
        <>
          <div className="mine-grid">
            {Array.from({ length: 25 }, (_, index) => {
              const isRevealed = revealed.includes(index);
              const isMine = mines.includes(index);

              return (
                <button
                  key={index}
                  className={`mine-cell ${
                    isRevealed ? "mine-cell-revealed" : ""
                  }`}
                  disabled={mineGameOver || isRevealed}
                  onClick={() => revealCell(index)}
                  aria-label={`Case ${index + 1}`}
                >
                  {isRevealed && isMine ? (
                    <Bomb size={17} />
                  ) : isRevealed ? (
                    <Check size={15} />
                  ) : (
                    ""
                  )}
                </button>
              );
            })}
          </div>

          {mineGameOver && (
            <div className="mine-result">
              <strong>
                {mineWon
                  ? "Bravo, grille nettoyée !"
                  : "Boum ! Partie terminée."}
              </strong>

              {mineWon && !mineRewardClaimed && (
                <button
                  className="retro-button primary-button"
                  onClick={claimMineReward}
                >
                  Réclamer 2 €
                </button>
              )}

              {mineRewardClaimed && (
                <p>Récompense de 2 € ajoutée à votre trésorerie.</p>
              )}

              <button className="retro-button" onClick={startMineGame}>
                Rejouer
              </button>
            </div>
          )}

          <p className="hint-text">
            Révélez toutes les cases sans mine pour gagner 2 €.
          </p>
        </>
      )}
    </div>
  );

  const renderHelp = () => (
    <div className="app-panel">
      <div className="welcome-panel compact">
        <div className="welcome-icon">
          <CircleHelp size={28} />
        </div>
        <div>
          <h2>Centre d'aide</h2>
          <p>Le guide officiel de votre bureau.</p>
        </div>
      </div>

      <div className="help-item">
        <div className="help-icon">
          <FileText size={21} />
        </div>
        <div>
          <strong>Traiter les dossiers</strong>
          <p>
            Ouvrez le Poste de travail et cliquez sur le bouton de traitement
            pour progresser.
          </p>
        </div>
      </div>

      <div className="help-item">
        <div className="help-icon">
          <ShoppingCart size={21} />
        </div>
        <div>
          <strong>Acheter des améliorations</strong>
          <p>
            Utilisez votre trésorerie pour acheter des améliorations et
            augmenter votre efficacité.
          </p>
        </div>
      </div>

      <div className="help-item">
        <div className="help-icon">
          <LockKeyhole size={21} />
        </div>
        <div>
          <strong>Débloquer des applications</strong>
          <p>
            De nouvelles applications apparaissent à mesure que vous traitez
            des dossiers.
          </p>
        </div>
      </div>

      <div className="help-item">
        <div className="help-icon">
          <Trophy size={21} />
        </div>
        <div>
          <strong>Gravir les échelons</strong>
          <p>
            Investissez dans votre bureau et remplissez les conditions du
            service du personnel pour obtenir une promotion.
          </p>
        </div>
      </div>

      <div className="help-item">
        <div className="help-icon">
          <Bomb size={21} />
        </div>
        <div>
          <strong>Faire une pause</strong>
          <p>
            Le Démineur est un mini-jeu qui permet de gagner une petite
            récompense.
          </p>
        </div>
      </div>

      <button
        className="retro-button"
        onClick={() => {
          if (
            window.confirm(
              "Voulez-vous vraiment recommencer une nouvelle partie ? Votre progression actuelle sera perdue.",
            )
          ) {
            game.resetGame();
            setWindows([]);
            setActiveWindow(null);
            setStartMenuOpen(false);
            setMines([]);
            setRevealed([]);
            setMineGameOver(false);
            setMineWon(false);
            setMineRewardClaimed(false);
          }
        }}
      >
        <RotateCcw size={15} />
        Réinitialiser la partie
      </button>
    </div>
  );

  const windowContent: Record<AppId, () => ReactNode> = {
    work: renderWork,
    catalog: renderCatalog,
    stats: renderStats,
    personnel: renderPersonnel,
    minesweeper: renderMinesweeper,
    help: renderHelp,
  };

  return (
    <main className="desktop">
      <div className="desktop-icons">
        {unlockedApps.map((app) => {
          const Icon = app.icon;

          return (
            <button
              key={app.id}
              className="desktop-icon"
              onDoubleClick={() => openApp(app.id)}
              onClick={() => setActiveWindow(app.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter") openApp(app.id);
              }}
              title={`Double-cliquez pour ouvrir ${app.name}`}
            >
              <Icon size={34} strokeWidth={1.5} />
              <span>{app.name}</span>
            </button>
          );
        })}

        {APPS.filter((app) => game.dossiers < app.unlockAt).map((app) => {
          const Icon = app.icon;

          return (
            <div
              className="desktop-icon locked-desktop-icon"
              key={app.id}
              title={`Débloqué à ${app.unlockAt} dossiers`}
            >
              <div className="locked-icon">
                <Icon size={32} strokeWidth={1.5} />
                <LockKeyhole size={13} className="lock-overlay" />
              </div>
              <span>{app.name}</span>
              <small>{app.unlockAt} dossiers</small>
            </div>
          );
        })}
      </div>

      <div className="desktop-note">
        <div className="note-title">
          <FileText size={14} /> Note.txt
        </div>
        <p>Bienvenue, collègue.</p>
        <p>Votre bureau vous attend.</p>
        <p>— La direction</p>
      </div>

      {windows.map((item) => {
        if (item.minimized) return null;

        const app = APPS.find((entry) => entry.id === item.id);
        if (!app) return null;

        return (
          <WindowFrame
            key={item.id}
            title={app.name}
            icon={app.icon}
            onClose={() => closeWindow(item.id)}
            onMinimize={() => minimizeWindow(item.id)}
            onFocus={() => focusWindow(item.id)}
            onToggleMaximize={() => toggleMaximize(item.id)}
            onBoundsChange={(bounds) =>
              updateWindowBounds(item.id, bounds)
            }
            bounds={{
              x: item.x,
              y: item.y,
              width: item.width,
              height: item.height,
            }}
            maximized={item.maximized}
            zIndex={item.zIndex}
            className={`window-${item.id} ${
              activeWindow === item.id ? "window-active" : ""
            }`}
          >
            {windowContent[item.id]()}
          </WindowFrame>
        );
      })}

      {startMenuOpen && (
        <>
          <div
            className="start-menu-backdrop"
            onClick={() => setStartMenuOpen(false)}
          />

          <div className="start-menu">
            <div className="start-menu-brand">
              <div className="brand-mark">
                <Monitor size={29} />
              </div>
              <div>
                <strong>Bureau Simulator</strong>
                <span>Édition professionnelle</span>
              </div>
            </div>

            <div className="start-menu-section">
              <span className="start-menu-heading">Applications</span>

              {unlockedApps.map((app) => {
                const Icon = app.icon;

                return (
                  <button
                    className="start-menu-item"
                    key={app.id}
                    onClick={() => openApp(app.id)}
                  >
                    <Icon size={19} />
                    <span>{app.name}</span>
                    <ChevronRight size={14} className="menu-chevron" />
                  </button>
                );
              })}
            </div>

            <div className="start-menu-footer">
              <button
                className="start-menu-item"
                onClick={() => openApp("help")}
              >
                <CircleHelp size={18} />
                <span>Aide et support</span>
              </button>

              <button
                className="start-menu-item"
                onClick={() => {
                  if (
                    window.confirm("Réinitialiser toute votre progression ?")
                  ) {
                    game.resetGame();
                    setWindows([]);
                    setActiveWindow(null);
                    setStartMenuOpen(false);
                  }
                }}
              >
                <Settings size={18} />
                <span>Nouvelle partie</span>
              </button>
            </div>
          </div>
        </>
      )}

      <footer className="taskbar">
        <button
          className={`start-button ${
            startMenuOpen ? "start-button-active" : ""
          }`}
          onClick={() => setStartMenuOpen((value) => !value)}
        >
          <Monitor size={18} />
          <strong>Démarrer</strong>
        </button>

        <div className="taskbar-divider" />

        <div className="taskbar-apps">
          {windows.map((item) => {
            const app = APPS.find((entry) => entry.id === item.id);
            if (!app) return null;
            const Icon = app.icon;

            return (
              <button
                key={item.id}
                className={`taskbar-app ${
                  activeWindow === item.id && !item.minimized
                    ? "taskbar-app-active"
                    : ""
                }`}
                onClick={() => {
                  if (activeWindow === item.id && !item.minimized) {
                    minimizeWindow(item.id);
                  } else {
                    focusWindow(item.id);
                  }
                }}
                title={app.name}
              >
                <Icon size={16} />
                <span>{app.name}</span>
              </button>
            );
          })}
        </div>

        <div className="system-tray">
          <span className="tray-status" title="Système opérationnel">
            <Monitor size={15} />
          </span>
          <div className="clock">
            {clock}
            <small>{currentDate}</small>
          </div>
        </div>
      </footer>
    </main>
  );
}