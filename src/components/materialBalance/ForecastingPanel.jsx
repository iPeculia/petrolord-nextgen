import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMaterialBalance } from '@/hooks/useMaterialBalance';
import { ResponsiveContainer, ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { TrendingUp, Play, Save } from 'lucide-react';
import { runForecast } from '@/utils/materialBalance/ForecastingEngine';
import { useToast } from '@/components/ui/use-toast';

const ForecastingPanel = () => {
    const { productionHistory, tankParameters, modelFitting } = useMaterialBalance();
    const { toast } = useToast();
    
    const [settings, setSettings] = useState({
        mode: 'exponential', // exponential, harmonic, constant_rate
        durationYears: 10,
        declineRate: 15, // % per year
        initialRate: productionHistory.length > 0 ? productionHistory[productionHistory.length-1].oilRate || 1000 : 1000,
        abandonmentRate: 50
    });

    const [forecastData, setForecastData] = useState([]);
    const [reserves, setReserves] = useState(0);

    const handleGenerate = () => {
        if (!productionHistory || productionHistory.length === 0) {
            toast({ title: "Error", description: "No production history available to forecast.", variant: "destructive" });
            return;
        }

        const lastDate = new Date(productionHistory[productionHistory.length-1].date);
        const startCum = productionHistory[productionHistory.length-1].cumulativeOil || 0;

        const results = runForecast({
            ...settings,
            startDate: lastDate,
            startCumulative: startCum
        });

        setForecastData(results.data);
        setReserves(results.eur - startCum);
        
        toast({ title: "Forecast Generated", description: `EUR: ${(results.eur/1e6).toFixed(2)} MMbbl` });
    };

    const plotData = [
        ...productionHistory.map(p => ({ 
            date: p.date, 
            rate: p.oilRate, 
            cumulative: p.cumulativeOil,
            type: 'History' 
        })),
        ...forecastData.map(p => ({
            ...p,
            type: 'Forecast'
        }))
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full p-4 overflow-y-auto">
             {/* Left Controls */}
             <div className="lg:col-span-1 space-y-6">
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-[#BFFF00]" />
                            Forecast Settings
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-slate-400">Method</Label>
                            <Select value={settings.mode} onValueChange={(v) => setSettings({...settings, mode: v})}>
                                <SelectTrigger className="bg-slate-950 border-slate-700 text-white"><SelectValue /></SelectTrigger>
                                <SelectContent className="bg-slate-950 border-slate-800 text-white">
                                    <SelectItem value="exponential">Exponential Decline</SelectItem>
                                    <SelectItem value="harmonic">Harmonic Decline</SelectItem>
                                    <SelectItem value="constant_rate">Constant Rate</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div className="space-y-2">
                            <Label className="text-slate-400">Duration (Years)</Label>
                            <Input 
                                type="number" 
                                value={settings.durationYears} 
                                onChange={(e) => setSettings({...settings, durationYears: Number(e.target.value)})}
                                className="bg-slate-950 border-slate-700 text-white"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-400">Initial Rate (bbl/d)</Label>
                            <Input 
                                type="number" 
                                value={settings.initialRate} 
                                onChange={(e) => setSettings({...settings, initialRate: Number(e.target.value)})}
                                className="bg-slate-950 border-slate-700 text-white"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-400">Decline Rate (%/yr)</Label>
                            <Input 
                                type="number" 
                                value={settings.declineRate} 
                                onChange={(e) => setSettings({...settings, declineRate: Number(e.target.value)})}
                                className="bg-slate-950 border-slate-700 text-white"
                            />
                        </div>

                        <div className="space-y-2">
                             <Label className="text-slate-400">Abandonment (bbl/d)</Label>
                             <Input 
                                type="number" 
                                value={settings.abandonmentRate} 
                                onChange={(e) => setSettings({...settings, abandonmentRate: Number(e.target.value)})}
                                className="bg-slate-950 border-slate-700 text-white"
                             />
                        </div>

                        <Button className="w-full bg-[#BFFF00] text-black hover:bg-[#a3d900] mt-4 font-bold" onClick={handleGenerate}>
                            <Play className="w-4 h-4 mr-2" /> Run Forecast
                        </Button>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader><CardTitle className="text-white text-sm">Reserves Summary</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                         <div className="flex justify-between text-sm">
                             <span className="text-slate-400">Forecast Reserves</span>
                             <span className="text-[#BFFF00] font-mono font-bold">
                                 {(reserves / 1000000).toFixed(3)} MMbbl
                             </span>
                         </div>
                    </CardContent>
                </Card>
             </div>

             {/* Right Visualization */}
             <div className="lg:col-span-3 space-y-6">
                <Card className="bg-slate-900 border-slate-800 h-[600px] flex flex-col">
                    <CardHeader className="flex flex-row items-center justify-between">
                         <CardTitle className="text-white">Production Forecast Profile</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 min-h-0">
                         {plotData.length > 0 ? (
                             <ResponsiveContainer width="100%" height="100%">
                                 <ComposedChart data={plotData} margin={{top: 20, right: 30, left: 20, bottom: 20}}>
                                     <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                     <XAxis 
                                        dataKey="date" 
                                        stroke="#64748b" 
                                        tickFormatter={(str) => new Date(str).getFullYear()} 
                                        minTickGap={50}
                                     />
                                     <YAxis yAxisId="left" stroke="#3b82f6" label={{ value: 'Rate (bbl/d)', angle: -90, position: 'insideLeft', fill: '#3b82f6' }} />
                                     <YAxis yAxisId="right" orientation="right" stroke="#10b981" label={{ value: 'Cumulative (bbl)', angle: 90, position: 'insideRight', fill: '#10b981' }} />
                                     <Tooltip 
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
                                        labelFormatter={(label) => new Date(label).toLocaleDateString()}
                                     />
                                     <Legend />
                                     
                                     <Line 
                                        yAxisId="left" 
                                        type="monotone" 
                                        dataKey="rate" 
                                        stroke="#3b82f6" 
                                        strokeWidth={2} 
                                        name="Rate" 
                                        dot={false}
                                     />
                                     <Area 
                                        yAxisId="right" 
                                        type="monotone" 
                                        dataKey="cumulative" 
                                        fill="#10b981" 
                                        stroke="#10b981" 
                                        fillOpacity={0.1} 
                                        name="Cumulative" 
                                     />
                                 </ComposedChart>
                             </ResponsiveContainer>
                         ) : (
                            <div className="flex h-full items-center justify-center text-slate-500">
                                Run a forecast to view the profile.
                            </div>
                         )}
                    </CardContent>
                </Card>
             </div>
        </div>
    );
};

export default ForecastingPanel;