import React from 'react';
import { useSearch } from '@/contexts/SearchContext';
import { Link } from 'react-router-dom';
import { ArrowRight, Box, Settings, FileText, Activity, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const getIconForType = (type) => {
  switch (type) {
    case 'Application': return <Box className="w-5 h-5" />;
    case 'Settings': return <Settings className="w-5 h-5" />;
    case 'Content': return <FileText className="w-5 h-5" />;
    default: return <Activity className="w-5 h-5" />;
  }
};

const SearchResults = () => {
  const { results, query, isSearching, addToHistory } = useSearch();

  if (isSearching) {
    return (
      <div className="py-12 text-center text-slate-400">
        <div className="w-8 h-8 border-2 border-[#BFFF00] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        Searching for "{query}"...
      </div>
    );
  }

  if (query && results.length === 0) {
    return (
      <div className="py-12 text-center text-slate-400 bg-[#1E293B]/50 rounded-lg border border-slate-700 border-dashed">
        <AlertCircle className="w-10 h-10 mx-auto mb-3 text-slate-600" />
        <p>No results found for "{query}"</p>
        <p className="text-sm text-slate-600 mt-1">Try checking for typos or using different keywords.</p>
      </div>
    );
  }

  if (!query) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-medium">Results ({results.length})</h3>
      </div>
      
      <div className="grid gap-3">
        {results.map((result) => (
          <Link 
            key={result.id} 
            to={result.path}
            onClick={() => addToHistory(query)}
            className="group flex items-start gap-4 p-4 rounded-lg bg-[#1E293B] border border-slate-700 hover:border-[#BFFF00] hover:shadow-[0_0_15px_rgba(191,255,0,0.1)] transition-all"
          >
            <div className={`mt-1 p-2 rounded-lg ${
              result.type === 'Application' ? 'bg-[#BFFF00]/10 text-[#BFFF00]' : 'bg-slate-700 text-slate-300'
            }`}>
              {getIconForType(result.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-base font-semibold text-white group-hover:text-[#BFFF00] transition-colors truncate">
                  {result.title}
                </h4>
                <div className="flex items-center gap-2">
                   {result.status === 'Coming Soon' && (
                     <Badge variant="outline" className="text-[10px] text-amber-500 border-amber-500/50">Coming Soon</Badge>
                   )}
                   <Badge variant="secondary" className="text-[10px] bg-slate-800 text-slate-400">
                     {result.module}
                   </Badge>
                </div>
              </div>
              
              <p className="text-sm text-slate-400 line-clamp-2 mb-2">
                {result.description}
              </p>
              
              <div className="flex flex-wrap gap-2">
                {result.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-500">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
            
            <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-[#BFFF00] self-center transition-colors opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0" />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;