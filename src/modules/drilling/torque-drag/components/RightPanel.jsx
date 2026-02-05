import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTorqueDrag } from '@/contexts/TorqueDragContext';
import WellPropertiesPanel from './panels/WellPropertiesPanel';
import QuickStatsPanel from './panels/QuickStatsPanel';
import AnalysisResultsPanel from './panels/AnalysisResultsPanel';

const RightPanel = () => {
  const { rightPanelCollapsed, toggleRightPanel } = useTorqueDrag();

  return (
    <div 
      className={`bg-[#1a1a1a] border-l border-slate-800 flex flex-col transition-all duration-300 ease-in-out ${
        rightPanelCollapsed ? 'w-0 overflow-hidden' : 'w-[300px]'
      }`}
    >
        <div className="flex items-center justify-between p-2 border-b border-slate-800">
            <span className="text-xs font-semibold text-slate-400 uppercase">Details</span>
            <Button variant="ghost" size="sm" onClick={toggleRightPanel} className="h-6 w-6 p-0">
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>

        <ScrollArea className="flex-1">
            <div className="p-4">
                <WellPropertiesPanel />
                <QuickStatsPanel />
                <AnalysisResultsPanel />
            </div>
        </ScrollArea>
    </div>
  );
};

export default RightPanel;