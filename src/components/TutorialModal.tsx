import React, { useState } from "react";
import { useFinance } from "../context/FinanceContext";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X,
  CreditCard,
  PlusCircle,
  BarChart3,
  Target,
  Palette,
  Check,
  Zap,
} from "lucide-react";

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface StepItem {
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  badge: string;
  badgeColor: string;
  tips: string[];
}

export const TutorialModal: React.FC<TutorialModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user } = useFinance();
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps: StepItem[] = [
    {
      title: `Bienvenue, ${user.name} !`,
      subtitle: "Votre nouveau copilote financier personnel",
      description:
        "Finanza vous permet de garder le contrôle total de votre argent : enregistrez vos flux en quelques secondes, visualisez vos tendances et bâtissez votre épargne en toute sérénité.",
      badge: "Démarrage Rapide",
      badgeColor:
        "bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-300",
      icon: <Sparkles className="w-10 h-10 text-teal-500 animate-pulse" />,
      tips: [
        "Prise en charge complète du Franc CFA (FCFA), Euro, Dollar, Livre et Franc Suisse",
        "Calcul automatique et instantané du solde net",
        "Fonctionne 100% hors-ligne en préservant votre vie privée",
      ],
    },
    {
      title: "Accueil & Cartes Clés",
      subtitle: "Toutes vos finances résumées d’un coup d’œil",
      description:
        "La page d’accueil regroupe votre solde actuel calculé en direct, l’anneau de progression de vos dépenses mensuelles par rapport à votre plafond, ainsi que vos transactions récentes groupées par date.",
      badge: "Onglet Home",
      badgeColor:
        "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300",
      icon: <CreditCard className="w-10 h-10 text-emerald-500" />,
      tips: [
        "Consultez la courbe d’évolution sur la carte principale",
        "Cliquez sur n’importe quelle transaction pour ouvrir sa fiche détaillée",
        "Filtrez vos transactions par Entrées ou Sorties",
      ],
    },
    {
      title: "Ajout Rapide de Transactions",
      subtitle: "Bouton central (+) et libellés intelligents",
      description:
        "Cliquez sur le bouton vert (+) au centre de la barre de navigation pour ajouter une dépense ou un revenu. Choisissez une catégorie, saisissez le montant (sécurisé pour n’accepter que des chiffres) et gagnez du temps avec vos libellés favoris !",
      badge: "Action Rapide",
      badgeColor:
        "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/60 dark:text-cyan-300",
      icon: <PlusCircle className="w-10 h-10 text-cyan-500" />,
      tips: [
        "Sélectionnez un libellé en 1 clic (Café, Salaire, Monoprix...)",
        "Gérez et personnalisez vos libellés préférés grâce à l’icône d’engrenage",
        "Possibilité de joindre une note ou un mémo contextuel",
      ],
    },
    {
      title: "Analyses & Flux Interactifs",
      subtitle: "Répartition graphique et flux hebdomadaire au clic",
      description:
        "L’onglet Analytics vous offre un suivi précis : jauge de budget mensuel, diagramme circulaire sans chevauchement avec unité auto-ajustée, et graphique de flux hebdomadaire interactif.",
      badge: "Onglet Analytics",
      badgeColor:
        "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-300",
      icon: <BarChart3 className="w-10 h-10 text-indigo-500" />,
      tips: [
        "NOUVEAU : Cliquez sur les barres du flux hebdomadaire pour afficher instantanément le détail de la semaine",
        "Survolez ou touchez chaque tranche du camembert pour voir le montant de la catégorie",
        "Visualisez clairement vos entrées face à vos sorties",
      ],
    },
    {
      title: "Tirelires & Objectifs d’Épargne",
      subtitle: "Versez des montants libres ou prédéfinis",
      description:
        "Fixez des objectifs pour vos projets de vie (Voyage, Voiture, Imprévus...). Ajustez votre tirelire grâce aux versements rapides ou utilisez le versement personnalisé adapté aux smartphones.",
      badge: "Onglet Goals",
      badgeColor:
        "bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300",
      icon: <Target className="w-10 h-10 text-amber-500" />,
      tips: [
        "Boutons de versement rapide configurés selon votre devise",
        'Option "Montant personnalisé" optimisée sans débordement sur écran mobile',
        "Modifiez ou supprimez vos tirelires à tout moment",
      ],
    },
    {
      title: "Personnalisation & Multi-Profils",
      subtitle: "Mode sombre, couleurs d’accent et gestion .CSV",
      description:
        "Dans Profil & Réglages, basculez en Mode Sombre, choisissez votre couleur d’accentuation préférée, gérez plusieurs profils (Personnel, Pro, Famille), et exportez ou réimportez vos données au format .CSV !",
      badge: "Profil & Style",
      badgeColor:
        "bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300",
      icon: <Palette className="w-10 h-10 text-rose-500" />,
      tips: [
        "Créez et passez d’un profil à l’autre en 1 clic",
        "6 nuances d’accentuation : Émeraude, Indigo, Violet, Rose, Ambre, Bleu",
        "Astuce secrète : touchez 3 fois le titre Profil pour afficher le mode cadre smartphone",
      ],
    },
  ];

  const current = steps[currentStep];
  const isLast = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLast) {
      onClose();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${current.badgeColor}`}
            >
              {current.badge}
            </span>
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
              Étape {currentStep + 1}/{steps.length}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors"
            title="Passer le tutoriel"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 no-scrollbar">
          {/* Icon Hero */}
          <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 flex items-center justify-center mx-auto shadow-2xs">
            {current.icon}
          </div>

          <div className="text-center space-y-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              {current.title}
            </h3>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {current.subtitle}
            </p>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed text-center px-1">
            {current.description}
          </p>

          {/* Bullet points */}
          <div className="bg-slate-50 dark:bg-slate-850 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Zap size={13} className="text-amber-500 fill-amber-500" />
              Ce que vous devez savoir :
            </span>
            <div className="space-y-1.5">
              {current.tips.map((tip, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 text-[11px] text-slate-600 dark:text-slate-400 leading-snug"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 mt-1.5" />
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col gap-3">
          {/* Dots Indicator */}
          <div className="flex items-center justify-center gap-1.5">
            {steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  currentStep === idx
                    ? "w-6 bg-accent"
                    : "w-1.5 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400"
                }`}
                title={`Aller à l'étape ${idx + 1}`}
              />
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {currentStep > 0 ? (
              <button
                onClick={handlePrev}
                className="py-2.5 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1 transition-colors"
              >
                <ArrowLeft size={14} />
                <span>Précédent</span>
              </button>
            ) : (
              <button
                onClick={onClose}
                className="py-2.5 px-3 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-xs font-semibold transition-colors"
              >
                Passer
              </button>
            )}

            <button
              onClick={handleNext}
              className="flex-1 py-2.5 px-4 rounded-xl bg-accent hover:opacity-95 active:scale-98 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-accent"
            >
              {isLast ? (
                <>
                  <Check size={15} />
                  <span>C'est parti ! Explorer l'app</span>
                </>
              ) : (
                <>
                  <span>Suivant</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
