import React, { useState, useEffect } from 'react';
import { Transaction } from './types';
import { StatsCards } from './components/StatsCards';
import { AnalysisCharts } from './components/AnalysisCharts';
import { HistoryList } from './components/HistoryList';
import { TransactionForm } from './components/TransactionForm';
import { GeminiInsight } from './components/GeminiInsight';
import { Plus, LayoutDashboard, WalletCards } from 'lucide-react';

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (t: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...t,
      id: crypto.randomUUID()
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta transação?')) {
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-background text-slate-200 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 pb-20">
      
      {/* Navigation Bar */}
      <nav className="border-b border-slate-800 bg-surface/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 p-2 rounded-lg">
                <WalletCards className="text-white w-6 h-6" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                Lumina Finance
              </span>
            </div>
            
            <button
              onClick={() => setIsFormOpen(true)}
              className="bg-primary hover:bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Nova Transação</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Visão Geral</h1>
            <p className="text-slate-400">Acompanhe sua saúde financeira em tempo real.</p>
          </div>
          <div className="hidden md:block text-right">
             <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Hoje</p>
             <p className="text-slate-300 font-medium">{new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>

        <StatsCards transactions={transactions} />
        
        <GeminiInsight transactions={transactions} />

        <AnalysisCharts transactions={transactions} />

        <div className="grid grid-cols-1 gap-8">
          <HistoryList transactions={transactions} onDelete={deleteTransaction} />
        </div>
      </main>

      {/* Floating Action Button (Mobile) */}
      <button
        onClick={() => setIsFormOpen(true)}
        className="md:hidden fixed bottom-6 right-6 bg-primary hover:bg-indigo-600 text-white p-4 rounded-full shadow-2xl shadow-indigo-500/40 z-40 transition-transform hover:scale-105 active:scale-95"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Modal */}
      {isFormOpen && (
        <TransactionForm 
          onAdd={addTransaction} 
          onClose={() => setIsFormOpen(false)} 
        />
      )}
    </div>
  );
};

export default App;