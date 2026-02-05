import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Cell } from 'recharts';

const TornadoChart = ({ data }) => {
    if (!data || data.length === 0) return <div className="flex items-center justify-center h-full text-slate-500 text-xs">No sensitivity data available</div>;

    // Transform data for Tornado: We need baseline centered
    // Data structure expected: [{ parameter: "Porosity", low: 400, high: 600, base: 500 }]
    // Recharts needs: [{ name: "Porosity", min: 400, max: 600, diffLow: base-low, diffHigh: high-base }]
    
    const processedData = data.map(d => ({
        name: d.parameter,
        start: d.low,
        end: d.high,
        base: d.base,
        lowDiff: d.low - d.base, // Negative usually
        highDiff: d.high - d.base, // Positive usually
        range: d.high - d.low
    })).sort((a, b) => b.range - a.range); // Sort by impact

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={processedData} margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                <XAxis type="number" stroke="#64748b" tick={{fill: '#64748b', fontSize: 10}} />
                <YAxis dataKey="name" type="category" stroke="#64748b" tick={{fill: '#94a3b8', fontSize: 11}} width={100} />
                <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9' }}
                    formatter={(val, name) => [val.toFixed(2), name === 'lowDiff' ? 'Low Case Delta' : 'High Case Delta']}
                />
                <ReferenceLine x={0} stroke="#94a3b8" />
                
                {/* We stack bars relative to base=0 (delta) for classic tornado look */}
                <Bar dataKey="lowDiff" fill="#ef4444" barSize={20} name="Low Case Impact" radius={[4, 0, 0, 4]} />
                <Bar dataKey="highDiff" fill="#3b82f6" barSize={20} name="High Case Impact" radius={[0, 4, 4, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default TornadoChart;