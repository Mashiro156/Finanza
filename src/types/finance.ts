export type TransactionType = 'expense' | 'income';

export interface Category {
  id: string;
  name: string;
  type: TransactionType | 'both';
  icon: string;
  bgColor: string; // Tailwind bg or hex
  textColor: string;
  budgetMonthly?: number; // Monthly budget allocation
}

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  date: string; // ISO format or YYYY-MM-DD
  time?: string; // HH:mm
  note?: string;
  merchant?: string;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  category: string;
  deadline?: string;
  color: string;
  icon: string;
}

export interface UserProfile {
  id: string;
  name: string;
  avatarUrl: string;
  currency: string;
  monthlyBudgetCap: number;
}

export type TabType = 'home' | 'analytics' | 'goals' | 'profile';
export type ViewMode = 'mockup' | 'full';
export type ThemeMode = 'light' | 'dark';
export type AccentColor = 'teal' | 'indigo' | 'violet' | 'rose' | 'amber' | 'blue';
