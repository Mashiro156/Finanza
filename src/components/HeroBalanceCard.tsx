import React from "react";
import { useFinance } from "../context/FinanceContext";
import { ArrowUpRight, TrendingUp } from "lucide-react";

export const HeroBalanceCard: React.FC = () => {
  const { totalBalance, setActiveTab, formatCurrency } = useFinance();

  return (
    <div
      data-tour="home-balance"
      className="relative overflow-hidden rounded-[26px] p-5 shadow-sm border transition-all hover:shadow-md"
      style={{
        background: "linear-gradient(135deg, var(--hero-from), var(--hero-via), var(--hero-to))",
        borderColor: "var(--hero-border)",
      }}
    >
      {/* Subtle background grid pattern matching the image */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.22] dark:opacity-[0.1]"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--accent-color) 1px, transparent 1px),
            linear-gradient(to bottom, var(--accent-color) 1px, transparent 1px)
          `,
          backgroundSize: "24px 24px",
        }}
      />

      {/* Top row */}
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <span
            className="text-xs font-semibold tracking-normal block"
            style={{ color: "var(--hero-text)" }}
          >
            Current Balance
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-mono-numbers">
              {formatCurrency(totalBalance)}
            </span>
          </div>
        </div>

        {/* Top-right subtle circle button / trend indicator */}
        <button
          onClick={() => setActiveTab("analytics")}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          style={{
            backgroundColor: "var(--accent-light)",
            color: "var(--accent-color)",
          }}
          title="Voir l'analyse détaillée"
        >
          <ArrowUpRight size={17} className="stroke-[2.5]" />
        </button>
      </div>

      {/* Bottom row: Total Balance + Sparkline and badge */}
      <div className="relative z-10 mt-3 pt-2 flex items-end justify-between">
        <div className="pb-0.5">
          <span
            className="text-[11px] font-medium"
            style={{ color: "var(--hero-text)", opacity: 0.8 }}
          >
            Total Balance
          </span>
        </div>

        {/* Right side: Sparkline graph + badge */}
        <div className="flex flex-col items-end">
          {/* SVG Sparkline matching the smooth curve from the image */}
          <div className="w-28 h-9 -mb-1">
            <svg
              viewBox="0 0 120 40"
              className="w-full h-full overflow-visible"
            >
              <defs>
                <linearGradient
                  id="balanceSparklineGrad"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="var(--accent-color)" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="var(--accent-color)" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Fill area */}
              <path
                d="M 0 32 Q 25 35 45 22 T 80 18 T 105 10 T 120 7 L 120 40 L 0 40 Z"
                fill="url(#balanceSparklineGrad)"
              />
              {/* Stroke line */}
              <path
                d="M 0 32 Q 25 35 45 22 T 80 18 T 105 10 T 120 7"
                fill="none"
                stroke="var(--accent-color)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* End pulse dot */}
              <circle cx="120" cy="7" r="3" fill="var(--accent-color)" />
            </svg>
          </div>

          {/* Trend badge */}
          <div
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border shadow-2xs mt-1"
            style={{
              backgroundColor: "var(--accent-light)",
              borderColor: "var(--accent-border)",
            }}
          >
            <TrendingUp size={11} className="stroke-[2.5]" style={{ color: "var(--accent-color)" }} />
            <span
              className="text-[10px] font-semibold font-mono-numbers"
              style={{ color: "var(--accent-text)" }}
            >
              +3.2% this month
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
