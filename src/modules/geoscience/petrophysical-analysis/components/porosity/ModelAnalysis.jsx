import React, { useState, useMemo } from 'react';
import { useGlobalDataStore } from '@/store/globalDataStore';
import { usePorosityStore } from '@/modules/geoscience/petrophysical-analysis/store/porosityStore';
import { calculateDensityPorosity, calculateSonicPorosity } from '@/modules/geoscience/petrophysical-analysis/utils/porosityCalculations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ResponsiveContainer, ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Area } from 'recharts';
import { AlertCircle, Activity } from 'lucide-react';

const ModelAnalysis = () => {
    const { activeWell, wellLogs } = useGlobalDataStore();
    const { models } = usePorosityStore();
    const [selectedModelId, setSelectedModelId] = useState('');

    // Safe access to models
    const safeModels = Array.isArray(models) ? models : [];
    
    const selectedModel = useMemo(() => {
        if (!selectedModelId) return null;
        return safeModels.find(m => m.id === selectedModelId);
    }, [selectedModelId, safeModels]);

    const chartData = useMemo(() => {
        if (!activeWell || !wellLogs || !wellLogs[activeWell] || !selectedModel) return [];
        
        const logs = wellLogs[activeWell];
        const inputCurveName = selectedModel.curve;
        
        if (!logs[inputCurveName]) return [];
        
        const inputLog = logs[inputCurveName];
        const depths = inputLog.depth_array || [];
        const values = inputLog.value_array || [];
        
        const data = [];
        // Optimization: Don't render every point if dataset is huge
        const step = depths.length > 5000 ? Math.floor(depths.length / 2000) : 1;

        for(let i=0; i<depths.length; i += step) {
            const val = values[i];
            if(val === null || isNaN(val)) continue;

            let porosity = null;
            try {
                if(selectedModel.type === 'density') {
                    porosity = calculateDensityPorosity(val, parseFloat(selectedModel.params.rhoMatrix), parseFloat(selectedModel.params.rhoFluid));
                } else if (selectedModel.type === 'sonic') {
                    porosity = calculateSonicPorosity(val, parseFloat(selectedModel.params.dtMatrix), parseFloat(selectedModel.params.dtFluid));
                }
            } catch (e) {
                // Ignore calculation errors for individual points
            }

            if(porosity !== null) {
                // Clamp porosity for display
                const phi = Math.max(0, Math.min(1, porosity));
                data.push({
                    depth: depths[i],
                    input: val,
                    porosity: parseFloat(phi.toFixed(4))
                });
            }
        }
        return data;
    }, [activeWell, wellLogs, selectedModel]);

    if (!activeWell) {
        return (
             <div className="flex flex-col items-center justify-center h-[500px] text-slate-500 bg-slate-900/50 rounded-xl border border-dashed border-slate-800">
                <AlertCircle className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-lg font-medium">No Active Well Selected</p>
                <p className="text-sm">Please select a well from the Data Panel to begin analysis.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
            {/* Controls */}
            <Card className="bg-slate-900 border-slate-800 h-fit lg:col-span-1">
                <CardHeader>
                    <CardTitle className="text-white text-lg">Analysis Controls</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-400 uppercase">Active Model</label>
                        <Select value={selectedModelId} onValueChange={setSelectedModelId}>
                            <SelectTrigger className="bg-slate-950 border-slate-700 text-slate-200">
                                <SelectValue placeholder="Select a model..." />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                                {safeModels.length === 0 ? (
                                    <SelectItem value="none" disabled>No models found</SelectItem>
                                ) : (
                                    safeModels.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    {selectedModel && (
                        <div className="p-4 bg-slate-950 rounded border border-slate-800 space-y-3">
                            <div className="flex justify-between text-sm border-b border-slate-800 pb-2">
                                <span className="text-slate-500">Type</span>
                                <span className="text-emerald-400 font-mono capitalize">{selectedModel.type}</span>
                            </div>
                            <div className="flex justify-between text-sm border-b border-slate-800 pb-2">
                                <span className="text-slate-500">Curve</span>
                                <span className="text-blue-400 font-mono">{selectedModel.curve}</span>
                            </div>
                            <div className="space-y-1 pt-1">
                                <span className="text-xs text-slate-500 block uppercase">Parameters</span>
                                <div className="grid grid-cols-2 gap-2">
                                    {Object.entries(selectedModel.params).map(([k, v]) => (
                                        <div key={k} className="bg-slate-900 p-1.5 rounded text-center">
                                            <span className="block text-[10px] text-slate-500">{k}</span>
                                            <span className="block text-xs font-mono text-slate-300">{v}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Visualization */}
            <Card className="bg-slate-900 border-slate-800 lg:col-span-3 flex flex-col h-[600px] lg:h-auto">
                <CardHeader className="border-b border-slate-800 py-3 min-h-[60px]">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-white text-base flex items-center gap-2">
                            <Activity className="w-4 h-4 text-[#BFFF00]" />
                            Porosity Profile
                        </CardTitle>
                        {chartData.length > 0 && (
                             <span className="text-xs text-slate-500 font-mono">{chartData.length} points calculated</span>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="flex-1 p-4 min-h-0 relative">
                    {(!selectedModelId) ? (
                         <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
                            <p>Select a model to visualize results.</p>
                        </div>
                    ) : (chartData.length === 0) ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-amber-500">
                            <AlertCircle className="w-8 h-8 mb-2 opacity-50" />
                            <p>No data available for calculation.</p>
                            <p className="text-xs text-slate-500 mt-1">Check if curve '{selectedModel?.curve}' exists in the active well.</p>
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={chartData} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={true} vertical={true} />
                                <XAxis 
                                    type="number" 
                                    xAxisId="phi" 
                                    orientation="top" 
                                    domain={[0, 0.5]} 
                                    label={{ value: 'Porosity (v/v)', position: 'top', fill: '#94a3b8', fontSize: 12 }} 
                                    stroke="#94a3b8"
                                    tick={{fontSize: 11}}
                                    reversed
                                />
                                <YAxis 
                                    dataKey="depth" 
                                    type="number" 
                                    domain={['auto', 'auto']} 
                                    reversed 
                                    stroke="#94a3b8"
                                    tick={{fontSize: 11}}
                                    label={{ value: 'Depth', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
                                />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9' }}
                                    labelStyle={{ color: '#94a3b8' }}
                                    formatter={(val) => val.toFixed(4)}
                                />
                                <Legend verticalAlign="bottom" height={36}/>
                                <Area 
                                    type="monotone" 
                                    dataKey="porosity" 
                                    fill="#3b82f6" 
                                    stroke="#2563eb" 
                                    fillOpacity={0.3} 
                                    xAxisId="phi" 
                                    name="Calculated Porosity" 
                                />
                            </ComposedChart>
                        </ResponsiveContainer>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default ModelAnalysis;