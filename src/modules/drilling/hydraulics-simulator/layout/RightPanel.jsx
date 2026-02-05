import React from 'react';
import { useHydraulicsSimulator } from '@/contexts/HydraulicsSimulatorContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronLeft, ChevronRight, PanelRightClose, PanelRightOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

// Sub-components
import WellPropertiesPanel from '../components/WellPropertiesPanel';
import ScenarioParametersPanel from '../components/ScenarioParametersPanel';
import SimulationResultsPanel from '../components/SimulationResultsPanel';
import QuickStatsPanel from '../components/QuickStatsPanel';

const RightPanel = () => {
    const { rightPanelCollapsed, toggleRightPanel } = useHydraulicsSimulator();

    return (
        <div 
            className={cn(
                "h-full bg-[#1a1a1a] border-l border-slate-800 flex flex-col transition-all duration-300 ease-in-out relative z-40",
                rightPanelCollapsed ? "w-0 border-none" : "w-[300px]"
            )}
        >
            {/* Collapse Toggle (Outside when collapsed, inside when expanded) */}
            <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleRightPanel}
                className={cn(
                    "absolute top-2 h-6 w-6 rounded-full bg-slate-800 border border-slate-700 shadow-sm z-50 text-slate-400 hover:text-white transition-all",
                    rightPanelCollapsed ? "-left-8" : "-left-3"
                )}
            >
                {rightPanelCollapsed ? <PanelRightOpen className="h-3 w-3" /> : <PanelRightClose className="h-3 w-3" />}
            </Button>

            {!rightPanelCollapsed && (
                <div className="flex flex-col h-full overflow-hidden">
                    <div className="h-10 border-b border-slate-800 flex items-center px-4 shrink-0">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Properties & Results</span>
                    </div>
                    
                    <ScrollArea className="flex-1">
                        <div className="flex flex-col h-full">
                            <QuickStatsPanel />
                            <WellPropertiesPanel />
                            <ScenarioParametersPanel />
                            <SimulationResultsPanel />
                        </div>
                    </ScrollArea>
                </div>
            )}
        </div>
    );
};

export default RightPanel;