import React from 'react';
import { useWellTestAnalysis } from '@/hooks/useWellTestAnalysis';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { ZoomIn, Activity, Download, Settings2 } from 'lucide-react';

const PlotToolbar = () => {
  const { state, dispatch } = useWellTestAnalysis();
  const { plotSettings } = state;

  const toggleLogScale = () => {
    dispatch({ type: 'UPDATE_PLOT_SETTINGS', payload: { logScale: !plotSettings.logScale } });
  };

  const toggleRate = () => {
    dispatch({ type: 'UPDATE_PLOT_SETTINGS', payload: { showRate: !plotSettings.showRate } });
  };

  return (
    <div className="h-10 border-b border-slate-800 bg-slate-900 flex items-center px-4 gap-2">
       <div className="flex items-center gap-1 border-r border-slate-800 pr-2">
          <Toggle 
            pressed={plotSettings.logScale} 
            onPressedChange={toggleLogScale}
            size="sm" 
            className="data-[state=on]:bg-slate-700 data-[state=on]:text-[#BFFF00] text-slate-400 hover:text-white"
          >
             <span className="text-xs font-bold mr-1">Log</span> X
          </Toggle>
       </div>

       <div className="flex items-center gap-1 border-r border-slate-800 pr-2">
          <Toggle 
            pressed={plotSettings.showRate} 
            onPressedChange={toggleRate}
            size="sm" 
            className="data-[state=on]:bg-slate-700 data-[state=on]:text-orange-400 text-slate-400 hover:text-white"
          >
             <Activity className="w-4 h-4 mr-1" /> Rate
          </Toggle>
       </div>
       
       <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-8 text-slate-400 hover:text-white">
             <Download className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 text-slate-400 hover:text-white">
             <Settings2 className="w-4 h-4" />
          </Button>
       </div>
    </div>
  );
};

export default PlotToolbar;