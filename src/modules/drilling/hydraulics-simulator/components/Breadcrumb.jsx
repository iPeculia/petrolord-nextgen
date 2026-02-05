import React from 'react';
import { useHydraulicsSimulator } from '@/contexts/HydraulicsSimulatorContext';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumb = () => {
  const { current_project, current_well, current_scenario } = useHydraulicsSimulator();

  return (
    <div className="flex items-center text-xs text-slate-400 h-8 px-4 bg-slate-900/50 border-b border-slate-800">
      <Home className="h-3 w-3 mr-2 text-slate-500" />
      
      {current_project && (
        <>
          <ChevronRight className="h-3 w-3 mx-1 text-slate-600" />
          <span className="hover:text-slate-200 cursor-pointer transition-colors">{current_project.name}</span>
        </>
      )}
      
      {current_well && (
        <>
          <ChevronRight className="h-3 w-3 mx-1 text-slate-600" />
          <span className="hover:text-slate-200 cursor-pointer transition-colors">{current_well.name}</span>
        </>
      )}

      {current_scenario && (
        <>
          <ChevronRight className="h-3 w-3 mx-1 text-slate-600" />
          <span className="text-blue-400 font-medium">{current_scenario.name}</span>
        </>
      )}
    </div>
  );
};

export default Breadcrumb;