import React from 'react';
import { useWellPlanningDesign } from '@/contexts/WellPlanningDesignContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Folder, CircleDot, Plus, Search, Map, Settings, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LeftPanel = () => {
  const { 
    state, 
    currentProject, 
    currentWell, 
    projectWells, 
    setCurrentProject, 
    setCurrentWell,
    createWell
  } = useWellPlanningDesign();

  const handleCreateWell = () => {
    // Placeholder for actual creation logic modal
    createWell({
      name: `New Well ${projectWells.length + 1}`,
      type: 'Vertical',
      targetDepth: 10000,
      location: { lat: 0, long: 0 },
      status: 'Draft',
      holeSize: 12.25
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#1a1a2e] border-r border-[#252541]">
      {/* Project Selector Header */}
      <div className="p-4 border-b border-[#252541]">
        <div className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Project</div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between bg-[#252541] border-none text-[#e0e0e0] hover:bg-[#2f2f50] hover:text-white">
              <span className="truncate">{currentProject?.name || 'Select Project'}</span>
              <Folder className="h-4 w-4 ml-2 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[240px] bg-[#252541] border-[#3a3a5e] text-[#e0e0e0]">
            {state.projects.map(proj => (
              <DropdownMenuItem 
                key={proj.id} 
                onClick={() => setCurrentProject(proj.id)}
                className="hover:bg-[#3a3a5e] cursor-pointer"
              >
                {proj.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem className="text-[#FFC107] border-t border-[#3a3a5e] mt-1 pt-2 cursor-pointer">
              <Plus className="h-4 w-4 mr-2" /> Create New Project
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Well Explorer */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="p-4 pb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#e0e0e0]">Wells</h3>
          <Button size="icon" variant="ghost" className="h-6 w-6 text-slate-400 hover:text-white" onClick={handleCreateWell}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="px-4 mb-2">
           <div className="relative">
             <Search className="absolute left-2 top-2.5 h-3 w-3 text-slate-500" />
             <Input placeholder="Search wells..." className="pl-8 h-8 bg-[#252541] border-none text-xs text-[#e0e0e0] placeholder:text-slate-500" />
           </div>
        </div>

        <ScrollArea className="flex-1 px-2">
          <div className="space-y-1 py-2">
            {projectWells.map((well) => (
              <div
                key={well.id}
                onClick={() => setCurrentWell(well.id)}
                className={cn(
                  "group flex items-center justify-between px-3 py-2.5 rounded-md cursor-pointer transition-all border border-transparent",
                  currentWell?.id === well.id 
                    ? "bg-[#2f2f50] border-l-[#FFC107] border-l-4" 
                    : "hover:bg-[#252541] text-slate-400 hover:text-[#e0e0e0]"
                )}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className={cn(
                    "h-2 w-2 rounded-full shrink-0",
                    well.status === 'Active' ? 'bg-[#4CAF50]' : 'bg-slate-500'
                  )} />
                  <div className="flex flex-col overflow-hidden">
                    <span className={cn(
                      "text-sm font-medium truncate",
                      currentWell?.id === well.id ? "text-white" : ""
                    )}>{well.name}</span>
                    <span className="text-[10px] text-slate-500 truncate">{well.type} • {well.targetDepth} ft</span>
                  </div>
                </div>
                <MoreVertical className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 hover:text-white" />
              </div>
            ))}
            
            {projectWells.length === 0 && (
               <div className="text-center py-8 text-slate-500 text-xs italic">
                 No wells in this project. <br/> Click + to add one.
               </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Footer / User Settings */}
      <div className="p-4 border-t border-[#252541] bg-[#151525]">
        <div className="flex items-center gap-3 text-slate-400 hover:text-white cursor-pointer transition-colors">
          <div className="p-2 rounded-full bg-[#252541]">
             <Settings className="h-4 w-4" />
          </div>
          <div className="text-xs">
            <div className="font-medium">Project Settings</div>
            <div className="text-[10px] text-slate-500">Units: Field (API)</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftPanel;