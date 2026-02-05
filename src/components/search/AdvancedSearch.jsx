import React from 'react';
import { useSearch } from '@/contexts/SearchContext';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import SearchFilters from './SearchFilters';
import SearchResults from './SearchResults';
import SearchSuggestions from './SearchSuggestions';
import SavedSearches from './SavedSearches';
import SearchHistory from './SearchHistory';
import SearchAnalytics from './SearchAnalytics';

const AdvancedSearch = () => {
  const { query, setQuery, isSearching } = useSearch();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        {/* Header Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white">Advanced Search</h1>
          <p className="text-slate-400">Search across modules, applications, and settings in the Petrolord Suite.</p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <Input 
            className="w-full h-14 pl-12 bg-[#1E293B] border-slate-700 text-white text-lg placeholder:text-slate-500 focus:border-[#BFFF00] focus:ring-[#BFFF00]/20"
            placeholder="Search for applications, tools, or settings..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Filters & Saved */}
          <div className="lg:col-span-1 space-y-6">
            <SearchFilters />
            <SavedSearches />
            <SearchAnalytics />
          </div>

          {/* Main Content - Results or Suggestions */}
          <div className="lg:col-span-3 space-y-6">
            <SearchHistory />
            
            <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-6 min-h-[500px]">
              {query ? (
                <SearchResults />
              ) : (
                <SearchSuggestions />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearch;