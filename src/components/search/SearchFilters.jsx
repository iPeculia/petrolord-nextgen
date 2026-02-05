import React from 'react';
import { useSearch } from '@/contexts/SearchContext';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SYSTEM_MODULES, FILTER_MODULES } from '@/utils/searchUtils';

const SearchFilters = () => {
  const { filters, setFilters } = useSearch();

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ module: 'All', type: 'All', status: 'All' });
  };

  const activeFilterCount = Object.values(filters).filter(v => v !== 'All').length;

  return (
    <div className="bg-[#1E293B] border border-slate-700 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-medium flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#BFFF00]" />
          Filters
        </h3>
        {activeFilterCount > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className="text-xs text-slate-400 hover:text-white h-6 px-2"
          >
            Clear All
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {/* Module Filter */}
        <div className="space-y-2">
          <label className="text-xs text-slate-400 uppercase font-semibold">Module</label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleFilterChange('module', 'All')}
              className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                filters.module === 'All' 
                  ? 'bg-[#BFFF00]/20 border-[#BFFF00] text-[#BFFF00]' 
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500'
              }`}
            >
              All
            </button>
            {FILTER_MODULES.map(mod => (
              <button
                key={mod}
                onClick={() => handleFilterChange('module', mod)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                  filters.module === mod 
                    ? 'bg-[#BFFF00]/20 border-[#BFFF00] text-[#BFFF00]' 
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500'
                }`}
              >
                {mod}
              </button>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <label className="text-xs text-slate-400 uppercase font-semibold">Status</label>
          <div className="flex flex-wrap gap-2">
            {['All', 'Active', 'Coming Soon'].map(status => (
              <button
                key={status}
                onClick={() => handleFilterChange('status', status)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                  filters.status === status 
                    ? 'bg-[#BFFF00]/20 border-[#BFFF00] text-[#BFFF00]' 
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
        
        {/* Type Filter */}
        <div className="space-y-2">
          <label className="text-xs text-slate-400 uppercase font-semibold">Type</label>
          <div className="flex flex-wrap gap-2">
            {['All', 'Application', 'Settings', 'Content'].map(type => (
              <button
                key={type}
                onClick={() => handleFilterChange('type', type)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                  filters.type === type 
                    ? 'bg-[#BFFF00]/20 border-[#BFFF00] text-[#BFFF00]' 
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;