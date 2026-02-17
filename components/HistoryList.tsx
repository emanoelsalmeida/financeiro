import React, { useState, useMemo } from 'react';
import { Transaction, TransactionType, Category } from '../types';
import { ArrowUpRight, ArrowDownLeft, Trash2, Filter, Calendar, Tag } from 'lucide-react';

interface HistoryListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

type PeriodFilter = 'ALL' | 'DAY' | 'MONTH' | 'YEAR';
type TypeFilter = 'ALL' | TransactionType;

export const HistoryList: React.FC<HistoryListProps> = ({ transactions, onDelete }) => {
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('ALL');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const tDate = new Date(t.date);
      const now = new Date();

      // Filter by Type
      if (typeFilter !== 'ALL' && t.type !== typeFilter) return false;

      // Filter by Category
      if (categoryFilter !== 'ALL' && t.category !== categoryFilter) return false;

      // Filter by Period
      if (periodFilter === 'DAY') {
        return tDate.toDateString() === now.toDateString();
      }
      if (periodFilter === 'MONTH') {
        return (
          tDate.getMonth() === now.getMonth() &&
          tDate.getFullYear() === now.getFullYear()
        );
      }
      if (periodFilter === 'YEAR') {
        return tDate.getFullYear() === now.getFullYear();
      }

      return true;
    });
  }, [transactions, periodFilter, typeFilter, categoryFilter]);

  // Sort by date desc
  const sorted = [...filteredTransactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="bg-surface rounded-2xl shadow-lg border border-slate-700/50 overflow-hidden flex flex-col">
      
      {/* Header & Title */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">Histórico de Transações</h3>
          <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded-full border border-slate-700">
            {sorted.length} registros
          </span>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col lg:flex-row gap-4 justify-between">
          
          {/* Period Toggles */}
          <div className="flex bg-slate-900/50 p-1 rounded-lg self-start">
            {(['ALL', 'DAY', 'MONTH', 'YEAR'] as PeriodFilter[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriodFilter(p)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  periodFilter === p
                    ? 'bg-indigo-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {p === 'ALL' ? 'Tudo' : p === 'DAY' ? 'Hoje' : p === 'MONTH' ? 'Este Mês' : 'Este Ano'}
              </button>
            ))}
          </div>

          {/* Type and Category Selects */}
          <div className="flex gap-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-3.5 w-3.5 text-slate-400" />
              </div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as TypeFilter)}
                className="pl-9 pr-8 py-1.5 bg-slate-900/50 border border-slate-700 text-slate-300 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full appearance-none hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <option value="ALL">Todos os Tipos</option>
                <option value={TransactionType.INCOME}>Entradas</option>
                <option value={TransactionType.EXPENSE}>Saídas</option>
              </select>
            </div>

            <div className="relative">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Tag className="h-3.5 w-3.5 text-slate-400" />
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="pl-9 pr-8 py-1.5 bg-slate-900/50 border border-slate-700 text-slate-300 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full appearance-none hover:bg-slate-800 transition-colors cursor-pointer"
                style={{ maxWidth: '160px' }}
              >
                <option value="ALL">Todas Categorias</option>
                {Object.values(Category).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase">
            <tr>
              <th className="px-6 py-4 font-medium">Descrição</th>
              <th className="px-6 py-4 font-medium">Categoria</th>
              <th className="px-6 py-4 font-medium">Data</th>
              <th className="px-6 py-4 font-medium text-right">Valor</th>
              <th className="px-6 py-4 font-medium text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
                  <Filter className="w-8 h-8 opacity-20" />
                  <p>Nenhuma transação encontrada com estes filtros.</p>
                </td>
              </tr>
            ) : (
              sorted.map((t) => (
                <tr key={t.id} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${t.type === TransactionType.INCOME ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                        {t.type === TransactionType.INCOME ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                      </div>
                      <span className="font-medium text-slate-200">{t.description}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs font-medium rounded-md bg-slate-700 text-slate-300 border border-slate-600/50">
                      {t.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3 opacity-50" />
                        {new Date(t.date).toLocaleDateString('pt-BR')}
                    </div>
                  </td>
                  <td className={`px-6 py-4 text-right font-semibold ${t.type === TransactionType.INCOME ? 'text-emerald-400' : 'text-slate-300'}`}>
                    {t.type === TransactionType.EXPENSE ? '-' : '+'} R$ {t.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => onDelete(t.id)}
                      className="text-slate-500 hover:text-rose-400 transition-colors p-2 hover:bg-rose-500/10 rounded-lg opacity-0 group-hover:opacity-100 focus:opacity-100"
                      title="Excluir"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};