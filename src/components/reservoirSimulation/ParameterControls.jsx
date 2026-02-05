import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Play, RotateCcw, HelpCircle } from 'lucide-react';

const ParameterControls = ({ onRun, isRunning }) => {
    // Local state for form inputs
    const [params, setParams] = useState({
        initialPressure: 3500,
        injectionRate: 500,
        productionRate: 500,
        duration: 3650, // 10 years
        timeStep: 30,
        permeability: 100,
        porosity: 0.2,
        viscosity: 1.0
    });

    const handleChange = (key, value) => {
        setParams(prev => ({
            ...prev,
            [key]: parseFloat(value)
        }));
    };

    const handleRun = () => {
        onRun(params);
    };

    const handleReset = () => {
        setParams({
            initialPressure: 3500,
            injectionRate: 500,
            productionRate: 500,
            duration: 3650,
            timeStep: 30,
            permeability: 100,
            porosity: 0.2,
            viscosity: 1.0
        });
    };

    return (
        <Card className="h-full bg-slate-900/50 border-slate-800 flex flex-col">
            <CardHeader className="pb-3 border-b border-slate-800">
                <CardTitle className="text-lg text-slate-200 flex items-center gap-2">
                    Parameter Controls
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-6">
                
                {/* Reservoir Properties */}
                <div className="space-y-4">
                    <h4 className="text-xs uppercase font-bold text-emerald-500 tracking-wider">Reservoir Properties</h4>
                    
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label className="text-xs text-slate-300">Initial Pressure (psi)</Label>
                            <span className="text-xs font-mono text-slate-400">{params.initialPressure}</span>
                        </div>
                        <Slider 
                            value={[params.initialPressure]} 
                            min={1000} max={10000} step={100}
                            onValueChange={(val) => handleChange('initialPressure', val[0])}
                            className="py-1"
                        />
                    </div>

                    <div className="space-y-2">
                         <div className="flex justify-between items-center">
                            <Label className="text-xs text-slate-300">Permeability (md)</Label>
                            <span className="text-xs font-mono text-slate-400">{params.permeability}</span>
                        </div>
                        <Slider 
                            value={[params.permeability]} 
                            min={1} max={2000} step={10}
                            onValueChange={(val) => handleChange('permeability', val[0])}
                            className="py-1"
                        />
                    </div>

                    <div className="space-y-2">
                         <div className="flex justify-between items-center">
                            <Label className="text-xs text-slate-300">Porosity (fraction)</Label>
                            <span className="text-xs font-mono text-slate-400">{params.porosity}</span>
                        </div>
                        <Slider 
                            value={[params.porosity]} 
                            min={0.05} max={0.4} step={0.01}
                            onValueChange={(val) => handleChange('porosity', val[0])}
                            className="py-1"
                        />
                    </div>
                </div>

                {/* Operational Parameters */}
                <div className="space-y-4 pt-4 border-t border-slate-800">
                    <h4 className="text-xs uppercase font-bold text-blue-500 tracking-wider">Operational Controls</h4>
                    
                    <div className="space-y-2">
                         <div className="flex justify-between items-center">
                            <div className="flex items-center gap-1">
                                <Label className="text-xs text-slate-300">Injection Rate (bbl/d)</Label>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger><HelpCircle className="w-3 h-3 text-slate-500" /></TooltipTrigger>
                                        <TooltipContent className="bg-slate-900 border-slate-700 text-xs">Rate of water injection to support pressure.</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            <span className="text-xs font-mono text-slate-400">{params.injectionRate}</span>
                        </div>
                        <Slider 
                            value={[params.injectionRate]} 
                            min={0} max={5000} step={50}
                            onValueChange={(val) => handleChange('injectionRate', val[0])}
                            className="py-1"
                        />
                    </div>

                    <div className="space-y-2">
                         <div className="flex justify-between items-center">
                            <Label className="text-xs text-slate-300">Production Rate (bbl/d)</Label>
                            <span className="text-xs font-mono text-slate-400">{params.productionRate}</span>
                        </div>
                        <Slider 
                            value={[params.productionRate]} 
                            min={0} max={5000} step={50}
                            onValueChange={(val) => handleChange('productionRate', val[0])}
                            className="py-1"
                        />
                    </div>

                     <div className="space-y-2">
                         <div className="flex justify-between items-center">
                            <Label className="text-xs text-slate-300">Duration (days)</Label>
                            <span className="text-xs font-mono text-slate-400">{params.duration}</span>
                        </div>
                        <Slider 
                            value={[params.duration]} 
                            min={365} max={7300} step={365}
                            onValueChange={(val) => handleChange('duration', val[0])}
                            className="py-1"
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-6 space-y-2">
                    <Button 
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                        onClick={handleRun}
                        disabled={isRunning}
                    >
                        {isRunning ? 'Simulating...' : (
                            <><Play className="w-4 h-4 mr-2" /> Run Simulation</>
                        )}
                    </Button>
                    <Button 
                        variant="outline" 
                        className="w-full border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800"
                        onClick={handleReset}
                        disabled={isRunning}
                    >
                        <RotateCcw className="w-4 h-4 mr-2" /> Reset Defaults
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default ParameterControls;