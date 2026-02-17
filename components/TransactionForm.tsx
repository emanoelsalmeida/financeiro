import React, { useState } from 'react';
import { TransactionType, Category, Transaction } from '../types';
import { suggestCategory } from '../services/geminiService';
import { Plus, Loader2, Sparkles } from 'lucide-react';

interface TransactionFormProps {
  onAdd: (t: Omit<Transaction, 'id'>) => void;
  onClose: () => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ onAdd, onClose }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [category, setCategory] = useState<Category>(Category.OTHER);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSuggesting, setIsSuggesting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      description,
      amount: parseFloat(amount),
      type,
      category,
      date: new Date(date).toISOString(),
    });
    onClose();
  };

  const handleDescriptionBlur = async () => {
    if (description.length > 3) {
      setIsSuggesting(true);
      const suggestion = await suggestCategory(description);
      if (suggestion) {
        setCategory(suggestion);
      }
      setIsSuggesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
        <div className="p-6 bg-slate-800/50 border-b border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Nova Transação</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Type Selection */}
          <div className="flex bg-slate-900/50 p-1 rounded-xl">
            <button
              type="button"
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                type === TransactionType.EXPENSE ? 'bg-rose-500/20 text-rose-400 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
              onClick={() => setType(TransactionType.EXPENSE)}
            >
              Despesa
            </button>
            <button
              type="button"
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                type === TransactionType.INCOME ? 'bg-emerald-500/20 text-emerald-400 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
              onClick={() => setType(TransactionType.INCOME)}
            >
              Receita
            </button>
          </div>

          {/* Description with AI Magic */}
          <div className="relative group">
            <label className="block text-xs font-medium text-slate-400 mb-1">Descrição</label>
            <div className="relative">
              <input
                type="text"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={handleDescriptionBlur}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-600"
                placeholder="Ex: Uber para o trabalho"
              />
              {isSuggesting && (
                <div className="absolute right-3 top-3">
                  <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
                </div>
              )}
              {!isSuggesting && description.length > 0 && (
                <div className="absolute right-3 top-3 text-indigo-400 opacity-50 pointer-events-none">
                  <Sparkles className="w-4 h-4" />
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Valor (R$)</label>
              <input
                type="number"
                step="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="0,00"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Data</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Categoria</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none"
            >
              {Object.values(Category).map((cat) => (
                <option key={cat} value={cat} className="bg-slate-800">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-indigo-600 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 mt-2"
          >
            <Plus className="w-5 h-5" />
            Adicionar Transação
          </button>
        </form>
      </div>
    </div>
  );
};