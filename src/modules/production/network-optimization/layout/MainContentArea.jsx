import React from 'react';
import NetworkVisualizationCanvas from '../components/NetworkVisualizationCanvas';
import TabPanel from '../components/TabPanel';
import QuickStatsPanel from '../components/QuickStatsPanel';
import { useNetworkOptimization } from '@/context/NetworkOptimizationContext';

const MainContentArea = () => {
  const { currentNetwork } = useNetworkOptimization();

  if (!currentNetwork) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#020617]">
        <div className="text-center space-y-4">
           <h2 className="text-2xl font-bold text-slate-200">No Network Selected</h2>
           <p className="text-slate-400">Create a new network or select one from the header to begin.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-[#020617]">
      {/* Canvas Area (Left/Top) */}
      <div className="flex-1 relative flex flex-col min-h-[50vh]">
        <div className="absolute top-4 left-4 z-10">
          <QuickStatsPanel />
        </div>
        <NetworkVisualizationCanvas />
      </div>

      {/* Properties/Tab Panel (Right/Bottom) */}
      <div className="w-full md:w-[350px] lg:w-[400px] border-l border-slate-800 bg-[#0F172A] flex flex-col overflow-hidden transition-all duration-300">
        <TabPanel />
      </div>
    </div>
  );
};

export default MainContentArea;