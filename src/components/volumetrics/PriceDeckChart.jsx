import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const PriceDeckChart = ({ data }) => {
    if (!data || data.length === 0) return <div className="flex items-center justify-center h-full text-slate-500 text-xs">No Data</div>;

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="year" stroke="#64748b" tick={{fill: '#64748b', fontSize: 10}} />
                <YAxis yAxisId="left" stroke="#10b981" tick={{fill: '#10b981', fontSize: 10}} label={{ value: 'Oil ($/bbl)', angle: -90, position: 'insideLeft', fill: '#10b981', fontSize: 10 }} />
                <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" tick={{fill: '#f59e0b', fontSize: 10}} label={{ value: 'Gas ($/mcf)', angle: 90, position: 'insideRight', fill: '#f59e0b', fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9' }} />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="oil_price" stroke="#10b981" strokeWidth={2} name="Oil Price" dot={false} />
                <Line yAxisId="right" type="monotone" dataKey="gas_price" stroke="#f59e0b" strokeWidth={2} name="Gas Price" dot={false} />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default PriceDeckChart;