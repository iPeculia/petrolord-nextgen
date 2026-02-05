import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Play, Pause, XCircle, Layers, CheckCircle, AlertTriangle, FileSpreadsheet } from 'lucide-react';
import { useDeclineCurve } from '@/context/DeclineCurveContext';
import { batchProcessor } from '@/utils/declineCurve/BatchProcessingEngine';
import { fitDecline } from '@/utils/declineCurve/RegressionEngine';
import { generateForecast } from '@/utils/declineCurve/ForecastingEngine';
import { useToast } from '@/components/ui/use-toast';

const BatchProcessing = () => {
    const { currentProject, addScenario, activeStream, fitConfig, forecastConfig } = useDeclineCurve();
    const { toast } = useToast();
    const [status, setStatus] = useState({ 
        isProcessing: false, 
        progress: 0, 
        results: [], 
        errors: [],
        currentTask: '' 
    });
    
    const [selectedWells, setSelectedWells] = useState([]);
    const [operations, setOperations] = useState({
        fitModel: true,
        generateForecast: true,
        autoExport: false
    });

    useEffect(() => {
        return batchProcessor.subscribe(setStatus);
    }, []);

    const wells = currentProject?.wells || [];

    const toggleWell = (id) => {
        setSelectedWells(prev => 
            prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id]
        );
    };

    const selectAll = () => {
        if (selectedWells.length === wells.length) setSelectedWells([]);
        else setSelectedWells(wells.map(w => w.id));
    };

    const handleStartBatch = () => {
        if (selectedWells.length === 0) {
            toast({ title: "No Wells Selected", description: "Select wells to process.", variant: "destructive" });
            return;
        }

        const tasks = selectedWells.map(wellId => {
            const well = wells.find(w => w.id === wellId);
            return {
                id: wellId,
                description: `Processing ${well.name}`,
                continueOnError: true,
                action: async () => {
                    // 1. Fit Model
                    let fitResult = null;
                    if (operations.fitModel && well.data && well.data.length > 0) {
                        const rateKey = activeStream === 'Oil' ? 'oilRate' : activeStream === 'Gas' ? 'gasRate' : 'waterRate';
                        const sortedData = [...well.data].sort((a,b) => new Date(a.date) - new Date(b.date));
                        const startDate = new Date(sortedData[0].date);
                        
                        const fitData = sortedData.map(d => ({
                            t: (new Date(d.date) - startDate) / (1000 * 60 * 60 * 24),
                            q: d[rateKey] || 0
                        })).filter(d => d.q > 0);

                        fitResult = fitDecline(fitData, 'auto', fitConfig);
                    }

                    // 2. Generate Forecast
                    let forecastResult = null;
                    if (operations.generateForecast && fitResult) {
                         // Mock start params for forecast
                         const lastProd = well.data[well.data.length - 1]; 
                         const startTime = new Date(well.data[0].date).getTime();
                         const lastTime = new Date(lastProd.date).getTime();
                         const startT = (lastTime - startTime) / (1000 * 60 * 60 * 24);
                         const startCum = lastProd[`cumulative${activeStream}`] || 0;

                         forecastResult = generateForecast(
                            fitResult.params, 
                            startCum, 
                            startT, 
                            lastTime, 
                            forecastConfig
                         );
                    }

                    // 3. Save Scenario
                    if (fitResult) {
                        // We need a way to dispatch to context/store from here. 
                        // In a real app, we'd use a redux thunk or similar. 
                        // Here we simulate by calling the provided context method if we were inside the loop, 
                        // but since we are inside a closure, we call the method passed in closure scope (addScenario)
                        // Note: State updates in loop might batch or cause re-renders.
                        // Ideally, we'd batch update the project store at end.
                        // For MVP visual:
                        addScenario(currentProject.id, {
                            name: `Batch Run ${new Date().toLocaleTimeString()}`,
                            wellId: wellId, // Tag scenario to well specifically if supported
                            results: { ...fitResult, stream: activeStream },
                            forecast: forecastResult,
                            timestamp: new Date().toISOString()
                        });
                    }

                    return { wellName: well.name, r2: fitResult?.r2 };
                }
            };
        });

        batchProcessor.cancel(); // Clear old
        batchProcessor.addToQueue(tasks);
        batchProcessor.start();
    };

    return (
        <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Configuration */}
            <Card className="bg-slate-900 border-slate-800 lg:col-span-1 flex flex-col">
                <CardHeader className="py-3 px-4 border-b border-slate-800">
                    <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                        <Layers className="w-4 h-4 text-blue-400" /> Batch Configuration
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4 flex-1 flex flex-col space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs text-slate-500 uppercase font-bold">Operations</label>
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox 
                                    id="op-fit" 
                                    checked={operations.fitModel} 
                                    onCheckedChange={(c) => setOperations(p => ({...p, fitModel: c}))} 
                                />
                                <label htmlFor="op-fit" className="text-sm text-slate-300">Auto-Fit Decline Models</label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox 
                                    id="op-fcst" 
                                    checked={operations.generateForecast} 
                                    onCheckedChange={(c) => setOperations(p => ({...p, generateForecast: c}))} 
                                />
                                <label htmlFor="op-fcst" className="text-sm text-slate-300">Generate Forecasts</label>
                            </div>
                             <div className="flex items-center space-x-2 opacity-50">
                                <Checkbox 
                                    id="op-export" 
                                    checked={operations.autoExport} 
                                    disabled
                                />
                                <label htmlFor="op-export" className="text-sm text-slate-300">Auto-Export to CSV (Coming Soon)</label>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col min-h-0">
                         <div className="flex justify-between items-center mb-2">
                            <label className="text-xs text-slate-500 uppercase font-bold">Target Wells ({selectedWells.length})</label>
                            <Button variant="ghost" size="sm" className="h-6 text-[10px]" onClick={selectAll}>Select All</Button>
                         </div>
                         <ScrollArea className="flex-1 border border-slate-800 rounded bg-slate-950 p-2">
                            <div className="space-y-1">
                                {wells.map(w => (
                                    <div key={w.id} className="flex items-center space-x-2 p-1 hover:bg-slate-900 rounded">
                                        <Checkbox 
                                            checked={selectedWells.includes(w.id)}
                                            onCheckedChange={() => toggleWell(w.id)}
                                        />
                                        <span className="text-xs text-slate-300 truncate">{w.name}</span>
                                    </div>
                                ))}
                            </div>
                         </ScrollArea>
                    </div>

                    <div className="pt-2 grid grid-cols-2 gap-2">
                        {!status.isProcessing ? (
                            <Button className="w-full bg-blue-600 hover:bg-blue-500 col-span-2" onClick={handleStartBatch}>
                                <Play className="w-4 h-4 mr-2" /> Start Batch
                            </Button>
                        ) : (
                            <>
                                <Button variant="outline" className="border-slate-700 hover:bg-slate-800" onClick={() => batchProcessor.isPaused ? batchProcessor.resume() : batchProcessor.pause()}>
                                    {status.isPaused ? <Play className="w-4 h-4 mr-2" /> : <Pause className="w-4 h-4 mr-2" />}
                                    {status.isPaused ? 'Resume' : 'Pause'}
                                </Button>
                                <Button variant="destructive" onClick={() => batchProcessor.cancel()}>
                                    <XCircle className="w-4 h-4 mr-2" /> Cancel
                                </Button>
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Progress & Results */}
            <Card className="bg-slate-900 border-slate-800 lg:col-span-2 flex flex-col">
                <CardHeader className="py-3 px-4 border-b border-slate-800">
                    <CardTitle className="text-sm font-medium text-slate-300 flex items-center justify-between">
                        <span>Execution Status</span>
                        {status.isProcessing && <span className="text-xs text-blue-400 animate-pulse">Running...</span>}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 flex-1 flex flex-col space-y-6">
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs text-slate-400">
                            <span>Progress</span>
                            <span>{status.progress.toFixed(0)}%</span>
                        </div>
                        <Progress value={status.progress} className="h-2 bg-slate-800" indicatorClassName="bg-blue-500" />
                        <p className="text-xs text-slate-500 h-4">{status.currentTask}</p>
                    </div>

                    <div className="flex-1 flex flex-col min-h-0">
                         <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Operation Log</h4>
                         <div className="flex-1 border border-slate-800 rounded bg-slate-950 p-0 overflow-hidden flex flex-col">
                            <div className="grid grid-cols-12 gap-2 p-2 border-b border-slate-800 bg-slate-900 text-[10px] text-slate-400 font-semibold">
                                <div className="col-span-1 text-center">Status</div>
                                <div className="col-span-4">Well Name</div>
                                <div className="col-span-7">Details</div>
                            </div>
                            <ScrollArea className="flex-1">
                                <div className="divide-y divide-slate-800">
                                    {[...status.results, ...status.errors].map((res, i) => (
                                        <div key={i} className="grid grid-cols-12 gap-2 p-2 text-xs">
                                            <div className="col-span-1 flex justify-center">
                                                {res.status === 'success' ? (
                                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                                ) : (
                                                    <AlertTriangle className="w-4 h-4 text-red-500" />
                                                )}
                                            </div>
                                            <div className="col-span-4 text-slate-300 truncate">
                                                {res.data?.wellName || `ID: ${res.id}`}
                                            </div>
                                            <div className="col-span-7 text-slate-400 truncate">
                                                {res.status === 'success' 
                                                    ? `Completed. R²: ${res.data.r2?.toFixed(3) || 'N/A'}`
                                                    : `Error: ${res.error}`
                                                }
                                            </div>
                                        </div>
                                    ))}
                                    {status.results.length === 0 && status.errors.length === 0 && (
                                        <div className="p-4 text-center text-slate-600 text-xs italic">
                                            Ready to start batch job.
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                         </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default BatchProcessing;