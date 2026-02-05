import React, { memo } from 'react';
import { useReservoirSimulation } from '@/context/ReservoirSimulationContext.jsx';
import RSLLeftSidebar from '../RSLLeftSidebar.jsx';
import RSLCenterVisualization from '../RSLCenterVisualization.jsx';
import RSLRightPanel from '../RSLRightPanel.jsx';
import MiniSimulatorTab from './MiniSimulatorTab.jsx';

const SimulationLabTab = memo(() => {
  const { state } = useReservoirSimulation();
  
  if (!state) return null;
  
  // Determine if we show the Mini Simulator (standalone tool) or the main visualization
  const showMiniSim = state.activeSidebarTab === 'simulator';

  return (
    <div className="flex h-full w-full border border-slate-800 rounded-lg overflow-hidden bg-slate-950 shadow-sm">
       {/* Left Sidebar - Always visible for model selection/setup */}
       <div className="w-80 border-r border-slate-800 bg-slate-900/50 flex-shrink-0">
          <RSLLeftSidebar />
       </div>
       
       {/* Main Content Area */}
       <div className="flex-1 min-w-0 bg-slate-950 relative flex flex-col overflow-hidden">
           {showMiniSim ? (
               <MiniSimulatorTab />
           ) : (
               <div className="flex h-full">
                   <RSLCenterVisualization />
                   <div className="w-72 border-l border-slate-800 bg-slate-900/30 flex-shrink-0">
                      <RSLRightPanel />
                   </div>
               </div>
           )}
       </div>
    </div>
  );
});

export default SimulationLabTab;