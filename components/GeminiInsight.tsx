import React, { useState } from 'react';
import { Transaction, FinancialInsight } from '../types';
import { analyzeFinancials } from '../services/geminiService';
import { Sparkles, Lightbulb, AlertTriangle, TrendingUp, Loader2 } from 'lucide-react';

interface GeminiInsightProps {
  transactions: Transaction[];
}

export const GeminiInsight: React.FC<GeminiInsightProps> = ({ transactions }) => {
  const [insight, setInsight] = useState<FinancialInsight | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await analyzeFinancials(transactions);
      setInsight(result);
    } catch (err) {
      setError('Falha ao conectar com o Gemini.');
    } finally {
      setLoading(false);
    }
  };

  if (!insight && !loading) {
    return (
      <div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 p-6 rounded-2xl mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-500/20 rounded-full border border-indigo-500/50">
            <Sparkles className="w-6 h-6 text-indigo-300" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Análise Financeira IA</h3>
            <p className="text-slate-300 text-sm">Obtenha dicas personalizadas sobre seus gastos com o Gemini.</p>
          </div>
        </div>
        <button
          onClick={handleAnalyze}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Gerar Insights
        </button>
      </div>
    );
  }

  if (loading) {
     return (
      <div className="bg-surface border border-slate-700/50 p-8 rounded-2xl mb-8 flex flex-col items-center justify-center text-center animate-pulse">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mb-4" />
        <h3 className="text-white font-medium">O Gemini está analisando suas finanças...</h3>
        <p className="text-slate-400 text-sm mt-2">Isso pode levar alguns segundos.</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-indigo-500/30 p-6 rounded-2xl mb-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none"></div>
      
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-indigo-400" />
          <h3 className="text-xl font-bold text-white">Relatório Inteligente</h3>
        </div>
        <button onClick={() => setInsight(null)} className="text-xs text-slate-400 hover:text-white underline">
          Fechar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        <div className="md:col-span-3 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
          <p className="text-slate-200 leading-relaxed text-sm md:text-base">
            "{insight?.summary}"
          </p>
        </div>

        <div className="bg-emerald-900/20 p-4 rounded-xl border border-emerald-500/20">
          <div className="flex items-center gap-2 mb-2 text-emerald-400">
            <Lightbulb className="w-5 h-5" />
            <h4 className="font-semibold text-sm uppercase tracking-wide">Dica de Economia</h4>
          </div>
          <p className="text-slate-300 text-sm">{insight?.savingsTip}</p>
        </div>

        <div className="bg-rose-900/20 p-4 rounded-xl border border-rose-500/20">
          <div className="flex items-center gap-2 mb-2 text-rose-400">
            <AlertTriangle className="w-5 h-5" />
            <h4 className="font-semibold text-sm uppercase tracking-wide">Atenção</h4>
          </div>
          <p className="text-slate-300 text-sm">{insight?.unusualSpending || "Nenhum gasto incomum detectado."}</p>
        </div>

        <div className="bg-indigo-900/20 p-4 rounded-xl border border-indigo-500/20">
          <div className="flex items-center gap-2 mb-2 text-indigo-400">
            <TrendingUp className="w-5 h-5" />
            <h4 className="font-semibold text-sm uppercase tracking-wide">Projeção</h4>
          </div>
          <p className="text-slate-300 text-sm">{insight?.projectedSavings}</p>
        </div>
      </div>
    </div>
  );
};