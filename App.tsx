
import React, { useState, useEffect } from 'react';
import { FinanceData, Transaction, PortfolioAsset, SavingsGoal } from './types';
import Dashboard from './components/Dashboard';
import PortfolioManager from './components/PortfolioManager';
import SavingsPlanner from './components/SavingsPlanner';
import AIAdvisor from './components/AIAdvisor';
import { LayoutDashboard, Briefcase, Target, History, Plus, PieChart } from 'lucide-react';

const INITIAL_DATA: FinanceData = {
  transactions: [
    { id: '1', date: new Date().toISOString(), amount: 5000, category: 'Salary', type: 'income', description: 'Monthly Salary' },
    { id: '2', date: new Date().toISOString(), amount: 1500, category: 'Rent', type: 'expense', description: 'Apartment Rent' },
    { id: '3', date: new Date().toISOString(), amount: 200, category: 'Food', type: 'expense', description: 'Grocery shopping' },
  ],
  portfolio: [
    { id: 'p1', name: 'Bitcoin', symbol: 'BTC', quantity: 0.25, purchasePrice: 45000, currentPrice: 62000, type: 'crypto' },
    { id: 'p2', name: 'Apple Inc.', symbol: 'AAPL', quantity: 15, purchasePrice: 150, currentPrice: 185, type: 'stock' },
    { id: 'p3', name: 'Vanguard S&P 500', symbol: 'VOO', quantity: 10, purchasePrice: 380, currentPrice: 440, type: 'etf' },
  ],
  savingsGoals: [
    { id: 's1', name: 'Emergency Fund', targetAmount: 15000, currentAmount: 8500, deadline: '2025-12-31' },
    { id: 's2', name: 'Europe Summer Trip', targetAmount: 5000, currentAmount: 1200, deadline: '2025-06-01' },
  ],
  monthlyIncome: 5000
};

const App: React.FC = () => {
  const [data, setData] = useState<FinanceData>(() => {
    const saved = localStorage.getItem('wealthflow_data');
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });
  const [activeTab, setActiveTab] = useState<'dashboard' | 'portfolio' | 'savings' | 'advisor'>('dashboard');

  useEffect(() => {
    localStorage.setItem('wealthflow_data', JSON.stringify(data));
  }, [data]);

  const addTransaction = (t: Omit<Transaction, 'id'>) => {
    const newT = { ...t, id: Date.now().toString() };
    setData(prev => ({ ...prev, transactions: [...prev.transactions, newT] }));
  };

  const addAsset = (asset: Omit<PortfolioAsset, 'id'>) => {
    const newAsset = { ...asset, id: Date.now().toString() };
    setData(prev => ({ ...prev, portfolio: [...prev.portfolio, newAsset] }));
  };

  const removeAsset = (id: string) => {
    setData(prev => ({ ...prev, portfolio: prev.portfolio.filter(a => a.id !== id) }));
  };

  const addGoal = (goal: Omit<SavingsGoal, 'id'>) => {
    const newGoal = { ...goal, id: Date.now().toString() };
    setData(prev => ({ ...prev, savingsGoals: [...prev.savingsGoals, newGoal] }));
  };

  const updateGoalProgress = (id: string, amount: number) => {
    setData(prev => ({
      ...prev,
      savingsGoals: prev.savingsGoals.map(g => 
        g.id === id ? { ...g, currentAmount: g.currentAmount + amount } : g
      )
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 md:sticky md:top-0 md:h-screen z-50">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <PieChart className="text-white" size={24} />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-700 bg-clip-text text-transparent">
              WealthFlow
            </h1>
          </div>

          <nav className="space-y-1">
            <NavItem 
              active={activeTab === 'dashboard'} 
              onClick={() => setActiveTab('dashboard')} 
              icon={<LayoutDashboard size={20} />} 
              label="Dashboard" 
            />
            <NavItem 
              active={activeTab === 'portfolio'} 
              onClick={() => setActiveTab('portfolio')} 
              icon={<Briefcase size={20} />} 
              label="Portfolio" 
            />
            <NavItem 
              active={activeTab === 'savings'} 
              onClick={() => setActiveTab('savings')} 
              icon={<Target size={20} />} 
              label="Savings" 
            />
            <NavItem 
              active={activeTab === 'advisor'} 
              onClick={() => setActiveTab('advisor')} 
              icon={<PieChart size={20} />} 
              label="AI Advisor" 
            />
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-6 hidden md:block">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Monthly Budget</p>
            <div className="flex items-end gap-1">
              <span className="text-xl font-bold text-slate-800">${data.monthlyIncome}</span>
              <span className="text-xs text-slate-400 mb-1">/ month</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-800 capitalize">{activeTab}</h2>
            <p className="text-slate-500">Welcome back! Here's what's happening with your wealth today.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                const amount = prompt("Income Amount:");
                const desc = prompt("Source:");
                if(amount && desc) addTransaction({
                  amount: Number(amount),
                  description: desc,
                  category: 'Income',
                  type: 'income',
                  date: new Date().toISOString()
                });
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/10"
            >
              <Plus size={18} /> Income
            </button>
            <button 
              onClick={() => {
                const amount = prompt("Expense Amount:");
                const desc = prompt("Source:");
                if(amount && desc) addTransaction({
                  amount: Number(amount),
                  description: desc,
                  category: 'Expense',
                  type: 'expense',
                  date: new Date().toISOString()
                });
              }}
              className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-rose-500/10"
            >
              <Plus size={18} /> Expense
            </button>
          </div>
        </header>

        {activeTab === 'dashboard' && <Dashboard data={data} />}
        {activeTab === 'portfolio' && <PortfolioManager portfolio={data.portfolio} onAdd={addAsset} onRemove={removeAsset} />}
        {activeTab === 'savings' && <SavingsPlanner goals={data.savingsGoals} onAdd={addGoal} onUpdate={updateGoalProgress} />}
        {activeTab === 'advisor' && <AIAdvisor data={data} />}
      </main>
    </div>
  );
};

const NavItem: React.FC<{ active: boolean, onClick: () => void, icon: React.ReactNode, label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
      active 
      ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100' 
      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default App;
