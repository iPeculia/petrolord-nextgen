import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useVolumetrics } from '@/hooks/useVolumetrics';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const MetricCard = ({ title, value, unit, subtext, color = "text-white" }) => (
    <Card className="bg-slate-950 border-slate-800 relative overflow-hidden">
        <div className={`absolute top-0 left-0 w-1 h-full ${color.replace('text-', 'bg-')}`}></div>
        <CardContent className="p-5">
            <p className="text-sm text-slate-400 font-medium uppercase tracking-wider mb-1">{title}</p>
            <div className="flex items-baseline gap-1">
                <h3 className={`text-3xl font-bold ${color}`}>{value}</h3>
                <span className="text-sm text-slate-500 font-mono">{unit}</span>
            </div>
            {subtext && <p className="text-xs text-slate-500 mt-2 border-t border-slate-900 pt-2">{subtext}</p>}
        </CardContent>
    </Card>
);

const ResultsDisplay = () => {
    const { state } = useVolumetrics();
    const results = state.data.results;

    if (!results || !results.metrics) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 bg-slate-900/20">
                <p className="text-lg">No results available</p>
                <p className="text-sm mt-2">Run a calculation from the Input tab to see results here.</p>
            </div>
        );
    }

    const { stoiip, recoverable, hcpv } = results.metrics;
    const unit = results.units.volume;

    const chartData = [
        { name: 'STOIIP', value: parseFloat(stoiip.toFixed(2)) },
        { name: 'Recoverable', value: parseFloat(recoverable.toFixed(2)) },
    ];

    return (
        <div className="p-6 space-y-6 h-full overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <MetricCard 
                    title="STOIIP" 
                    value={stoiip.toFixed(2)} 
                    unit={unit} 
                    subtext="Stock Tank Oil Initially In Place"
                    color="text-blue-400"
                />
                <MetricCard 
                    title="Recoverable Resources" 
                    value={recoverable.toFixed(2)} 
                    unit={unit} 
                    subtext="Technically Recoverable Volume"
                    color="text-green-400"
                />
                <MetricCard 
                    title="HCPV" 
                    value={(hcpv).toFixed(1)} 
                    unit="acre-ft" 
                    subtext="Hydrocarbon Pore Volume"
                    color="text-purple-400"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-slate-950 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-sm text-slate-400 uppercase tracking-wider">Volume Comparison</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                                <XAxis type="number" stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} />
                                <YAxis dataKey="name" type="category" stroke="#64748b" tick={{fill: '#94a3b8', fontSize: 12}} width={80} />
                                <RechartsTooltip 
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9' }}
                                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                                />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={40}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === 0 ? '#60a5fa' : '#4ade80'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="bg-slate-950 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-sm text-slate-400 uppercase tracking-wider">Summary Table</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <table className="w-full text-sm text-left text-slate-300">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-900/50">
                                <tr>
                                    <th className="px-4 py-3">Metric</th>
                                    <th className="px-4 py-3 text-right">Value</th>
                                    <th className="px-4 py-3 text-right">Unit</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                <tr className="bg-slate-900/20">
                                    <td className="px-4 py-3 font-medium text-blue-400">STOIIP</td>
                                    <td className="px-4 py-3 text-right font-mono">{stoiip.toFixed(3)}</td>
                                    <td className="px-4 py-3 text-right text-slate-500">{unit}</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium text-green-400">Recoverable</td>
                                    <td className="px-4 py-3 text-right font-mono">{recoverable.toFixed(3)}</td>
                                    <td className="px-4 py-3 text-right text-slate-500">{unit}</td>
                                </tr>
                                <tr className="bg-slate-900/20">
                                    <td className="px-4 py-3">HCPV</td>
                                    <td className="px-4 py-3 text-right font-mono">{hcpv.toFixed(1)}</td>
                                    <td className="px-4 py-3 text-right text-slate-500">acre-ft</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3">GRV</td>
                                    <td className="px-4 py-3 text-right font-mono">{results.metrics.grv.toFixed(1)}</td>
                                    <td className="px-4 py-3 text-right text-slate-500">acre-ft</td>
                                </tr>
                            </tbody>
                         </table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ResultsDisplay;