import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Activity } from 'lucide-react';
import { usePressureTransient } from '@/context/PressureTransientContext';

const AnalysisTab = () => {
  const { currentWell, currentTest } = usePressureTransient();

  if (!currentWell || !currentTest) {
    return (
       <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4 animate-in fade-in duration-500">
          <div className="p-4 bg-slate-900 rounded-full border border-slate-800">
             <LineChart className="w-12 h-12 text-slate-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-300">Analysis Not Ready</h2>
          <p className="text-slate-500 max-w-md">
            Please select a <strong>Well</strong> and a <strong>Pressure Test</strong> to begin the diagnostic analysis.
          </p>
       </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-2xl font-bold text-white">Diagnostic Analysis</h2>
            <p className="text-slate-400">{currentWell.name} - {currentTest.test_type} Test</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-slate-900 border-slate-800 lg:col-span-2 min-h-[500px]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <LineChart className="w-5 h-5 text-blue-500" />
              Log-Log Diagnostic Plot
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[450px] flex items-center justify-center text-slate-500 bg-slate-950/30 m-6 rounded-lg border border-slate-800 border-dashed">
             Chart Area (Coming in Phase 4)
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800 min-h-[500px]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-500" />
              Model Parameters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-slate-950/50 border border-slate-800 text-center text-slate-500">
              Parameter Estimation Tool
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalysisTab;