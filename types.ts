export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export enum Category {
  FOOD = 'Alimentação',
  TRANSPORT = 'Transporte',
  HOUSING = 'Moradia',
  UTILITIES = 'Contas',
  ENTERTAINMENT = 'Lazer',
  HEALTH = 'Saúde',
  SHOPPING = 'Compras',
  SALARY = 'Salário',
  INVESTMENT = 'Investimento',
  FREELANCE = 'Freelance',
  OTHER = 'Outros'
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: Category;
  date: string; // ISO String
}

export interface FinancialInsight {
  summary: string;
  savingsTip: string;
  unusualSpending: string | null;
  projectedSavings: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
}