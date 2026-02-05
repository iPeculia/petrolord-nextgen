import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ResponsiveContainer, ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Area } from 'recharts';
import { useDeclineCurve } from '@/context/DeclineCurveContext';
import { Button } from '@/components/ui/button';
import { Maximize2 } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-900 border border-slate-700 p-2 rounded shadow-xl text-xs">
                <p className="text-slate-300 font-bold mb-1">{label}</p>
                {payload.map((p, idx) => (
                    <p key={idx} style={{ color: p.color }}>
                        {p.name}: {p.value.toLocaleString()} {p.unit}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const BasePlots = () => {
    const { currentWell } = useDeclineCurve();

    if (!currentWell || !currentWell.data) {
        return (
            <div className="h-full flex items-center justify-center text-slate-500">
                <p>Select a well with production data to view plots.</p>
            </div>
        );
    }

    const data = currentWell.data;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full overflow-auto pb-4">
            {/* Rate vs Time - Semi-Log */}
            <Card className="bg-slate-900 border-slate-800 min-h-[400px] flex flex-col">
                <CardHeader className="py-3 px-4 border-b border-slate-800 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-medium text-slate-300">Production Rate vs Time (Semi-Log)</CardTitle>
                    <Button variant="ghost" size="icon" className="h-6 w-6"><Maximize2 className="h-3 w-3" /></Button>
                </CardHeader>
                <CardContent className="p-4 flex-1 min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                            <XAxis dataKey="date" stroke="#94a3b8" tick={{fontSize: 10}} tickFormatter={(val) => val.split('-')[0]} />
                            <YAxis yAxisId="left" stroke="#94a3b8" tick={{fontSize: 10}} scale="log" domain={['auto', 'auto']} />
                            <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" tick={{fontSize: 10}} scale="log" domain={['auto', 'auto']} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{fontSize: '11px', paddingTop: '10px'}} />
                            <Line yAxisId="left" type="monotone" dataKey="oilRate" name="Oil Rate" stroke="#10b981" dot={false} strokeWidth={2} unit="bbl/d" />
                            <Line yAxisId="right" type="monotone" dataKey="gasRate" name="Gas Rate" stroke="#ef4444" dot={false} strokeWidth={2} unit="mcf/d" />
                            <Line yAxisId="left" type="monotone" dataKey="waterRate" name="Water Rate" stroke="#3b82f6" dot={false} strokeWidth={1} strokeDasharray="3 3" unit="bbl/d" />
                        </ComposedChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Cum vs Time */}
            <Card className="bg-slate-900 border-slate-800 min-h-[400px] flex flex-col">
                <CardHeader className="py-3 px-4 border-b border-slate-800 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-medium text-slate-300">Cumulative Production</CardTitle>
                    <Button variant="ghost" size="icon" className="h-6 w-6"><Maximize2 className="h-3 w-3" /></Button>
                </CardHeader>
                <CardContent className="p-4 flex-1 min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                            <XAxis dataKey="date" stroke="#94a3b8" tick={{fontSize: 10}} tickFormatter={(val) => val.split('-')[0]} />
                            <YAxis stroke="#94a3b8" tick={{fontSize: 10}} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{fontSize: '11px', paddingTop: '10px'}} />
                            <Area type="monotone" dataKey="cumOil" name="Cum Oil" fill="#10b981" stroke="#10b981" fillOpacity={0.1} unit="bbl" />
                            <Area type="monotone" dataKey="cumGas" name="Cum Gas" fill="#ef4444" stroke="#ef4444" fillOpacity={0.1} unit="mcf" />
                        </ComposedChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
};

export default BasePlots;