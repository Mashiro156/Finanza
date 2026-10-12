import React from "react";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import { WifiOff } from "lucide-react";

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-40 max-w-sm mx-auto animate-in slide-in-from-bottom-2 duration-200">
      <div className="p-2.5 rounded-2xl bg-slate-900/95 dark:bg-slate-800/95 text-white backdrop-blur-md border border-slate-700/80 shadow-xl flex items-center gap-2.5 text-xs font-semibold">
        <span className="w-6 h-6 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
          <WifiOff size={14} />
        </span>
        <span className="flex-1 text-[11px] leading-tight text-slate-200">
          Mode Hors-ligne — Vos données locales et sauvegardes restent accessibles.
        </span>
      </div>
    </div>
  );
};
