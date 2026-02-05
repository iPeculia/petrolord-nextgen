import React from 'react';
import { useHydraulicsSimulator } from '@/contexts/HydraulicsSimulatorContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ScenarioParametersPanel = () => {
    const { current_scenario } = useHydraulicsSimulator();

    if (!current_scenario) return null;

    return (
        <Card className="bg-slate-900 border-slate-800 rounded-none shadow-none mt-px">
             <CardHeader className="py-3 px-4 bg-slate-800/50 border-b border-slate-800 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-200">Simulation Scenario</CardTitle>
                <Badge variant="outline" className="text-[10px] bg-slate-800 text-blue-400 border-blue-900">{current_scenario.status}</Badge>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
                 <div className="text-xs text-slate-400 italic mb-2">
                    "{current_scenario.description || 'No description'}"
                </div>
                
                <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500">Fluid Density</span>
                        <span className="text-slate-200 font-mono">14.5 ppg</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full w-[70%]"></div>
                    </div>
                    
                    <div className="flex justify-between items-center text-xs mt-2">
                        <span className="text-slate-500">Pump Rate</span>
                        <span className="text-slate-200 font-mono">{current_scenario.flow_rate_gpm} gpm</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-green-500 h-full w-[60%]"></div>
                    </div>

                     <div className="flex justify-between items-center text-xs mt-2">
                        <span className="text-slate-500">Surface RPM</span>
                        <span className="text-slate-200 font-mono">{current_scenario.pump_rpm} rpm</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-yellow-500 h-full w-[45%]"></div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                    <div className="bg-slate-800 p-2 rounded text-center">
                        <div className="text-slate-500 mb-1">Backpressure</div>
                        <div className="text-slate-200 font-bold">{current_scenario.surface_backpressure_psi} psi</div>
                    </div>
                    <div className="bg-slate-800 p-2 rounded text-center">
                        <div className="text-slate-500 mb-1">ROP</div>
                        <div className="text-slate-200 font-bold">{current_scenario.rate_of_penetration_ft_per_hr} ft/hr</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ScenarioParametersPanel;