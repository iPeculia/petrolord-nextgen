import React from 'react';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useFacilityMasterPlanner } from '../../context/FacilityMasterPlannerContext';
import { cn } from '@/lib/utils';
import RightPanel from './RightPanel'; 
import DataValidationSummary from '../guidance/DataValidationSummary';

const RightPanelCollapsible = () => {
  const { isRightPanelOpen, setIsRightPanelOpen } = useFacilityMasterPlanner();

  return (
    <div 
        className={cn(
            "relative bg-[#1a1a1a] border-l border-[#333333] transition-all duration-300 ease-in-out shrink-0 flex flex-col z-30",
            isRightPanelOpen ? "w-[300px]" : "w-0 border-l-0"
        )}
    >
        <div className="w-[300px] h-full flex flex-col overflow-hidden">
            <RightPanel />
            <div className="p-4 border-t border-slate-800 bg-[#161e2e] shrink-0">
                 <h4 className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Validation Status</h4>
                 <DataValidationSummary />
            </div>
        </div>

        {/* Toggle Button */}
         <button
            onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
            className="absolute -left-3 top-1/2 -translate-y-1/2 z-50 w-6 h-6 bg-[#0f172a] border border-[#333333] rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:border-blue-500 transition-colors shadow-lg"
        >
            {isRightPanelOpen ? <ChevronsRight className="w-3 h-3" /> : <ChevronsLeft className="w-3 h-3" />}
        </button>
    </div>
  );
};

export default RightPanelCollapsible;