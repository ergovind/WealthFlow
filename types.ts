
export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: string;
  type: TransactionType;
  description: string;
}

export interface PortfolioAsset {
  id: string;
  name: string;
  symbol: string;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  type: 'stock' | 'crypto' | 'etf' | 'bond';
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
}

export interface FinanceData {
  transactions: Transaction[];
  portfolio: PortfolioAsset[];
  savingsGoals: SavingsGoal[];
  monthlyIncome: number;
}
