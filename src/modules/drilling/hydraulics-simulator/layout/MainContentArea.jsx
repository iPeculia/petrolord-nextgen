import React from 'react';
import { useHydraulicsSimulator } from '@/contexts/HydraulicsSimulatorContext';
import HydraulicsSchematicCanvas from '../components/HydraulicsSchematicCanvas';
import Breadcrumb from '../components/Breadcrumb';
import SetupWorkspace from '../components/SetupWorkspace';

const MainContentArea = () => {
  const { current_tab } = useHydraulicsSimulator();

  return (
    <div className="flex-1 bg-[#0f172a] flex flex-col min-w-0 overflow-hidden relative">
      <Breadcrumb />
      
      <div className="flex-1 overflow-hidden flex flex-col">
         {current_tab === 'Setup' && (
             <SetupWorkspace />
         )}

         {current_tab === 'Hydraulics' && (
             <div className="flex-1 h-full w-full p-4 overflow-auto">
                 <div className="h-full w-full bg-slate-900 rounded-lg border border-slate-800 p-4">
                     <HydraulicsSchematicCanvas />
                 </div>
             </div>
         )}

         {current_tab === 'Simulation' && (
             <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
                 <h2 className="text-xl font-light text-slate-400 mb-2">Simulation Engine</h2>
                 <p className="text-sm">Run steady-state and transient simulations.</p>
             </div>
         )}

         {current_tab === 'Results' && (
             <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
                 <h2 className="text-xl font-light text-slate-400 mb-2">Analysis Results</h2>
                 <p className="text-sm">View ECD plots, pressure loss distribution, and optimization suggestions.</p>
             </div>
         )}

          {current_tab === 'Settings' && (
             <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
                 <h2 className="text-xl font-light text-slate-400 mb-2">Application Settings</h2>
                 <p className="text-sm">Configure units, default parameters, and solver options.</p>
             </div>
         )}
      </div>
    </div>
  );
};

export default MainContentArea;