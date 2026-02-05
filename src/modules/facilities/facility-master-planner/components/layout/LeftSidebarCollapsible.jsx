import React from 'react';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useFacilityMasterPlanner } from '../../context/FacilityMasterPlannerContext';
import { cn } from '@/lib/utils';
import LeftSidebar from './LeftSidebar';

const LeftSidebarCollapsible = () => {
  const { isLeftSidebarOpen, setIsLeftSidebarOpen } = useFacilityMasterPlanner();

  return (
    <div 
        className={cn(
            "relative bg-[#1a1a1a] border-r border-[#333333] transition-all duration-300 ease-in-out shrink-0 flex flex-col",
            isLeftSidebarOpen ? "w-[240px]" : "w-[60px]"
        )}
    >
        <div className="flex-1 overflow-hidden w-full relative">
            <LeftSidebar isCollapsed={!isLeftSidebarOpen} />
        </div>

        {/* Toggle Button */}
        <button
            onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
            className="absolute -right-3 top-1/2 -translate-y-1/2 z-50 w-6 h-6 bg-[#0f172a] border border-[#333333] rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:border-blue-500 transition-colors shadow-lg"
        >
            {isLeftSidebarOpen ? <ChevronsLeft className="w-3 h-3" /> : <ChevronsRight className="w-3 h-3" />}
        </button>
    </div>
  );
};

export default LeftSidebarCollapsible;