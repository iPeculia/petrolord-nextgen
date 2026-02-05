import React from 'react';
import { useWellTestAnalysisContext } from '@/contexts/WellTestAnalysisContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from 'lucide-react';

const DeliverabilityAnalysis = () => {
  const { state } = useWellTestAnalysisContext();
  const { flowCapacity } = state.matchingResults;

  if (!flowCapacity) return null;

  return (
    <Card className="bg-slate-900 border-slate-800 mt-2">
        <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-400" />
                Deliverability Results
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-950 p-3 rounded border border-slate-800">
                    <div className="text-xs text-slate-500">Flow Capacity (kh)</div>
                    <div className="text-lg font-bold text-white">{flowCapacity.kh?.toFixed(1)} <span className="text-xs font-normal text-slate-400">md-ft</span></div>
                </div>
                <div className="bg-slate-950 p-3 rounded border border-slate-800">
                    <div className="text-xs text-slate-500">Productivity Index</div>
                    <div className="text-lg font-bold text-white">{flowCapacity.pi?.toFixed(2)} <span className="text-xs font-normal text-slate-400">bbl/d/psi</span></div>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Ideal PI (s=0):</span>
                    <span className="text-slate-200">{flowCapacity.piIdeal?.toFixed(2)} bbl/d/psi</span>
                </div>
                <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Flow Efficiency:</span>
                    <span className={`${flowCapacity.flowEfficiency < 0.8 ? 'text-red-400' : 'text-green-400'}`}>
                        {(flowCapacity.flowEfficiency * 100)?.toFixed(1)}%
                    </span>
                </div>
                <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Damage Ratio:</span>
                    <span className="text-slate-200">{flowCapacity.damageRatio?.toFixed(2)}</span>
                </div>
            </div>
        </CardContent>
    </Card>
  );
};

export default DeliverabilityAnalysis;