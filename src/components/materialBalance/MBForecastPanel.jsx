import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, TrendingUp } from 'lucide-react';
import { useMaterialBalance } from '@/hooks/useMaterialBalance';
import { runForecast } from '@/services/materialBalance/ForecastEngine';
import ForecastResultsPanel from './ForecastResultsPanel';

const MBForecastPanel = () => {
    const { modelFitting, tankData, productionHistory } = useMaterialBalance();
    const [strategy, setStrategy] = useState('pressure_maintenance');
    const [duration, setDuration] = useState(60);
    const [target, setTarget] = useState(3000); // Target Pressure or Rate
    const [forecastResults, setForecastResults] = useState(null);

    const handleRunForecast = () => {
        // Prepare current state
        const lastProd = productionHistory[productionHistory.length - 1];
        
        const results = runForecast(
            { 
                pressure: lastProd.pressure, 
                Np: lastProd.np, 
                Gp: lastProd.gp 
            },
            modelFitting.currentModel?.parameters || { N: 10000000 }, // Fallback for demo
            tankData,
            [], // pvt
            { strategy, target, durationMonths: duration },
            { minPressure: 500 }
        );

        setForecastResults(results);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
            {/* Control Panel */}
            <div className="lg:col-span-3 space-y-4">
                <Card className="bg-slate-900/50 border-slate-800 h-full">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" /> Forecast Setup
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Prediction Strategy</Label>
                            <Select value={strategy} onValueChange={setStrategy}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="constant_rate">Constant Rate</SelectItem>
                                    <SelectItem value="pressure_maintenance">Pressure Maintenance</SelectItem>
                                    <SelectItem value="decline_curve">Exp. Decline</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Target {strategy.includes('pressure') ? 'Pressure (psi)' : 'Rate (stb/d)'}</Label>
                            <Input 
                                type="number" 
                                value={target} 
                                onChange={e => setTarget(parseFloat(e.target.value))} 
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Duration (Months)</Label>
                            <Input 
                                type="number" 
                                value={duration} 
                                onChange={e => setDuration(parseFloat(e.target.value))} 
                            />
                        </div>

                        <Button className="w-full bg-lime-600 hover:bg-lime-700 mt-6" onClick={handleRunForecast}>
                            <Play className="h-4 w-4 mr-2" /> Run Forecast
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Visuals */}
            <div className="lg:col-span-9 h-full min-h-[500px]">
                {forecastResults ? (
                    <ForecastResultsPanel results={forecastResults} />
                ) : (
                    <div className="h-full flex items-center justify-center bg-slate-900/30 border border-slate-800 rounded text-slate-500">
                        Run a forecast to view production profiles and recovery estimates.
                    </div>
                )}
            </div>
        </div>
    );
};

export default MBForecastPanel;