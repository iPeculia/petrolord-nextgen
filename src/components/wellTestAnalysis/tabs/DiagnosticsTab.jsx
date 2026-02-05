import React, { useEffect } from 'react';
import { useWellTestAnalysis } from '@/hooks/useWellTestAnalysis';
import LogLogPlot from '../plots/LogLogPlot';
import SemiLogPlot from '../plots/SemiLogPlot';
import PatternAssistant from '../PatternAssistant';
import PlotToolbar from '../PlotToolbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const DiagnosticsTab = () => {
  const { state, dispatch } = useWellTestAnalysis();
  
  // Ensure diagnostics are run when mounting this tab if not already
  useEffect(() => {
      if (state.standardizedData.length > 0 && state.diagnosticData.length === 0) {
          dispatch({ type: 'RUN_DIAGNOSTICS' });
      }
  }, [state.standardizedData.length, state.diagnosticData.length, dispatch]);

  return (
    <div className="flex flex-col h-full bg-slate-950">
        {/* Toolbar */}
        <div className="shrink-0">
           <PlotToolbar />
        </div>

        <div className="flex-1 flex overflow-hidden">
            {/* Main Plot Area */}
            <div className="flex-1 p-2 flex flex-col min-w-0">
                <Tabs defaultValue="loglog" className="h-full flex flex-col">
                    <TabsList className="bg-slate-900 w-fit mb-2">
                        <TabsTrigger value="loglog">Log-Log (Derivative)</TabsTrigger>
                        <TabsTrigger value="semilog">Semi-Log (Horner/MDH)</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="loglog" className="flex-1 mt-0 min-h-0 relative">
                        <LogLogPlot />
                    </TabsContent>
                    
                    <TabsContent value="semilog" className="flex-1 mt-0 min-h-0 relative">
                        <SemiLogPlot />
                    </TabsContent>
                </Tabs>
            </div>

            {/* Right Side Info Panel */}
            <div className="w-80 p-2 border-l border-slate-800 shrink-0 overflow-y-auto bg-slate-950">
                <PatternAssistant />
            </div>
        </div>
    </div>
  );
};

export default DiagnosticsTab;