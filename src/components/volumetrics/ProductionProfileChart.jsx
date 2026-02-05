import React from 'react';
import { ResponsiveContainer, ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const ProductionProfileChart = ({ data }) => {
    if (!data || data.length === 0) return <div className="flex items-center justify-center h-full text-slate-500 text-xs">No Data</div>;

    return (
        <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="year" stroke="#64748b" tick={{fill: '#64748b', fontSize: 10}} />
                <YAxis yAxisId="left" stroke="#64748b" tick={{fill: '#64748b', fontSize: 10}} label={{ value: 'Rate (bbl/d)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
                <YAxis yAxisId="right" orientation="right" stroke="#64748b" tick={{fill: '#64748b', fontSize: 10}} label={{ value: 'Cum (MMbbl)', angle: 90, position: 'insideRight', fill: '#64748b', fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9' }} />
                <Legend />
                <Bar yAxisId="left" dataKey="oil_rate" fill="#10b981" name="Oil Rate" barSize={20} />
                <Line yAxisId="right" type="monotone" dataKey="cumulative_oil" stroke="#3b82f6" strokeWidth={2} name="Cumulative" dot={false} />
            </ComposedChart>
        </ResponsiveContainer>
    );
};

export default ProductionProfileChart;