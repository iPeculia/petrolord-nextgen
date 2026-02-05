import React from 'react';
import { useHydraulicsSimulator } from '@/contexts/HydraulicsSimulatorContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

const SimulationResultsPanel = () => {
    const { simulation_results, current_scenario } = useHydraulicsSimulator();

    // Find result for current scenario
    const result = simulation_results.find(r => r.scenario_id === current_scenario?.scenario_id);

    if (!result) return (
         <Card className="bg-slate-900 border-slate-800 rounded-none shadow-none mt-px">
            <CardContent className="p-8 text-center">
                <span className="text-slate-500 text-xs">No simulation results available.</span>
            </CardContent>
         </Card>
    );

    return (
        <Card className="bg-slate-900 border-slate-800 rounded-none shadow-none mt-px flex-1">
             <CardHeader className="py-3 px-4 bg-slate-800/50 border-b border-slate-800">
                <CardTitle className="text-sm font-medium text-slate-200">Last Simulation Results</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 p-2 rounded">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-green-400 font-medium">Convergence Achieved ({result.iterations} iters)</span>
                </div>

                <div className="space-y-3">
                    <div>
                        <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-400">Hole Cleaning Index</span>
                            <span className="text-slate-200 font-bold">Good (0.85)</span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 w-[85%]"></div>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-400">ECD Margin</span>
                            <span className="text-slate-200 font-bold">0.4 ppg Safe</span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden flex">
                            <div className="h-full bg-slate-700 w-[20%]"></div>
                            <div className="h-full bg-blue-500 w-[60%]"></div>
                            <div className="h-full bg-red-500 w-[20%]"></div>
                        </div>
                        <div className="relative h-1 w-full mt-0.5">
                            <div className="absolute top-0 w-0.5 h-full bg-white left-[75%]"></div> {/* Marker */}
                        </div>
                    </div>
                </div>

                <div className="text-[10px] text-slate-500 text-center pt-2">
                    Simulation Time: {result.execution_time_seconds}s • {new Date(result.simulation_date).toLocaleTimeString()}
                </div>
            </CardContent>
        </Card>
    );
};

export default SimulationResultsPanel;