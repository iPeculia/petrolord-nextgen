import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useArtificialLift } from '../context/ArtificialLiftContext';
import { 
  ChevronLeft, 
  ChevronRight, 
  Info,
  Activity,
  Droplets,
  Search,
  Plus
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

const ALDRightSidebar = ({ isCollapsed, toggleCollapse, onTabChange }) => {
  const { currentWell, wells, setCurrentWellId, productionData } = useArtificialLift();
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredWells = wells.filter(w => 
    w.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const prodData = currentWell ? productionData[currentWell.well_id] : null;

  return (
    <aside 
      className={cn(
        "flex flex-col bg-[#0F172A] border-l border-slate-800 transition-all duration-300 ease-in-out relative z-40 h-full",
        isCollapsed ? "w-0 border-l-0" : "w-72"
      )}
    >
      {/* Toggle Button (Absolute positioned when collapsed to allow opening) */}
      <button
        onClick={toggleCollapse}
        className={cn(
            "absolute top-1/2 -translate-y-1/2 w-6 h-12 bg-[#1E293B] border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all z-50 rounded-l-md shadow-lg",
            isCollapsed ? "-left-6 border-r-0" : "left-0 -translate-x-1/2"
        )}
        title={isCollapsed ? "Show Well Panel" : "Hide Well Panel"}
      >
        {isCollapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>

      {!isCollapsed && (
        <div className="flex flex-col h-full overflow-hidden">
            
            {/* Panel Header */}
            <div className="p-4 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white uppercase tracking-wide">Well Summary</h3>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
                
                {/* Active Well Stats */}
                <div className="space-y-4">
                    <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
                        <div className="flex items-start justify-between mb-2">
                             <div>
                                <h4 className="text-sm font-semibold text-white">{currentWell?.name || "No Selection"}</h4>
                                <span className="text-xs text-slate-500">{currentWell?.location || "Unknown Location"}</span>
                             </div>
                             <div className={cn("w-2 h-2 rounded-full", currentWell?.status === 'Active' ? "bg-emerald-500" : "bg-slate-600")} />
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-3">
                             <StatItem label="Type" value={currentWell?.type} />
                             <StatItem label="MD" value={currentWell ? `${currentWell.depth_md} ft` : "-"} />
                        </div>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-1 gap-2">
                        <div className="bg-slate-800/30 rounded p-2 border border-slate-700/50 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Activity className="w-4 h-4 text-blue-500" />
                                <span className="text-xs text-slate-400">Production</span>
                            </div>
                            <span className="text-sm font-mono text-white">{prodData?.current_production_bpd || 0} <span className="text-slate-600 text-[10px]">bpd</span></span>
                        </div>
                         <div className="bg-slate-800/30 rounded p-2 border border-slate-700/50 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Droplets className="w-4 h-4 text-emerald-500" />
                                <span className="text-xs text-slate-400">Target</span>
                            </div>
                            <span className="text-sm font-mono text-white">{prodData?.target_production_bpd || 0} <span className="text-slate-600 text-[10px]">bpd</span></span>
                        </div>
                    </div>
                </div>

                <Separator className="bg-slate-800" />

                {/* Project Wells List */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Project Wells ({wells.length})</h4>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-blue-400 hover:text-blue-300" onClick={() => onTabChange('wells')}>
                            <Plus className="w-3 h-3" />
                        </Button>
                    </div>
                    
                    <div className="relative">
                        <Search className="absolute left-2 top-2 h-3 w-3 text-slate-500" />
                        <Input 
                            placeholder="Filter wells..." 
                            className="h-8 pl-7 bg-slate-900 border-slate-700 text-xs focus-visible:ring-1 focus-visible:ring-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="space-y-1 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                        {filteredWells.map(w => (
                            <button
                                key={w.well_id}
                                onClick={() => setCurrentWellId(w.well_id)}
                                className={cn(
                                    "w-full flex items-center justify-between p-2 rounded text-xs transition-colors border border-transparent",
                                    currentWell?.well_id === w.well_id 
                                        ? "bg-blue-500/10 text-blue-300 border-blue-500/20" 
                                        : "hover:bg-slate-800 text-slate-400 hover:text-white"
                                )}
                            >
                                <span className="truncate">{w.name}</span>
                                <span className={cn(
                                    "text-[9px] px-1.5 py-0.5 rounded-full uppercase",
                                    w.status === 'Active' ? "bg-emerald-500/10 text-emerald-500" : "bg-slate-700 text-slate-500"
                                )}>
                                    {w.status}
                                </span>
                            </button>
                        ))}
                         {filteredWells.length === 0 && (
                            <div className="text-center py-4 text-xs text-slate-600 italic">No wells found</div>
                        )}
                    </div>
                </div>

            </div>
        </div>
      )}
    </aside>
  );
};

const StatItem = ({ label, value }) => (
    <div>
        <span className="text-[10px] text-slate-500 block uppercase">{label}</span>
        <span className="text-xs text-slate-200 font-medium truncate block">{value || "-"}</span>
    </div>
);

export default ALDRightSidebar;