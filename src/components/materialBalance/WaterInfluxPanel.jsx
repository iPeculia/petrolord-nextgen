import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useMaterialBalance } from '@/hooks/useMaterialBalance';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Droplets, Calculator, Activity, TrendingUp, Info } from 'lucide-react';
import { calculateWaterInflux } from '@/services/materialBalance/WaterInfluxModel';
import { useToast } from '@/components/ui/use-toast';

const WaterInfluxPanel = () => {
    const { tankParameters, productionHistory, pressureData } = useMaterialBalance();
    const { toast } = useToast();
    const [selectedModel, setSelectedModel] = useState('schilthuis');
    
    // Default parameters based on tank setup or reasonable defaults
    const [params, setParams] = useState({
        aquiferConstant: 100, // U
        aquiferRadius: 50000, // ra
        reservoirRadius: Math.sqrt((tankParameters.area * 43560) / Math.PI) || 2000, // re from area
        permeability: 50, // k
        porosity: tankParameters.porosity || 0.2, // phi
        viscosity: 0.5, // mu_w
        compressibility: (tankParameters.cw || 3e-6) + (tankParameters.cf || 4e-6), // ct = cw + cf approx
        encroachmentAngle: 360, // theta
        thickness: tankParameters.thickness || 50
    });

    const handleParamChange = (key, value) => {
        setParams(prev => ({ ...prev, [key]: parseFloat(value) }));
    };

    const results = useMemo(() => {
        if (!pressureData || pressureData.length === 0) return [];
        
        try {
            const influxData = calculateWaterInflux(
                selectedModel,
                pressureData,
                params,
                tankParameters.initialPressure
            );
            return influxData;
        } catch (error) {
            console.error("Water Influx Calculation Error:", error);
            return [];
        }
    }, [selectedModel, params, pressureData, tankParameters]);

    const handleUpdateModel = () => {
        toast({
            title: "Model Updated",
            description: `Recalculated using ${selectedModel} model.`,
            variant: "default"
        });
    };

    const totalInflux = results.length > 0 ? results[results.length-1].We : 0;
    const cumOil = productionHistory.length > 0 ? productionHistory[productionHistory.length-1].cumulativeOil || productionHistory[productionHistory.length-1].Np : 1;
    const aquiferIndex = totalInflux / (cumOil || 1);

    if (!pressureData || pressureData.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-slate-500">
                <Info className="w-12 h-12 mb-4 opacity-50" />
                <h3 className="text-lg font-medium text-slate-300">Insufficient Data</h3>
                <p>Please import pressure history to calculate water influx.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full p-4 overflow-y-auto">
            {/* Left: Configuration */}
            <div className="lg:col-span-4 space-y-6">
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Droplets className="w-5 h-5 text-blue-400" />
                            Aquifer Model Selection
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-slate-400">Model Type</Label>
                            <Select value={selectedModel} onValueChange={setSelectedModel}>
                                <SelectTrigger className="bg-slate-950 border-slate-700 text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-950 border-slate-800 text-white">
                                    <SelectItem value="schilthuis">Schilthuis (Steady State)</SelectItem>
                                    <SelectItem value="fetkovich">Fetkovich (Pseudo-Steady)</SelectItem>
                                    <SelectItem value="veh">Van Everdingen-Hurst (Unsteady)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                             <div className="col-span-2">
                                <h4 className="text-sm font-semibold text-slate-300 mb-2">Model Parameters</h4>
                             </div>
                             
                             {selectedModel === 'schilthuis' && (
                                 <div className="col-span-2 space-y-2">
                                     <Label className="text-xs text-slate-400">Aquifer Constant (U) [bbl/psi]</Label>
                                     <Input 
                                        type="number" 
                                        value={params.aquiferConstant} 
                                        onChange={(e) => handleParamChange('aquiferConstant', e.target.value)}
                                        className="bg-slate-950 border-slate-700 text-white" 
                                    />
                                 </div>
                             )}

                             {(selectedModel === 'fetkovich' || selectedModel === 'veh') && (
                                 <>
                                    <div className="space-y-1">
                                        <Label className="text-xs text-slate-400">Ra (ft)</Label>
                                        <Input type="number" value={params.aquiferRadius} onChange={(e) => handleParamChange('aquiferRadius', e.target.value)} className="bg-slate-950 border-slate-700 h-8 text-white" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs text-slate-400">Re (ft)</Label>
                                        <Input type="number" value={params.reservoirRadius} onChange={(e) => handleParamChange('reservoirRadius', e.target.value)} className="bg-slate-950 border-slate-700 h-8 text-white" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs text-slate-400">Perm (md)</Label>
                                        <Input type="number" value={params.permeability} onChange={(e) => handleParamChange('permeability', e.target.value)} className="bg-slate-950 border-slate-700 h-8 text-white" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs text-slate-400">Porosity (dec)</Label>
                                        <Input type="number" value={params.porosity} onChange={(e) => handleParamChange('porosity', e.target.value)} className="bg-slate-950 border-slate-700 h-8 text-white" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs text-slate-400">Angle (°)</Label>
                                        <Input type="number" value={params.encroachmentAngle} onChange={(e) => handleParamChange('encroachmentAngle', e.target.value)} className="bg-slate-950 border-slate-700 h-8 text-white" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs text-slate-400">Thick (ft)</Label>
                                        <Input type="number" value={params.thickness} onChange={(e) => handleParamChange('thickness', e.target.value)} className="bg-slate-950 border-slate-700 h-8 text-white" />
                                    </div>
                                 </>
                             )}
                        </div>

                        <Button className="w-full bg-blue-600 hover:bg-blue-500 mt-4" onClick={handleUpdateModel}>
                            <Calculator className="w-4 h-4 mr-2" />
                            Recalculate Influx
                        </Button>
                    </CardContent>
                </Card>
                
                <div className="grid grid-cols-2 gap-4">
                    <Card className="bg-slate-900 border-slate-800">
                        <CardContent className="p-4">
                            <div className="text-xs text-slate-500 uppercase">Cum. Influx (We)</div>
                            <div className="text-xl font-mono text-[#BFFF00] mt-1">
                                {(totalInflux/1e6).toFixed(3)} <span className="text-sm text-slate-500">MMbbl</span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-slate-900 border-slate-800">
                        <CardContent className="p-4">
                            <div className="text-xs text-slate-500 uppercase">Aquifer Index (We/Np)</div>
                            <div className="text-xl font-mono text-white mt-1">
                                {aquiferIndex.toFixed(2)}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Right: Visualization */}
            <div className="lg:col-span-8 space-y-6">
                <Card className="bg-slate-900 border-slate-800 h-[500px] flex flex-col">
                    <CardHeader className="flex flex-row items-center justify-between py-3 border-b border-slate-800">
                         <CardTitle className="text-white text-base flex items-center gap-2">
                             <Activity className="w-4 h-4 text-slate-400" />
                             Water Influx Performance
                         </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 min-h-0 pt-4">
                         <ResponsiveContainer width="100%" height="100%">
                             <LineChart data={results} margin={{top: 10, right: 30, left: 10, bottom: 0}}>
                                 <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                 <XAxis 
                                    dataKey="date" 
                                    stroke="#64748b" 
                                    tickFormatter={(str) => new Date(str).getFullYear()} 
                                    minTickGap={30}
                                    tick={{fontSize: 12}}
                                 />
                                 <YAxis 
                                    yAxisId="left" 
                                    stroke="#3b82f6" 
                                    tick={{fontSize: 12}}
                                    tickFormatter={(val) => (val/1e6).toFixed(1) + 'M'}
                                    label={{ value: 'Cum We (bbl)', angle: -90, position: 'insideLeft', fill: '#3b82f6', offset: 0, style: {textAnchor: 'middle'} }} 
                                 />
                                 <YAxis 
                                    yAxisId="right" 
                                    orientation="right" 
                                    stroke="#ef4444" 
                                    domain={['auto', 'auto']} 
                                    tick={{fontSize: 12}}
                                    label={{ value: 'Pressure (psi)', angle: 90, position: 'insideRight', fill: '#ef4444', offset: 10, style: {textAnchor: 'middle'} }} 
                                 />
                                 <Tooltip 
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
                                    labelFormatter={(label) => new Date(label).toLocaleDateString()}
                                    formatter={(val, name) => [
                                        name === 'We' ? (val/1e6).toFixed(3) + ' MMbbl' : val.toFixed(0) + ' psi', 
                                        name === 'We' ? 'Cumulative Influx' : 'Reservoir Pressure'
                                    ]}
                                 />
                                 <Legend verticalAlign="top" height={36}/>
                                 <Line yAxisId="left" type="monotone" dataKey="We" name="We" stroke="#3b82f6" dot={false} strokeWidth={3} activeDot={{r: 6}} />
                                 <Line yAxisId="right" type="monotone" dataKey="pressure" name="Pressure" stroke="#ef4444" dot={false} strokeWidth={2} strokeDasharray="5 5" />
                             </LineChart>
                         </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default WaterInfluxPanel;