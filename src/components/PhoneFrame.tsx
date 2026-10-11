import React from "react";
import { useFinance } from "../context/FinanceContext";
import { Wifi, Battery, Smartphone, Monitor, Sun, Moon } from "lucide-react";

interface PhoneFrameProps {
  children: React.ReactNode;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({ children }) => {
  const { viewMode, setViewMode, themeMode, toggleThemeMode } = useFinance();

  if (viewMode === "full") {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col items-center">
        {/* Top desktop header bar (hidden on smartphone screens) */}
        <header className="hidden sm:flex w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-3 px-4 sm:px-6 items-center justify-between sticky top-0 z-30 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center text-white font-bold text-base shadow-xs">
              F
            </div>
            <div>
              <span className="font-bold text-slate-900 dark:text-white text-sm tracking-tight block">
                Finanza
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block -mt-0.5">
                Gestion Financière & Budget
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleThemeMode}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors border border-slate-200 dark:border-slate-700 shadow-2xs cursor-pointer"
              title={themeMode === "dark" ? "Passer en mode clair" : "Passer en mode sombre"}
            >
              {themeMode === "dark" ? <Sun size={14} className="text-amber-400" /> : <Moon size={14} />}
              <span>{themeMode === "dark" ? "Mode Clair" : "Mode Sombre"}</span>
            </button>

            <button
              onClick={() => setViewMode("mockup")}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-accent-themed bg-accent-light hover:opacity-90 rounded-lg transition-colors border border-accent shadow-2xs"
            >
              <Smartphone size={14} />
              <span>Afficher le smartphone mockup</span>
            </button>
          </div>
        </header>

        {/* Content container with proper responsive padding and hidden scrollbar */}
        <main className="w-full max-w-lg mx-auto min-h-screen sm:min-h-[calc(100vh-60px)] bg-slate-50 dark:bg-slate-950 px-4 sm:px-6 py-4 pb-28 relative flex flex-col no-scrollbar">
          {children}
        </main>
      </div>
    );
  }

  // Realistic iPhone mockup frame on desk environment
  return (
    <div className="min-h-screen w-full bg-[#dfd7cc] dark:bg-[#121118] relative flex items-center justify-center py-6 px-4 overflow-x-hidden selection:bg-teal-100 selection:text-teal-900 transition-colors">
      {/* Switch to Full Screen mode button (desktop) */}
      <button
        onClick={() => setViewMode("full")}
        className="fixed top-4 right-4 z-40 hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-800 dark:text-white bg-white/90 dark:bg-slate-900/90 backdrop-blur-md hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all border border-slate-200 dark:border-slate-700 shadow-lg cursor-pointer"
        title="Passer en mode plein écran"
      >
        <Monitor size={14} />
        <span>Mode Plein Écran</span>
      </button>

      {/* Ambient background styling simulating warm wood desk + soft elements */}
      <div
        className="fixed inset-0 pointer-events-none opacity-40 dark:opacity-20"
        style={{
          backgroundImage: `
            radial-gradient(circle at 10% 20%, rgba(20, 83, 45, 0.15) 0%, transparent 40%),
            radial-gradient(circle at 90% 80%, rgba(255, 255, 255, 0.4) 0%, transparent 50%),
            linear-gradient(135deg, #d3c7b7 0%, #e8e0d5 50%, #d8ccbc 100%)
          `,
        }}
      />

      {/* Decorative desktop elements blur (plant leaf top-left, notebook top-right) */}
      <div className="fixed -top-12 -left-12 w-64 h-64 bg-emerald-950/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-1/4 -right-16 w-80 h-96 bg-stone-200/40 dark:bg-purple-950/20 rounded-3xl blur-2xl pointer-events-none" />

      {/* iPhone Device Chassis */}
      <div className="relative z-10 w-full max-w-[390px] h-[835px] max-h-[95vh] rounded-[50px] p-[10px] bg-gradient-to-b from-[#3d2e46] via-[#241a2e] to-[#171020] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.1)_inset] flex flex-col">
        {/* Outer Bezel Rim */}
        <div className="w-full h-full rounded-[42px] bg-black p-[2.5px] flex flex-col relative overflow-hidden shadow-inner">
          {/* Screen Inner Display */}
          <div className="w-full h-full rounded-[40px] bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col overflow-hidden relative">
            {/* iPhone Top Status Bar + Dynamic Island */}
            <div className="h-11 w-full bg-white dark:bg-slate-950 px-7 pt-2 flex items-center justify-between shrink-0 select-none z-30 transition-colors">
              {/* Left Time */}
              <span className="text-[14px] font-bold text-slate-900 dark:text-white font-mono-numbers tracking-tight">
                9:45
              </span>

              {/* Center Dynamic Island */}
              <div className="w-[108px] h-[28px] bg-black rounded-full flex items-center justify-end pr-2.5 gap-2 border border-white/5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#101018] border border-slate-800" />
              </div>

              {/* Right Icons: Signal, Wifi, Battery */}
              <div className="flex items-center gap-1.5 text-slate-900 dark:text-white">
                <div className="flex items-end gap-[1.5px] h-2.5">
                  <div className="w-[2.5px] h-1.5 bg-slate-900 dark:bg-white rounded-2xs" />
                  <div className="w-[2.5px] h-2 bg-slate-900 dark:bg-white rounded-2xs" />
                  <div className="w-[2.5px] h-2.5 bg-slate-900 dark:bg-white rounded-2xs" />
                </div>
                <Wifi size={13} className="stroke-[2.5]" />
                <div className="flex items-center gap-0.5">
                  <span className="text-[10px] font-bold font-mono-numbers">
                    85
                  </span>
                  <Battery size={15} className="stroke-[2]" />
                </div>
              </div>
            </div>

            {/* Scrollable View Content */}
            <div className="flex-1 overflow-y-auto px-4 relative flex flex-col no-scrollbar">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
