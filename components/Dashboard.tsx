
import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FinanceData, Transaction } from '../types';
import { Wallet, TrendingUp, Target, CreditCard, ChevronUp, ChevronDown } from 'lucide-react';

interface Props {
  data: FinanceData;
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

const Dashboard: React.FC<Props> = ({ data }) => {
  const stats = useMemo(() => {
    const totalIncome = data.transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = data.transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpenses;
    const portfolioValue = data.portfolio.reduce((sum, a) => sum + (a.currentPrice * a.quantity), 0);
    const portfolioGain = data.portfolio.reduce((sum, a) => sum + ((a.currentPrice - a.purchasePrice) * a.quantity), 0);
    
    return { balance, portfolioValue, portfolioGain, totalExpenses };
  }, [data]);

  const chartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dateStr = date.toISOString().split('0')[0];
      
      const dayTotal = data.transactions
        .filter(t => t.date.startsWith(dateStr))
        .reduce((sum, t) => t.type === 'income' ? sum + t.amount : sum - t.amount, 0);
        
      return {
        name: date.toLocaleDateString('en-US', { weekday: 'short' }),
        balance: dayTotal
      };
    });
    return last7Days;
  }, [data.transactions]);

  const portfolioPieData = useMemo(() => {
    return data.portfolio.map(asset => ({
      name: asset.symbol,
      value: asset.currentPrice * asset.quantity
    }));
  }, [data.portfolio]);

  return (
    <div className="space-y-6">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Net Cash Balance" 
          value={`$${stats.balance.toLocaleString()}`} 
          icon={<Wallet className="text-emerald-500" />} 
          trend={12}
        />
        <StatCard 
          title="Portfolio Value" 
          value={`$${stats.portfolioValue.toLocaleString()}`} 
          icon={<TrendingUp className="text-blue-500" />} 
          trend={stats.portfolioGain > 0 ? 5 : -2}
        />
        <StatCard 
          title="Savings Progress" 
          value={`${data.savingsGoals.length} Active`} 
          icon={<Target className="text-amber-500" />} 
        />
        <StatCard 
          title="Total Expenses" 
          value={`$${stats.totalExpenses.toLocaleString()}`} 
          icon={<CreditCard className="text-rose-500" />} 
          trend={-4}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Cash Flow (Last 7 Days)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="balance" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorBalance)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Portfolio Allocation */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Asset Allocation</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={portfolioPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {portfolioPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {portfolioPieData.map((entry, index) => (
              <div key={entry.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span className="text-slate-600 font-medium">{entry.name}</span>
                </div>
                <span className="text-slate-400 font-mono">${entry.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string, value: string, icon: React.ReactNode, trend?: number }> = ({ title, value, icon, trend }) => (
  <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
    <div className="flex items-center justify-between mb-3">
      <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
      {trend !== undefined && (
        <div className={`flex items-center text-xs font-semibold ${trend >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
          {trend >= 0 ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {Math.abs(trend)}%
        </div>
      )}
    </div>
    <div>
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</p>
      <h4 className="text-2xl font-bold text-slate-800 mt-1">{value}</h4>
    </div>
  </div>
);

export default Dashboard;
