import React from 'react';
import { 
  ChevronRight, 
  Home, 
  Save, 
  Download, 
  Share2, 
  Settings, 
  Menu,
  Sidebar 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWellPlanningDesign } from '@/contexts/WellPlanningDesignContext';
import { cn } from '@/lib/utils';

const TopBanner = () => {
  const { 
    currentProject, 
    currentWell, 
    toggleLeftPanel, 
    toggleRightPanel,
    state 
  } = useWellPlanningDesign();

  const { leftPanelOpen, rightPanelOpen } = state.ui;

  return (
    <div className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 shrink-0">
      {/* Left Section: Navigation & Context */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleLeftPanel}
          className={cn("text-slate-400 hover:text-white hover:bg-slate-800", leftPanelOpen && "bg-slate-800 text-white")}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Home className="h-4 w-4" />
          <ChevronRight className="h-4 w-4" />
          <span className="hover:text-white cursor-pointer transition-colors">Drilling</span>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-white">Well Planning</span>
        </div>

        <div className="h-6 w-px bg-slate-700 mx-2" />

        <div className="flex flex-col">
           <div className="flex items-center gap-2">
             <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">Project</span>
             <span className="text-sm font-semibold text-slate-200">
               {currentProject ? currentProject.name : 'No Project Selected'}
             </span>
           </div>
        </div>
      </div>

      {/* Center Section: Toolbar (Optional) */}
      <div className="hidden md:flex items-center gap-2">
         {/* Tools can go here */}
      </div>

      {/* Right Section: Actions */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white gap-2">
          <Save className="h-4 w-4" />
          <span className="hidden sm:inline">Save</span>
        </Button>
        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white gap-2">
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Export</span>
        </Button>
        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
          <Share2 className="h-4 w-4" />
        </Button>
        
        <div className="h-6 w-px bg-slate-700 mx-2" />
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleRightPanel}
          className={cn("text-slate-400 hover:text-white hover:bg-slate-800", rightPanelOpen && "bg-slate-800 text-white")}
        >
          <Sidebar className="h-5 w-5 transform scale-x-[-1]" />
        </Button>
      </div>
    </div>
  );
};

export default TopBanner;