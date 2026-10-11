import React from "react";
import { useFinance } from "../context/FinanceContext";
import { Sparkles, ArrowRight, X, Compass } from "lucide-react";

export const TutorialPromptModal: React.FC = () => {
  const { isTutorialPromptOpen, setIsTutorialPromptOpen, setIsTutorialOpen } =
    useFinance();

  if (!isTutorialPromptOpen) return null;

  const handleStartTutorial = () => {
    setIsTutorialPromptOpen(false);
    setIsTutorialOpen(true);
  };

  const handleSkipTutorial = () => {
    setIsTutorialPromptOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="w-11 h-11 rounded-2xl bg-accent-light flex items-center justify-center text-accent">
            <Compass size={22} className="stroke-[2.3]" />
          </div>
          <button
            onClick={handleSkipTutorial}
            className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent-light text-accent text-[10px] font-bold mb-1.5">
            <Sparkles size={11} /> Guide de démarrage
          </span>
          <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
            Souhaitez-vous suivre le tutoriel ?
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Découvrez en moins d'une minute comment suivre vos soldes, catégoriser vos transactions, gérer vos plafonds et créer vos objectifs d'épargne.
          </p>
        </div>

        <div className="space-y-2 pt-1">
          <button
            onClick={handleStartTutorial}
            className="w-full py-2.5 px-4 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <span>Démarrer le tutoriel</span>
            <ArrowRight size={14} />
          </button>

          <button
            onClick={handleSkipTutorial}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold transition-colors"
          >
            Passer et explorer seul
          </button>
        </div>
      </div>
    </div>
  );
};
