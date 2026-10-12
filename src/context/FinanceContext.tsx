import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import {
  Transaction,
  TransactionType,
  Category,
  SavingsGoal,
  UserProfile,
  TabType,
  ViewMode,
  ThemeMode,
  AccentColor,
} from "../types/finance";
import { DEFAULT_CATEGORIES } from "../data/categories";
import {
  DEFAULT_TRANSACTIONS,
  DEFAULT_GOALS,
  DEFAULT_USER,
} from "../data/initialData";
import { TOURS_CONFIG } from "../data/tours";

interface FinanceContextType {
  transactions: Transaction[];
  categories: Category[];
  goals: SavingsGoal[];
  user: UserProfile;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  isAvatarModalOpen: boolean;
  setIsAvatarModalOpen: (open: boolean) => void;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  completeOnboarding: () => void;
  isTutorialPromptOpen: boolean;
  setIsTutorialPromptOpen: (open: boolean) => void;
  isTutorialOpen: boolean;
  setIsTutorialOpen: (open: boolean) => void;
  editingTransaction: Transaction | null;
  setEditingTransaction: (tx: Transaction | null) => void;

  // Interactive Spotlight Tour
  activeTourPage: TabType | null;
  tourStepIndex: number;
  startTour: (page: TabType) => void;
  nextTourStep: () => void;
  prevTourStep: () => void;
  stopTour: () => void;
  tourSuggestion: TabType | null;
  acceptTourSuggestion: () => void;
  dismissTourSuggestion: () => void;

  // Theme & Customization
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleThemeMode: () => void;
  accentColor: AccentColor;
  setAccentColor: (accent: AccentColor) => void;

  // Multi-Profile Management
  profiles: UserProfile[];
  activeProfileId: string;
  addProfile: (profile: Omit<UserProfile, "id">) => string;
  switchProfile: (id: string) => void;
  deleteProfile: (id: string) => void;

  // Actions
  addTransaction: (tx: Omit<Transaction, "id">) => void;
  updateTransaction: (tx: Transaction) => void;
  deleteTransaction: (id: string) => void;
  addGoal: (goal: Omit<SavingsGoal, "id">) => void;
  updateGoal: (goal: SavingsGoal) => void;
  deleteGoal: (id: string) => void;
  updateCategoryBudget: (categoryId: string, budget: number) => void;
  updateUser: (patch: Partial<UserProfile>) => void;
  resetToDemoData: () => void;
  clearAllUserData: () => void;
  importTransactionsFromCSV: (csvContent: string) => {
    success: boolean;
    count: number;
    error?: string;
  };

  // Labels (libellés)
  labels: { expense: string[]; income: string[] };
  addLabel: (type: TransactionType, label: string) => void;
  updateLabel: (
    type: TransactionType,
    oldLabel: string,
    newLabel: string,
  ) => void;
  deleteLabel: (type: TransactionType, label: string) => void;

  // Computed metrics
  totalBalance: number;
  monthlySpend: number;
  monthlyIncome: number;
  netSavings: number;
  spendingVsAvgPercent: number;
  activeBudgetsCount: number;
  formatCurrency: (amount: number, showSign?: boolean) => string;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const DEFAULT_LABELS = {
  expense: [
    "Café",
    "Courses Monoprix",
    "Restaurant",
    "Boulangerie",
    "Cinéma",
    "Uber / Taxi",
    "Pharmacie",
    "Loyer",
  ],
  income: [
    "Salaire",
    "Mission Freelance",
    "Remboursement",
    "Vente Vinted",
    "Dividendes",
    "Prime",
  ],
};

const STORAGE_KEYS = {
  PROFILES: "finanza_profiles_v2",
  ACTIVE_PROFILE: "finanza_active_profile_v2",
  TXS_BY_PROFILE: "finanza_txs_by_profile_v2",
  GOALS_BY_PROFILE: "finanza_goals_by_profile_v2",
  CATEGORIES: "finanza_categories_v2",
  VIEW_MODE: "finanza_viewmode_v2",
  LABELS: "finanza_labels_v2",
  ONBOARDING: "finanza_onboarded_v2",
  THEME: "finanza_theme_v2",
  ACCENT: "finanza_accent_v2",
  LEGACY_TXS: "finanza_transactions_v1",
  LEGACY_GOALS: "finanza_goals_v1",
};

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // 1. Profiles list
  const [profiles, setProfiles] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return [DEFAULT_USER];
  });

  // 2. Active profile ID
  const [activeProfileId, setActiveProfileId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_PROFILE);
      if (saved) return saved;
    } catch {
      // ignore
    }
    return DEFAULT_USER.id;
  });

  // 3. Transactions segregated by profile
  const [transactionsByProfile, setTransactionsByProfile] = useState<
    Record<string, Transaction[]>
  >(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TXS_BY_PROFILE);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") return parsed;
      }
      // Migrate legacy transactions to default profile if present
      const legacyTxs = localStorage.getItem(STORAGE_KEYS.LEGACY_TXS);
      const initialTxs = legacyTxs ? JSON.parse(legacyTxs) : DEFAULT_TRANSACTIONS;
      return {
        [DEFAULT_USER.id]: initialTxs,
      };
    } catch {
      return {
        [DEFAULT_USER.id]: DEFAULT_TRANSACTIONS,
      };
    }
  });

  // 4. Savings Goals segregated by profile
  const [goalsByProfile, setGoalsByProfile] = useState<
    Record<string, SavingsGoal[]>
  >(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GOALS_BY_PROFILE);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") return parsed;
      }
      const legacyGoals = localStorage.getItem(STORAGE_KEYS.LEGACY_GOALS);
      const initialGoals = legacyGoals ? JSON.parse(legacyGoals) : DEFAULT_GOALS;
      return {
        [DEFAULT_USER.id]: initialGoals,
      };
    } catch {
      return {
        [DEFAULT_USER.id]: DEFAULT_GOALS,
      };
    }
  });

  // Current active transactions and goals
  const transactions = useMemo(() => {
    return transactionsByProfile[activeProfileId] || [];
  }, [transactionsByProfile, activeProfileId]);

  const goals = useMemo(() => {
    return goalsByProfile[activeProfileId] || [];
  }, [goalsByProfile, activeProfileId]);

  // Current active user
  const user = useMemo(() => {
    const found = profiles.find((p) => p.id === activeProfileId);
    return found || profiles[0] || DEFAULT_USER;
  }, [profiles, activeProfileId]);

  // Categories
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
    } catch {
      return DEFAULT_CATEGORIES;
    }
  });

  // Theme & Accent state
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      if (saved === "dark" || saved === "light") return saved;
    } catch {
      // ignore
    }
    return "light";
  });

  const [accentColor, setAccentColorState] = useState<AccentColor>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACCENT);
      if (
        saved &&
        ["teal", "indigo", "violet", "rose", "amber", "blue"].includes(saved)
      ) {
        return saved as AccentColor;
      }
    } catch {
      // ignore
    }
    return "blue";
  });

  const [labels, setLabels] = useState<{ expense: string[]; income: string[] }>(
    () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEYS.LABELS);
        return saved ? JSON.parse(saved) : DEFAULT_LABELS;
      } catch {
        return DEFAULT_LABELS;
      }
    },
  );

  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VIEW_MODE);
      if (saved === "full" || saved === "mockup") return saved as ViewMode;
    } catch {
      return "full";
    }
    return "full";
  });

  const [activeTab, setActiveTab] = useState<TabType>("home");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(() => {
    try {
      const onboarded = localStorage.getItem(STORAGE_KEYS.ONBOARDING);
      return onboarded !== "true";
    } catch {
      return true;
    }
  });

  // Legacy tutorial state kept for backward compatibility
  const [isTutorialPromptOpen, setIsTutorialPromptOpen] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  // NEW INTERACTIVE SPOTLIGHT TOUR STATE
  const [activeTourPage, setActiveTourPage] = useState<TabType | null>(null);
  const [tourStepIndex, setTourStepIndex] = useState<number>(0);
  const [tourSuggestion, setTourSuggestion] = useState<TabType | null>(null);

  const startTour = (page: TabType) => {
    setActiveTab(page);
    setActiveTourPage(page);
    setTourStepIndex(0);
    setTourSuggestion(null);
  };

  const stopTour = () => {
    if (activeTourPage) {
      try {
        localStorage.setItem(`finanza_tour_${activeTourPage}_completed_v3`, "true");
      } catch {}
    }
    setActiveTourPage(null);
    setTourStepIndex(0);
  };

  const nextTourStep = () => {
    if (!activeTourPage) return;
    const tour = TOURS_CONFIG[activeTourPage];
    if (tour && tourStepIndex < tour.steps.length - 1) {
      setTourStepIndex((prev) => prev + 1);
    } else {
      stopTour();
    }
  };

  const prevTourStep = () => {
    if (tourStepIndex > 0) {
      setTourStepIndex((prev) => prev - 1);
    }
  };

  const acceptTourSuggestion = () => {
    if (!tourSuggestion) return;
    const pageToTour = tourSuggestion;
    try {
      localStorage.setItem(`finanza_tour_${pageToTour}_suggested_v3`, "true");
    } catch {}
    setTourSuggestion(null);
    startTour(pageToTour);
  };

  const dismissTourSuggestion = () => {
    if (!tourSuggestion) return;
    const pageToTour = tourSuggestion;
    try {
      localStorage.setItem(`finanza_tour_${pageToTour}_suggested_v3`, "true");
    } catch {}
    setTourSuggestion(null);
  };

  // Auto-launch Home tour upon 1st login (after onboarding is completed or skipped)
  useEffect(() => {
    if (!isOnboardingOpen) {
      try {
        const homeSeen = localStorage.getItem("finanza_tour_home_completed_v3");
        if (homeSeen !== "true") {
          const timer = setTimeout(() => {
            startTour("home");
          }, 450);
          return () => clearTimeout(timer);
        }
      } catch {}
    }
  }, [isOnboardingOpen]);

  // Auto-suggest tour when visiting other pages for the 1st time
  useEffect(() => {
    if (activeTab === "home") return;
    if (activeTourPage) return; // Don't disrupt an ongoing tour
    try {
      const completed = localStorage.getItem(`finanza_tour_${activeTab}_completed_v3`);
      const suggested = localStorage.getItem(`finanza_tour_${activeTab}_suggested_v3`);
      if (completed !== "true" && suggested !== "true") {
        const timer = setTimeout(() => {
          setTourSuggestion(activeTab);
        }, 450);
        return () => clearTimeout(timer);
      }
    } catch {}
  }, [activeTab, activeTourPage]);

  // Sync theme to DOM
  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, mode);
    } catch {}
  };

  const toggleThemeMode = () => {
    const next = themeMode === "dark" ? "light" : "dark";
    setThemeMode(next);
  };

  const setAccentColor = (accent: AccentColor) => {
    setAccentColorState(accent);
    try {
      localStorage.setItem(STORAGE_KEYS.ACCENT, accent);
    } catch {}
  };

  useEffect(() => {
    const root = document.documentElement;
    if (themeMode === "dark") {
      root.classList.add("dark");
      document.body.classList.add("dark");
      root.setAttribute("data-theme", "dark");
    } else {
      root.classList.remove("dark");
      document.body.classList.remove("dark");
      root.setAttribute("data-theme", "light");
    }
  }, [themeMode]);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-accent", accentColor);
  }, [accentColor]);

  // Onboarding completion: Launch home spotlight tutorial upon 1st connection
  const completeOnboarding = () => {
    try {
      localStorage.setItem(STORAGE_KEYS.ONBOARDING, "true");
    } catch {
      // ignore
    }
    setIsOnboardingOpen(false);
    setIsTutorialPromptOpen(false);
    setTimeout(() => {
      startTour("home");
    }, 400);
  };

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.TXS_BY_PROFILE,
        JSON.stringify(transactionsByProfile),
      );
    } catch {}
  }, [transactionsByProfile]);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.GOALS_BY_PROFILE,
        JSON.stringify(goalsByProfile),
      );
    } catch {}
  }, [goalsByProfile]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
    } catch {}
  }, [profiles]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_PROFILE, activeProfileId);
    } catch {}
  }, [activeProfileId]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch {}
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LABELS, JSON.stringify(labels));
    } catch {}
  }, [labels]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.VIEW_MODE, viewMode);
    } catch {}
  }, [viewMode]);

  // Actions for current active profile
  const addTransaction = (txData: Omit<Transaction, "id">) => {
    const newTx: Transaction = {
      ...txData,
      id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    setTransactionsByProfile((prev) => {
      const currentList = prev[activeProfileId] || [];
      return {
        ...prev,
        [activeProfileId]: [newTx, ...currentList],
      };
    });
  };

  const updateTransaction = (updatedTx: Transaction) => {
    setTransactionsByProfile((prev) => {
      const currentList = prev[activeProfileId] || [];
      return {
        ...prev,
        [activeProfileId]: currentList.map((t) =>
          t.id === updatedTx.id ? updatedTx : t,
        ),
      };
    });
  };

  const deleteTransaction = (id: string) => {
    setTransactionsByProfile((prev) => {
      const currentList = prev[activeProfileId] || [];
      return {
        ...prev,
        [activeProfileId]: currentList.filter((t) => t.id !== id),
      };
    });
  };

  const addGoal = (goalData: Omit<SavingsGoal, "id">) => {
    const newGoal: SavingsGoal = {
      ...goalData,
      id: `goal-${Date.now()}`,
    };
    setGoalsByProfile((prev) => {
      const currentList = prev[activeProfileId] || [];
      return {
        ...prev,
        [activeProfileId]: [...currentList, newGoal],
      };
    });
  };

  const updateGoal = (updatedGoal: SavingsGoal) => {
    setGoalsByProfile((prev) => {
      const currentList = prev[activeProfileId] || [];
      return {
        ...prev,
        [activeProfileId]: currentList.map((g) =>
          g.id === updatedGoal.id ? updatedGoal : g,
        ),
      };
    });
  };

  const deleteGoal = (id: string) => {
    setGoalsByProfile((prev) => {
      const currentList = prev[activeProfileId] || [];
      return {
        ...prev,
        [activeProfileId]: currentList.filter((g) => g.id !== id),
      };
    });
  };

  const updateCategoryBudget = (categoryId: string, budget: number) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === categoryId ? { ...c, budgetMonthly: budget } : c,
      ),
    );
  };

  const updateUser = (patch: Partial<UserProfile>) => {
    setProfiles((prev) =>
      prev.map((p) => (p.id === activeProfileId ? { ...p, ...patch } : p)),
    );
  };

  // Multi-Profile management
  const addProfile = (profileData: Omit<UserProfile, "id">) => {
    const newId = `profile-${Date.now()}`;
    const newProfile: UserProfile = {
      ...profileData,
      id: newId,
    };

    setProfiles((prev) => [...prev, newProfile]);

    // Initialize with a clean set of data for this new profile
    setTransactionsByProfile((prev) => ({
      ...prev,
      [newId]: [],
    }));
    setGoalsByProfile((prev) => ({
      ...prev,
      [newId]: [],
    }));

    setActiveProfileId(newId);
    return newId;
  };

  const switchProfile = (id: string) => {
    if (profiles.some((p) => p.id === id)) {
      setActiveProfileId(id);
    }
  };

  const deleteProfile = (id: string) => {
    if (profiles.length <= 1) return;
    setProfiles((prev) => prev.filter((p) => p.id !== id));
    setTransactionsByProfile((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setGoalsByProfile((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });

    if (activeProfileId === id) {
      const remaining = profiles.filter((p) => p.id !== id);
      if (remaining.length > 0) {
        setActiveProfileId(remaining[0].id);
      }
    }
  };

  const addLabel = (type: TransactionType, label: string) => {
    const trimmed = label.trim();
    if (!trimmed) return;
    setLabels((prev) => {
      const currentList = prev[type] || [];
      if (currentList.includes(trimmed)) return prev;
      return {
        ...prev,
        [type]: [...currentList, trimmed],
      };
    });
  };

  const updateLabel = (
    type: TransactionType,
    oldLabel: string,
    newLabel: string,
  ) => {
    const trimmed = newLabel.trim();
    if (!trimmed) return;
    setLabels((prev) => ({
      ...prev,
      [type]: (prev[type] || []).map((l: string) =>
        l === oldLabel ? trimmed : l,
      ),
    }));
  };

  const deleteLabel = (type: TransactionType, label: string) => {
    setLabels((prev) => ({
      ...prev,
      [type]: (prev[type] || []).filter((l: string) => l !== label),
    }));
  };

  // Robust CSV Import supporting French & English Excel formats (semi-colon and comma)
  const importTransactionsFromCSV = (
    csvContent: string,
  ): { success: boolean; count: number; error?: string } => {
    try {
      if (!csvContent || !csvContent.trim()) {
        return { success: false, count: 0, error: "Le fichier CSV est vide." };
      }

      // Remove BOM if present
      const cleanContent = csvContent.replace(/^\uFEFF/, "").trim();
      const lines = cleanContent.split(/\r?\n/).filter((l) => l.trim().length > 0);

      if (lines.length < 2) {
        return {
          success: false,
          count: 0,
          error: "Fichier CSV incomplet (l'en-tête ou les données manquent).",
        };
      }

      // Detect separator: comma or semicolon or tab
      const firstLine = lines[0];
      const countSemicolons = (firstLine.match(/;/g) || []).length;
      const countCommas = (firstLine.match(/,/g) || []).length;
      const countTabs = (firstLine.match(/\t/g) || []).length;

      let delimiter = ",";
      if (countSemicolons > countCommas && countSemicolons > countTabs) {
        delimiter = ";";
      } else if (countTabs > countCommas && countTabs > countSemicolons) {
        delimiter = "\t";
      }

      // Tokenize CSV line respecting quotes
      const parseLine = (line: string): string[] => {
        const result: string[] = [];
        let current = "";
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
              current += '"';
              i++;
            } else {
              inQuotes = !inQuotes;
            }
          } else if (char === delimiter && !inQuotes) {
            result.push(current.trim());
            current = "";
          } else {
            current += char;
          }
        }
        result.push(current.trim());
        return result;
      };

      const rawHeaders = parseLine(lines[0]);
      const headers = rawHeaders.map((h) =>
        h.toLowerCase().replace(/["']/g, "").trim(),
      );

      const titleIdx = headers.findIndex(
        (h) => h.includes("titre") || h.includes("title") || h.includes("nom") || h.includes("description"),
      );
      const amountIdx = headers.findIndex(
        (h) => h.includes("montant") || h.includes("amount") || h.includes("valeur") || h.includes("prix"),
      );
      const typeIdx = headers.findIndex(
        (h) => h.includes("type") || h.includes("sens"),
      );
      const catIdx = headers.findIndex(
        (h) => h.includes("cat") || h.includes("rubrique"),
      );
      const dateIdx = headers.findIndex(
        (h) => h.includes("date") || h.includes("jour"),
      );
      const timeIdx = headers.findIndex(
        (h) => h.includes("heure") || h.includes("time"),
      );
      const noteIdx = headers.findIndex(
        (h) => h.includes("note") || h.includes("remarque") || h.includes("memo"),
      );

      if (titleIdx === -1 || amountIdx === -1) {
        return {
          success: false,
          count: 0,
          error:
            'Colonnes obligatoires "Titre" et "Montant" introuvables. Vérifiez le format de l\'en-tête du fichier CSV.',
        };
      }

      const importedList: Transaction[] = [];

      for (let i = 1; i < lines.length; i++) {
        const cols = parseLine(lines[i]);
        if (cols.length <= Math.max(titleIdx, amountIdx)) continue;

        const rawTitle = (cols[titleIdx] || "").replace(/^"|"$/g, "").trim();
        const rawAmountStr = (cols[amountIdx] || "").replace(/^"|"$/g, "").trim();

        // Clean amount: support "1 250,50", "1250.50", "1,250.50"
        let normalizedAmountStr = rawAmountStr.replace(/\s+/g, "");
        if (normalizedAmountStr.includes(",") && !normalizedAmountStr.includes(".")) {
          normalizedAmountStr = normalizedAmountStr.replace(",", ".");
        } else if (normalizedAmountStr.includes(",") && normalizedAmountStr.includes(".")) {
          // If both exist, determine decimal separator
          if (normalizedAmountStr.lastIndexOf(",") > normalizedAmountStr.lastIndexOf(".")) {
            normalizedAmountStr = normalizedAmountStr.replace(/\./g, "").replace(",", ".");
          } else {
            normalizedAmountStr = normalizedAmountStr.replace(/,/g, "");
          }
        }
        normalizedAmountStr = normalizedAmountStr.replace(/[^0-9.-]/g, "");

        const numAmount = Math.abs(parseFloat(normalizedAmountStr));
        if (!rawTitle || isNaN(numAmount) || numAmount === 0) continue;

        // Determine transaction type
        let txType: TransactionType = "expense";
        if (typeIdx !== -1 && cols[typeIdx]) {
          const val = cols[typeIdx].toLowerCase();
          if (
            val.includes("income") ||
            val.includes("revenu") ||
            val.includes("revenue") ||
            val.includes("entrée") ||
            val.includes("entree") ||
            val.includes("recette") ||
            val.includes("salaire") ||
            val.includes("+")
          ) {
            txType = "income";
          }
        } else if (parseFloat(normalizedAmountStr) > 0 && rawAmountStr.startsWith("+")) {
          txType = "income";
        }

        // Determine date
        let txDate = new Date().toISOString().slice(0, 10);
        if (dateIdx !== -1 && cols[dateIdx]) {
          const dStr = cols[dateIdx].replace(/^"|"$/g, "").trim();
          // Support DD/MM/YYYY or YYYY-MM-DD
          if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dStr)) {
            const [d, m, y] = dStr.split("/");
            txDate = `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
          } else if (/^\d{4}-\d{2}-\d{2}$/.test(dStr)) {
            txDate = dStr;
          }
        }

        const categoryId =
          catIdx !== -1 && cols[catIdx]
            ? cols[catIdx].replace(/^"|"$/g, "").trim().toLowerCase()
            : txType === "income"
              ? "salary"
              : "food";

        const txTime =
          timeIdx !== -1 && cols[timeIdx]
            ? cols[timeIdx].replace(/^"|"$/g, "").trim()
            : undefined;

        const txNote =
          noteIdx !== -1 && cols[noteIdx]
            ? cols[noteIdx].replace(/^"|"$/g, "").trim()
            : undefined;

        importedList.push({
          id: `tx-imp-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`,
          title: rawTitle,
          amount: numAmount,
          type: txType,
          categoryId: categoryId || (txType === "income" ? "salary" : "food"),
          date: txDate,
          time: txTime,
          note: txNote,
        });
      }

      if (importedList.length === 0) {
        return {
          success: false,
          count: 0,
          error: "Aucune transaction valide reconnue dans le fichier.",
        };
      }

      // Add to current active profile's transactions
      setTransactionsByProfile((prev) => {
        const currentList = prev[activeProfileId] || [];
        const merged = [...importedList, ...currentList].sort((a, b) =>
          b.date.localeCompare(a.date),
        );
        return {
          ...prev,
          [activeProfileId]: merged,
        };
      });

      return { success: true, count: importedList.length };
    } catch (err: any) {
      return {
        success: false,
        count: 0,
        error: err?.message || "Erreur lors de la lecture du fichier CSV.",
      };
    }
  };

  // Reset to initial demo data
  const resetToDemoData = () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.PROFILES);
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_PROFILE);
      localStorage.removeItem(STORAGE_KEYS.TXS_BY_PROFILE);
      localStorage.removeItem(STORAGE_KEYS.GOALS_BY_PROFILE);
      localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
      localStorage.removeItem(STORAGE_KEYS.LABELS);
    } catch {}

    setProfiles([DEFAULT_USER]);
    setActiveProfileId(DEFAULT_USER.id);
    setTransactionsByProfile({
      [DEFAULT_USER.id]: DEFAULT_TRANSACTIONS,
    });
    setGoalsByProfile({
      [DEFAULT_USER.id]: DEFAULT_GOALS,
    });
    setCategories(DEFAULT_CATEGORIES);
    setLabels(DEFAULT_LABELS);
    setAccentColorState("blue");
    setViewMode("full");
    try {
      localStorage.setItem(STORAGE_KEYS.ACCENT, "blue");
      localStorage.setItem(STORAGE_KEYS.VIEW_MODE, "full");
      document.documentElement.setAttribute("data-accent", "blue");
    } catch {}
  };

  // Delete all user data, transactions and erase monthly budget caps
  const clearAllUserData = () => {
    setTransactionsByProfile((prev) => ({
      ...prev,
      [activeProfileId]: [],
    }));
    setGoalsByProfile((prev) => ({
      ...prev,
      [activeProfileId]: [],
    }));
    // Reset all category monthly budgets (plafonds mensuels budgétaires par catégorie) to 0
    setCategories((prev) => {
      const updated = prev.map((cat) => ({
        ...cat,
        budgetMonthly: 0,
      }));
      try {
        localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    // Reset global monthly budget cap of active profile to 0
    updateUser({ monthlyBudgetCap: 0 });
  };

  // Computed metrics based on the active profile's transactions
  const { totalBalance, monthlySpend, monthlyIncome, netSavings } =
    useMemo(() => {
      let income = 0;
      let spend = 0;

      transactions.forEach((tx) => {
        if (tx.type === "income") {
          income += tx.amount;
        } else {
          spend += tx.amount;
        }
      });

      const balance = income - spend;
      const net = income - spend;

      return {
        totalBalance: balance,
        monthlySpend: spend,
        monthlyIncome: income,
        netSavings: net,
      };
    }, [transactions]);

  const spendingVsAvgPercent = useMemo(() => {
    const cap = user.monthlyBudgetCap || 2000;
    if (cap === 0) return 0;
    const ratio = Math.round((monthlySpend / cap) * 100);
    return ratio;
  }, [monthlySpend, user.monthlyBudgetCap]);

  const activeBudgetsCount = useMemo(() => {
    return categories.filter(
      (c) => c.type === "expense" && (c.budgetMonthly || 0) > 0,
    ).length;
  }, [categories]);

  const formatCurrency = (amount: number, showSign: boolean = false): string => {
    const isCFA =
      user.currency === "FCFA" ||
      user.currency === "CFA" ||
      user.currency === "XOF" ||
      user.currency === "XAF";
    const isCHF = user.currency === "CHF";
    const decimals = isCFA && Number.isInteger(amount) ? 0 : 2;

    const formatted = new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(Math.abs(amount));

    const sign = showSign ? (amount < 0 ? "-" : "+") : amount < 0 ? "-" : "";

    if (isCFA) {
      return `${sign}${formatted} FCFA`;
    }
    if (isCHF) {
      return `${sign}${formatted} CHF`;
    }

    if (user.currency === "$") {
      return `${sign}$${formatted}`;
    }
    if (user.currency === "£") {
      return `${sign}£${formatted}`;
    }

    return `${sign}${formatted} ${user.currency}`;
  };

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        categories,
        goals,
        user,
        activeTab,
        setActiveTab,
        viewMode,
        setViewMode,
        isAddModalOpen,
        setIsAddModalOpen,
        isAvatarModalOpen,
        setIsAvatarModalOpen,
        isOnboardingOpen,
        setIsOnboardingOpen,
        completeOnboarding,
        isTutorialPromptOpen,
        setIsTutorialPromptOpen,
        isTutorialOpen,
        setIsTutorialOpen,
        editingTransaction,
        setEditingTransaction,
        activeTourPage,
        tourStepIndex,
        startTour,
        nextTourStep,
        prevTourStep,
        stopTour,
        tourSuggestion,
        acceptTourSuggestion,
        dismissTourSuggestion,
        themeMode,
        setThemeMode,
        toggleThemeMode,
        accentColor,
        setAccentColor,
        profiles,
        activeProfileId,
        addProfile,
        switchProfile,
        deleteProfile,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addGoal,
        updateGoal,
        deleteGoal,
        updateCategoryBudget,
        updateUser,
        resetToDemoData,
        clearAllUserData,
        importTransactionsFromCSV,
        labels,
        addLabel,
        updateLabel,
        deleteLabel,
        totalBalance,
        monthlySpend,
        monthlyIncome,
        netSavings,
        spendingVsAvgPercent,
        activeBudgetsCount,
        formatCurrency,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error("useFinance must be used within a FinanceProvider");
  }
  return context;
};
