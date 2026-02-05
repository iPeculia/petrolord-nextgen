import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Area, ComposedChart, Line, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

const ResultsDashboard = ({ results, constraints }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
        
        {/* Summary Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             <Card className="lg:col-span-2 bg-slate-900 border-slate-700">
                <CardHeader>
                    <CardTitle className="text-white">Performance vs Diameter</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={results}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="idInches" stroke="#94a3b8" label={{ value: 'Diameter (in)', position: 'insideBottom', offset: -5 }} />
                            <YAxis yAxisId="left" stroke="#3b82f6" label={{ value: 'Pressure Drop (psi)', angle: -90, position: 'insideLeft' }} />
                            <YAxis yAxisId="right" orientation="right" stroke="#10b981" label={{ value: 'Velocity (ft/s)', angle: 90, position: 'insideRight' }} />
                            <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
                            <Legend />
                            <Area yAxisId="left" type="monotone" dataKey="totalDrop" fill="#3b82f6" stroke="#3b82f6" fillOpacity={0.2} name="Pressure Drop" />
                            <Line yAxisId="right" type="monotone" dataKey="velocity" stroke="#10b981" strokeWidth={2} name="Velocity" />
                            <ReferenceLine yAxisId="right" y={constraints.maxVelocity} stroke="#ef4444" strokeDasharray="3 3" label="Max Vel" />
                            <ReferenceLine yAxisId="right" y={constraints.minVelocity} stroke="#f59e0b" strokeDasharray="3 3" label="Min Vel" />
                        </ComposedChart>
                    </ResponsiveContainer>
                </CardContent>
             </Card>

             <Card className="bg-slate-900 border-slate-700">
                <CardHeader>
                    <CardTitle className="text-white">Recommendation</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col justify-center items-center h-[300px] space-y-4">
                    {(() => {
                        const optimal = results?.find(r => r.status === 'pass');
                        if (optimal) {
                            return (
                                <>
                                    <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center border-4 border-emerald-500">
                                        <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                                    </div>
                                    <div className="text-center">
                                        <div className="text-4xl font-bold text-white">{optimal.nps}"</div>
                                        <div className="text-sm text-slate-400">Optimal NPS Size</div>
                                    </div>
                                    <div className="text-sm text-center text-slate-400 px-4">
                                        Provides balanced velocity ({optimal.velocity} ft/s) and pressure drop ({optimal.totalDrop} psi) within constraints.
                                    </div>
                                </>
                            );
                        } else {
                            return (
                                <div className="text-center text-red-400">
                                    <AlertTriangle className="w-16 h-16 mx-auto mb-4" />
                                    <h4 className="text-lg font-bold">No Passing Solution</h4>
                                    <p className="text-sm">Adjust constraints or pipe schedule.</p>
                                </div>
                            );
                        }
                    })()}
                </CardContent>
             </Card>
        </div>

        {/* Detailed Table */}
        <Card className="bg-slate-900 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white">Detailed Size Screening</CardTitle>
                <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:text-white">
                    <Download className="w-4 h-4 mr-2" /> Export Report
                </Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader className="bg-slate-800">
                        <TableRow>
                            <TableHead className="text-slate-300">NPS</TableHead>
                            <TableHead className="text-slate-300">ID (in)</TableHead>
                            <TableHead className="text-slate-300">Velocity (ft/s)</TableHead>
                            <TableHead className="text-slate-300">Reynolds</TableHead>
                            <TableHead className="text-slate-300">Total dP (psi)</TableHead>
                            <TableHead className="text-slate-300">Arr. Press. (psi)</TableHead>
                            <TableHead className="text-slate-300">Erosion Ratio</TableHead>
                            <TableHead className="text-slate-300">Status</TableHead>
                            <TableHead className="text-slate-300">Flags</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {results && results.map(row => (
                            <TableRow key={row.nps} className="border-slate-800 hover:bg-slate-800/30">
                                <TableCell className="font-bold text-white">{row.nps}"</TableCell>
                                <TableCell className="text-slate-400">{row.idInches.toFixed(3)}</TableCell>
                                <TableCell className={
                                    parseFloat(row.velocity) > constraints.maxVelocity ? 'text-red-400 font-bold' : 
                                    parseFloat(row.velocity) < constraints.minVelocity ? 'text-amber-400' : 'text-emerald-400'
                                }>{row.velocity}</TableCell>
                                <TableCell className="text-slate-400 font-mono text-xs">{parseInt(row.reynolds).toLocaleString()}</TableCell>
                                <TableCell className="text-slate-300">{row.totalDrop}</TableCell>
                                <TableCell className={parseFloat(row.arrivalPressure) < 0 ? 'text-red-400' : 'text-slate-300'}>{row.arrivalPressure}</TableCell>
                                <TableCell className={parseFloat(row.erosionRatio) > 1 ? 'text-red-400' : 'text-slate-300'}>{row.erosionRatio}</TableCell>
                                <TableCell>
                                    <Badge variant={row.status === 'pass' ? 'default' : 'destructive'} className={
                                        row.status === 'pass' ? 'bg-emerald-600' : 
                                        row.status === 'warning' ? 'bg-amber-600' : 'bg-red-600'
                                    }>
                                        {row.status.toUpperCase()}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                        {row.flags.map(f => (
                                            <span key={f} className="text-[10px] bg-slate-800 px-1 py-0.5 rounded border border-slate-700 text-slate-400">{f}</span>
                                        ))}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
  );
};

export default ResultsDashboard;