import React, { useState } from 'react';
import { Search, Plus, Eye, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useWellCorrelation } from '@/contexts/WellCorrelationContext';
import { cn } from '@/lib/utils';
import WellImportDialog from './WellImportDialog';

const WellListPanel = () => {
    const { state, actions } = useWellCorrelation();
    const [searchTerm, setSearchTerm] = useState('');
    const [importOpen, setImportOpen] = useState(false);

    // Defensive check: ensure wells is always an array
    const wells = Array.isArray(state?.wells) ? state.wells : [];

    const filteredWells = wells.filter(w => {
        // CRITICAL FIX: Safety check before accessing properties
        if (!w) return false;
        
        const name = typeof w.name === 'string' ? w.name : '';
        const field = typeof w.field === 'string' ? w.field : '';
        const term = typeof searchTerm === 'string' ? searchTerm.toLowerCase() : '';
        
        if (!term) return true;
        
        // Safe toLowerCase calls
        return name.toLowerCase().includes(term) || field.toLowerCase().includes(term);
    });

    return (
        <div className="flex flex-col h-full bg-[#0F172A]">
            {/* Panel Header */}
            <div className="p-4 border-b border-slate-800 space-y-4 bg-[#0F172A]">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                        <span className="w-1 h-4 bg-[#CCFF00] rounded-full"/>
                        Project Wells
                        <span className="text-slate-500 text-xs font-normal">({wells.length})</span>
                    </h3>
                    <Button 
                        size="sm" 
                        className="h-7 bg-[#CCFF00] text-black hover:bg-[#B3E600] font-semibold text-xs px-2"
                        onClick={() => setImportOpen(true)}
                    >
                        <Plus size={14} className="mr-1" /> New
                    </Button>
                </div>
                
                <div className="relative">
                    <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-500" />
                    <Input 
                        placeholder="Search wells..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8 bg-[#020617] border-slate-700 h-8 text-xs text-slate-200 focus:border-[#CCFF00] focus:ring-0 rounded-md placeholder:text-slate-600 focus:ring-offset-0" 
                    />
                </div>
            </div>

            {/* Well List */}
            <ScrollArea className="flex-1 bg-[#0F172A]">
                <div className="p-2 space-y-1">
                    {filteredWells.length === 0 ? (
                        <div className="text-center py-12 px-4">
                            <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center mx-auto mb-3 border border-slate-800">
                                <Filter size={20} className="text-slate-600" />
                            </div>
                            <p className="text-slate-500 text-xs mb-3">No wells found matching your search.</p>
                            {wells.length === 0 && (
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="border-slate-700 text-[#CCFF00] hover:bg-slate-900 hover:text-[#CCFF00]"
                                    onClick={() => setImportOpen(true)}
                                >
                                    Import Data
                                </Button>
                            )}
                        </div>
                    ) : (
                        filteredWells.map((well) => {
                            const isSelected = (state?.selectedWellIds || []).includes(well.id);
                            return (
                                <div 
                                    key={well.id} 
                                    className={cn(
                                        "group flex items-center p-3 rounded-md cursor-pointer transition-all border",
                                        isSelected 
                                            ? "bg-slate-900 border-[#CCFF00]/30 shadow-[0_0_10px_rgba(204,255,0,0.05)]" 
                                            : "bg-transparent border-transparent hover:bg-slate-900 hover:border-slate-800"
                                    )}
                                    onClick={() => actions?.toggleWellSelection && actions.toggleWellSelection(well.id)}
                                >
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold mr-3 border shrink-0",
                                        isSelected 
                                            ? "bg-[#CCFF00]/10 border-[#CCFF00] text-[#CCFF00]" 
                                            : "bg-slate-800 border-slate-700 text-slate-400 group-hover:border-slate-600 group-hover:text-slate-300"
                                    )}>
                                        W
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        <div className={cn("text-sm font-medium truncate mb-0.5", isSelected ? "text-white" : "text-slate-300")}>
                                            {well.name || 'Unnamed Well'}
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] text-slate-500">
                                            <span className="truncate max-w-[80px]">{well.field || 'Unknown Field'}</span>
                                            <span className="w-1 h-1 bg-slate-600 rounded-full" />
                                            <span className={cn("px-1 rounded-sm", isSelected ? "bg-[#CCFF00]/10 text-[#CCFF00]" : "bg-slate-800")}>
                                                Active
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </ScrollArea>
            
            <WellImportDialog open={importOpen} onOpenChange={setImportOpen} />
        </div>
    );
};

export default WellListPanel;