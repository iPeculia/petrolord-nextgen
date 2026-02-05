import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { AlertCircle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SimulationResults = ({ data }) => {
    // Defensive Check for Data Existence
    if (!data || !data.results || !data.timeSteps) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 bg-slate-900/30 rounded-lg border-2 border-dashed border-slate-800 p-8">
                <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle className="w-8 h-8 opacity-40" />
                </div>
                <h3 className="text-lg font-medium text-slate-400 mb-2">No Simulation Data</h3>
                <p className="text-sm text-center max-w-md">
                    Configure parameters on the left and click "Run Simulation" to generate results.
                </p>
            </div>
        );
    }

    // Format Data for Recharts
    const chartData = data.timeSteps.map((time, i) => ({
        time: time,
        pressure: data.results.reservoirPressure[i] || 0,
        oilRate: data.results.oilRate[i] || 0,
        waterRate: data.results.waterRate[i] || 0,
        waterCut: data.results.waterCut[i] || 0,
        cumOil: data.results.cumulativeOil[i] || 0
    }));

    return (
        <div className="h-full flex flex-col space-y-4">
            {/* KPI Cards */}
            <div className="grid grid-cols-3 gap-4 shrink-0">
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardContent className="p-4">
                        <p className="text-xs text-slate-500 uppercase font-bold">Total Oil Recovery</p>
                        <div className="text-2xl font-mono text-emerald-400 mt-1">
                            {data.summary.totalOil.toFixed(1)} <span className="text-sm text-slate-600">MSTB</span>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardContent className="p-4">
                        <p className="text-xs text-slate-500 uppercase font-bold">Final Water Cut</p>
                        <div className="text-2xl font-mono text-blue-400 mt-1">
                            {data.summary.finalWaterCut.toFixed(1)} <span className="text-sm text-slate-600">%</span>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardContent className="p-4">
                        <p className="text-xs text-slate-500 uppercase font-bold">Final Pressure</p>
                        <div className="text-2xl font-mono text-orange-400 mt-1">
                            {data.summary.finalPressure.toFixed(0)} <span className="text-sm text-slate-600">psi</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Area */}
            <Card className="flex-1 bg-slate-900/50 border-slate-800 flex flex-col min-h-0">
                <CardHeader className="py-3 px-4 border-b border-slate-800 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm text-slate-300">Performance Curves</CardTitle>
                    <Button variant="ghost" size="sm" className="h-8 text-xs text-slate-400 hover:text-white">
                        <Download className="w-3 h-3 mr-1.5" /> Export
                    </Button>
                </CardHeader>
                <CardContent className="flex-1 p-4">
                    <Tabs defaultValue="rates" className="h-full flex flex-col">
                        <TabsList className="bg-slate-950 border border-slate-800 mb-4 w-fit">
                            <TabsTrigger value="rates" className="text-xs">Production Rates</TabsTrigger>
                            <TabsTrigger value="pressure" className="text-xs">Pressure & WC</TabsTrigger>
                            <TabsTrigger value="cumulative" className="text-xs">Cumulative</TabsTrigger>
                        </TabsList>

                        <div className="flex-1 min-h-0">
                            <TabsContent value="rates" className="h-full mt-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                        <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickFormatter={v => `${(v/365).toFixed(1)}y`} />
                                        <YAxis stroke="#64748b" fontSize={10} />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', fontSize: '12px' }}
                                            labelFormatter={v => `Day ${v}`}
                                        />
                                        <Legend />
                                        <Line type="monotone" dataKey="oilRate" name="Oil Rate (bbl/d)" stroke="#10b981" strokeWidth={2} dot={false} />
                                        <Line type="monotone" dataKey="waterRate" name="Water Rate (bbl/d)" stroke="#3b82f6" strokeWidth={2} dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </TabsContent>

                            <TabsContent value="pressure" className="h-full mt-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                        <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickFormatter={v => `${(v/365).toFixed(1)}y`} />
                                        <YAxis yAxisId="left" stroke="#f97316" fontSize={10} domain={['auto', 'auto']} />
                                        <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" fontSize={10} unit="%" />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', fontSize: '12px' }}
                                            labelFormatter={v => `Day ${v}`}
                                        />
                                        <Legend />
                                        <Line yAxisId="left" type="monotone" dataKey="pressure" name="Reservoir Pressure (psi)" stroke="#f97316" strokeWidth={2} dot={false} />
                                        <Line yAxisId="right" type="monotone" dataKey="waterCut" name="Water Cut (%)" stroke="#3b82f6" strokeWidth={2} dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </TabsContent>

                             <TabsContent value="cumulative" className="h-full mt-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                        <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickFormatter={v => `${(v/365).toFixed(1)}y`} />
                                        <YAxis stroke="#64748b" fontSize={10} />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', fontSize: '12px' }}
                                            labelFormatter={v => `Day ${v}`}
                                        />
                                        <Legend />
                                        <Area type="monotone" dataKey="cumOil" name="Cumulative Oil (MSTB)" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </TabsContent>
                        </div>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
};

export default SimulationResults;