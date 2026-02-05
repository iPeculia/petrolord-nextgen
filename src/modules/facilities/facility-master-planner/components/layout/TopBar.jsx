import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, Bell, Menu, LayoutGrid, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFacilityMasterPlanner } from '../../context/FacilityMasterPlannerContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const TopBar = () => {
  const { isLeftSidebarOpen, setIsLeftSidebarOpen, isRightPanelOpen, setIsRightPanelOpen } = useFacilityMasterPlanner();
  const navigate = useNavigate();

  return (
    <header className="h-[48px] bg-[#0f172a] border-b border-[#333333] flex items-center justify-between px-4 z-50 shrink-0">
      <div className="flex items-center gap-4">
         <div className="flex items-center gap-1">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-slate-400 hover:text-white hover:bg-white/10"
                            onClick={() => navigate('/dashboard/modules/facilities')}
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">Back to Facilities</TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-slate-400 hover:text-white hover:bg-white/10"
                onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
            >
                <Menu className="w-5 h-5" />
            </Button>
         </div>

         <div className="h-6 w-px bg-slate-700 mx-2" />

         <div className="flex items-center gap-3 select-none">
             <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-900/20">
                 <LayoutGrid className="w-5 h-5 text-white" />
             </div>
             <div>
                <h1 className="font-bold text-white text-sm tracking-tight leading-none">Facility Master Planner</h1>
                <span className="text-[10px] text-blue-400 font-medium tracking-wide uppercase">Studio</span>
             </div>
         </div>
      </div>

      <div className="flex items-center gap-2">
         <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white hover:bg-white/10 relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0f172a]" />
         </Button>
         <Button 
            variant="ghost" 
            size="icon" 
            className={`h-8 w-8 transition-colors ${isRightPanelOpen ? 'text-blue-400 bg-blue-500/10' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
            onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
         >
            <Settings className="w-4 h-4" />
         </Button>
         
         <div className="h-6 w-px bg-slate-700 mx-2" />
         
         <div className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-white/5 cursor-pointer transition-colors border border-transparent hover:border-slate-700">
            <div className="w-6 h-6 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center overflow-hidden">
                <User className="w-4 h-4 text-slate-400" />
            </div>
         </div>
      </div>
    </header>
  );
};

export default TopBar;