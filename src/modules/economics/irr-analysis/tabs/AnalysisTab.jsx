import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, RotateCcw } from 'lucide-react';
import { useIRRAnalysis } from '@/context/economics/IRRAnalysisContext';

const AnalysisTab = () => {
  const { currentProject } = useIRRAnalysis();

  if (!currentProject) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-slate-400">Please select a project to run analysis.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Analysis & Calculation</h2>
          <p className="text-slate-400 text-sm mt-1">Run economic models and sensitivity analysis.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
            <RotateCcw className="w-4 h-4 mr-2" /> Reset
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Play className="w-4 h-4 mr-2" /> Run Analysis
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-[#1E293B] border-slate-700 col-span-1">
          <CardHeader>
            <CardTitle className="text-lg text-white">Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="space-y-2">
                <label className="text-xs text-slate-400 uppercase font-bold">Discount Rate (%)</label>
                <div className="p-3 bg-slate-900 rounded border border-slate-700 text-slate-200">
                    10.0
                </div>
             </div>
             <div className="space-y-2">
                <label className="text-xs text-slate-400 uppercase font-bold">Inflation Rate (%)</label>
                <div className="p-3 bg-slate-900 rounded border border-slate-700 text-slate-200">
                    2.5
                </div>
             </div>
             <div className="space-y-2">
                <label className="text-xs text-slate-400 uppercase font-bold">Tax Rate (%)</label>
                <div className="p-3 bg-slate-900 rounded border border-slate-700 text-slate-200">
                    21.0
                </div>
             </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1E293B] border-slate-700 col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg text-white">Cash Flow Projection</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="h-[300px] flex items-center justify-center border border-dashed border-slate-700 rounded-md bg-slate-900/50">
              <p className="text-sm text-slate-500">Run analysis to visualize projections</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalysisTab;