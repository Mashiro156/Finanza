import React from "react";
import { useFinance } from "../context/FinanceContext";
import { TOURS_CONFIG } from "../data/tours";
import { Compass, Sparkles, ArrowRight, X } from "lucide-react";

export const TourSuggestionPrompt: React.FC = () => {
  const {
    tourSuggestion,
    acceptTourSuggestion,
    dismissTourSuggestion,
    activeTourPage,
  } = useFinance();

  // If a tour is currently running or no suggestion, don't show
  if (!tourSuggestion || activeTourPage) return null;

  const tourConfig = TOURS_CONFIG[tourSuggestion];
  if (!tourConfig) return null;

  return (
    <div className="fixed bottom-24 sm:bottom-20 left-4 right-4 z-40 max-w-sm mx-auto animate-in slide-in-from-bottom-3 fade-in duration-300">
      <div className="p-3.5 sm:p-4 rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-accent/40 shadow-xl shadow-accent/10 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-accent-light text-accent flex items-center justify-center shrink-0 shadow-2xs">
              <Compass size={18} className="stroke-[2.5]" />
            </div>
            <div>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-accent uppercase tracking-wider">
                <Sparkles size={11} /> Guide Découverte
              </span>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight">
                Découvrir la page {tourConfig.pageName} ?
              </h4>
            </div>
          </div>

          <button
            onClick={dismissTourSuggestion}
            className="w-6 h-6 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            title="Ignorer pour le moment"
          >
            <X size={14} />
          </button>
        </div>

        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
          Un guide interactif rapide en {tourConfig.steps.length} étapes pour
          comprendre les fonctionnalités clés de cette page.
        </p>

        <div className="flex items-center gap-2 pt-0.5">
          <button
            onClick={dismissTourSuggestion}
            className="flex-1 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
          >
            Plus tard
          </button>
          <button
            onClick={acceptTourSuggestion}
            className="flex-1 py-2 px-3 rounded-xl bg-accent hover:opacity-95 text-white text-xs font-bold shadow-accent flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <span>Découvrir</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};
