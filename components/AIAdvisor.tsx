
import React, { useState } from 'react';
import { FinanceData } from '../types';
import { getFinancialAdvice } from '../services/geminiService';
import { Sparkles, Loader2, RefreshCw } from 'lucide-react';

interface Props {
  data: FinanceData;
}

const AIAdvisor: React.FC<Props> = ({ data }) => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAdvice = async () => {
    setLoading(true);
    const result = await getFinancialAdvice(data);
    setAdvice(result || "Unable to generate advice at this moment.");
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-8 text-white shadow-xl overflow-hidden relative">
      <div className="absolute top-0 right-0 p-8 opacity-10">
        <Sparkles size={120} />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
            <Sparkles className="text-indigo-200" />
          </div>
          <h2 className="text-2xl font-bold">WealthFlow AI Advisor</h2>
        </div>

        {!advice && !loading && (
          <div className="max-w-xl">
            <p className="text-indigo-100 text-lg mb-8 leading-relaxed">
              Get personalized, AI-driven insights based on your income, assets, and spending patterns. 
              Our advisor analyzes your data to help you optimize for growth and security.
            </p>
            <button 
              onClick={fetchAdvice}
              className="bg-white text-indigo-700 font-bold px-8 py-3 rounded-xl hover:bg-indigo-50 transition-all shadow-lg hover:shadow-indigo-500/20 active:scale-95"
            >
              Analyze My Portfolio
            </button>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center py-12">
            <Loader2 className="animate-spin text-white mb-4" size={48} />
            <p className="text-indigo-100 animate-pulse font-medium">Analyzing markets and your finances...</p>
          </div>
        )}

        {advice && !loading && (
          <div className="space-y-6">
            <div className="prose prose-invert max-w-none">
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/10 leading-relaxed whitespace-pre-wrap text-indigo-50">
                {advice}
              </div>
            </div>
            <button 
              onClick={fetchAdvice}
              className="flex items-center gap-2 text-sm font-semibold text-indigo-200 hover:text-white transition-colors"
            >
              <RefreshCw size={14} /> Regenerate Insights
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAdvisor;
