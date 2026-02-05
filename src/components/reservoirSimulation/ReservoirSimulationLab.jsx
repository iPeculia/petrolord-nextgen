import React, { useEffect, memo } from 'react';
import { useReservoirSimulation } from '@/context/ReservoirSimulationContext.jsx';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { Loader2 } from 'lucide-react';

// Import child components safely
import RSLLeftSidebar from './RSLLeftSidebar.jsx';
import RSLCenterVisualization from './RSLCenterVisualization.jsx';
import RSLRightPanel from './RSLRightPanel.jsx';

const ReservoirSimulationLab = memo(() => {
    const { state } = useReservoirSimulation();
    const { selectedModel } = state;

    if (!selectedModel) {
        return (
            <div className="flex h-full w-full items-center justify-center bg-slate-950 text-slate-400 gap-2">
                <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
                <span>Initializing Lab Environment...</span>
            </div>
        );
    }

    return (
        <div className="h-full w-full bg-slate-950 flex flex-col overflow-hidden">
             <PanelGroup direction="horizontal" className="h-full w-full">
                {/* Left Sidebar: Controls & Models */}
                <Panel defaultSize={20} minSize={15} maxSize={30} className="border-r border-slate-800 bg-slate-900/50">
                    <RSLLeftSidebar />
                </Panel>
                
                <PanelResizeHandle className="w-1 bg-slate-800 hover:bg-emerald-500 transition-colors" />

                {/* Center: Visualization */}
                <Panel defaultSize={60} minSize={30}>
                    <RSLCenterVisualization />
                </Panel>

                <PanelResizeHandle className="w-1 bg-slate-800 hover:bg-emerald-500 transition-colors" />

                {/* Right: Details & Results */}
                <Panel defaultSize={20} minSize={15} maxSize={35} className="border-l border-slate-800 bg-slate-900/50">
                    <RSLRightPanel />
                </Panel>
            </PanelGroup>
        </div>
    );
});

export default ReservoirSimulationLab;