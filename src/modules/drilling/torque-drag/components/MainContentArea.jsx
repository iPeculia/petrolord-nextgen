import React from 'react';
import { useTorqueDrag } from '@/contexts/TorqueDragContext';
import WellboreVisualizationCanvas from './WellboreVisualizationCanvas';
import SetupWorkspace from './SetupWorkspace';

const MainContentArea = () => {
  const { current_tab } = useTorqueDrag();

  return (
    <div className="flex-1 bg-[#0f172a] p-4 overflow-hidden flex flex-col">
      {/* Content specific to current tab */}
      
      {current_tab === 'Setup' && (
          <SetupWorkspace />
      )}

      {current_tab === 'Trajectory' && (
          <div className="flex-1 border border-slate-700 rounded-lg overflow-hidden flex flex-col">
            <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 text-xs text-slate-400">
                Visualization Mode
            </div>
            <WellboreVisualizationCanvas />
          </div>
      )}

      {current_tab === 'Pipe String' && (
          <div className="flex-1 flex items-center justify-center text-slate-500">
             <div className="text-center max-w-md">
                 <h3 className="text-lg font-medium text-slate-300 mb-2">Pipe String Configuration</h3>
                 <p>Configure your BHA and drill string components in the <strong>Setup</strong> tab (Step 4 & 5).</p>
             </div>
          </div>
      )}

      {current_tab === 'Analysis' && (
           <div className="flex-1 flex items-center justify-center text-slate-500">
             <div className="text-center max-w-md">
                <h3 className="text-lg font-medium text-slate-300 mb-2">Analysis Engine</h3>
                <p>Simulation controls and parameters will be available here once setup is complete.</p>
             </div>
          </div>
      )}
      
      {current_tab === 'Results' && (
           <div className="flex-1 flex items-center justify-center text-slate-500">
             <p>Results Dashboard Placeholder</p>
          </div>
      )}
      
      {current_tab === 'Settings' && (
           <div className="flex-1 flex items-center justify-center text-slate-500">
             <p>Application Settings Placeholder</p>
          </div>
      )}
    </div>
  );
};

export default MainContentArea;