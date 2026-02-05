import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useDeclineCurve } from '@/context/DeclineCurveContext';
import { Play, TrendingUp, Droplets, Flame, Waves, Activity } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { fitDecline, autoFit } from '@/utils/declineCurve/RegressionEngine';
import { calculateDiagnostics, getFitQualityLabel } from '@/utils/declineCurve/FitDiagnostics';
import { Badge } from '@/components/ui/badge';

const AnalysisParametersPanel = () => {
    const { 
        activeStream, setActiveStream, 
        fitConfig, setFitConfig,
        forecastConfig, setForecastConfig,
        currentWell, addScenario
    } = useDeclineCurve();

    const [isFitting, setIsFitting] = useState(false);
    const [lastFitResult, setLastFitResult] = useState(null);

    const handleStreamChange = (val) => setActiveStream(val);

    const updateFitConfig = (key, val) => {
        setFitConfig(prev => ({ ...prev, [key]: val }));
    };

    const updateForecastConfig = (key, val) => {
        setForecastConfig(prev => ({ ...prev, [key]: val }));
    };
    
    const handleFitModel = async () => {
        if (!currentWell || !currentWell.data || currentWell.data.length === 0) {
            toast({ title: "No Data", description: "Select a well with data first.", variant: "destructive" });
            return;
        }

        setIsFitting(true);
        // Small delay to allow UI to show loading state
        setTimeout(() => {
            try {
                // 1. Prepare Data
                const rateKey = activeStream === 'Oil' ? 'oilRate' : activeStream === 'Gas' ? 'gasRate' : 'waterRate';
                
                // Sort by date
                const sortedData = [...currentWell.data].sort((a,b) => new Date(a.date) - new Date(b.date));
                const startDate = new Date(sortedData[0].date);
                
                // Transform to relative time (days) and rate
                let fitData = sortedData.map(d => ({
                    t: (new Date(d.date) - startDate) / (1000 * 60 * 60 * 24),
                    q: d[rateKey] || 0,
                    originalDate: d.date
                })).filter(d => d.q > 0); // Filter out zero/negative rates for fitting

                // Fit Window Logic
                if (fitConfig.startDate) {
                    const winStart = new Date(fitConfig.startDate);
                    fitData = fitData.filter(d => new Date(d.originalDate) >= winStart);
                }
                if (fitConfig.endDate) {
                    const winEnd = new Date(fitConfig.endDate);
                    fitData = fitData.filter(d => new Date(d.originalDate) <= winEnd);
                }

                if (fitData.length < 5) {
                    throw new Error("Insufficient data points in selected window.");
                }

                // 2. Run Regression
                let result;
                if (fitConfig.modelType === 'auto') {
                    result = autoFit(fitData, fitConfig);
                } else {
                    result = fitDecline(fitData, fitConfig.modelType, fitConfig);
                }

                // 3. Run Diagnostics
                const diagnostics = calculateDiagnostics(fitData, result.params);
                
                const finalResult = {
                    ...result,
                    diagnostics,
                    stream: activeStream,
                    timestamp: new Date().toISOString()
                };

                setLastFitResult(finalResult);

                // 4. Save to Context/Scenarios
                addScenario(currentWell.project_id, {
                    name: `Fit ${new Date().toLocaleTimeString()}`,
                    results: finalResult,
                    config: fitConfig
                });

                toast({ 
                    title: "Fit Complete", 
                    description: `R²: ${result.r2.toFixed(3)} | Model: ${result.modelType}` 
                });

            } catch (error) {
                console.error("Fit Error:", error);
                toast({ title: "Fit Failed", description: error.message, variant: "destructive" });
            } finally {
                setIsFitting(false);
            }
        }, 100);
    };

    const handleGenerateForecast = () => {
        if (!currentWell) return;
        if (!lastFitResult) {
            toast({ title: "No Model", description: "Fit a model first before generating forecast.", variant: "destructive" });
            return;
        }
        toast({ title: "Forecasting", description: "Forecast updated on chart." });
        // Forecast is implicitly handled by visualization component reading the latest scenario
    };

    const fitQuality = lastFitResult ? getFitQualityLabel(lastFitResult.r2) : null;

    return (
        <div className="space-y-4">
            <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
                    <CardTitle className="text-xs font-medium text-slate-400 uppercase tracking-wider">Analysis Setup</CardTitle>
                    {fitQuality && (
                        <Badge variant="outline" className={`h-5 text-[10px] px-2 ${fitQuality.badge}`}>
                            {fitQuality.label} Fit
                        </Badge>
                    )}
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-4">
                    {/* Production Stream */}
                    <div>
                        <Label className="text-xs text-slate-500 mb-2 block">Production Stream</Label>
                        <div className="grid grid-cols-3 gap-2">
                            <Button 
                                variant={activeStream === 'Oil' ? 'default' : 'outline'} 
                                size="sm" 
                                className={`h-8 ${activeStream === 'Oil' ? 'bg-green-600 hover:bg-green-700 text-white' : 'border-slate-700 text-slate-400'}`}
                                onClick={() => handleStreamChange('Oil')}
                            >
                                <Droplets className="w-3 h-3 mr-1" /> Oil
                            </Button>
                            <Button 
                                variant={activeStream === 'Gas' ? 'default' : 'outline'} 
                                size="sm" 
                                className={`h-8 ${activeStream === 'Gas' ? 'bg-red-600 hover:bg-red-700 text-white' : 'border-slate-700 text-slate-400'}`}
                                onClick={() => handleStreamChange('Gas')}
                            >
                                <Flame className="w-3 h-3 mr-1" /> Gas
                            </Button>
                            <Button 
                                variant={activeStream === 'Water' ? 'default' : 'outline'} 
                                size="sm" 
                                className={`h-8 ${activeStream === 'Water' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'border-slate-700 text-slate-400'}`}
                                onClick={() => handleStreamChange('Water')}
                            >
                                <Waves className="w-3 h-3 mr-1" /> Water
                            </Button>
                        </div>
                    </div>

                    {/* Decline Model */}
                    <div>
                        <Label className="text-xs text-slate-500 mb-1 block">Decline Model</Label>
                        <Select value={fitConfig.modelType} onValueChange={(v) => updateFitConfig('modelType', v)}>
                            <SelectTrigger className="h-8 bg-slate-950 border-slate-700 text-white text-xs">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-700 text-white">
                                <SelectItem value="auto">Auto-Select (Best Fit)</SelectItem>
                                <SelectItem value="exponential">Exponential (b=0)</SelectItem>
                                <SelectItem value="hyperbolic">Hyperbolic (0&lt;b&lt;1)</SelectItem>
                                <SelectItem value="harmonic">Harmonic (b=1)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Constraints */}
                    <div>
                        <Label className="text-xs text-slate-500 mb-1 block uppercase">B-Factor Constraints</Label>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <Label className="text-[10px] text-slate-600">Min b</Label>
                                <Input 
                                    type="number" 
                                    value={fitConfig.minB} 
                                    step={0.1}
                                    onChange={(e) => updateFitConfig('minB', parseFloat(e.target.value))}
                                    className="h-7 bg-slate-950 border-slate-700 text-xs"
                                />
                            </div>
                            <div>
                                <Label className="text-[10px] text-slate-600">Max b</Label>
                                <Input 
                                    type="number" 
                                    value={fitConfig.maxB} 
                                    step={0.1}
                                    onChange={(e) => updateFitConfig('maxB', parseFloat(e.target.value))}
                                    className="h-7 bg-slate-950 border-slate-700 text-xs"
                                />
                            </div>
                        </div>
                    </div>
                    
                    {/* Fit Window */}
                    <div>
                        <Label className="text-xs text-slate-500 mb-1 block">Fit Window</Label>
                        <div className="grid grid-cols-2 gap-2">
                             <div>
                                <Label className="text-[10px] text-slate-600">Start Date</Label>
                                <Input 
                                    type="date" 
                                    value={fitConfig.startDate || ''}
                                    onChange={(e) => updateFitConfig('startDate', e.target.value)}
                                    className="h-7 bg-slate-950 border-slate-700 text-xs text-slate-400" 
                                />
                             </div>
                             <div>
                                <Label className="text-[10px] text-slate-600">End Date</Label>
                                <Input 
                                    type="date" 
                                    value={fitConfig.endDate || ''}
                                    onChange={(e) => updateFitConfig('endDate', e.target.value)}
                                    className="h-7 bg-slate-950 border-slate-700 text-xs text-slate-400" 
                                />
                             </div>
                        </div>
                    </div>

                    <Button 
                        className="w-full bg-blue-600 hover:bg-blue-500 text-xs font-semibold" 
                        onClick={handleFitModel}
                        disabled={isFitting}
                    >
                        {isFitting ? <Activity className="w-3 h-3 mr-2 animate-spin" /> : <Play className="w-3 h-3 mr-2" />}
                        {isFitting ? 'Fitting...' : 'Fit Model'}
                    </Button>
                </CardContent>
            </Card>

            {/* Results Card - Only show if fit exists */}
            {lastFitResult && (
                <Card className="bg-slate-900 border-slate-800 animate-in fade-in slide-in-from-top-2">
                    <CardHeader className="py-2 px-4 border-b border-slate-800">
                         <CardTitle className="text-xs font-medium text-slate-400 uppercase tracking-wider">Fitted Parameters</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-2">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500">qi (Rate)</span>
                            <span className="font-mono text-slate-200">{lastFitResult.params.qi.toFixed(0)}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500">Di (Nom. /yr)</span>
                            <span className="font-mono text-slate-200">
                                {lastFitResult.params.Di.toFixed(3)} 
                                <span className="text-slate-500 ml-1">({(lastFitResult.params.Di * 100).toFixed(1)}%)</span>
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500">b-Factor</span>
                            <span className={`font-mono font-bold ${lastFitResult.params.b > 1 ? 'text-amber-400' : 'text-slate-200'}`}>
                                {lastFitResult.params.b.toFixed(2)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-800">
                            <span className="text-slate-500">R²</span>
                            <span className={`font-mono ${fitQuality.color}`}>{lastFitResult.r2.toFixed(4)}</span>
                        </div>
                    </CardContent>
                </Card>
            )}

            <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
                    <CardTitle className="text-xs font-medium text-slate-400 uppercase tracking-wider">Forecasting</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-3">
                    <div>
                        <Label className="text-xs text-slate-500 mb-1 block">Forecast Settings</Label>
                        <div className="space-y-2">
                             <div>
                                <div className="flex justify-between items-center mb-1">
                                    <Label className="text-[10px] text-slate-400">Economic Limit Rate (bbl/d)</Label>
                                    <div className="flex items-center gap-2">
                                        <Switch 
                                            checked={forecastConfig.stopAtLimit}
                                            onCheckedChange={(c) => updateForecastConfig('stopAtLimit', c)}
                                            className="scale-75"
                                        />
                                        <span className="text-[10px] text-slate-400">Stop</span>
                                    </div>
                                </div>
                                <Input 
                                    type="number" 
                                    value={forecastConfig.economicLimit}
                                    onChange={(e) => updateForecastConfig('economicLimit', parseFloat(e.target.value))}
                                    className="h-7 bg-slate-950 border-slate-700 text-xs" 
                                />
                             </div>
                             <div>
                                <Label className="text-[10px] text-slate-400">Max Duration (Days)</Label>
                                <Input 
                                    type="number"
                                    value={forecastConfig.maxDuration}
                                    onChange={(e) => updateForecastConfig('maxDuration', parseFloat(e.target.value))}
                                    className="h-7 bg-slate-950 border-slate-700 text-xs" 
                                />
                             </div>
                        </div>
                    </div>

                    <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-xs" onClick={handleGenerateForecast}>
                        <TrendingUp className="w-3 h-3 mr-2" /> Update Forecast
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default AnalysisParametersPanel;