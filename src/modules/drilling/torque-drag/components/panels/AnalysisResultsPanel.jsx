import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, AlertTriangle } from 'lucide-react';
import { useTorqueDrag } from '@/contexts/TorqueDragContext';

const AnalysisResultsPanel = () => {
  const { analysis_results } = useTorqueDrag();
  const latestResult = analysis_results.length > 0 ? analysis_results[0] : null;

  if (!latestResult) return null;

  return (
    <Card className="bg-slate-900 border-slate-700 text-slate-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-slate-400">Latest Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-3">
            {latestResult.convergence_achieved ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
                <AlertTriangle className="h-5 w-5 text-red-500" />
            )}
            <span className={`font-medium ${latestResult.convergence_achieved ? 'text-green-400' : 'text-red-400'}`}>
                {latestResult.convergence_achieved ? 'Converged' : 'Failed'}
            </span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
            <span className="text-slate-500">Iterations:</span>
            <span className="text-right">{latestResult.iterations}</span>
            
            <span className="text-slate-500">Time:</span>
            <span className="text-right">{latestResult.execution_time_seconds}s</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalysisResultsPanel;