import { Category } from '../types/finance';

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'food',
    name: 'Café & Restaurant',
    type: 'expense',
    icon: 'Coffee',
    bgColor: '#0d9488', // Teal (matching image)
    textColor: '#ffffff',
    budgetMonthly: 200,
  },
  {
    id: 'groceries',
    name: 'Courses & Épicerie',
    type: 'expense',
    icon: 'ShoppingCart',
    bgColor: '#f97316', // Orange (matching image)
    textColor: '#ffffff',
    budgetMonthly: 450,
  },
  {
    id: 'travel',
    name: 'Voyage & Hébergement',
    type: 'expense',
    icon: 'Home',
    bgColor: '#a855f7', // Purple Airbnb style (matching image)
    textColor: '#ffffff',
    budgetMonthly: 400,
  },
  {
    id: 'subscriptions',
    name: 'Abonnements & Médias',
    type: 'expense',
    icon: 'Radio',
    bgColor: '#ef4444', // Red Spotify style (matching image)
    textColor: '#ffffff',
    budgetMonthly: 60,
  },
  {
    id: 'transport',
    name: 'Transports & Mobilité',
    type: 'expense',
    icon: 'Car',
    bgColor: '#3b82f6', // Blue
    textColor: '#ffffff',
    budgetMonthly: 120,
  },
  {
    id: 'housing',
    name: 'Logement & Charges',
    type: 'expense',
    icon: 'Building',
    bgColor: '#6366f1', // Indigo
    textColor: '#ffffff',
    budgetMonthly: 650,
  },
  {
    id: 'leisure',
    name: 'Loisirs & Sorties',
    type: 'expense',
    icon: 'Sparkles',
    bgColor: '#ec4899', // Pink
    textColor: '#ffffff',
    budgetMonthly: 180,
  },
  {
    id: 'health',
    name: 'Santé & Bien-être',
    type: 'expense',
    icon: 'HeartPulse',
    bgColor: '#14b8a6', // Emerald / Cyan
    textColor: '#ffffff',
    budgetMonthly: 90,
  },
  // Incomes
  {
    id: 'salary',
    name: 'Salaire Principal',
    type: 'income',
    icon: 'Banknote',
    bgColor: '#10b981', // Emerald
    textColor: '#ffffff',
  },
  {
    id: 'freelance',
    name: 'Freelance & Missions',
    type: 'income',
    icon: 'Briefcase',
    bgColor: '#06b6d4', // Cyan
    textColor: '#ffffff',
  },
  {
    id: 'investment',
    name: 'Dividendes & Intérêts',
    type: 'income',
    icon: 'TrendingUp',
    bgColor: '#8b5cf6', // Violet
    textColor: '#ffffff',
  },
  {
    id: 'other_income',
    name: 'Autres Entrées',
    type: 'income',
    icon: 'PlusCircle',
    bgColor: '#64748b', // Slate
    textColor: '#ffffff',
  },
];
