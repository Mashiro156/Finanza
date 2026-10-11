import React, { useState, useEffect } from "react";
import { useFinance } from "../context/FinanceContext";
import { CategoryIcon } from "./CategoryIcon";
import { SavingsGoal } from "../types/finance";
import {
  Target,
  Plus,
  Check,
  Edit2,
  Edit3,
  Trash2,
  X,
  Sparkles,
  Info,
} from "lucide-react";

export const BudgetsGoalsView: React.FC = () => {
  const {
    user,
    categories,
    transactions,
    goals,
    updateGoal,
    addGoal,
    deleteGoal,
    updateCategoryBudget,
    formatCurrency,
    startTour,
    activeTourPage,
    tourStepIndex,
  } = useFinance();

  const [activeSubTab, setActiveSubTab] = useState<"budgets" | "goals">(
    "budgets",
  );

  // Synchronize subtab when guided tour moves between budgets and savings goals
  useEffect(() => {
    if (activeTourPage === "goals") {
      if (tourStepIndex === 1) {
        setActiveSubTab("budgets");
      } else if (tourStepIndex === 2) {
        setActiveSubTab("goals");
      }
    }
  }, [activeTourPage, tourStepIndex]);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null,
  );
  const [tempBudgetInput, setTempBudgetInput] = useState("");

  // Goal modal state (Create & Edit)
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);
  const [goalTitle, setGoalTitle] = useState("");
  const [goalTarget, setGoalTarget] = useState("");
  const [goalCurrent, setGoalCurrent] = useState("");
  const [goalCategory, setGoalCategory] = useState("Épargne");

  // Custom contribution state
  const [customGoalId, setCustomGoalId] = useState<string | null>(null);
  const [customAmount, setCustomAmount] = useState("");

  // Dynamic quick amounts based on user currency
  const isCFA = user.currency === "FCFA" || user.currency === "CFA";
  const quickAmounts = isCFA ? [5000, 10000, 25000] : [20, 50, 100];

  // Calculate actual spending per category
  const spendingPerCat = React.useMemo(() => {
    const map: { [id: string]: number } = {};
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        map[t.categoryId] = (map[t.categoryId] || 0) + t.amount;
      });
    return map;
  }, [transactions]);

  const expenseCategories = categories.filter((c) => c.type === "expense");

  const handleSaveBudget = (catId: string) => {
    const val = parseFloat(tempBudgetInput);
    if (!isNaN(val) && val >= 0) {
      updateCategoryBudget(catId, val);
    }
    setEditingCategoryId(null);
  };

  const handleOpenNewGoal = () => {
    setEditingGoal(null);
    setGoalTitle("");
    setGoalTarget("");
    setGoalCurrent("");
    setGoalCategory("Épargne");
    setIsGoalModalOpen(true);
  };

  const handleOpenEditGoal = (goal: SavingsGoal) => {
    setEditingGoal(goal);
    setGoalTitle(goal.title);
    setGoalTarget(goal.targetAmount.toString());
    setGoalCurrent(goal.currentAmount.toString());
    setGoalCategory(goal.category || "Épargne");
    setIsGoalModalOpen(true);
  };

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(goalTarget.replace(",", "."));
    const current = parseFloat(goalCurrent.replace(",", ".")) || 0;
    if (!goalTitle.trim() || isNaN(target) || target <= 0) return;

    if (editingGoal) {
      updateGoal({
        ...editingGoal,
        title: goalTitle.trim(),
        targetAmount: target,
        currentAmount: current,
        category: goalCategory,
      });
    } else {
      addGoal({
        title: goalTitle.trim(),
        targetAmount: target,
        currentAmount: current,
        category: goalCategory,
        color: "var(--accent-color)",
        icon: "Target",
      });
    }

    setIsGoalModalOpen(false);
    setEditingGoal(null);
  };

  const handleAddContribution = (goal: SavingsGoal, amount: number) => {
    updateGoal({
      ...goal,
      currentAmount: Math.max(0, goal.currentAmount + amount),
    });
  };

  const handleApplyCustomContribution = (goal: SavingsGoal, isAdd: boolean) => {
    const parsed = parseFloat(customAmount.replace(",", "."));
    if (isNaN(parsed) || parsed <= 0) return;
    handleAddContribution(goal, isAdd ? parsed : -parsed);
    setCustomAmount("");
    setCustomGoalId(null);
  };

  return (
    <div className="space-y-4 pb-24 pt-1 animate-in fade-in duration-200">
      {/* Title */}
      <div className="px-1 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Budgets & Objectifs
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            Plafonds par catégorie et tirelires d’épargne pour {user.name}
          </p>
        </div>

        {/* Discreet (i) button to relaunch goals tour */}
        <button
          onClick={() => startTour("goals")}
          className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-accent-light text-slate-600 dark:text-slate-300 hover:text-accent-themed flex items-center justify-center transition-all border border-slate-200/60 dark:border-slate-700 shadow-2xs active:scale-95 cursor-pointer"
          title="Lancer le guide interactif des Budgets & Objectifs"
          aria-label="Lancer le guide interactif"
        >
          <Info size={15} />
        </button>
      </div>

      {/* Sub Tabs */}
      <div data-tour="goals-subtabs" className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
        <button
          onClick={() => setActiveSubTab("budgets")}
          className={`py-2 text-xs font-bold rounded-lg transition-all ${
            activeSubTab === "budgets"
              ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          Plafonds Budgétaires
        </button>
        <button
          onClick={() => setActiveSubTab("goals")}
          className={`py-2 text-xs font-bold rounded-lg transition-all ${
            activeSubTab === "goals"
              ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          Objectifs d'Épargne ({goals.length})
        </button>
      </div>

      {/* SUBTAB 1: BUDGETS PAR CATEGORIE */}
      {activeSubTab === "budgets" && (
        <div data-tour="goals-budgets-list" className="space-y-3">
          <div className="px-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            Cliquez sur un montant pour ajuster le plafond mensuel de la
            catégorie.
          </div>

          {expenseCategories.map((cat) => {
            const spent = spendingPerCat[cat.id] || 0;
            const budget = cat.budgetMonthly || 0;
            const percentage =
              budget > 0 ? Math.round((spent / budget) * 100) : 0;
            const isOver = percentage > 100;
            const isEditing = editingCategoryId === cat.id;

            return (
              <div
                key={cat.id}
                className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs space-y-2.5 transition-all hover:border-slate-200 dark:hover:border-slate-700"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-2xs"
                      style={{ backgroundColor: cat.bgColor }}
                    >
                      <CategoryIcon
                        iconName={cat.icon}
                        size={18}
                        className="text-white"
                      />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {cat.name}
                      </h4>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono-numbers">
                        Dépensé : {formatCurrency(spent)}
                      </span>
                    </div>
                  </div>

                  {/* Budget Limit and Edit Trigger */}
                  <div className="text-right">
                    {isEditing ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          autoFocus
                          value={tempBudgetInput}
                          onChange={(e) => setTempBudgetInput(e.target.value)}
                          className="w-16 px-1.5 py-0.5 text-xs font-bold border border-accent rounded-lg font-mono-numbers text-right focus:outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                        <button
                          onClick={() => handleSaveBudget(cat.id)}
                          className="p-1 bg-accent text-white rounded-lg hover:opacity-90"
                        >
                          <Check size={12} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingCategoryId(cat.id);
                          setTempBudgetInput(budget.toString());
                        }}
                        className="group inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        title="Modifier le plafond"
                      >
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono-numbers">
                          / {formatCurrency(budget)}
                        </span>
                        <Edit2
                          size={10}
                          className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200"
                        />
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isOver
                          ? "bg-rose-500"
                          : percentage > 80
                            ? "bg-amber-500"
                            : "bg-accent"
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono-numbers">
                    <span
                      className={
                        isOver ? "text-rose-500 font-bold" : "text-slate-400 dark:text-slate-500"
                      }
                    >
                      {percentage}% utilisé
                    </span>
                    <span className="text-slate-400 dark:text-slate-500">
                      Reste {formatCurrency(Math.max(0, budget - spent))}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SUBTAB 2: SAVINGS GOALS */}
      {activeSubTab === "goals" && (
        <div data-tour="goals-savings-list" className="space-y-3">
          <button
            onClick={handleOpenNewGoal}
            className="w-full py-3 rounded-2xl bg-accent-light hover:opacity-90 border border-dashed border-accent text-accent-themed text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-2xs"
          >
            <Plus size={16} />
            Créer un nouvel objectif d'épargne
          </button>

          {goals.map((goal) => {
            const percent = Math.min(
              100,
              Math.round((goal.currentAmount / goal.targetAmount) * 100),
            );
            const isCustomOpen = customGoalId === goal.id;

            return (
              <div
                key={goal.id}
                className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs space-y-3 hover:border-slate-200 dark:hover:border-slate-700 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-2xs bg-accent"
                    >
                      <Target size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {goal.title}
                      </h4>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500">
                        {goal.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditGoal(goal)}
                      className="text-slate-400 hover:text-accent hover:bg-slate-50 dark:hover:bg-slate-800 p-1.5 rounded-lg transition-colors"
                      title="Modifier cet objectif"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      onClick={() => deleteGoal(goal.id)}
                      className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 p-1.5 rounded-lg transition-colors"
                      title="Supprimer l'objectif"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Amounts and bar */}
                <div className="space-y-1.5">
                  <div className="flex items-baseline justify-between font-mono-numbers">
                    <span className="text-base font-bold text-slate-900 dark:text-white">
                      {formatCurrency(goal.currentAmount)}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500">
                      Objectif : {formatCurrency(goal.targetAmount)} ({percent}
                      %)
                    </span>
                  </div>

                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-accent transition-all duration-300"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                {/* Quick Add buttons & Custom Contribution */}
                <div className="space-y-2 pt-1 border-t border-slate-50 dark:border-slate-800">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mr-0.5">
                      Ajouter :
                    </span>
                    {quickAmounts.map((amt) => (
                      <button
                        key={amt}
                        onClick={() => handleAddContribution(goal, amt)}
                        className="px-2 py-0.5 text-[10px] font-bold bg-slate-100 dark:bg-slate-800 hover:bg-accent-light hover:text-accent-themed text-slate-600 dark:text-slate-300 rounded-md transition-colors font-mono-numbers"
                      >
                        +{formatCurrency(amt)}
                      </button>
                    ))}
                    <button
                      onClick={() => {
                        setCustomGoalId(isCustomOpen ? null : goal.id);
                        setCustomAmount("");
                      }}
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-colors ${
                        isCustomOpen
                          ? "bg-accent text-white"
                          : "bg-accent-light text-accent-themed hover:opacity-90"
                      }`}
                    >
                      + Montant personnalisé
                    </button>
                  </div>

                  {/* Inline custom contribution panel - zero overflow on smartphone */}
                  {isCustomOpen && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-accent space-y-2.5 animate-in fade-in duration-150">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">
                          Versement ou retrait libre
                        </span>
                        <button
                          onClick={() => setCustomGoalId(null)}
                          className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md transition-colors"
                        >
                          <X size={15} />
                        </button>
                      </div>

                      <div className="w-full">
                        <input
                          type="text"
                          inputMode="decimal"
                          autoFocus
                          placeholder={`Ex: ${isCFA ? "15000" : "75"}`}
                          value={customAmount}
                          onChange={(e) =>
                            setCustomAmount(
                              e.target.value.replace(/[^0-9.,]/g, ""),
                            )
                          }
                          className="w-full px-3 py-2 text-xs font-bold bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent font-mono-numbers"
                        />
                      </div>

                      {/* 2-column grid ensures buttons NEVER overflow on smartphone screens */}
                      <div className="grid grid-cols-2 gap-2 w-full">
                        <button
                          onClick={() =>
                            handleApplyCustomContribution(goal, true)
                          }
                          className="w-full py-2 px-3 bg-accent hover:opacity-95 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                        >
                          <Plus size={14} />
                          <span>Verser</span>
                        </button>
                        <button
                          onClick={() =>
                            handleApplyCustomContribution(goal, false)
                          }
                          className="w-full py-2 px-3 bg-slate-200 dark:bg-slate-700 hover:bg-rose-100 dark:hover:bg-rose-900/40 hover:text-rose-600 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                          title="Retirer un montant"
                        >
                          <span>Retirer</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal New / Edit Goal */}
      {isGoalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingGoal
                  ? "Modifier l'objectif d'épargne"
                  : "Nouvel Objectif d'Épargne"}
              </h3>
              <button
                onClick={() => {
                  setIsGoalModalOpen(false);
                  setEditingGoal(null);
                }}
                className="w-7 h-7 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveGoal} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                  Titre de l'objectif
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Voyage à Rome ✈️, Fonds d'urgence..."
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                  Catégorie
                </label>
                <input
                  type="text"
                  placeholder="Ex: Voyage, Épargne, Équipement..."
                  value={goalCategory}
                  onChange={(e) => setGoalCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                    Cible ({user.currency})
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    required
                    placeholder="1500"
                    value={goalTarget}
                    onChange={(e) =>
                      setGoalTarget(e.target.value.replace(/[^0-9.,]/g, ""))
                    }
                    className="w-full px-3 py-2 text-xs font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent font-mono-numbers"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                    Déjà épargné ({user.currency})
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="0"
                    value={goalCurrent}
                    onChange={(e) =>
                      setGoalCurrent(e.target.value.replace(/[^0-9.,]/g, ""))
                    }
                    className="w-full px-3 py-2 text-xs font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent font-mono-numbers"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsGoalModalOpen(false);
                    setEditingGoal(null);
                  }}
                  className="flex-1 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 text-xs font-bold text-white bg-accent hover:opacity-95 rounded-xl shadow-sm transition-all"
                >
                  {editingGoal ? "Enregistrer" : "Créer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
