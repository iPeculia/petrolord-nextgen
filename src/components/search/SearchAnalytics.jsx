import React from 'react';
import { useSearch } from '@/contexts/SearchContext';
import { BarChart2, TrendingUp } from 'lucide-react';

const SearchAnalytics = () => {
  const { analytics } = useSearch();
  const topSearches = Object.entries(analytics.topTerms)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  return (
    <div className="bg-[#1E293B] border border-slate-700 rounded-lg p-4 space-y-4">
      <h3 className="text-white font-medium flex items-center gap-2">
        <BarChart2 className="w-4 h-4 text-[#BFFF00]" />
        Analytics
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-800/50 p-3 rounded border border-slate-700">
          <span className="text-xs text-slate-400 uppercase">Total Searches</span>
          <p className="text-2xl font-bold text-white">{analytics.totalSearches}</p>
        </div>
        <div className="bg-slate-800/50 p-3 rounded border border-slate-700">
          <span className="text-xs text-slate-400 uppercase">Unique Terms</span>
          <p className="text-2xl font-bold text-white">{Object.keys(analytics.topTerms).length}</p>
        </div>
      </div>

      <div className="space-y-2">
        <span className="text-xs text-slate-400 uppercase">Your Top Searches</span>
        {topSearches.length === 0 ? (
          <p className="text-xs text-slate-500">No data yet</p>
        ) : (
          <div className="space-y-1">
            {topSearches.map(([term, count], idx) => (
              <div key={term} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                   <span className="text-slate-500 w-4">{idx + 1}.</span>
                   <span className="text-slate-300">{term}</span>
                </div>
                <span className="text-slate-500 text-xs">{count}x</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchAnalytics;