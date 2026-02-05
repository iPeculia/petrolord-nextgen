import React from 'react';
import { useNetworkOptimization } from '@/context/NetworkOptimizationContext';
import { Card, CardContent } from '@/components/ui/card';
import { Activity, AlertTriangle, ArrowUpRight, Zap } from 'lucide-react';

const QuickStatsPanel = () => {
  const { nodes, pipelines, facilities, optimizationResults } = useNetworkOptimization();

  // Calculate stats (Mocked logic or real if data available)
  const totalProduction = nodes
    .filter(n => n.type === 'Well' && n.well_data)
    .reduce((sum, n) => sum + (n.well_data.production_rate_bpd || 0), 0);

  const lastResult = optimizationResults[optimizationResults.length - 1];
  const efficiency = lastResult ? lastResult.system_efficiency_percent : 0;
  const bottlenecks = lastResult ? (lastResult.bottleneck_pipelines?.length || 0) : 0;

  return (
    <div className="flex flex-col gap-2 pointer-events-none">
       <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-sm w-48 pointer-events-auto">
          <CardContent className="p-3">
             <div className="flex items-center gap-2 mb-1">
                <Activity className="h-4 w-4 text-emerald-500" />
                <span className="text-xs text-slate-400 font-medium uppercase">Production</span>
             </div>
             <div className="text-xl font-bold text-white tracking-tight">
                {totalProduction.toLocaleString()} <span className="text-xs font-normal text-slate-500">bpd</span>
             </div>
          </CardContent>
       </Card>

       <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-sm w-48 pointer-events-auto">
          <CardContent className="p-3">
             <div className="flex items-center gap-2 mb-1">
                <Zap className="h-4 w-4 text-blue-500" />
                <span className="text-xs text-slate-400 font-medium uppercase">Efficiency</span>
             </div>
             <div className="text-xl font-bold text-white tracking-tight">
                {efficiency}%
             </div>
          </CardContent>
       </Card>

       {bottlenecks > 0 && (
         <Card className="bg-slate-900/80 border-red-900/50 backdrop-blur-sm w-48 pointer-events-auto">
            <CardContent className="p-3">
               <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="text-xs text-red-400 font-medium uppercase">Bottlenecks</span>
               </div>
               <div className="text-xl font-bold text-white tracking-tight">
                  {bottlenecks} <span className="text-xs font-normal text-slate-500">Detected</span>
               </div>
            </CardContent>
         </Card>
       )}
    </div>
  );
};

export default QuickStatsPanel;