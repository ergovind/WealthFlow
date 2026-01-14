
import React, { useState } from 'react';
import { PortfolioAsset } from '../types';
import { Plus, Trash2, ArrowUpRight, ArrowDownRight, Briefcase } from 'lucide-react';

interface Props {
  portfolio: PortfolioAsset[];
  onAdd: (asset: Omit<PortfolioAsset, 'id'>) => void;
  onRemove: (id: string) => void;
}

const PortfolioManager: React.FC<Props> = ({ portfolio, onAdd, onRemove }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    quantity: 0,
    purchasePrice: 0,
    currentPrice: 0,
    type: 'stock' as PortfolioAsset['type']
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({ name: '', symbol: '', quantity: 0, purchasePrice: 0, currentPrice: 0, type: 'stock' });
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Briefcase className="text-blue-500" /> Investment Portfolio
        </h2>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <Plus size={18} /> Add Asset
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input 
              type="text" 
              placeholder="Asset Name (e.g. Apple Inc)" 
              required
              className="px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
            <input 
              type="text" 
              placeholder="Symbol (e.g. AAPL)" 
              required
              className="px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none uppercase"
              value={formData.symbol}
              onChange={e => setFormData({...formData, symbol: e.target.value})}
            />
            <select 
              className="px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.type}
              onChange={e => setFormData({...formData, type: e.target.value as any})}
            >
              <option value="stock">Stock</option>
              <option value="crypto">Crypto</option>
              <option value="etf">ETF</option>
              <option value="bond">Bond</option>
            </select>
            <input 
              type="number" 
              placeholder="Quantity" 
              required
              step="any"
              className="px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.quantity || ''}
              onChange={e => setFormData({...formData, quantity: Number(e.target.value)})}
            />
            <input 
              type="number" 
              placeholder="Avg Purchase Price" 
              required
              step="any"
              className="px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.purchasePrice || ''}
              onChange={e => setFormData({...formData, purchasePrice: Number(e.target.value)})}
            />
            <input 
              type="number" 
              placeholder="Current Price" 
              required
              step="any"
              className="px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.currentPrice || ''}
              onChange={e => setFormData({...formData, currentPrice: Number(e.target.value)})}
            />
          </div>
          <div className="mt-4 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={() => setIsAdding(false)}
              className="text-slate-500 font-medium px-4 py-2"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
            >
              Confirm Addition
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Asset</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Qty</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Holdings</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Price/Avg</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Return</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {portfolio.map(asset => {
              const value = asset.currentPrice * asset.quantity;
              const cost = asset.purchasePrice * asset.quantity;
              const profit = value - cost;
              const profitPerc = (profit / cost) * 100;
              const isPositive = profit >= 0;

              return (
                <tr key={asset.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800">{asset.symbol}</span>
                      <span className="text-xs text-slate-500">{asset.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium">{asset.quantity}</td>
                  <td className="px-6 py-4 font-mono font-bold text-slate-800">${value.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-700">${asset.currentPrice}</div>
                    <div className="text-xs text-slate-400">Avg: ${asset.purchasePrice}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`flex items-center gap-1 text-sm font-bold ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                      {isPositive ? '+' : ''}{profitPerc.toFixed(2)}%
                    </div>
                    <div className={`text-xs ${isPositive ? 'text-emerald-500' : 'text-rose-400'}`}>
                      ${Math.abs(profit).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => onRemove(asset.id)}
                      className="text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}
            {portfolio.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                  Your portfolio is empty. Add your first asset to start tracking!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PortfolioManager;
