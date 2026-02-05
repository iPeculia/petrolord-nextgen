import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const SpiderPlot = ({ data }) => {
    if (!data || data.length === 0) return <div className="flex items-center justify-center h-full text-slate-500 text-xs">No spider plot data</div>;
    
    // Data expected: [ { percentChange: -20, porosity: 450, sw: 480, thickness: 420 }, { percentChange: 0, ... }, ... ]

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                    dataKey="percentChange" 
                    label={{ value: '% Change in Input', position: 'insideBottom', offset: -5, fill: '#64748b' }} 
                    stroke="#64748b"
                    tick={{fill: '#64748b', fontSize: 10}}
                />
                <YAxis 
                    stroke="#64748b"
                    tick={{fill: '#64748b', fontSize: 10}}
                    label={{ value: 'Output (STOIIP)', angle: -90, position: 'insideLeft', fill: '#64748b' }}
                />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9' }} />
                <Legend />
                <Line type="monotone" dataKey="porosity" stroke="#3b82f6" name="Porosity" strokeWidth={2} dot={{r:3}} />
                <Line type="monotone" dataKey="sw" stroke="#ef4444" name="Water Saturation" strokeWidth={2} dot={{r:3}} />
                <Line type="monotone" dataKey="thickness" stroke="#10b981" name="Thickness" strokeWidth={2} dot={{r:3}} />
                <Line type="monotone" dataKey="area" stroke="#a855f7" name="Area" strokeWidth={2} dot={{r:3}} />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default SpiderPlot;