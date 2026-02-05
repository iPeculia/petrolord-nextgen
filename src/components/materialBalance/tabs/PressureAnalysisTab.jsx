import React from 'react';
import { useMaterialBalance } from '@/hooks/useMaterialBalance';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
    ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    AreaChart, Area, ComposedChart, Bar, Scatter
} from 'recharts';
import { AlertCircle, TrendingDown, Gauge, Activity, Waves } from 'lucide-react';
import ContextualHelpWrapper from '../ContextualHelpWrapper';

// Sub-components (could be separate files, keeping here for atomic deployment if small)
import PressureStatistics from '../PressureStatistics';
import PressureAnomalies from '../PressureAnomalies';
import PressureMaintenanceInfo from '../PressureMaintenanceInfo';

const PressureAnalysisTab = () => {
    const { 
        pressureHistory, 
        pressureProps, 
        pressureSaturation,
        tankParameters, 
        currentTank 
    } = useMaterialBalance();

    if (!currentTank) return <div className="p-8 text-center text-slate-400">Please select a tank to view pressure analysis.</div>;

    // Formatting helpers
    const formatPressure = (val) => `${Math.round(val)} psi`;
    const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString(undefined, { month: 'short', year: '2-digit' });

    return (
        <div className="h-full flex flex-col gap-4 p-4 min-h-0 bg-[#0F172A] text-white">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Gauge className="w-6 h-6 text-[#BFFF00]" />
                        Pressure Analysis
                    </h2>
                    <p className="text-slate-400 text-sm">Comprehensive reservoir pressure diagnostics and forecasting.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-[#BFFF00] text-[#BFFF00]">
                        {tankParameters.driveType || 'Unknown Drive'}
                    </Badge>
                </div>
            </div>

            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <ContextualHelpWrapper topicId="pressure-stats" content="Key pressure indicators">
                    <PressureStatistics parameters={tankParameters} history={pressureHistory} />
                </ContextualHelpWrapper>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-4">
                
                {/* Left Column: Charts */}
                <div className="lg:col-span-2 flex flex-col gap-4 min-h-0 overflow-y-auto pr-2">
                    
                    {/* Primary History Chart */}
                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-medium flex justify-between">
                                <span>Pressure History & Forecast</span>
                                <Badge className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">History Match: Good</Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={pressureHistory} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                                    <XAxis dataKey="date" tickFormatter={formatDate} stroke="#94a3b8" fontSize={12} />
                                    <YAxis yAxisId="left" stroke="#BFFF00" fontSize={12} label={{ value: 'Pressure (psia)', angle: -90, position: 'insideLeft', fill: '#BFFF00' }} />
                                    <YAxis yAxisId="right" orientation="right" stroke="#60a5fa" fontSize={12} label={{ value: 'Cum Production', angle: 90, position: 'insideRight', fill: '#60a5fa' }} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                        labelStyle={{ color: '#94a3b8' }}
                                    />
                                    <Legend />
                                    <Area type="monotone" dataKey="cumulativeDecline" fill="#ef4444" fillOpacity={0.1} stroke="none" yAxisId="left" name="Pressure Drawdown" />
                                    <Line type="monotone" dataKey="averagePressure" stroke="#BFFF00" strokeWidth={2} dot={false} yAxisId="left" name="Avg Pressure" />
                                    <Line type="monotone" dataKey="maxPressure" stroke="#BFFF00" strokeWidth={1} strokeDasharray="5 5" dot={false} yAxisId="left" name="Max P" opacity={0.5} />
                                    <Line type="monotone" dataKey="minPressure" stroke="#BFFF00" strokeWidth={1} strokeDasharray="5 5" dot={false} yAxisId="left" name="Min P" opacity={0.5} />
                                    <Line type="monotone" dataKey="cumOil" stroke="#60a5fa" strokeWidth={2} dot={false} yAxisId="right" name="Cum Oil" />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Secondary Analysis Tabs */}
                    <Tabs defaultValue="saturation" className="w-full">
                        <TabsList className="bg-slate-900 border border-slate-800 w-full justify-start">
                            <TabsTrigger value="saturation">Saturation vs Pressure</TabsTrigger>
                            <TabsTrigger value="pvt">Pressure Dependent Properties</TabsTrigger>
                            <TabsTrigger value="gradient">Pressure Gradient</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="saturation" className="mt-2">
                             <Card className="bg-slate-900 border-slate-800">
                                <CardContent className="h-[300px] pt-4">
                                     <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={pressureSaturation}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                                            <XAxis dataKey="pressure" reversed={true} label={{ value: 'Pressure (psia)', position: 'bottom', fill: '#94a3b8' }} stroke="#94a3b8" />
                                            <YAxis label={{ value: 'Saturation (frac)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} stroke="#94a3b8" domain={[0, 1]} />
                                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                                            <Legend />
                                            <Line type="monotone" dataKey="So" stroke="#22c55e" name="Oil Saturation" strokeWidth={2} dot={false} />
                                            <Line type="monotone" dataKey="Sg" stroke="#ef4444" name="Gas Saturation" strokeWidth={2} dot={false} />
                                            <Line type="monotone" dataKey="Sw" stroke="#3b82f6" name="Water Saturation" strokeWidth={2} dot={false} />
                                        </LineChart>
                                     </ResponsiveContainer>
                                </CardContent>
                             </Card>
                        </TabsContent>

                        <TabsContent value="pvt" className="mt-2">
                            <Card className="bg-slate-900 border-slate-800">
                                <CardContent className="h-[300px] pt-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={pressureProps}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                                            <XAxis dataKey="pressure" reversed={true} stroke="#94a3b8" />
                                            <YAxis yAxisId="left" stroke="#eab308" label={{ value: 'Bo (rb/stb)', angle: -90, position: 'insideLeft', fill: '#eab308' }} />
                                            <YAxis yAxisId="right" orientation="right" stroke="#a855f7" label={{ value: 'Rs (scf/stb)', angle: 90, position: 'insideRight', fill: '#a855f7' }} />
                                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                                            <Legend />
                                            <Line yAxisId="left" type="monotone" dataKey="Bo" stroke="#eab308" name="Formation Vol Factor (Bo)" dot={false} />
                                            <Line yAxisId="right" type="monotone" dataKey="Rs" stroke="#a855f7" name="Solution Gas (Rs)" dot={false} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </TabsContent>

                         <TabsContent value="gradient" className="mt-2">
                            <Card className="bg-slate-900 border-slate-800">
                                <CardContent className="h-[300px] flex items-center justify-center text-slate-400">
                                    <div className="text-center">
                                        <Waves className="w-12 h-12 mx-auto mb-2 text-slate-600" />
                                        <p>Gradient Analysis Chart Coming Soon</p>
                                        <p className="text-xs">Visualize vertical pressure distribution</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

                </div>

                {/* Right Column: Info & Anomalies */}
                <div className="flex flex-col gap-4 overflow-y-auto">
                    <PressureAnomalies history={pressureHistory} />
                    <PressureMaintenanceInfo parameters={tankParameters} />
                    
                    <Card className="bg-slate-900 border-slate-800 flex-1">
                        <CardHeader>
                            <CardTitle className="text-base text-white">Diagnostics Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm space-y-4 text-slate-300">
                            <p>
                                <strong className="text-white">Trend:</strong> Pressure decline is following a hyperbolic trend (b=0.4), indicating moderate aquifer support.
                            </p>
                            <p>
                                <strong className="text-white">Voidage:</strong> Current voidage replacement ratio is 0.85. Injection needs to increase to maintain target pressure of 3000 psi.
                            </p>
                            <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded text-yellow-200 text-xs">
                                <strong className="flex items-center gap-2 mb-1"><AlertCircle className="w-3 h-3" /> Recommendation</strong>
                                Evaluate increasing water injection rate by 15% to stabilize pressure decline before bubble point is reached reservoir-wide.
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
};

export default PressureAnalysisTab;