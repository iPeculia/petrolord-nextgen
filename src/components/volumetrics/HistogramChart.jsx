import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';

const HistogramChart = ({ data, p10, p50, p90 }) => {
    if (!data || data.length === 0) return <div className="flex items-center justify-center h-full text-slate-500 text-xs">No simulation data</div>;

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} barCategoryGap={0}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis 
                    dataKey="mid" 
                    stroke="#64748b" 
                    tick={{fill: '#64748b', fontSize: 10}}
                    tickFormatter={(val) => val.toFixed(0)}
                />
                <YAxis stroke="#64748b" tick={{fill: '#64748b', fontSize: 10}} />
                <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9' }}
                    labelFormatter={(label) => `Value: ${parseFloat(label).toFixed(1)}`}
                />
                <Bar dataKey="frequency" fill="#3b82f6" opacity={0.6} name="Frequency" />
                
                {p90 && <ReferenceLine x={p90} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'P90', fill: '#ef4444', fontSize: 10 }} />}
                {p50 && <ReferenceLine x={p50} stroke="#fbbf24" strokeDasharray="3 3" label={{ value: 'P50', fill: '#fbbf24', fontSize: 10 }} />}
                {p10 && <ReferenceLine x={p10} stroke="#10b981" strokeDasharray="3 3" label={{ value: 'P10', fill: '#10b981', fontSize: 10 }} />}
            </BarChart>
        </ResponsiveContainer>
    );
};

export default HistogramChart;