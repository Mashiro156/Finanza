import React, { useState, useEffect, useMemo } from "react";
import { useFinance } from "../context/FinanceContext";
import { Sun, Moon, Info } from "lucide-react";
import { PWAInstallButton } from "./PWAInstallButton";

export const Header: React.FC = () => {
  const { user, setIsAvatarModalOpen, themeMode, toggleThemeMode, startTour } = useFinance();
  const [currentDate, setCurrentDate] = useState(() => new Date());

  // Automatically keep date updated in real time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 30000); // checks every 30 seconds
    return () => clearInterval(timer);
  }, []);

  // Formatted date automatically reflecting the exact current date in "Jeu, 8 Oct" style
  const formattedDate = useMemo(() => {
    const raw = new Intl.DateTimeFormat("fr-FR", {
      weekday: "short",
      day: "numeric",
      month: "short",
    }).format(currentDate);

    // Clean dot abbreviations and format into "Jeu, 8 Oct" style
    const cleaned = raw.replace(/\./g, "").trim();
    const parts = cleaned.split(" ");
    const capitalized = parts.map((part) =>
      isNaN(Number(part)) && part.length > 0
        ? part.charAt(0).toUpperCase() + part.slice(1)
        : part,
    );

    if (capitalized.length >= 2) {
      return `${capitalized[0]}, ${capitalized.slice(1).join(" ")}`;
    }
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }, [currentDate]);

  return (
    <header className="flex items-center justify-between pt-2 pb-4 px-1">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
          Welcome, {user.name}!
        </h1>
        <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-0.5">
          {formattedDate}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => startTour("home")}
          className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-accent-light text-slate-600 dark:text-slate-300 hover:text-accent-themed flex items-center justify-center transition-all border border-slate-200/60 dark:border-slate-700 shadow-2xs active:scale-95 cursor-pointer"
          title="Lancer le guide interactif de l'Accueil"
          aria-label="Lancer le guide interactif"
        >
          <Info size={15} />
        </button>

        <button
          onClick={toggleThemeMode}
          className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-amber-400 flex items-center justify-center transition-all border border-slate-200/60 dark:border-slate-700 shadow-2xs active:scale-95 cursor-pointer"
          title={themeMode === "dark" ? "Passer en mode clair" : "Passer en mode sombre"}
          aria-label="Basculer le mode sombre"
        >
          {themeMode === "dark" ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        <PWAInstallButton variant="compact" />

        <button
          onClick={() => setIsAvatarModalOpen(true)}
          className="relative group p-0.5 rounded-full ring-2 ring-slate-100 dark:ring-slate-800 hover:ring-teal-400 transition-all active:scale-95"
          title="Changer de photo de profil"
        >
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover shadow-sm bg-white"
            referrerPolicy="no-referrer"
          />
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-accent border-2 border-white dark:border-slate-900 rounded-full"></div>
        </button>
      </div>
    </header>
  );
};
