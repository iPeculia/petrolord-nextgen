import React, { useState, useCallback, memo } from 'react';
import { Button } from '@/components/ui/button';
import { Play, RotateCcw, Loader2 } from 'lucide-react';
import ParameterControls from './ParameterControls.jsx';
import SimulationResults from './SimulationResults.jsx';
import { runSimulation } from '@/data/reservoirSimulation/simulationEngine.js';

const MiniSimulator = memo(() => {
    const [isSimulating, setIsSimulating] = useState(false);
    const [results, setResults] = useState(null);
    const [params, setParams] = useState({
        initialPressure: 3500,
        injectionRate: 500,
        productionRate: 500,
        permeability: 100,
        porosity: 0.20,
        viscosity: 1.0,
        duration: 365
    });

    const handleRun = useCallback(async () => {
        setIsSimulating(true);
        setResults(null);
        
        // Non-blocking simulation delay for UI effect
        await new Promise(resolve => setTimeout(resolve, 800));

        try {
            const data = runSimulation(params);
            setResults(data);
        } catch (error) {
            console.error("Simulation failed:", error);
        } finally {
            setIsSimulating(false);
        }
    }, [params]);

    const handleReset = useCallback(() => {
        setResults(null);
        setParams({
            initialPressure: 3500,
            injectionRate: 500,
            productionRate: 500,
            permeability: 100,
            porosity: 0.20,
            viscosity: 1.0,
            duration: 365
        });
    }, []);

    return (
        <div className="h-full flex flex-col md:flex-row gap-4 p-4 overflow-hidden">
            {/* Left Control Panel */}
            <div className="w-full md:w-80 flex flex-col gap-4 bg-slate-900/50 p-4 rounded-lg border border-slate-800 shrink-0 overflow-y-auto">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-slate-200">Parameters</h3>
                    <Button variant="ghost" size="sm" onClick={handleReset} className="h-8 w-8 p-0">
                        <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                    </Button>
                </div>

                <ParameterControls params={params} onChange={setParams} />

                <div className="mt-auto pt-4 border-t border-slate-800">
                    <Button 
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                        onClick={handleRun}
                        disabled={isSimulating}
                    >
                        {isSimulating ? (
                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Running...</>
                        ) : (
                            <><Play className="w-4 h-4 mr-2" /> Run Simulation</>
                        )}
                    </Button>
                </div>
            </div>

            {/* Right Visualization Panel */}
            <div className="flex-1 min-h-0 bg-slate-900/50 rounded-lg border border-slate-800 overflow-hidden p-4">
                {results ? (
                    <SimulationResults data={results} />
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-3">
                        <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center">
                            <Play className="w-6 h-6 ml-1 opacity-20" />
                        </div>
                        <p>Adjust parameters and click Run to see results</p>
                    </div>
                )}
            </div>
        </div>
    );
});

export default MiniSimulator;