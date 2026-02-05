import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { calculateRate } from '@/utils/declineCurve/DeclineModels';

const ScenarioComparisonChart = ({ scenarios }) => {
    // Only compare valid scenarios with results
    const validScenarios = scenarios.filter(s => s.results && s.results.params);

    if (validScenarios.length === 0) {
        return <div className="h-[400px] flex items-center justify-center text-slate-500">No scenarios with data to compare.</div>;
    }

    // Generate comparison data
    // We'll generate a unified time axis from 0 to maxDuration among scenarios
    const maxDuration = Math.max(...validScenarios.map(s => s.config?.maxDuration || 3650));
    const step = maxDuration / 100; // 100 points
    
    const chartData = [];
    for (let t = 0; t <= maxDuration; t += step) {
        const point = { tDays: t };
        validScenarios.forEach((scenario, idx) => {
            const { qi, Di, b } = scenario.results.params;
            point[`scenario_${idx}`] = calculateRate(t, qi, Di, b);
        });
        chartData.push(point);
    }

    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

    return (
        <div className="h-[500px] w-full p-4 bg-slate-950 rounded-lg">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                    <XAxis 
                        dataKey="tDays" 
                        stroke="#94a3b8" 
                        label={{ value: 'Time (Days)', position: 'insideBottom', offset: -5, fill: '#94a3b8', fontSize: 12 }} 
                        tick={{ fontSize: 10 }}
                    />
                    <YAxis 
                        stroke="#94a3b8" 
                        label={{ value: 'Rate', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 12 }}
                        tick={{ fontSize: 10 }}
                    />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc', fontSize: '12px' }}
                        labelFormatter={(t) => `Day: ${t.toFixed(0)}`}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    {validScenarios.map((scenario, idx) => (
                        <Line 
                            key={idx}
                            type="monotone" 
                            dataKey={`scenario_${idx}`} 
                            name={scenario.name} 
                            stroke={colors[idx % colors.length]} 
                            dot={false} 
                            strokeWidth={2}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ScenarioComparisonChart;