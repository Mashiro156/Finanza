import React, { useState } from "react";
import { usePWAInstall } from "../hooks/usePWAInstall";
import { Download, Share, PlusSquare, X, Check, Smartphone } from "lucide-react";

interface PWAInstallButtonProps {
  variant?: "button" | "card" | "compact";
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = "button",
  className = "",
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [hasInstalledSuccess, setHasInstalledSuccess] = useState(false);

  // If already running as an installed PWA on device, hide button
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) {
        setHasInstalledSuccess(true);
        setTimeout(() => setHasInstalledSuccess(false), 4000);
      }
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      // Browser doesn't trigger prompt yet or running in preview iframe
      setShowIOSModal(true);
    }
  };

  // Compact icon button (ideal for header)
  if (variant === "compact") {
    return (
      <>
        <button
          onClick={handleInstallClick}
          className={`relative group inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-accent-light text-accent hover:opacity-90 active:scale-95 border border-accent/40 shadow-2xs transition-all text-xs font-bold cursor-pointer ${className}`}
          title="Installer Finanza sur votre appareil (PWA)"
          aria-label="Installer l'application"
        >
          <Download size={14} className="stroke-[2.5]" />
          <span className="hidden xs:inline">Installer</span>
        </button>

        {showIOSModal && (
          <IOSInstallModal onClose={() => setShowIOSModal(false)} />
        )}
      </>
    );
  }

  // Card view (ideal for Profile / Settings)
  if (variant === "card") {
    return (
      <>
        <div
          onClick={handleInstallClick}
          className={`p-3.5 rounded-2xl bg-gradient-to-r from-sky-500/10 via-accent-light/50 to-transparent border border-accent/30 dark:border-accent/40 flex items-center justify-between gap-3 cursor-pointer hover:bg-accent-light/70 transition-all ${className}`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-accent text-white flex items-center justify-center shrink-0 shadow-md shadow-accent/20">
              <Download size={20} className="stroke-[2.3]" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>Installer Finanza</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-accent text-white font-semibold">
                  PWA
                </span>
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                Accès direct hors-ligne depuis votre écran d’accueil
              </p>
            </div>
          </div>

          <button
            type="button"
            className="px-3 py-1.5 rounded-xl bg-accent hover:opacity-95 text-white text-xs font-bold shrink-0 shadow-xs"
          >
            {hasInstalledSuccess ? (
              <span className="flex items-center gap-1">
                <Check size={14} /> Installé
              </span>
            ) : (
              "Installer"
            )}
          </button>
        </div>

        {showIOSModal && (
          <IOSInstallModal onClose={() => setShowIOSModal(false)} />
        )}
      </>
    );
  }

  // Standard Button variant
  return (
    <>
      <button
        onClick={handleInstallClick}
        className={`inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-accent hover:opacity-95 active:scale-95 text-white text-xs font-bold shadow-md shadow-accent/20 transition-all cursor-pointer ${className}`}
        title="Installer Finanza sur votre téléphone ou ordinateur"
      >
        <Download size={15} className="stroke-[2.5]" />
        <span>Installer l'application</span>
      </button>

      {showIOSModal && (
        <IOSInstallModal onClose={() => setShowIOSModal(false)} />
      )}
    </>
  );
};

// Friendly step-by-step modal for iOS Safari and other browsers
const IOSInstallModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-4 animate-in zoom-in-95 duration-150"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-accent-light text-accent flex items-center justify-center shrink-0">
              <Smartphone size={20} className="stroke-[2.3]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Installer Finanza
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Ajouter à l'écran d'accueil
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-xs">
          <div className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-accent text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
              1
            </span>
            <p className="text-slate-700 dark:text-slate-200 leading-snug">
              Appuyez sur le bouton <strong>Partager</strong>{" "}
              <Share size={13} className="inline mx-0.5 text-accent" /> dans la barre de votre navigateur (Safari / Chrome).
            </p>
          </div>

          <div className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-accent text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
              2
            </span>
            <p className="text-slate-700 dark:text-slate-200 leading-snug">
              Faites défiler puis touchez <strong>« Sur l'écran d'accueil »</strong>{" "}
              <PlusSquare size={13} className="inline mx-0.5 text-accent" />.
            </p>
          </div>

          <div className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-accent text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
              3
            </span>
            <p className="text-slate-700 dark:text-slate-200 leading-snug">
              Confirmez en cliquant sur <strong>Ajouter</strong> en haut à droite. L'icône Finanza apparaît sur votre écran !
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-accent text-white text-xs font-bold hover:opacity-95 transition-all cursor-pointer"
        >
          J'ai compris
        </button>
      </div>
    </div>
  );
};
