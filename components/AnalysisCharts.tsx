import React, { useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { Transaction, TransactionType } from '../types';

interface AnalysisChartsProps {
  transactions: Transaction[];
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6', '#14b8a6', '#f43f5e'];

export const AnalysisCharts: React.FC<AnalysisChartsProps> = ({ transactions }) => {
  
  // Prepare data for Daily Trend (Area Chart)
  const trendData = useMemo(() => {
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);
    
    // Group by date
    const grouped = transactions
      .filter(t => new Date(t.date) >= last30Days)
      .reduce((acc, curr) => {
        const dateKey = curr.date.split('T')[0];
        if (!acc[dateKey]) acc[dateKey] = { date: dateKey, income: 0, expense: 0 };
        if (curr.type === TransactionType.INCOME) acc[dateKey].income += curr.amount;
        else acc[dateKey].expense += curr.amount;
        return acc;
      }, {} as Record<string, { date: string, income: number, expense: number }>);

    // Sort and format
    const values = Object.values(grouped) as { date: string, income: number, expense: number }[];
    return values.sort((a, b) => a.date.localeCompare(b.date)).map(item => ({
      ...item,
      date: new Date(item.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
    }));
  }, [transactions]);

  // Prepare data for Category Breakdown (Pie Chart)
  const categoryData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === TransactionType.EXPENSE);
    const grouped = expenses.reduce((acc: Record<string, number>, curr: Transaction) => {
      const cat = curr.category as string;
      acc[cat] = (acc[cat] || 0) + curr.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value: value as number }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-700 p-3 rounded-lg shadow-xl">
          <p className="text-slate-300 mb-1 text-sm">{label}</p>
          {payload.map((p: any) => (
            <p key={p.name} style={{ color: p.color }} className="text-sm font-medium">
              {p.name === 'income' ? 'Receita' : 'Despesa'}: R$ {p.value.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      
      {/* Trend Chart */}
      <div className="bg-surface p-6 rounded-2xl shadow-lg border border-slate-700/50">
        <h3 className="text-lg font-semibold text-white mb-6">Fluxo de Caixa (30 dias)</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value}`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="income" stroke="#10b981" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={2} />
              <Area type="monotone" dataKey="expense" stroke="#ef4444" fillOpacity={1} fill="url(#colorExpense)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Chart */}
      <div className="bg-surface p-6 rounded-2xl shadow-lg border border-slate-700/50">
        <h3 className="text-lg font-semibold text-white mb-6">Despesas por Categoria</h3>
        <div className="h-[300px] w-full flex items-center justify-center">
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                   itemStyle={{ color: '#fff' }}
                   formatter={(value: number) => `R$ ${value.toFixed(2)}`}
                />
                <Legend 
                  layout="vertical" 
                  verticalAlign="middle" 
                  align="right"
                  wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-slate-500 text-center">
              <p>Sem dados de despesas</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};