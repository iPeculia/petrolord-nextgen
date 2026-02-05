import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';

const CDFPlot = ({ data, p10, p50, p90 }) => {
    // data expected: sorted values with cumulative prob
    if (!data || data.length === 0) return <div className="flex items-center justify-center h-full text-slate-500 text-xs">No CDF data</div>;

    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="value" stroke="#64748b" tick={{fill: '#64748b', fontSize: 10}} />
                <YAxis stroke="#64748b" tick={{fill: '#64748b', fontSize: 10}} domain={[0, 1]} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9' }} />
                <Area type="monotone" dataKey="prob" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} name="Cumulative Probability" />
                
                {p90 && <ReferenceLine x={p90} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'P90', fill: '#ef4444', position: 'insideTopRight', fontSize: 10 }} />}
                {p50 && <ReferenceLine x={p50} stroke="#fbbf24" strokeDasharray="3 3" label={{ value: 'P50', fill: '#fbbf24', position: 'insideTopRight', fontSize: 10 }} />}
                {p10 && <ReferenceLine x={p10} stroke="#10b981" strokeDasharray="3 3" label={{ value: 'P10', fill: '#10b981', position: 'insideTopRight', fontSize: 10 }} />}
            </AreaChart>
        </ResponsiveContainer>
    );
};

export default CDFPlot;