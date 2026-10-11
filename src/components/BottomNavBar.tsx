import React from "react";
import { useFinance } from "../context/FinanceContext";
import { TabType } from "../types/finance";
import { Home, BarChart2, Target, User, Plus } from "lucide-react";
import { DemoDataBanner } from "./DemoDataBanner";

export const BottomNavBar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    setIsAddModalOpen,
    setEditingTransaction,
    viewMode,
  } = useFinance();

  const handleOpenAdd = () => {
    setEditingTransaction(null);
    setIsAddModalOpen(true);
  };

  const isFull = viewMode === "full";

  return (
    <div
      className={`${
        isFull
          ? "fixed bottom-0 left-0 right-0 z-40 pointer-events-none"
          : "sticky bottom-0 left-0 right-0 z-40 mt-auto pointer-events-none"
      } select-none transition-all`}
    >
      {/* Banner allowing user to delete initial pre-written demo transactions directly upon 1st login */}
      <div className="pointer-events-auto px-2 max-w-lg mx-auto">
        <DemoDataBanner />
      </div>

      {/* Actual Navigation Bar */}
      <nav
        className={`pointer-events-auto w-full ${
          isFull
            ? "border-t border-slate-200/80 dark:border-slate-800"
            : "border-t border-slate-100 dark:border-slate-800"
        } bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-[0_-4px_25px_rgba(0,0,0,0.07)] px-3 pb-5 pt-1.5`}
      >
        <div
          className={`${isFull ? "max-w-lg mx-auto" : ""} flex items-center justify-around relative`}
        >
        {/* Tab 1: Home */}
        <button
          onClick={() => setActiveTab("home")}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] transition-colors ${
            activeTab === "home"
              ? "text-accent font-bold"
              : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
          }`}
        >
          <Home
            size={22}
            className={`transition-transform ${activeTab === "home" ? "scale-105 stroke-[2.5]" : "stroke-[1.8]"}`}
          />
          <span className="text-[10px] font-semibold tracking-tight mt-1">
            Home
          </span>
        </button>

        {/* Tab 2: Analytics */}
        <button
          onClick={() => setActiveTab("analytics")}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] transition-colors ${
            activeTab === "analytics"
              ? "text-accent font-bold"
              : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
          }`}
        >
          <BarChart2
            size={22}
            className={`transition-transform ${activeTab === "analytics" ? "scale-105 stroke-[2.5]" : "stroke-[1.8]"}`}
          />
          <span className="text-[10px] font-semibold tracking-tight mt-1">
            Analytics
          </span>
        </button>

        {/* Center Floating Plus Button */}
        <div data-tour="home-add-btn" className="relative -top-5 flex items-center justify-center">
          <button
            onClick={handleOpenAdd}
            className="w-12 h-12 rounded-full bg-accent hover:opacity-95 active:scale-95 text-white flex items-center justify-center shadow-lg shadow-accent ring-4 ring-white dark:ring-slate-900 transition-all"
            title="Ajouter une entrée ou sortie"
          >
            <Plus size={24} className="stroke-[2.8]" />
          </button>
        </div>

        {/* Tab 3: Goals */}
        <button
          onClick={() => setActiveTab("goals")}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] transition-colors ${
            activeTab === "goals"
              ? "text-accent font-bold"
              : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
          }`}
        >
          <Target
            size={22}
            className={`transition-transform ${activeTab === "goals" ? "scale-105 stroke-[2.5]" : "stroke-[1.8]"}`}
          />
          <span className="text-[10px] font-semibold tracking-tight mt-1">
            Goals
          </span>
        </button>

        {/* Tab 4: Profile */}
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] transition-colors ${
            activeTab === "profile"
              ? "text-accent font-bold"
              : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
          }`}
        >
          <User
            size={22}
            className={`transition-transform ${activeTab === "profile" ? "scale-105 stroke-[2.5]" : "stroke-[1.8]"}`}
          />
          <span className="text-[10px] font-semibold tracking-tight mt-1">
            Profile
          </span>
        </button>
      </div>
    </nav>
  </div>
  );
};
