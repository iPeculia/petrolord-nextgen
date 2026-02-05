import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, ReferenceLine, Cell } from 'recharts';
import { useDeclineCurve } from '@/context/DeclineCurveContext';
import { runMonteCarloSimulation } from '@/utils/declineCurve/MonteCarloEngine';
import { Calculator, Play } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const MonteCarloSimulation = () => {
    const { currentProject, activeScenarioId } = useDeclineCurve();
    
    // Default uncertainties (decimal percentage)
    const [uncertainty, setUncertainty] = useState({
        qi: 0.15, // 15%
        Di: 0.10, // 10%
        b: 0.10   // 10% (absolute variation for b)
    });
    const [iterations, setIterations] = useState(1000);
    const [simResults, setSimResults] = useState(null);

    const scenarios = currentProject?.scenarios || [];
    const activeScenario = activeScenarioId !== null ? scenarios[activeScenarioId] : scenarios[scenarios.length-1];

    const runSimulation = () => {
        if (!activeScenario || !activeScenario.results) {
            toast({ title: "No Base Model", description: "Select a valid scenario with fitted parameters first.", variant: "destructive" });
            return;
        }

        const { params } = activeScenario.results;
        
        // Convert simple UI inputs to engine format
        const uncertainties = {
            qi: { type: 'normal', value: uncertainty.qi },
            Di: { type: 'normal', value: uncertainty.Di },
            b:  { type: 'uniform', value: uncertainty.b } // b usually uniform range
        };

        const results = runMonteCarloSimulation(params, uncertainties, iterations);
        
        // Prepare histogram data
        const histogramBins = 20;
        const minVal = results.stats.min;
        const maxVal = results.stats.max;
        const binWidth = (maxVal - minVal) / histogramBins;
        
        const histogram = Array(histogramBins).fill(0).map((_, i) => ({
            binStart: minVal + i * binWidth,
            binEnd: minVal + (i + 1) * binWidth,
            count: 0,
            label: `${((minVal + i * binWidth)/1000).toFixed(0)}k`
        }));

        results.iterations.forEach(iter => {
            const binIdx = Math.min(Math.floor((iter.eur - minVal) / binWidth), histogramBins - 1);
            if(binIdx >= 0) histogram[binIdx].count++;
        });

        setSimResults({ ...results, histogram });
        toast({ title: "Simulation Complete", description: `Run ${iterations} iterations successfully.` });
    };

    return (
        <div className="h-full flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-slate-900 border-slate-800 md:col-span-1">
                    <CardHeader className="py-3 px-4 border-b border-slate-800">
                        <CardTitle className="text-sm font-medium text-slate-300">Uncertainty Parameters</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                        <div className="space-y-2">
                            <Label className="text-xs text-slate-400">Qi Uncertainty (±%)</Label>
                            <Input 
                                type="number" 
                                value={uncertainty.qi * 100} 
                                onChange={(e) => setUncertainty({...uncertainty, qi: parseFloat(e.target.value)/100})}
                                className="bg-slate-950 border-slate-700 h-8 text-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs text-slate-400">Di Uncertainty (±%)</Label>
                            <Input 
                                type="number" 
                                value={uncertainty.Di * 100} 
                                onChange={(e) => setUncertainty({...uncertainty, Di: parseFloat(e.target.value)/100})}
                                className="bg-slate-950 border-slate-700 h-8 text-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs text-slate-400">b-Factor Range (± Absolute)</Label>
                            <Input 
                                type="number" 
                                value={uncertainty.b} 
                                onChange={(e) => setUncertainty({...uncertainty, b: parseFloat(e.target.value)})}
                                className="bg-slate-950 border-slate-700 h-8 text-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs text-slate-400">Iterations</Label>
                            <Select value={iterations.toString()} onValueChange={(v) => setIterations(parseInt(v))}>
                                <SelectTrigger className="bg-slate-950 border-slate-700 h-8 text-sm"><SelectValue /></SelectTrigger>
                                <SelectContent className="bg-slate-900 border-slate-700">
                                    <SelectItem value="500">500</SelectItem>
                                    <SelectItem value="1000">1000</SelectItem>
                                    <SelectItem value="5000">5000</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button className="w-full bg-blue-600 hover:bg-blue-500 mt-2" onClick={runSimulation}>
                            <Play className="w-3 h-3 mr-2" /> Run Simulation
                        </Button>
                    </CardContent>
                </Card>

                <Card className="bg-slate-950 border-slate-800 md:col-span-2 flex flex-col">
                    <CardHeader className="py-3 px-4 border-b border-slate-800 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-medium text-slate-300">EUR Distribution (Probabilistic)</CardTitle>
                        {simResults && <div className="text-xs text-slate-500">{iterations} runs</div>}
                    </CardHeader>
                    <CardContent className="p-4 flex-1 min-h-[300px]">
                        {!simResults ? (
                            <div className="h-full flex items-center justify-center text-slate-500 flex-col gap-2">
                                <Calculator className="h-8 w-8 opacity-50" />
                                <p>Run simulation to view probabilistic reserves</p>
                            </div>
                        ) : (
                            <div className="h-full w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={simResults.histogram} barCategoryGap={1}>
                                        <XAxis dataKey="label" stroke="#64748b" fontSize={10} tickLine={false} />
                                        <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                                        <Tooltip 
                                            cursor={{fill: 'rgba(255,255,255,0.05)'}}
                                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }}
                                        />
                                        <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                                            {simResults.histogram.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fillOpacity={0.6 + (entry.count / Math.max(...simResults.histogram.map(h=>h.count))) * 0.4} />
                                            ))}
                                        </Bar>
                                        <ReferenceLine x={simResults.histogram.find(h => h.binEnd >= simResults.stats.p50)?.label} stroke="#eab308" label={{ value: 'P50', fill: '#eab308', fontSize: 10, position: 'top' }} />
                                        <ReferenceLine x={simResults.histogram.find(h => h.binEnd >= simResults.stats.p90)?.label} stroke="#22c55e" label={{ value: 'P90', fill: '#22c55e', fontSize: 10, position: 'top' }} />
                                        <ReferenceLine x={simResults.histogram.find(h => h.binEnd >= simResults.stats.p10)?.label} stroke="#ef4444" label={{ value: 'P10', fill: '#ef4444', fontSize: 10, position: 'top' }} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {simResults && (
                <div className="grid grid-cols-3 gap-4">
                    <Card className="bg-slate-900 border-slate-800">
                        <CardContent className="p-4 flex flex-col items-center">
                            <span className="text-xs text-slate-500 uppercase tracking-wider mb-1">P90 (Proven)</span>
                            <span className="text-2xl font-mono text-green-400 font-bold">{(simResults.stats.p10 / 1000).toFixed(1)}k</span>
                            <span className="text-[10px] text-slate-600">bbl (90% prob. to exceed)</span>
                        </CardContent>
                    </Card>
                    <Card className="bg-slate-900 border-slate-800">
                        <CardContent className="p-4 flex flex-col items-center">
                            <span className="text-xs text-slate-500 uppercase tracking-wider mb-1">P50 (Probable)</span>
                            <span className="text-2xl font-mono text-amber-400 font-bold">{(simResults.stats.p50 / 1000).toFixed(1)}k</span>
                            <span className="text-[10px] text-slate-600">bbl (Median)</span>
                        </CardContent>
                    </Card>
                    <Card className="bg-slate-900 border-slate-800">
                        <CardContent className="p-4 flex flex-col items-center">
                            <span className="text-xs text-slate-500 uppercase tracking-wider mb-1">P10 (Possible)</span>
                            <span className="text-2xl font-mono text-red-400 font-bold">{(simResults.stats.p90 / 1000).toFixed(1)}k</span>
                            <span className="text-[10px] text-slate-600">bbl (10% prob. to exceed)</span>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default MonteCarloSimulation;