import React, { useState } from "react";
import { useFinance } from "../context/FinanceContext";
import { BUILT_IN_AVATARS } from "../data/avatars";
import { Sparkles, Check, ArrowRight, ShieldCheck, Wallet, User } from "lucide-react";

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onComplete,
}) => {
  const { user, updateUser } = useFinance();

  const [name, setName] = useState(
    user.name === "Sophie" ? "" : user.name || "",
  );
  const [currency, setCurrency] = useState(user.currency || "FCFA");
  const [budgetCap, setBudgetCap] = useState(
    currency === "FCFA" ? "500000" : "2000",
  );
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState(
    BUILT_IN_AVATARS[0].svgDataUri,
  );

  if (!isOpen) return null;

  const handleCurrencyChange = (newCurrency: string) => {
    setCurrency(newCurrency);
    if (newCurrency === "FCFA") {
      if (budgetCap === "2000" || budgetCap === "") {
        setBudgetCap("500000");
      }
    } else {
      if (budgetCap === "500000") {
        setBudgetCap("2000");
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const capNum = parseFloat(budgetCap.replace(/[^0-9.]/g, ""));
    const finalCap =
      isNaN(capNum) || capNum <= 0
        ? currency === "FCFA"
          ? 500000
          : 2000
        : capNum;

    updateUser({
      name: name.trim() || "Utilisateur",
      currency,
      avatarUrl: selectedAvatarUrl,
      monthlyBudgetCap: finalCap,
    });

    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Hero */}
        <div className="bg-gradient-to-br from-teal-700 via-teal-800 to-emerald-900 p-6 text-white text-center relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 mx-auto flex items-center justify-center mb-3 shadow-inner">
            <Sparkles size={24} className="text-teal-200" />
          </div>
          <h2 className="text-xl font-extrabold tracking-tight">
            Bienvenue sur Finanza !
          </h2>
          <p className="text-xs text-teal-100/90 mt-1 max-w-xs mx-auto">
            Configurons votre profil pour un suivi personnalisé de votre budget
          </p>
        </div>

        {/* Scrollable Form Body */}
        <form
          onSubmit={handleSubmit}
          className="p-5 overflow-y-auto space-y-4 no-scrollbar"
        >
          {/* 1. Name */}
          <div>
            <label className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5 mb-1.5">
              <User size={14} className="text-teal-600 dark:text-teal-400" />
              <span>Quel est votre prénom ?</span>
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Sophie, Ludwig..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm font-semibold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:bg-white dark:focus:bg-slate-900"
            />
          </div>

          {/* 2. Choose Avatar */}
          <div>
            <label className="text-xs font-bold text-slate-800 dark:text-white flex items-center justify-between mb-2">
              <span className="flex items-center gap-1.5">
                <Sparkles size={14} className="text-teal-600 dark:text-teal-400" />
                <span>Choisissez votre photo de profil / avatar</span>
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">
                Non-humain
              </span>
            </label>

            {/* Avatars Carousel / Grid */}
            <div className="grid grid-cols-4 gap-2 p-1.5 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-100 dark:border-slate-800">
              {BUILT_IN_AVATARS.map((avatar) => {
                const isSelected = selectedAvatarUrl === avatar.svgDataUri;
                return (
                  <button
                    type="button"
                    key={avatar.id}
                    onClick={() => setSelectedAvatarUrl(avatar.svgDataUri)}
                    className={`relative p-1.5 rounded-xl flex flex-col items-center transition-all ${
                      isSelected
                        ? "bg-white dark:bg-slate-800 ring-2 ring-teal-600 shadow-xs"
                        : "hover:bg-white/60 dark:hover:bg-slate-800/60 opacity-80 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={avatar.svgDataUri}
                      alt={avatar.name}
                      className="w-11 h-11 rounded-full object-cover shadow-2xs"
                    />
                    <span className="text-[9px] font-bold text-slate-700 dark:text-slate-300 mt-1 line-clamp-1">
                      {avatar.name.split(" ")[0]}
                    </span>
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-teal-600 rounded-full flex items-center justify-center text-white shadow-2xs">
                        <Check size={10} className="stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Currency Selection */}
          <div>
            <label className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5 mb-1.5">
              <Wallet size={14} className="text-teal-600 dark:text-teal-400" />
              <span>Votre devise principale</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Franc CFA", value: "FCFA", symbol: "FCFA" },
                { label: "Euro", value: "€", symbol: "€" },
                { label: "Dollar", value: "$", symbol: "$" },
                { label: "Livre", value: "£", symbol: "£" },
                { label: "Franc Suisse", value: "CHF", symbol: "CHF" },
              ].map((cur) => (
                <button
                  type="button"
                  key={cur.value}
                  onClick={() => handleCurrencyChange(cur.value)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                    currency === cur.value
                      ? "border-teal-600 bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-200 ring-2 ring-teal-500/20"
                      : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60"
                  }`}
                >
                  <span className="block text-sm">{cur.symbol}</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                    {cur.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Monthly Budget Cap */}
          <div>
            <label className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5 mb-1.5">
              <ShieldCheck size={14} className="text-teal-600 dark:text-teal-400" />
              <span>Plafond de budget mensuel ({currency})</span>
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                required
                placeholder={currency === "FCFA" ? "500000" : "2000"}
                value={budgetCap}
                onChange={(e) =>
                  setBudgetCap(e.target.value.replace(/[^0-9]/g, ""))
                }
                className="w-full pl-3.5 pr-14 py-2.5 text-base font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:bg-white dark:focus:bg-slate-900 font-mono-numbers"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 dark:text-slate-500">
                {currency}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
              Vous pourrez modifier ce plafond et définir des budgets par
              catégorie à tout moment.
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full h-12 rounded-2xl bg-teal-700 hover:bg-teal-800 active:scale-[0.98] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-teal-800/20 transition-all"
            >
              <span>Démarrer avec Finanza</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
