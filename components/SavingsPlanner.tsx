
import React, { useState } from 'react';
import { SavingsGoal } from '../types';
import { Target, Plus, Calendar, CheckCircle2 } from 'lucide-react';

interface Props {
  goals: SavingsGoal[];
  onAdd: (goal: Omit<SavingsGoal, 'id'>) => void;
  onUpdate: (id: string, amount: number) => void;
}

const SavingsPlanner: React.FC<Props> = ({ goals, onAdd, onUpdate }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: 0,
    currentAmount: 0,
    deadline: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({ name: '', targetAmount: 0, currentAmount: 0, deadline: '' });
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Target className="text-amber-500" /> Savings Goals
        </h2>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <Plus size={18} /> New Goal
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <input 
              type="text" 
              placeholder="Goal Name (e.g. New Car)" 
              required
              className="px-4 py-2 rounded-lg border focus:ring-2 focus:ring-amber-500 outline-none"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
            <input 
              type="number" 
              placeholder="Target Amount ($)" 
              required
              className="px-4 py-2 rounded-lg border focus:ring-2 focus:ring-amber-500 outline-none"
              value={formData.targetAmount || ''}
              onChange={e => setFormData({...formData, targetAmount: Number(e.target.value)})}
            />
            <input 
              type="number" 
              placeholder="Initial Amount ($)" 
              className="px-4 py-2 rounded-lg border focus:ring-2 focus:ring-amber-500 outline-none"
              value={formData.currentAmount || ''}
              onChange={e => setFormData({...formData, currentAmount: Number(e.target.value)})}
            />
            <input 
              type="date" 
              required
              className="px-4 py-2 rounded-lg border focus:ring-2 focus:ring-amber-500 outline-none"
              value={formData.deadline}
              onChange={e => setFormData({...formData, deadline: e.target.value})}
            />
          </div>
          <div className="mt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setIsAdding(false)} className="text-slate-500 font-medium px-4 py-2">Cancel</button>
            <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-medium">Create Goal</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map(goal => {
          const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
          const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
          
          return (
            <div key={goal.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm group">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{goal.name}</h3>
                  <div className="flex items-center gap-2 text-slate-400 text-sm mt-1">
                    <Calendar size={14} />
                    <span>Target: {new Date(goal.deadline).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-slate-800">${goal.currentAmount.toLocaleString()}</div>
                  <div className="text-sm text-slate-400">of ${goal.targetAmount.toLocaleString()}</div>
                </div>
              </div>

              <div className="relative pt-1">
                <div className="overflow-hidden h-3 text-xs flex rounded-full bg-slate-100 mb-4">
                  <div 
                    style={{ width: `${progress}%` }} 
                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ${progress === 100 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                  ></div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm font-medium text-slate-600">
                  {progress === 100 ? (
                    <span className="text-emerald-600 flex items-center gap-1 font-bold">
                      <CheckCircle2 size={16} /> Fully Funded!
                    </span>
                  ) : (
                    <span className="text-slate-500">{daysLeft > 0 ? `${daysLeft} days remaining` : 'Deadline passed'}</span>
                  )}
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => {
                      const amount = prompt("How much would you like to contribute?");
                      if(amount) onUpdate(goal.id, Number(amount));
                    }}
                    className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full hover:bg-amber-100"
                  >
                    Add Funds
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SavingsPlanner;
