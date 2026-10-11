import React from "react";
import { useFinance } from "../context/FinanceContext";
import { ChevronRight } from "lucide-react";

export const MetricCards: React.FC = () => {
  const {
    monthlySpend,
    user,
    activeBudgetsCount,
    setActiveTab,
    spendingVsAvgPercent,
    formatCurrency,
  } = useFinance();

  // Spend percentage compared to monthly cap (e.g. 1380.45 / 2000 = 69%)
  const spendRatio = Math.min(
    Math.round((monthlySpend / (user.monthlyBudgetCap || 2000)) * 100),
    100,
  );

  // SVG circular arc parameters
  const size = 38;
  const strokeWidth = 4.5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * spendRatio) / 100;

  return (
    <div data-tour="home-metrics" className="grid grid-cols-2 gap-3 mt-3.5">
      {/* Left Card: Monthly Spend */}
      <button
        onClick={() => setActiveTab("analytics")}
        className="group relative overflow-hidden rounded-[20px] bg-white dark:bg-slate-900 p-4 text-left shadow-2xs border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 transition-all hover:shadow-xs"
      >
        <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 block truncate">
          Monthly Spend
        </span>

        <div className="mt-1 flex items-center justify-between gap-1.5">
          <div className="min-w-0 flex-1">
            <span
              className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight font-mono-numbers block truncate"
              title={formatCurrency(monthlySpend)}
            >
              {formatCurrency(monthlySpend)}
            </span>
            <span className="text-[10px] font-medium text-rose-500 mt-0.5 block font-mono-numbers">
              {spendingVsAvgPercent}% vs avg
            </span>
          </div>

          {/* Donut progress ring matching image */}
          <div className="relative w-9 h-9 shrink-0 flex items-center justify-center">
            <svg width={size} height={size} className="transform -rotate-90">
              {/* Background circle */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                className="stroke-slate-100 dark:stroke-slate-800"
                strokeWidth={strokeWidth}
                fill="none"
              />
              {/* Progress ring in coral/rose matching image */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#f43f5e"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </div>
        </div>
      </button>

      {/* Right Card: Budgets */}
      <button
        onClick={() => setActiveTab("goals")}
        className="group relative overflow-hidden rounded-[20px] bg-white dark:bg-slate-900 p-4 text-left shadow-2xs border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 transition-all hover:shadow-xs flex flex-col justify-between"
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
            Budgets
          </span>
          <ChevronRight
            size={14}
            className="text-slate-400 dark:text-slate-500 group-hover:translate-x-0.5 transition-transform"
          />
        </div>

        <div className="mt-2">
          <span className="text-base font-bold text-slate-900 dark:text-white block">
            {activeBudgetsCount} Active
          </span>
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="flex -space-x-1 overflow-hidden">
              <div className="w-2.5 h-2.5 rounded-full bg-accent ring-1 ring-white dark:ring-slate-900" />
              <div className="w-2.5 h-2.5 rounded-full bg-orange-400 ring-1 ring-white dark:ring-slate-900" />
              <div className="w-2.5 h-2.5 rounded-full bg-purple-500 ring-1 ring-white dark:ring-slate-900" />
            </div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500">En cours</span>
          </div>
        </div>
      </button>
    </div>
  );
};
