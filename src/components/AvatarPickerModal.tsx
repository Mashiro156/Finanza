import React, { useState } from "react";
import { useFinance } from "../context/FinanceContext";
import { BUILT_IN_AVATARS, BuiltInAvatar } from "../data/avatars";
import { X, Check, Sparkles, Upload, Palette, Shield } from "lucide-react";

interface AvatarPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AvatarPickerModal: React.FC<AvatarPickerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user, updateUser } = useFinance();
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState(user.avatarUrl);

  if (!isOpen) return null;

  const handleSelectAvatar = (url: string) => {
    setSelectedAvatarUrl(url);
    updateUser({ avatarUrl: url });
  };

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          handleSelectAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Generate minimalist monogram
  const generateMonogram = (letter: string, color1: string, color2: string) => {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <defs>
          <linearGradient id="monoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${color1}"/>
            <stop offset="100%" stop-color="${color2}"/>
          </linearGradient>
        </defs>
        <rect width="100" height="100" rx="50" fill="url(#monoGrad)"/>
        <text x="50" y="62" font-family="system-ui, sans-serif" font-size="44" font-weight="bold" fill="#ffffff" text-anchor="middle">${letter}</text>
      </svg>
    `;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  };

  const initialLetter = (user.name || "S").charAt(0).toUpperCase();

  const monogramOptions = [
    {
      name: "Teal Minimal",
      url: generateMonogram(initialLetter, "#0d9488", "#115e59"),
    },
    {
      name: "Violet Neon",
      url: generateMonogram(initialLetter, "#8b5cf6", "#4c1d95"),
    },
    {
      name: "Orange Sunset",
      url: generateMonogram(initialLetter, "#f97316", "#9a3412"),
    },
    {
      name: "Emerald Pure",
      url: generateMonogram(initialLetter, "#10b981", "#064e3b"),
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-[28px] sm:rounded-[28px] shadow-2xl border border-slate-100 dark:border-slate-800 max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-teal-500" />
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Choisir une photo de profil
              </h3>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                Avatars graphiques et emblèmes abstraits (non-humains)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Current Preview */}
        <div className="p-4 bg-slate-50/70 dark:bg-slate-850 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={selectedAvatarUrl}
                alt="Avatar sélectionné"
                className="w-14 h-14 rounded-full object-cover ring-2 ring-teal-500 shadow-sm bg-white"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-teal-500 text-white rounded-full flex items-center justify-center">
                <Check size={10} className="stroke-[3]" />
              </div>
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-white block">
                Avatar Actuel
              </span>
              <span className="text-[11px] text-teal-700 dark:text-teal-300 font-semibold block">
                Actif sur tout le tableau de bord
              </span>
            </div>
          </div>

          <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 shadow-2xs transition-colors">
            <Upload size={13} />
            <span>Importer une image</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleCustomUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Body Grid */}
        <div className="p-5 overflow-y-auto space-y-5 no-scrollbar">
          {/* Section 1: Non-human Built-in Avatars */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={14} className="text-teal-600 dark:text-teal-400" />
                Emblèmes Graphiques & 3D
              </span>
              <span className="text-[11px] text-slate-400 dark:text-slate-500">
                {BUILT_IN_AVATARS.length} modèles intégrés
              </span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-4 gap-3">
              {BUILT_IN_AVATARS.map((avatar) => {
                const isSelected = selectedAvatarUrl === avatar.svgDataUri;
                return (
                  <button
                    key={avatar.id}
                    onClick={() => handleSelectAvatar(avatar.svgDataUri)}
                    className={`group relative flex flex-col items-center p-2 rounded-2xl border transition-all text-center ${
                      isSelected
                        ? "border-teal-600 bg-teal-50/60 dark:bg-teal-950/40 ring-2 ring-teal-500/30 shadow-xs"
                        : "border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 bg-white dark:bg-slate-800 hover:shadow-2xs"
                    }`}
                  >
                    <div className="relative w-14 h-14 rounded-full overflow-hidden transition-transform group-hover:scale-105">
                      <img
                        src={avatar.svgDataUri}
                        alt={avatar.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 mt-2 line-clamp-1">
                      {avatar.name}
                    </span>
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 line-clamp-1">
                      {avatar.category}
                    </span>
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-teal-600 rounded-full flex items-center justify-center text-white">
                        <Check size={10} className="stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Monogram Minimalists */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Palette size={14} className="text-purple-600 dark:text-purple-400" />
                Monogrammes Minimalistes ({initialLetter})
              </span>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {monogramOptions.map((mono, idx) => {
                const isSelected = selectedAvatarUrl === mono.url;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectAvatar(mono.url)}
                    className={`group relative flex flex-col items-center p-2 rounded-2xl border transition-all text-center ${
                      isSelected
                        ? "border-teal-600 bg-teal-50/60 dark:bg-teal-950/40 ring-2 ring-teal-500/30 shadow-xs"
                        : "border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 bg-white dark:bg-slate-800 hover:shadow-2xs"
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden shadow-2xs transition-transform group-hover:scale-105">
                      <img
                        src={mono.url}
                        alt={mono.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 mt-1.5 truncate w-full">
                      {mono.name}
                    </span>
                    {isSelected && (
                      <div className="absolute top-1 right-1 w-4 h-4 bg-teal-600 rounded-full flex items-center justify-center text-white">
                        <Check size={10} className="stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2 bg-white dark:bg-slate-900">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
          >
            <Check size={15} />
            Confirmer et fermer
          </button>
        </div>
      </div>
    </div>
  );
};
