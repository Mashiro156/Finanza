import React, { useState, useMemo } from "react";
import { useFinance } from "../context/FinanceContext";
import { CategoryIcon } from "./CategoryIcon";
import {
  PieChart,
  BarChart3,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  X,
  Info,
} from "lucide-react";

export const AnalyticsView: React.FC = () => {
  const {
    transactions,
    categories,
    user,
    monthlySpend,
    monthlyIncome,
    netSavings,
    formatCurrency,
    startTour,
  } = useFinance();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedWeekIndex, setSelectedWeekIndex] = useState<number | null>(null);

  // Group expenses by category
  const expensesByCategory = useMemo(() => {
    const map: { [catId: string]: number } = {};
    let totalExp = 0;

    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        map[t.categoryId] = (map[t.categoryId] || 0) + t.amount;
        totalExp += t.amount;
      });

    return Object.entries(map)
      .map(([catId, amount]) => {
        const cat = categories.find((c) => c.id === catId) || {
          id: catId,
          name: "Autre",
          bgColor: "#64748b",
          textColor: "#ffffff",
          icon: "PlusCircle",
          type: "expense" as const,
        };
        const percentage = totalExp > 0 ? (amount / totalExp) * 100 : 0;
        return {
          cat,
          amount,
          percentage,
        };
      })
      .sort((a, b) => b.amount - a.amount);
  }, [transactions, categories]);

  // Weekly breakdown for cashflow bar chart
  const weeklyData = useMemo(() => {
    // 4 weeks buckets
    const weeks = [
      { label: "Sem 1", period: "1 - 7 du mois", income: 0, expense: 0, count: 0 },
      { label: "Sem 2", period: "8 - 14 du mois", income: 0, expense: 0, count: 0 },
      { label: "Sem 3", period: "15 - 21 du mois", income: 0, expense: 0, count: 0 },
      { label: "Sem 4", period: "22 - fin du mois", income: 0, expense: 0, count: 0 },
    ];

    transactions.forEach((tx) => {
      const day = parseInt(tx.date.split("-")[2] || "1", 10);
      let weekIndex = 0;
      if (day > 21) weekIndex = 3;
      else if (day > 14) weekIndex = 2;
      else if (day > 7) weekIndex = 1;

      weeks[weekIndex].count += 1;
      if (tx.type === "income") {
        weeks[weekIndex].income += tx.amount;
      } else {
        weeks[weekIndex].expense += tx.amount;
      }
    });

    return weeks;
  }, [transactions]);

  // Calculate SVG Donut chart paths with expanded center radius to prevent overlap
  const donutData = useMemo(() => {
    let accumulatedAngle = 0;
    const radius = 82;
    const innerRadius = 58;
    const cx = 100;
    const cy = 100;

    return expensesByCategory.map((item) => {
      const angle = (item.percentage / 100) * 360;
      const startAngle = accumulatedAngle;
      const endAngle = accumulatedAngle + angle;
      accumulatedAngle += angle;

      // Convert angles to radians
      const startRad = ((startAngle - 90) * Math.PI) / 180;
      const endRad = ((endAngle - 90) * Math.PI) / 180;

      const x1 = cx + radius * Math.cos(startRad);
      const y1 = cy + radius * Math.sin(startRad);
      const x2 = cx + radius * Math.cos(endRad);
      const y2 = cy + radius * Math.sin(endRad);

      const ix1 = cx + innerRadius * Math.cos(endRad);
      const iy1 = cy + innerRadius * Math.sin(endRad);
      const ix2 = cx + innerRadius * Math.cos(startRad);
      const iy2 = cy + innerRadius * Math.sin(startRad);

      const largeArc = angle > 180 ? 1 : 0;

      const pathData = [
        `M ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
        `L ${ix1} ${iy1}`,
        `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix2} ${iy2}`,
        "Z",
      ].join(" ");

      return {
        ...item,
        pathData,
      };
    });
  }, [expensesByCategory]);

  const selectedCategoryObj = selectedCategory
    ? expensesByCategory.find((c) => c.cat.id === selectedCategory)
    : null;

  const currentDisplayAmount = selectedCategoryObj
    ? selectedCategoryObj.amount
    : monthlySpend;
  const currentDisplayLabel = selectedCategoryObj
    ? selectedCategoryObj.cat.name
    : "Total Dépenses";

  const budgetUsagePercent = Math.min(
    100,
    Math.round((monthlySpend / (user.monthlyBudgetCap || 2000)) * 100),
  );
  const remainingBudget = Math.max(
    0,
    (user.monthlyBudgetCap || 2000) - monthlySpend,
  );

  // Format only numeric part for clean circular center placement
  const formattedNumberOnly = useMemo(() => {
    const isCFA =
      user.currency === "FCFA" ||
      user.currency === "CFA" ||
      user.currency === "XOF" ||
      user.currency === "XAF";
    const decimals = isCFA && Number.isInteger(currentDisplayAmount) ? 0 : 2;
    return new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(Math.abs(currentDisplayAmount));
  }, [currentDisplayAmount, user.currency]);

  return (
    <div className="space-y-4 pb-24 pt-1 animate-in fade-in duration-200">
      {/* Title */}
      <div className="px-1 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Analyses & Budget
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            Suivi de vos flux financiers et répartition des dépenses pour {user.name}
          </p>
        </div>

        {/* Discreet (i) button to relaunch analytics tour */}
        <button
          onClick={() => startTour("analytics")}
          className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-accent-light text-slate-600 dark:text-slate-300 hover:text-accent-themed flex items-center justify-center transition-all border border-slate-200/60 dark:border-slate-700 shadow-2xs active:scale-95 cursor-pointer"
          title="Lancer le guide interactif des Analyses"
          aria-label="Lancer le guide interactif"
        >
          <Info size={15} />
        </button>
      </div>

      {/* Overview Cards: Entrées / Sorties / Solde net */}
      <div data-tour="analytics-overview" className="grid grid-cols-3 gap-2">
        <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
            <TrendingUp size={13} />
            <span>Entrées</span>
          </div>
          <span className="text-sm font-bold text-slate-900 dark:text-white font-mono-numbers block truncate">
            {formatCurrency(monthlyIncome)}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-rose-500 dark:text-rose-400 mb-1">
            <TrendingDown size={13} />
            <span>Sorties</span>
          </div>
          <span className="text-sm font-bold text-slate-900 dark:text-white font-mono-numbers block truncate">
            {formatCurrency(monthlySpend)}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-accent mb-1">
            <CheckCircle2 size={13} />
            <span>Épargne</span>
          </div>
          <span
            className={`text-sm font-bold font-mono-numbers block truncate ${netSavings >= 0 ? "text-accent" : "text-rose-500 dark:text-rose-400"}`}
          >
            {formatCurrency(netSavings)}
          </span>
        </div>
      </div>

      {/* Monthly Budget Gauge Card */}
      <div data-tour="analytics-gauge" className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-xs font-bold text-slate-800 dark:text-white">
              Budget Mensuel Global
            </span>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              Plafond fixé à {formatCurrency(user.monthlyBudgetCap)}
            </p>
          </div>
          <span className="text-xs font-bold font-mono-numbers px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {budgetUsagePercent}% utilisé
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              budgetUsagePercent > 90
                ? "bg-rose-500"
                : budgetUsagePercent > 70
                  ? "bg-amber-500"
                  : "bg-accent"
            }`}
            style={{ width: `${Math.min(budgetUsagePercent, 100)}%` }}
          />
        </div>

        <div className="flex items-center justify-between mt-2.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
          <span>
            Dépensé :{" "}
            <strong className="text-slate-800 dark:text-white font-mono-numbers">
              {formatCurrency(monthlySpend)}
            </strong>
          </span>
          <span>
            Reste :{" "}
            <strong className="text-accent font-mono-numbers">
              {formatCurrency(remainingBudget)}
            </strong>
          </span>
        </div>
      </div>

      {/* Interactive Donut Chart: Expense Breakdown */}
      <div data-tour="analytics-donut" className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <PieChart size={16} className="text-accent" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Répartition par Catégorie
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 dark:text-slate-500">
            {expensesByCategory.length} catégories
          </span>
        </div>

        {/* Donut and Center Stats */}
        <div className="flex items-center justify-center my-3">
          <div className="relative w-52 h-52 flex items-center justify-center">
            <svg
              viewBox="0 0 200 200"
              className="w-full h-full transform -rotate-90"
            >
              {donutData.map((item) => {
                const isHovered = selectedCategory === item.cat.id;
                return (
                  <path
                    key={item.cat.id}
                    d={item.pathData}
                    fill={item.cat.bgColor}
                    className="cursor-pointer transition-all duration-200 hover:opacity-90"
                    style={{
                      transformOrigin: "100px 100px",
                      transform: isHovered ? "scale(1.04)" : "scale(1)",
                    }}
                    onClick={() =>
                      setSelectedCategory(
                        selectedCategory === item.cat.id ? null : item.cat.id,
                      )
                    }
                  />
                );
              })}
            </svg>

            {/* Center label with unit placed below to prevent any overlap especially in FCFA */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-3 select-none">
              <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 block uppercase tracking-wider mb-0.5 truncate max-w-[110px]">
                {currentDisplayLabel}
              </span>
              <span
                className={`font-black text-slate-900 dark:text-white font-mono-numbers leading-tight block truncate max-w-[115px] ${
                  formattedNumberOnly.length > 10
                    ? "text-xs"
                    : formattedNumberOnly.length > 7
                      ? "text-sm"
                      : "text-base"
                }`}
                title={formattedNumberOnly}
              >
                {formattedNumberOnly}
              </span>
              <span className="text-[10px] font-extrabold text-accent block uppercase tracking-wider mt-0.5">
                {user.currency}
              </span>
            </div>
          </div>
        </div>

        {/* Legend / Category breakdown list */}
        <div className="space-y-2 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          {expensesByCategory.map((item) => {
            const isSelected = selectedCategory === item.cat.id;
            return (
              <div
                key={item.cat.id}
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === item.cat.id ? null : item.cat.id,
                  )
                }
                className={`flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer ${
                  isSelected
                    ? "bg-slate-100 dark:bg-slate-800 ring-1 ring-accent"
                    : "hover:bg-slate-50 dark:hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 shadow-2xs"
                    style={{ backgroundColor: item.cat.bgColor }}
                  >
                    <CategoryIcon
                      iconName={item.cat.icon}
                      size={14}
                      className="text-white"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span
                      className="text-xs font-bold text-slate-800 dark:text-white block truncate"
                      title={item.cat.name}
                    >
                      {item.cat.name}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono-numbers block truncate">
                      {item.percentage.toFixed(1)}% des dépenses
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0 min-w-fit">
                  <span className="text-xs font-bold text-slate-900 dark:text-white font-mono-numbers block whitespace-nowrap">
                    {formatCurrency(item.amount)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weekly Cash Flow Comparison with On-Click Inspection */}
      <div data-tour="analytics-weekly" className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BarChart3 size={16} className="text-accent" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Flux Hebdomadaire (Entrées vs Sorties)
            </h3>
          </div>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium hidden sm:inline">
            Cliquez pour inspecter
          </span>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-3 px-1">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
              <span>Entrées</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-rose-400" />
              <span>Sorties</span>
            </div>
          </div>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 italic">
            Touchez une barre
          </span>
        </div>

        {/* Bars Container */}
        <div className="grid grid-cols-4 gap-2 pt-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          {weeklyData.map((week, idx) => {
            const maxVal = Math.max(
              ...weeklyData.flatMap((w) => [w.income, w.expense]),
              500,
            );
            const incHeight = Math.max((week.income / maxVal) * 90, 6);
            const expHeight = Math.max((week.expense / maxVal) * 90, 6);
            const isSelected = selectedWeekIndex === idx;

            return (
              <button
                key={idx}
                type="button"
                onClick={() =>
                  setSelectedWeekIndex((prev) => (prev === idx ? null : idx))
                }
                className={`flex flex-col items-center p-1.5 rounded-2xl transition-all cursor-pointer focus:outline-none ${
                  isSelected
                    ? "bg-accent-light ring-2 ring-accent shadow-xs scale-102"
                    : "hover:bg-slate-50 dark:hover:bg-slate-800/60"
                }`}
                title={`Cliquer pour voir les détails de ${week.label}`}
              >
                <div className="h-28 flex items-end justify-center gap-1.5 w-full">
                  {/* Income bar */}
                  <div
                    className={`w-3.5 bg-emerald-500 rounded-t-sm transition-all ${
                      isSelected
                        ? "bg-emerald-600 ring-2 ring-emerald-300 dark:ring-emerald-400"
                        : "hover:bg-emerald-600"
                    }`}
                    style={{ height: `${incHeight}px` }}
                  />
                  {/* Expense bar */}
                  <div
                    className={`w-3.5 bg-rose-400 rounded-t-sm transition-all ${
                      isSelected
                        ? "bg-rose-500 ring-2 ring-rose-300 dark:ring-rose-400"
                        : "hover:bg-rose-500"
                    }`}
                    style={{ height: `${expHeight}px` }}
                  />
                </div>
                <span
                  className={`text-[11px] font-bold mt-2 ${
                    isSelected
                      ? "text-accent"
                      : "text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {week.label}
                </span>
                <span className="text-[9px] text-slate-400 dark:text-slate-500 -mt-0.5 font-mono-numbers">
                  {week.count} opé.
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Week Detailed Card (shown upon clicking on bars) */}
        {selectedWeekIndex !== null && (
          <div className="mt-3.5 p-3.5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-accent space-y-2.5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Détail {weeklyData[selectedWeekIndex].label} · {weeklyData[selectedWeekIndex].period}
                </span>
              </div>
              <button
                onClick={() => setSelectedWeekIndex(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md transition-colors"
                title="Fermer le détail"
              >
                <X size={15} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-2xs">
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 block mb-0.5">
                  Entrées
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-white font-mono-numbers block truncate">
                  +{formatCurrency(weeklyData[selectedWeekIndex].income)}
                </span>
              </div>

              <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-2xs">
                <span className="text-[10px] font-semibold text-rose-500 dark:text-rose-400 block mb-0.5">
                  Sorties
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-white font-mono-numbers block truncate">
                  -{formatCurrency(weeklyData[selectedWeekIndex].expense)}
                </span>
              </div>

              <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-2xs">
                <span className="text-[10px] font-semibold text-accent block mb-0.5">
                  Solde net
                </span>
                <span
                  className={`text-xs font-bold font-mono-numbers block truncate ${
                    weeklyData[selectedWeekIndex].income -
                      weeklyData[selectedWeekIndex].expense >=
                    0
                      ? "text-accent"
                      : "text-rose-600 dark:text-rose-400"
                  }`}
                >
                  {formatCurrency(
                    weeklyData[selectedWeekIndex].income -
                      weeklyData[selectedWeekIndex].expense,
                    true,
                  )}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
