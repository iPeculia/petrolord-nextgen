import React from 'react';
import { useMaterialBalance } from '@/hooks/useMaterialBalance';
import { ResponsiveContainer, ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Area } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';

const MBHistoryPlots = () => {
    const { state } = useMaterialBalance();
    const { productionHistory, pressureData } = state;

    // Combine production and pressure data for plotting if dates match, 
    // or just pass production history if pressure is sparse/different. 
    // For simplicity, we plot them on separate charts or merged if aligned.
    // Here, we plot separate charts for clarity.

    if (productionHistory.length === 0 && pressureData.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 border-2 border-dashed border-slate-700 rounded-lg text-slate-500">
                No historical data loaded. Import production/pressure data to view plots.
            </div>
        );
    }

    const formatDate = (dateStr) => {
        try {
            return format(new Date(dateStr), 'MMM yy');
        } catch {
            return dateStr;
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full min-h-[500px]">
            {/* Cumulative Production */}
            <Card className="bg-slate-800 border-slate-700 flex flex-col">
                <CardHeader className="py-3">
                    <CardTitle className="text-sm font-medium text-slate-200">Production History</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 p-2 min-h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={productionHistory}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="date" tickFormatter={formatDate} stroke="#94a3b8" fontSize={11} />
                            <YAxis yAxisId="left" stroke="#94a3b8" fontSize={11} label={{ value: 'Oil (stb) / Gas (mscf)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                            <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" fontSize={11} label={{ value: 'Water (stb)', angle: 90, position: 'insideRight', fill: '#94a3b8' }} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                                labelFormatter={(label) => formatDate(label)}
                            />
                            <Legend />
                            <Area yAxisId="left" type="monotone" dataKey="oilProd" name="Np" stroke="#22c55e" fill="#22c55e" fillOpacity={0.1} strokeWidth={2} />
                            <Line yAxisId="left" type="monotone" dataKey="gasProd" name="Gp" stroke="#ef4444" strokeWidth={2} dot={false} />
                            <Area yAxisId="right" type="monotone" dataKey="waterProd" name="Wp" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeWidth={2} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Pressure History */}
            <Card className="bg-slate-800 border-slate-700 flex flex-col">
                <CardHeader className="py-3">
                    <CardTitle className="text-sm font-medium text-slate-200">Reservoir Pressure</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 p-2 min-h-[250px]">
                    {pressureData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={pressureData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="date" tickFormatter={formatDate} stroke="#94a3b8" fontSize={11} />
                                <YAxis stroke="#94a3b8" fontSize={11} domain={['auto', 'auto']} label={{ value: 'Pressure (psi)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                                    labelFormatter={(label) => formatDate(label)}
                                />
                                <Legend />
                                <Line type="monotone" dataKey="pressure" name="Pressure" stroke="#eab308" strokeWidth={3} dot={{ r: 4, fill: '#eab308' }} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-full text-slate-500 text-sm">
                            No pressure data loaded.
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default MBHistoryPlots;