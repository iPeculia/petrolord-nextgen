import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const FiscalTermsChart = ({ data }) => {
    if (!data) return <div className="flex items-center justify-center h-full text-slate-500 text-xs">No Data</div>;
    
    // data structure expected: { revenue, govt, opex, capex, net }
    const chartData = [
        { name: 'Net Cash Flow', value: data.net, color: '#10b981' },
        { name: 'Govt Take (Tax+Royalty)', value: data.govt, color: '#f43f5e' },
        { name: 'OPEX', value: data.opex, color: '#f59e0b' },
        { name: 'CAPEX', value: data.capex, color: '#6366f1' },
    ].filter(d => d.value > 0);

    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                >
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0.5)" />
                    ))}
                </Pie>
                <Tooltip 
                    formatter={(value) => `$${(value/1000000).toFixed(1)}M`}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9' }} 
                />
                <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{fontSize: '10px'}} />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default FiscalTermsChart;