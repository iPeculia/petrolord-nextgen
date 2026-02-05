import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Activity, MapPin, MoreVertical, Droplet, Edit, Trash2, FileBarChart } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

const WellsList = ({ wells, activeWellId, onSelect, onEdit, onDelete, isLoading }) => {
  
  // Helper to stop propagation for menu items
  const handleMenuAction = (e, action) => {
      e.preventDefault();
      e.stopPropagation();
      action();
  };

  if (isLoading && wells.length === 0) {
      return (
        <div className="flex flex-col gap-3 p-2">
            {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-slate-900/50 animate-pulse rounded-lg border border-slate-800" />
            ))}
        </div>
      );
  }

  if (!wells || wells.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center p-6 border-2 border-dashed border-slate-800 rounded-xl bg-slate-900/20 mx-2 my-4">
        <div className="bg-slate-900 p-3 rounded-full mb-3">
            <Droplet className="w-6 h-6 text-slate-500" />
        </div>
        <h3 className="text-slate-300 font-medium mb-1">No wells found</h3>
        <p className="text-sm text-slate-500 max-w-[200px]">
            Get started by adding a new well to your project.
        </p>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'active': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'abandoned': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'planned': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-2 space-y-1">
        {wells.map((well) => {
           const isActive = activeWellId === well.id;
           
           return (
            <div
                key={well.id}
                onClick={() => onSelect(well.id)}
                className={cn(
                  "group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all border select-none",
                  isActive 
                    ? "bg-slate-900 border-slate-700 shadow-sm ring-1 ring-[#BFFF00]/30" 
                    : "border-transparent hover:bg-slate-900/50 hover:border-slate-800"
                )}
            >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors",
                    isActive ? "bg-[#BFFF00] text-black" : "bg-slate-800 text-slate-400 group-hover:bg-slate-700"
                  )}>
                    <Activity className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <h4 className={cn(
                        "text-sm font-medium truncate transition-colors",
                        isActive ? "text-white" : "text-slate-300"
                        )}>
                        {well.name}
                        </h4>
                        {/* We can check logs existence if passed, but simplifying for now */}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                      <div className="flex items-center gap-1 min-w-0">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate max-w-[80px]">{well.field || well.location?.name || 'Unknown Loc'}</span>
                      </div>
                      <span className="w-1 h-1 rounded-full bg-slate-700" />
                      <span className={cn("px-1.5 py-px rounded", getStatusColor(well.status))}>
                        {well.status || 'Unknown'}
                      </span>
                    </div>
                  </div>
                </div>

                <div onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity hover:text-slate-200 hover:bg-slate-800 focus:opacity-100"
                            >
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-slate-950 border-slate-800 text-slate-200 w-40">
                            <DropdownMenuItem 
                                onClick={(e) => handleMenuAction(e, () => onSelect(well.id))}
                                className="cursor-pointer hover:bg-slate-900 focus:bg-slate-900"
                            >
                                <Activity className="mr-2 h-3.5 w-3.5 text-[#BFFF00]" /> Activate
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                onClick={(e) => handleMenuAction(e, () => onEdit(well))}
                                className="cursor-pointer hover:bg-slate-900 focus:bg-slate-900"
                            >
                                <Edit className="mr-2 h-3.5 w-3.5 text-blue-400" /> Edit Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-slate-800" />
                            <DropdownMenuItem 
                                onClick={(e) => handleMenuAction(e, () => onDelete(well))}
                                className="text-red-400 hover:text-red-300 hover:bg-red-900/20 focus:bg-red-900/20 cursor-pointer"
                            >
                                <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete Well
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
           );
        })}
      </div>
    </ScrollArea>
  );
};

export default WellsList;