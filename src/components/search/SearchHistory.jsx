import React from 'react';
import { useSearch } from '@/contexts/SearchContext';
import { History, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SearchHistory = () => {
  const { history, clearHistory, removeHistoryItem, setQuery } = useSearch();

  if (history.length === 0) return null;

  return (
    <div className="bg-[#1E293B] border border-slate-700 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-medium flex items-center gap-2">
          <History className="w-4 h-4 text-[#BFFF00]" />
          History
        </h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={clearHistory}
          className="text-xs text-slate-400 hover:text-red-400 h-6 px-2"
        >
          Clear All
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {history.map((term, idx) => (
          <div 
            key={idx}
            className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 hover:border-slate-500 transition-colors"
          >
            <button 
              onClick={() => setQuery(term)}
              className="text-xs text-slate-300 hover:text-[#BFFF00]"
            >
              {term}
            </button>
            <button
              onClick={() => removeHistoryItem(term)}
              className="text-slate-500 hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchHistory;