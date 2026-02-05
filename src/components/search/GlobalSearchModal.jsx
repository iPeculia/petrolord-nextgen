import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '@/contexts/SearchContext';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Search, ArrowRight, CornerDownLeft } from 'lucide-react';
import { SYSTEM_MODULES } from '@/utils/searchUtils';

const GlobalSearchModal = () => {
  const { isGlobalSearchOpen, setIsGlobalSearchOpen, addToHistory } = useSearch();
  const [localQuery, setLocalQuery] = React.useState('');
  const navigate = useNavigate();

  const filteredResults = localQuery 
    ? SYSTEM_MODULES.filter(m => m.title.toLowerCase().includes(localQuery.toLowerCase())).slice(0, 5)
    : [];

  const handleNavigate = (path, title) => {
    addToHistory(title); // Track even if clicked
    setIsGlobalSearchOpen(false);
    setLocalQuery('');
    navigate(path);
  };

  const handleSearchPage = () => {
      setIsGlobalSearchOpen(false);
      navigate('/search');
  };

  return (
    <Dialog open={isGlobalSearchOpen} onOpenChange={setIsGlobalSearchOpen}>
      <DialogContent className="max-w-2xl bg-[#1E293B] border-slate-700 p-0 overflow-hidden shadow-2xl">
        <div className="flex items-center px-4 border-b border-slate-700">
          <Search className="w-5 h-5 text-slate-400 mr-3" />
          <Input 
            className="flex-1 h-14 border-none bg-transparent text-lg text-white placeholder:text-slate-500 focus-visible:ring-0 px-0"
            placeholder="Search anything... (Press Enter for full search)"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            onKeyDown={(e) => {
                if(e.key === 'Enter') handleSearchPage();
            }}
            autoFocus
          />
          <div className="hidden sm:flex items-center gap-2">
            <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-slate-600 bg-slate-800 px-1.5 font-mono text-[10px] font-medium text-slate-400 opacity-100">
              <span className="text-xs">ESC</span>
            </kbd>
          </div>
        </div>

        {localQuery && (
          <div className="p-2">
            {filteredResults.length > 0 ? (
              <div className="space-y-1">
                <p className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase">Quick Results</p>
                {filteredResults.map(res => (
                  <button
                    key={res.id}
                    onClick={() => handleNavigate(res.path, res.title)}
                    className="w-full flex items-center justify-between px-3 py-3 rounded-lg hover:bg-slate-800 group transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-slate-700 rounded text-slate-300 group-hover:text-[#BFFF00] group-hover:bg-[#BFFF00]/10 transition-colors">
                        <Search className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-200 group-hover:text-white">{res.title}</p>
                        <p className="text-xs text-slate-500">{res.module}</p>
                      </div>
                    </div>
                    <CornerDownLeft className="w-4 h-4 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            ) : (
               <div className="p-8 text-center text-slate-500">
                   <p>No quick matches found.</p>
                   <button onClick={handleSearchPage} className="text-[#BFFF00] hover:underline mt-2 text-sm">Go to Advanced Search page</button>
               </div>
            )}
            
            <div className="mt-2 border-t border-slate-700 pt-2 px-2 pb-1">
                 <button 
                    onClick={handleSearchPage}
                    className="w-full flex items-center justify-center gap-2 py-2 text-sm text-[#BFFF00] hover:bg-[#BFFF00]/10 rounded transition-colors"
                 >
                    View all results for "{localQuery}" <ArrowRight className="w-4 h-4" />
                 </button>
            </div>
          </div>
        )}

        {!localQuery && (
            <div className="p-8 text-center">
                 <p className="text-slate-400 mb-2">Search across all modules, tools, and settings.</p>
                 <div className="flex justify-center gap-2 text-xs text-slate-600">
                     <span>Pro tip: Use</span>
                     <kbd className="font-sans border border-slate-700 bg-slate-800 px-1 rounded">CMD + K</kbd>
                     <span>to open this anytime.</span>
                 </div>
            </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default GlobalSearchModal;