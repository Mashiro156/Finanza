import React, { useState, useRef, useEffect } from "react";
import { useFinance } from "../context/FinanceContext";
import { BUILT_IN_AVATARS } from "../data/avatars";
import { UserProfile, AccentColor } from "../types/finance";
import {
  User,
  Download,
  Upload,
  RotateCcw,
  Smartphone,
  Monitor,
  Check,
  Camera,
  AlertTriangle,
  X,
  Sparkles,
  Sun,
  Moon,
  Palette,
  Users,
  Plus,
  Trash2,
  ExternalLink,
  Github,
  HelpCircle,
  Unlock,
  Flame,
  Info,
  Compass,
} from "lucide-react";

export const ProfileView: React.FC = () => {
  const {
    user,
    updateUser,
    transactions,
    resetToDemoData,
    clearAllUserData,
    viewMode,
    setViewMode,
    setIsAvatarModalOpen,
    setIsOnboardingOpen,
    setIsTutorialOpen,
    startTour,
    themeMode,
    toggleThemeMode,
    accentColor,
    setAccentColor,
    profiles,
    activeProfileId,
    addProfile,
    switchProfile,
    deleteProfile,
    importTransactionsFromCSV,
    formatCurrency,
  } = useFinance();

  const [name, setName] = useState(user.name);
  const [budgetCap, setBudgetCap] = useState(user.monthlyBudgetCap.toString());
  const [currency, setCurrency] = useState(user.currency);
  const [isSaved, setIsSaved] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetFeedback, setResetFeedback] = useState(false);

  // Clear all user data modal & feedback
  const [showClearAllConfirm, setShowClearAllConfirm] = useState(false);
  const [clearAllFeedback, setClearAllFeedback] = useState(false);

  // Profile deletion confirmation state
  const [profileToDelete, setProfileToDelete] = useState<UserProfile | null>(null);

  // Easter egg: Triple click on title to unlock display mode card
  const [titleClickCount, setTitleClickCount] = useState(0);
  const [showUnlockToast, setShowUnlockToast] = useState(false);
  const isDisplayModeUnlocked = titleClickCount >= 3;

  // CSV Import feedback
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [importFeedback, setImportFeedback] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  // New Profile Modal state
  const [isAddProfileModalOpen, setIsAddProfileModalOpen] = useState(false);
  const [newProfileName, setNewProfileName] = useState("");
  const [newProfileCurrency, setNewProfileCurrency] = useState("FCFA");
  const [newProfileBudget, setNewProfileBudget] = useState("500000");
  const [newProfileAvatar, setNewProfileAvatar] = useState(
    BUILT_IN_AVATARS[0].svgDataUri,
  );

  // Sync inputs when user changes
  useEffect(() => {
    setName(user.name);
    setBudgetCap(user.monthlyBudgetCap.toString());
    setCurrency(user.currency);
  }, [user]);

  const handleTitleClick = () => {
    setTitleClickCount((prev) => {
      const next = prev + 1;
      if (next === 3) {
        setShowUnlockToast(true);
        setTimeout(() => setShowUnlockToast(false), 3500);
      }
      return next;
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cap = parseFloat(budgetCap);
    updateUser({
      name: name.trim() || "Sophie",
      currency,
      monthlyBudgetCap: isNaN(cap) || cap <= 0 ? 2000 : cap,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleConfirmReset = () => {
    resetToDemoData();
    setName("Sophie");
    setCurrency("€");
    setBudgetCap("2000");
    setShowResetConfirm(false);
    setResetFeedback(true);
    setTimeout(() => setResetFeedback(false), 2500);
  };

  const handleConfirmClearAll = () => {
    clearAllUserData();
    setShowClearAllConfirm(false);
    setClearAllFeedback(true);
    setTimeout(() => setClearAllFeedback(false), 3000);
  };

  const handleExportCSV = () => {
    const headers = "ID,Titre,Montant,Type,Categorie,Date,Heure,Note\n";
    const rows = transactions
      .map(
        (t) =>
          `"${t.id}","${t.title.replace(/"/g, '""')}",${t.amount},"${t.type}","${t.categoryId}","${t.date}","${t.time || ""}","${(t.note || "").replace(/"/g, '""')}"`,
      )
      .join("\n");
    const blob = new Blob([headers + rows], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `finanza-${user.name.toLowerCase()}-transactions-${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportCSVFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (!content) {
        setImportFeedback({
          success: false,
          message: "Impossible de lire le contenu du fichier sélectionné.",
        });
        return;
      }
      const res = importTransactionsFromCSV(content);
      if (res.success) {
        setImportFeedback({
          success: true,
          message: `${res.count} transactions importées avec succès pour ${user.name} !`,
        });
      } else {
        setImportFeedback({
          success: false,
          message: res.error || "Échec de l'importation.",
        });
      }
      setTimeout(() => setImportFeedback(null), 4000);
    };
    reader.onerror = () => {
      setImportFeedback({
        success: false,
        message: "Erreur lors de la lecture du fichier.",
      });
      setTimeout(() => setImportFeedback(null), 4000);
    };
    reader.readAsText(file);
    // Reset file input value so re-importing the same file works
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileName.trim()) return;
    const capNum = parseFloat(newProfileBudget.replace(/[^0-9.]/g, ""));
    const finalCap =
      isNaN(capNum) || capNum <= 0
        ? newProfileCurrency === "FCFA"
          ? 500000
          : 2000
        : capNum;

    addProfile({
      name: newProfileName.trim(),
      currency: newProfileCurrency,
      avatarUrl: newProfileAvatar,
      monthlyBudgetCap: finalCap,
    });

    setNewProfileName("");
    setIsAddProfileModalOpen(false);
  };

  const accentOptions: { id: AccentColor; name: string; hex: string }[] = [
    { id: "teal", name: "Émeraude", hex: "#0d9488" },
    { id: "indigo", name: "Indigo", hex: "#4f46e5" },
    { id: "violet", name: "Violet", hex: "#7c3aed" },
    { id: "rose", name: "Rose", hex: "#e11d48" },
    { id: "amber", name: "Ambre", hex: "#d97706" },
    { id: "blue", name: "Bleu Azur", hex: "#0284c7" },
  ];

  return (
    <div className="space-y-4 pb-24 pt-1 animate-in fade-in duration-200">
      {/* Title with secret triple-click detection */}
      <div className="px-1 select-none">
        <div
          onClick={handleTitleClick}
          className="cursor-pointer group flex items-center justify-between"
          title="Cliquez 3 fois pour déverrouiller le mode d'affichage"
        >
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <span>Profil & Réglages</span>
              {isDisplayModeUnlocked && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent-light text-accent-themed flex items-center gap-1 animate-in fade-in border border-accent">
                  <Unlock size={10} /> Déverrouillé
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              Personnalisez votre compte, gérez vos profils et vos préférences
            </p>
          </div>

          {/* Discreet (i) button to relaunch profile tour */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              startTour("profile");
            }}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-accent-light text-slate-600 dark:text-slate-300 hover:text-accent-themed flex items-center justify-center transition-all border border-slate-200/60 dark:border-slate-700 shadow-2xs active:scale-95 cursor-pointer shrink-0"
            title="Lancer le guide interactif du Profil"
            aria-label="Lancer le guide interactif"
          >
            <Info size={15} />
          </button>
        </div>
      </div>

      {/* Unlock Toast Notification */}
      {showUnlockToast && (
        <div className="p-3 bg-accent-light text-accent-themed rounded-2xl border border-accent text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <Sparkles size={16} className="text-accent animate-spin" />
          <span>
            Mode d'affichage de l'application déverrouillé avec succès !
          </span>
        </div>
      )}

      {/* User Card with Photo Change Trigger */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-2xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-3.5 min-w-0">
          <button
            onClick={() => setIsAvatarModalOpen(true)}
            className="relative group shrink-0 rounded-full focus:outline-none"
            title="Changer la photo de profil"
          >
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-16 h-16 rounded-full object-cover ring-4 ring-slate-100 dark:ring-slate-800 group-hover:ring-accent transition-all bg-white"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-0 right-0 w-5 h-5 bg-accent text-white border-2 border-white dark:border-slate-900 rounded-full flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform">
              <Camera size={10} className="stroke-[2.5]" />
            </div>
          </button>
          <div className="min-w-0">
            <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
              {user.name}
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium truncate">
              Profil actif · {transactions.length} transaction{transactions.length > 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAvatarModalOpen(true)}
          className="shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold bg-accent-light hover:opacity-90 text-accent-themed transition-all border border-accent"
        >
          Changer la photo
        </button>
      </div>

      {/* MULTI-PROFILES MANAGEMENT SECTION */}
      <div
        data-tour="profile-multiprofiles"
        className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-2xs space-y-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-accent" />
            <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">
              Mes Profils ({profiles.length})
            </h4>
          </div>
          <button
            onClick={() => setIsAddProfileModalOpen(true)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold bg-accent-light text-accent-themed hover:opacity-90 transition-all border border-accent"
          >
            <Plus size={13} />
            <span>Nouveau profil</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {profiles.map((p) => {
            const isActive = p.id === activeProfileId;
            return (
              <div
                key={p.id}
                onClick={() => switchProfile(p.id)}
                className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                  isActive
                    ? "border-accent bg-accent-light/50 ring-2 ring-accent/30 text-slate-900 dark:text-white"
                    : "border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/60 hover:border-slate-200 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={p.avatarUrl}
                    alt={p.name}
                    className="w-9 h-9 rounded-full object-cover shrink-0 bg-white shadow-2xs"
                  />
                  <div className="min-w-0">
                    <span className="text-xs font-bold block truncate">
                      {p.name}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 block truncate">
                      {p.currency} · Plafond {p.monthlyBudgetCap}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {isActive && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent text-white shadow-2xs">
                      Actif
                    </span>
                  )}
                  {profiles.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setProfileToDelete(p);
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                      title={`Supprimer le profil « ${p.name} »`}
                      aria-label={`Supprimer le profil ${p.name}`}
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* APPEARANCE & CUSTOMIZATION (DARK MODE & ACCENT COLORS) */}
      <div
        data-tour="profile-appearance"
        className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-2xs space-y-3.5"
      >
        <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <Palette size={15} className="text-accent" />
          Apparence & Personnalisation
        </h4>

        {/* Dark Mode Switch */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700/80 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-amber-400">
              {themeMode === "dark" ? <Moon size={16} /> : <Sun size={16} />}
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Mode Sombre
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                {themeMode === "dark"
                  ? "Interface sombre activée"
                  : "Interface claire activée"}
              </span>
            </div>
          </div>

          <button
            onClick={toggleThemeMode}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
              themeMode === "dark" ? "bg-accent" : "bg-slate-300 dark:bg-slate-700"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white dark:bg-slate-100 shadow-xs transition-transform ${
                themeMode === "dark" ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Accent Colors Picker */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
            Couleur d'accentuation de l'application
          </span>
          <div className="grid grid-cols-6 gap-2">
            {accentOptions.map((opt) => {
              const isCurrent = accentColor === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setAccentColor(opt.id)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all border ${
                    isCurrent
                      ? "border-slate-900 dark:border-white bg-slate-100 dark:bg-slate-800 scale-105"
                      : "border-transparent hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                  title={opt.name}
                >
                  <div
                    className="w-6 h-6 rounded-full shadow-2xs flex items-center justify-center text-white"
                    style={{ backgroundColor: opt.hex }}
                  >
                    {isCurrent && <Check size={12} className="stroke-[3]" />}
                  </div>
                  <span className="text-[9px] font-medium text-slate-600 dark:text-slate-400 truncate w-full text-center">
                    {opt.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* MODE VIEW SWITCHER - HIDDEN UNTIL 3 CLICKS ON TITLE */}
      {isDisplayModeUnlocked && (
        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-accent shadow-2xs space-y-2.5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-white block">
              Mode d'affichage de l'application
            </span>
            <span className="text-[10px] text-accent font-bold">
              Option avancée
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setViewMode("mockup")}
              className={`flex items-center gap-2 p-2.5 rounded-2xl border text-left transition-all ${
                viewMode === "mockup"
                  ? "border-accent bg-accent-light text-accent-themed ring-2 ring-accent/20"
                  : "border-slate-100 dark:border-slate-800 hover:border-slate-200 text-slate-600 dark:text-slate-400"
              }`}
            >
              <Smartphone
                size={18}
                className={
                  viewMode === "mockup"
                    ? "text-accent"
                    : "text-slate-400 dark:text-slate-500"
                }
              />
              <div>
                <span className="text-xs font-bold block">
                  Cadre Smartphone
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block">
                  Format maquette
                </span>
              </div>
            </button>

            <button
              onClick={() => setViewMode("full")}
              className={`flex items-center gap-2 p-2.5 rounded-2xl border text-left transition-all ${
                viewMode === "full"
                  ? "border-accent bg-accent-light text-accent-themed ring-2 ring-accent/20"
                  : "border-slate-100 dark:border-slate-800 hover:border-slate-200 text-slate-600 dark:text-slate-400"
              }`}
            >
              <Monitor
                size={18}
                className={
                  viewMode === "full"
                    ? "text-accent"
                    : "text-slate-400 dark:text-slate-500"
                }
              />
              <div>
                <span className="text-xs font-bold block">Plein Écran</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block">
                  Largeur fluide
                </span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Settings Form */}
      <form
        data-tour="profile-preferences"
        onSubmit={handleSave}
        className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-2xs space-y-3.5"
      >
        <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">
          Préférences de {user.name}
        </h4>

        <div>
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
            Prénom affiché
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
              Devise
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-3 py-2 text-xs font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="FCFA">Franc CFA (FCFA)</option>
              <option value="€">Euro (€)</option>
              <option value="$">Dollar ($)</option>
              <option value="£">Livre Sterling (£)</option>
              <option value="CHF">Franc Suisse (CHF)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
              Plafond Budget Mensuel
            </label>
            <input
              type="number"
              value={budgetCap}
              onChange={(e) => setBudgetCap(e.target.value)}
              className="w-full px-3 py-2 text-xs font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-accent font-mono-numbers"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 rounded-xl bg-accent hover:opacity-95 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
        >
          {isSaved ? (
            <>
              <Check size={14} /> Préférences enregistrées
            </>
          ) : (
            "Enregistrer les préférences"
          )}
        </button>

        {profiles.length > 1 && (
          <button
            type="button"
            onClick={() => setProfileToDelete(user)}
            className="w-full py-2 px-3 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200/60 dark:border-rose-900/60 transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-1"
          >
            <Trash2 size={13} />
            <span>Supprimer ce profil ({user.name})</span>
          </button>
        )}
      </form>

      {/* Data Management & CSV Export/Import */}
      <div
        data-tour="profile-data-mgmt"
        className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-2xs space-y-2"
      >
        <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-2">
          Gestion des Données
        </h4>

        {resetFeedback && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <Check size={15} className="text-emerald-600" />
            <span>
              Données réinitialisées avec succès aux valeurs de démonstration !
            </span>
          </div>
        )}

        {clearAllFeedback && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <Check size={15} className="text-emerald-600" />
            <span>
              Toutes les données et transactions ont été supprimées avec succès.
            </span>
          </div>
        )}

        {importFeedback && (
          <div
            className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in ${
              importFeedback.success
                ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800"
                : "bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-800"
            }`}
          >
            {importFeedback.success ? (
              <Check size={15} className="text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle size={15} className="text-rose-600 shrink-0" />
            )}
            <span>{importFeedback.message}</span>
          </div>
        )}

        {/* Hidden CSV file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,text/csv,text/plain"
          className="hidden"
          onChange={handleImportCSVFile}
        />

        {/* Spotlight Tour Replay Button */}
        <button
          onClick={() => startTour("profile")}
          className="w-full py-2.5 px-3 rounded-xl bg-accent-light text-accent-themed text-xs font-semibold flex items-center justify-between transition-colors border border-accent hover:opacity-90 cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Compass size={14} className="text-accent" />
            Lancer le guide interactif de cette page
          </span>
          <span className="text-[10px] font-bold">
            Démarrer
          </span>
        </button>

        {/* Re-run Onboarding */}
        <button
          onClick={() => setIsOnboardingOpen(true)}
          className="w-full py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center justify-between transition-colors"
        >
          <span className="flex items-center gap-2">
            <Sparkles size={14} className="text-amber-500" />
            Relancer l'assistant de bienvenue
          </span>
          <span className="text-[10px] text-slate-400">Modifier</span>
        </button>

        {/* Import CSV - SWAPPED ICON: Now uses Download icon */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center justify-between transition-colors"
        >
          <span className="flex items-center gap-2">
            <Download size={14} className="text-accent" />
            Importer des transactions (.CSV)
          </span>
          <span className="text-[10px] text-slate-400">Restaurer</span>
        </button>

        {/* Export CSV - SWAPPED ICON: Now uses Upload icon */}
        <button
          onClick={handleExportCSV}
          className="w-full py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center justify-between transition-colors"
        >
          <span className="flex items-center gap-2">
            <Upload size={14} className="text-slate-400" />
            Exporter mes transactions (.CSV)
          </span>
          <span className="text-[10px] text-slate-400">Tableur / Excel</span>
        </button>

        {/* DELETE ALL USER DATA BUTTON */}
        <button
          onClick={() => setShowClearAllConfirm(true)}
          className="w-full py-2.5 px-3 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-950/60 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center justify-between transition-colors border border-rose-200/50 dark:border-rose-900/50"
        >
          <span className="flex items-center gap-2">
            <Trash2 size={14} className="text-rose-500" />
            Supprimer toutes les données et transactions
          </span>
          <span className="text-[10px] text-rose-500 font-bold">Effacer tout</span>
        </button>

        {/* Reset to Demo Data */}
        <button
          onClick={() => setShowResetConfirm(true)}
          className="w-full py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs font-semibold flex items-center justify-between transition-colors"
        >
          <span className="flex items-center gap-2">
            <RotateCcw size={14} className="text-slate-400" />
            Réinitialiser aux données initiales
          </span>
          <span className="text-[10px] text-slate-400">Par défaut</span>
        </button>
      </div>

      {/* DISCREET GITHUB AUTHOR LINK */}
      <div className="pt-2 pb-1 text-center select-none">
        <a
          href="https://github.com/Mashiro156"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors py-1 px-3 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Github size={13} />
          <span>Développé par Mashiro156</span>
          <ExternalLink size={10} className="opacity-60" />
        </a>
      </div>

      {/* In-App Confirmation Modal for Clear All User Data */}
      {showClearAllConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 flex items-center justify-center">
                <Trash2 size={20} />
              </div>
              <button
                onClick={() => setShowClearAllConfirm(false)}
                className="w-7 h-7 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center"
              >
                <X size={16} />
              </button>
            </div>

            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Supprimer toutes vos données ?
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Cette action effacera l'ensemble de vos transactions et objectifs pour le profil{" "}
                <span className="font-bold text-slate-700 dark:text-slate-200">{user.name}</span>. Votre solde repartira de zéro.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setShowClearAllConfirm(false)}
                className="py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmClearAll}
                className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors shadow-sm"
              >
                Oui, tout supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* In-App Confirmation Modal for Reset Demo */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center">
                <AlertTriangle size={20} />
              </div>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="w-7 h-7 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center"
              >
                <X size={16} />
              </button>
            </div>

            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Réinitialiser aux données démo ?
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Cette action rétablira le solde initial, les transactions par
                défaut et les réglages de démonstration de Sophie.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmReset}
                className="py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors shadow-sm"
              >
                Oui, réinitialiser
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE NEW PROFILE MODAL */}
      {isAddProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users size={18} className="text-accent" />
                <span>Nouveau Profil</span>
              </h3>
              <button
                onClick={() => setIsAddProfileModalOpen(false)}
                className="w-7 h-7 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateProfile} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                  Nom du profil (ex: Professionnel, Épargne...)
                </label>
                <input
                  type="text"
                  autoFocus
                  required
                  placeholder="Ex: Personnel / Pro"
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-accent font-medium"
                />
              </div>

              {/* Choose avatar */}
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                  Avatar du profil
                </label>
                <div className="grid grid-cols-5 gap-2 max-h-32 overflow-y-auto p-1 bg-slate-50 dark:bg-slate-800 rounded-xl no-scrollbar">
                  {BUILT_IN_AVATARS.map((av) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => setNewProfileAvatar(av.svgDataUri)}
                      className={`p-1 rounded-xl transition-all ${
                        newProfileAvatar === av.svgDataUri
                          ? "ring-2 ring-accent bg-white dark:bg-slate-800 shadow-2xs scale-105"
                          : "opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={av.svgDataUri}
                        alt={av.name}
                        className="w-8 h-8 rounded-full"
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                    Devise
                  </label>
                  <select
                    value={newProfileCurrency}
                    onChange={(e) => {
                      setNewProfileCurrency(e.target.value);
                      if (e.target.value === "FCFA") {
                        setNewProfileBudget("500000");
                      } else if (newProfileBudget === "500000") {
                        setNewProfileBudget("2000");
                      }
                    }}
                    className="w-full px-2.5 py-2 text-xs font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="FCFA">FCFA</option>
                    <option value="€">Euro (€)</option>
                    <option value="$">Dollar ($)</option>
                    <option value="£">Livre (£)</option>
                    <option value="CHF">CHF</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                    Plafond Budget
                  </label>
                  <input
                    type="number"
                    value={newProfileBudget}
                    onChange={(e) => setNewProfileBudget(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-accent font-mono-numbers"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddProfileModalOpen(false)}
                  className="py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="py-2.5 rounded-xl bg-accent hover:opacity-95 text-white text-xs font-bold transition-colors shadow-2xs"
                >
                  Créer et activer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL FOR DELETING A PROFILE */}
      {profileToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 flex items-center justify-center">
                <Trash2 size={20} />
              </div>
              <button
                onClick={() => setProfileToDelete(null)}
                className="w-7 h-7 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center"
              >
                <X size={16} />
              </button>
            </div>

            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Supprimer le profil « {profileToDelete.name} » ?
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Êtes-vous sûr de vouloir supprimer définitivement ce profil ? Toutes les transactions, objectifs et réglages associés seront effacés.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setProfileToDelete(null)}
                className="py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteProfile(profileToDelete.id);
                  setProfileToDelete(null);
                }}
                className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors shadow-sm"
              >
                Supprimer le profil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
