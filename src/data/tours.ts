import { TabType } from "../types/finance";

export interface TourStep {
  targetId: string; // matches data-tour attribute
  title: string;
  description: string;
  badge?: string;
}

export interface PageTour {
  page: TabType;
  pageName: string;
  steps: TourStep[];
}

export const TOURS_CONFIG: Record<TabType, PageTour> = {
  home: {
    page: "home",
    pageName: "Accueil",
    steps: [
      {
        targetId: "home-balance",
        badge: "Vue d'ensemble",
        title: "Solde Total & Évolution",
        description:
          "Consultez votre trésorerie globale consolidée en temps réel. La courbe dynamique illustre l'évolution récente de votre solde net.",
      },
      {
        targetId: "home-metrics",
        badge: "Indicateurs Clés",
        title: "Dépenses du Mois & Budgets",
        description:
          "Gardez un œil sur le montant dépensé par rapport à votre moyenne habituelle, ainsi que le nombre de budgets actuellement actifs.",
      },
      {
        targetId: "home-add-btn",
        badge: "Action Principale",
        title: "Bouton d'Ajout Rapide (+)",
        description:
          "Enregistrez instantanément une nouvelle dépense ou un nouveau revenu en appuyant sur ce bouton central. Choisissez un montant, une catégorie et un libellé rapide en un geste !",
      },
      {
        targetId: "home-recent",
        badge: "Historique",
        title: "Dernières Transactions",
        description:
          "Parcourez vos opérations récentes classées par date. Filtrez par entrées ou sorties et touchez une ligne pour consulter ses détails ou la modifier.",
      },
    ],
  },
  analytics: {
    page: "analytics",
    pageName: "Analyses & Budget",
    steps: [
      {
        targetId: "analytics-overview",
        badge: "Synthèse",
        title: "Synthèse Mensuelle des Flux",
        description:
          "Visualisez d'un coup d'œil vos revenus totaux (Entrées), vos dépenses cumulées (Sorties) et l'épargne nette dégagée sur le mois.",
      },
      {
        targetId: "analytics-gauge",
        badge: "Plafond Global",
        title: "Consommation du Budget Global",
        description:
          "Suivez en direct le pourcentage consommé de votre plafond mensuel et découvrez le montant restant disponible avant dépassement.",
      },
      {
        targetId: "analytics-donut",
        badge: "Répartition",
        title: "Répartition par Catégorie",
        description:
          "Analysez précisément où va votre argent grâce au diagramme circulaire interactif. Touchez un secteur pour isoler une catégorie spécifique.",
      },
      {
        targetId: "analytics-weekly",
        badge: "Trésorerie",
        title: "Flux Hebdomadaires Comparés",
        description:
          "Comparez vos entrées et sorties semaine par semaine. Touchez une colonne pour afficher le détail chiffré de cette période.",
      },
    ],
  },
  goals: {
    page: "goals",
    pageName: "Budgets & Objectifs",
    steps: [
      {
        targetId: "goals-subtabs",
        badge: "Navigation",
        title: "Deux Espaces Complémentaires",
        description:
          "Basculez facilement entre le contrôle de vos plafonds de dépenses mensuels et le suivi de vos cagnottes d'épargne.",
      },
      {
        targetId: "goals-budgets-list",
        badge: "Plafonds",
        title: "Plafonds par Catégorie",
        description:
          "Définissez une limite budgétaire pour chaque type de dépense (Alimentation, Sorties...). Cliquez sur un montant pour l'ajuster instantanément.",
      },
      {
        targetId: "goals-savings-list",
        badge: "Tirelires",
        title: "Tirelires d'Épargne & Dépôts",
        description:
          "Créez des projets financiers (vacances, urgence, achat coup de cœur) et alimentez-les rapidement avec les boutons de dépôt rapide.",
      },
    ],
  },
  profile: {
    page: "profile",
    pageName: "Profil & Réglages",
    steps: [
      {
        targetId: "profile-multiprofiles",
        badge: "Multi-Comptes",
        title: "Espaces Multi-Profils",
        description:
          "Créez et passez d'un profil à un autre (Personnel, Professionnel, Épargne). Les transactions et budgets de chaque espace sont entièrement étanches.",
      },
      {
        targetId: "profile-appearance",
        badge: "Personnalisation",
        title: "Apparence & Mode Sombre",
        description:
          "Adaptez l'interface à vos préférences : basculez en mode sombre et sélectionnez votre couleur d'accentuation préférée.",
      },
      {
        targetId: "profile-preferences",
        badge: "Compte",
        title: "Préférences Personnelles",
        description:
          "Ajustez votre prénom affiché, votre devise monétaire (FCFA, €, $, CHF...) et votre plafond budgétaire global.",
      },
      {
        targetId: "profile-data-mgmt",
        badge: "Sécurité & Fichiers",
        title: "Gestion des Données & CSV",
        description:
          "Exportez l'historique de vos opérations vers Excel, restaurez un fichier CSV ou réinitialisez vos données en toute autonomie.",
      },
    ],
  },
};
