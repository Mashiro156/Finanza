import React, { useState, useEffect } from "react";
import { useFinance } from "../context/FinanceContext";
import { Sparkles, Trash2, X } from "lucide-react";

const STORAGE_KEY_BANNER = "finanza_demo_banner_dismissed_v1";

export const DemoDataBanner: React.FC = () => {
  const { transactions, clearAllUserData } = useFinance();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem(STORAGE_KEY_BANNER);
      // Only show upon 1st login if never dismissed and there are transactions (initial demo transactions)
      if (dismissed !== "true" && transactions.length > 0) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    } catch {
      setIsVisible(false);
    }
  }, [transactions.length]);

  if (!isVisible) return null;

  const handleClearDemoData = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      localStorage.setItem(STORAGE_KEY_BANNER, "true");
    } catch {}
    clearAllUserData();
    setIsVisible(false);
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      localStorage.setItem(STORAGE_KEY_BANNER, "true");
    } catch {}
    setIsVisible(false);
  };

  return (
    <div className="w-full mb-2 animate-in slide-in-from-bottom-2 duration-200">
      <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-slate-900 border border-amber-200/90 dark:border-amber-500/40 text-amber-950 dark:text-amber-200 shadow-md flex items-center justify-between gap-2.5 backdrop-blur-sm">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-xl bg-amber-100 dark:bg-amber-950/80 flex items-center justify-center shrink-0 text-amber-600 dark:text-amber-400 shadow-2xs">
            <Sparkles size={14} className="stroke-[2.5]" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold block truncate text-slate-900 dark:text-white">
              Transactions & Plafonds préécrits
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate -mt-0.5">
              Supprimer les données exemples et réinitialiser les plafonds à zéro ?
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleClearDemoData}
            className="px-2.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-[11px] font-bold shadow-xs transition-all flex items-center gap-1 cursor-pointer"
            title="Supprimer les transactions préécrites et réinitialiser les plafonds budgétaires"
          >
            <Trash2 size={12} />
            <span>Supprimer</span>
          </button>
          <button
            onClick={handleDismiss}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-amber-100/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Conserver les exemples"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
