import React from 'react';
import { Transaction, TransactionType } from '../types';
import { ArrowUpCircle, ArrowDownCircle, Wallet } from 'lucide-react';

interface StatsCardsProps {
  transactions: Transaction[];
}

export const StatsCards: React.FC<StatsCardsProps> = ({ transactions }) => {
  const income = transactions
    .filter(t => t.type === TransactionType.INCOME)
    .reduce((acc, curr) => acc + curr.amount, 0);

  const expense = transactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = income - expense;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Balance Card */}
      <div className="bg-surface p-6 rounded-2xl shadow-lg border border-slate-700/50 flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium mb-1">Saldo Total</p>
          <h3 className={`text-2xl font-bold ${balance >= 0 ? 'text-white' : 'text-red-400'}`}>
            {formatCurrency(balance)}
          </h3>
        </div>
        <div className="p-3 bg-indigo-500/20 rounded-xl">
          <Wallet className="w-8 h-8 text-indigo-400" />
        </div>
      </div>

      {/* Income Card */}
      <div className="bg-surface p-6 rounded-2xl shadow-lg border border-slate-700/50 flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium mb-1">Entradas</p>
          <h3 className="text-2xl font-bold text-emerald-400">
            {formatCurrency(income)}
          </h3>
        </div>
        <div className="p-3 bg-emerald-500/20 rounded-xl">
          <ArrowUpCircle className="w-8 h-8 text-emerald-400" />
        </div>
      </div>

      {/* Expense Card */}
      <div className="bg-surface p-6 rounded-2xl shadow-lg border border-slate-700/50 flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium mb-1">Saídas</p>
          <h3 className="text-2xl font-bold text-rose-400">
            {formatCurrency(expense)}
          </h3>
        </div>
        <div className="p-3 bg-rose-500/20 rounded-xl">
          <ArrowDownCircle className="w-8 h-8 text-rose-400" />
        </div>
      </div>
    </div>
  );
};