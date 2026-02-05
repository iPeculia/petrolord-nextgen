import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ScenarioRankingChart = ({ scenarios }) => {
  const [metric, setMetric] = useState('npv');

  const chartData = scenarios
    .filter(s => s.results)
    .map(s => ({
      name: s.name,
      value: s.results[metric],
      ...s.results
    }));

  const metrics = {
    npv: { label: 'Net Present Value', unit: '$M' },
    irr: { label: 'Internal Rate of Return', unit: '%' },
    total_capex: { label: 'Total CAPEX', unit: '$M' },
    peak_oil_rate: { label: 'Peak Oil Rate', unit: 'bpd' }
  };

  const getBarColor = (index, total) => {
      // Gradient blues
      const intensity = 200 + Math.floor((index / total) * 55); 
      return `hsl(217, 91%, 60%)`; // Simple blue for now, can be complex
  };

  return (
    <div className="bg-[#1a1a1a] rounded-lg border border-slate-800 p-4">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">Metric Comparison</h3>
        <Select value={metric} onValueChange={setMetric}>
            <SelectTrigger className="w-[180px] h-8 bg-slate-900 border-slate-700 text-white text-xs">
                <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-700 text-white">
                <SelectItem value="npv">NPV</SelectItem>
                <SelectItem value="irr">IRR</SelectItem>
                <SelectItem value="total_capex">Total CAPEX</SelectItem>
                <SelectItem value="peak_oil_rate">Peak Oil</SelectItem>
            </SelectContent>
        </Select>
      </div>

      <div className="h-[300px] w-full">
        {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                <XAxis type="number" stroke="#94a3b8" fontSize={10} tickFormatter={(val) => val.toLocaleString()} />
                <YAxis dataKey="name" type="category" width={100} stroke="#94a3b8" fontSize={11} tick={{fill: '#cbd5e1'}} />
                <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value) => [`${value.toLocaleString()} ${metrics[metric].unit}`, metrics[metric].label]}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#3b82f6'} />
                    ))}
                </Bar>
            </BarChart>
            </ResponsiveContainer>
        ) : (
            <div className="flex items-center justify-center h-full text-slate-500 text-sm">
                No data available to chart. Run analysis first.
            </div>
        )}
      </div>
    </div>
  );
};

export default ScenarioRankingChart;