import React, { useState } from 'react';
import { useSearch } from '@/contexts/SearchContext';
import { Bookmark, Trash2, Play, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const SavedSearches = () => {
  const { savedSearches, deleteSavedSearch, loadSavedSearch, saveSearch, query, filters } = useSearch();
  const [newSaveName, setNewSaveName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSave = () => {
    if (newSaveName.trim()) {
      saveSearch(newSaveName, query, filters);
      setNewSaveName('');
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="bg-[#1E293B] border border-slate-700 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-medium flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-[#BFFF00]" />
          Saved Searches
        </h3>
        
        {query && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="h-7 text-xs border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700">
                <Save className="w-3 h-3 mr-1.5" /> Save Current
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#1E293B] border-slate-700 text-white">
              <DialogHeader>
                <DialogTitle>Save Search Configuration</DialogTitle>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-slate-400">Name</label>
                  <Input 
                    value={newSaveName} 
                    onChange={(e) => setNewSaveName(e.target.value)} 
                    placeholder="e.g., Active Reservoir Apps"
                    className="bg-slate-900 border-slate-700"
                  />
                </div>
                <div className="text-xs text-slate-500 bg-slate-900/50 p-3 rounded">
                  <p><strong>Query:</strong> {query}</p>
                  <p><strong>Module:</strong> {filters.module}</p>
                </div>
                <Button onClick={handleSave} className="w-full bg-[#BFFF00] text-black hover:bg-[#a3d900]">
                  Save Search
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="space-y-2">
        {savedSearches.length === 0 ? (
          <p className="text-xs text-slate-500 italic text-center py-4">No saved searches yet.</p>
        ) : (
          savedSearches.map((item) => (
            <div key={item.id} className="group flex items-center justify-between p-2 rounded bg-slate-800/50 hover:bg-slate-800 transition-colors">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-300 font-medium truncate">{item.name}</p>
                <p className="text-xs text-slate-500 truncate">{item.query || '(No keywords)'} • {item.filters.module}</p>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-7 w-7 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10"
                  onClick={() => loadSavedSearch(item)}
                >
                  <Play className="w-3 h-3" />
                </Button>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-7 w-7 text-red-400 hover:text-red-300 hover:bg-red-400/10"
                  onClick={() => deleteSavedSearch(item.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SavedSearches;