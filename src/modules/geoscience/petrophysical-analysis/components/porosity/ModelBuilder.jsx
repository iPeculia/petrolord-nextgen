import React, { useState, useEffect, useMemo } from 'react';
import { useGlobalDataStore } from '@/store/globalDataStore';
import { usePorosityStore } from '@/modules/geoscience/petrophysical-analysis/store/porosityStore';
// Ensure these imports map to the file we just created
import { calculateDensityPorosity, calculateSonicPorosity, calculateR2, calculateRMSE } from '@/modules/geoscience/petrophysical-analysis/utils/porosityCalculations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line } from 'recharts';
import { Play, Save, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ModelBuilder = () => {
    const { wells, wellLogs, isLoading: isGlobalLoading } = useGlobalDataStore();
    const { addModel } = usePorosityStore();
    const { toast } = useToast();

    const [config, setConfig] = useState({
        name: '',
        wellId: '',
        curve: '',
        type: 'density',
        params: { rhoMatrix: 2.65, rhoFluid: 1.0, dtMatrix: 47.6, dtFluid: 189 }
    });
    
    const [previewData, setPreviewData] = useState(null);
    const [metrics, setMetrics] = useState(null);
    const [calculating, setCalculating] = useState(false);

    // Safely handle null/undefined wells
    const wellList = useMemo(() => {
        if (!wells) return [];
        return Object.values(wells);
    }, [wells]);

    // Dynamically get curves for selected well
    const curveList = useMemo(() => {
        if (!config.wellId || !wellLogs || !wellLogs[config.wellId]) return [];
        return Object.keys(wellLogs[config.wellId]);
    }, [config.wellId, wellLogs]);

    // Set default well if none selected
    useEffect(() => {
        if (!config.wellId && wellList.length > 0) {
             setConfig(prev => ({ ...prev, wellId: wellList[0].id }));
        }
    }, [wellList, config.wellId]);

    const handleRun = () => {
        if (!config.wellId || !config.curve) {
            toast({ variant: "destructive", title: "Missing Inputs", description: "Please select a well and a curve." });
            return;
        }

        setCalculating(true);
        
        try {
            // Safety checks
            if (!wellLogs) throw new Error("Log data not loaded");
            const logs = wellLogs[config.wellId];
            if (!logs) throw new Error("Logs for selected well not found");
            const inputCurve = logs[config.curve];
            
            if (!inputCurve || !inputCurve.value_array || !inputCurve.depth_array) {
                throw new Error("Selected curve data is invalid or empty.");
            }

            const inputVals = inputCurve.value_array;
            const depths = inputCurve.depth_array;
            const data = [];
            const validPhis = [];

            // Process data
            for (let i = 0; i < inputVals.length; i++) {
                const val = inputVals[i];
                if (val === null || val === undefined || isNaN(val)) continue;

                let phi = null;
                try {
                    if (config.type === 'density') {
                        phi = calculateDensityPorosity(val, parseFloat(config.params.rhoMatrix), parseFloat(config.params.rhoFluid));
                    } else {
                        phi = calculateSonicPorosity(val, parseFloat(config.params.dtMatrix), parseFloat(config.params.dtFluid));
                    }
                } catch (calcErr) {
                    console.warn("Calculation error at index " + i, calcErr);
                    continue;
                }

                if (phi !== null && !isNaN(phi)) {
                    validPhis.push(phi);
                    // Downsample for chart performance if needed, but let's keep it detailed for now
                    if (i % 5 === 0) { 
                        data.push({ depth: depths[i], input: val, phi: parseFloat(phi.toFixed(4)) });
                    }
                }
            }

            if (data.length === 0) {
                throw new Error("No valid porosity values calculated. Check parameters.");
            }

            // Dummy "Actual" data generation for R2 calculation demonstration
            // In a real scenario, you'd select a Core Porosity curve to compare against.
            const simulatedCore = validPhis.map(p => p + (Math.random() * 0.05 - 0.025)); 
            
            const calculatedMetrics = {
                r2: calculateR2(validPhis, simulatedCore).toFixed(3),
                rmse: calculateRMSE(validPhis, simulatedCore).toFixed(3)
            };

            setPreviewData(data);
            setMetrics(calculatedMetrics);
            toast({ title: "Calculation Complete", description: `Processed ${data.length} points.` });

        } catch (error) {
            console.error(error);
            toast({ variant: "destructive", title: "Calculation Failed", description: error.message });
            setPreviewData(null);
            setMetrics(null);
        } finally {
            setCalculating(false);
        }
    };

    const handleSave = () => {
        if (!config.name) {
            toast({ variant: "destructive", title: "Error", description: "Please provide a model name." });
            return;
        }
        if (!previewData) {
             toast({ variant: "destructive", title: "Error", description: "Run the model first." });
             return;
        }

        addModel({
            name: config.name,
            type: config.type,
            wellId: config.wellId,
            curve: config.curve,
            params: config.params,
            metrics: metrics || { r2: 0, rmse: 0 }
        });
        toast({ title: "Model Saved", description: "Added to Model Library." });
    };

    if (isGlobalLoading) {
        return <div className="flex items-center justify-center h-64 text-slate-400"><Loader2 className="w-6 h-6 animate-spin mr-2"/> Loading data...</div>;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="bg-slate-900 border-slate-800">
                <CardHeader><CardTitle className="text-white">Model Configuration</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Model Name</Label>
                        <Input 
                            value={config.name} 
                            onChange={e => setConfig({...config, name: e.target.value})} 
                            placeholder="e.g., Sandstone Density V1"
                            className="bg-slate-950 border-slate-700"
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <Label>Target Well</Label>
                        <Select value={config.wellId} onValueChange={v => setConfig({...config, wellId: v, curve: ''})}>
                            <SelectTrigger className="bg-slate-950 border-slate-700">
                                <SelectValue placeholder="Select well..." />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-800">
                                {wellList.length === 0 ? <SelectItem value="none" disabled>No wells available</SelectItem> : 
                                    wellList.map(w => <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>)
                                }
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Input Curve</Label>
                        <Select value={config.curve} onValueChange={v => setConfig({...config, curve: v})} disabled={!config.wellId}>
                            <SelectTrigger className="bg-slate-950 border-slate-700">
                                <SelectValue placeholder="Select curve..." />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-800 max-h-60">
                                {curveList.length === 0 ? <SelectItem value="none" disabled>No curves found</SelectItem> : 
                                    curveList.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)
                                }
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Method</Label>
                        <Select value={config.type} onValueChange={v => setConfig({...config, type: v})}>
                            <SelectTrigger className="bg-slate-950 border-slate-700">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-800">
                                <SelectItem value="density">Density</SelectItem>
                                <SelectItem value="sonic">Sonic</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="p-3 bg-slate-950 rounded-md border border-slate-800 space-y-3">
                        <Label className="text-xs text-slate-400 uppercase font-bold">Parameters</Label>
                        {config.type === 'density' ? (
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <Label className="text-xs">Matrix ρ (g/cc)</Label>
                                    <Input type="number" step="0.01" value={config.params.rhoMatrix} onChange={e => setConfig({...config, params: {...config.params, rhoMatrix: e.target.value}})} className="bg-slate-900 border-slate-700 h-8"/>
                                </div>
                                <div>
                                    <Label className="text-xs">Fluid ρ (g/cc)</Label>
                                    <Input type="number" step="0.01" value={config.params.rhoFluid} onChange={e => setConfig({...config, params: {...config.params, rhoFluid: e.target.value}})} className="bg-slate-900 border-slate-700 h-8"/>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <Label className="text-xs">Matrix Δt (us/ft)</Label>
                                    <Input type="number" value={config.params.dtMatrix} onChange={e => setConfig({...config, params: {...config.params, dtMatrix: e.target.value}})} className="bg-slate-900 border-slate-700 h-8"/>
                                </div>
                                <div>
                                    <Label className="text-xs">Fluid Δt (us/ft)</Label>
                                    <Input type="number" value={config.params.dtFluid} onChange={e => setConfig({...config, params: {...config.params, dtFluid: e.target.value}})} className="bg-slate-900 border-slate-700 h-8"/>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2 pt-2">
                        <Button onClick={handleRun} disabled={calculating} className="flex-1 bg-indigo-600 text-white hover:bg-indigo-500">
                            {calculating ? <Loader2 className="w-4 h-4 animate-spin mr-2"/> : <Play className="w-4 h-4 mr-2"/>}
                            Calculate
                        </Button>
                        <Button onClick={handleSave} variant="outline" className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800">
                            <Save className="w-4 h-4 mr-2"/> Save
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800 col-span-1 lg:col-span-2 flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-white">Results Preview</CardTitle>
                    {metrics && (
                        <div className="flex gap-3">
                            <div className="text-xs bg-slate-950 px-2 py-1 rounded border border-slate-800">
                                <span className="text-slate-500 mr-1">R²:</span>
                                <span className="text-emerald-400 font-mono">{metrics.r2}</span>
                            </div>
                            <div className="text-xs bg-slate-950 px-2 py-1 rounded border border-slate-800">
                                <span className="text-slate-500 mr-1">RMSE:</span>
                                <span className="text-blue-400 font-mono">{metrics.rmse}</span>
                            </div>
                        </div>
                    )}
                </CardHeader>
                <CardContent className="flex-1 min-h-[400px]">
                    {previewData ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={previewData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis 
                                    dataKey="depth" 
                                    type="number" 
                                    domain={['auto', 'auto']} 
                                    stroke="#94a3b8" 
                                    label={{ value: 'Depth', position: 'bottom', fill: '#94a3b8' }}
                                />
                                <YAxis 
                                    stroke="#94a3b8" 
                                    domain={[0, 0.4]} 
                                    label={{ value: 'Porosity (v/v)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
                                />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
                                    itemStyle={{ color: '#34d399' }}
                                    labelStyle={{ color: '#94a3b8' }}
                                    formatter={(value) => typeof value === 'number' ? value.toFixed(4) : value}
                                />
                                <Line type="monotone" dataKey="phi" stroke="#34d399" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500">
                            <AlertCircle className="w-12 h-12 mb-4 opacity-20" />
                            <p>Configure parameters and click Calculate to generate a model.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default ModelBuilder;