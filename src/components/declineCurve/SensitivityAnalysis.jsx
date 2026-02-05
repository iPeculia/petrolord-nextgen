import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ReferenceLine } from 'recharts';
import { useDeclineCurve } from '@/context/DeclineCurveContext';
import { calculateCumulative } from '@/utils/declineCurve/DeclineModels';

const SensitivityAnalysis = () => {
    const { currentProject, activeScenarioId } = useDeclineCurve();
    
    const scenarios = currentProject?.scenarios || [];
    const activeScenario = activeScenarioId !== null ? scenarios[activeScenarioId] : scenarios[scenarios.length-1];

    const sensitivityData = useMemo(() => {
        if (!activeScenario || !activeScenario.results) return [];

        const { qi, Di, b } = activeScenario.results.params;
        const baseEUR = calculateCumulative(3650 * 5, qi, Di, b); // 50 years EUR base

        // Vary parameters by +/- 20%
        const variation = 0.2;
        
        const params = [
            { id: 'qi', label: 'Initial Rate (Qi)', base: qi, valLow: qi * (1-variation), valHigh: qi * (1+variation) },
            { id: 'Di', label: 'Decline Rate (Di)', base: Di, valLow: Di * (1-variation), valHigh: Di * (1+variation) },
            { id: 'b', label: 'b-Factor', base: b, valLow: Math.max(0, b - 0.2), valHigh: Math.min(2, b + 0.2) } // Absolute +/- 0.2 for b
        ];

        return params.map(p => {
            // Calculate Low Case EUR
            const eurLow = calculateCumulative(
                18250, 
                p.id === 'qi' ? p.valLow : qi, 
                p.id === 'Di' ? p.valLow * 365 : Di * 365, // Convert back to annual for calc function if needed, or pass raw Di
                p.id === 'b' ? p.valLow : b
            );
            
            // Calculate High Case EUR
            const eurHigh = calculateCumulative(
                18250, 
                p.id === 'qi' ? p.valHigh : qi, 
                p.id === 'Di' ? p.valHigh * 365 : Di * 365,
                p.id === 'b' ? p.valHigh : b
            );

            // Delta from Base
            return {
                param: p.label,
                lowImpact: ((eurLow - baseEUR) / baseEUR) * 100,
                highImpact: ((eurHigh - baseEUR) / baseEUR) * 100,
                base: baseEUR
            };
        }).sort((a,b) => Math.abs(b.highImpact - b.lowImpact) - Math.abs(a.highImpact - a.lowImpact)); // Sort by impact magnitude

    }, [activeScenario]);

    if (!activeScenario) {
        return <div className="p-8 text-center text-slate-500">No active scenario available for sensitivity analysis.</div>;
    }

    // Transform for Tornado Chart (Recharts Bar Chart hack)
    // We need 'start' and 'end' values for ranges, or just center around 0
    const chartData = sensitivityData.map(d => ({
        name: d.param,
        min: Math.min(d.lowImpact, d.highImpact),
        max: Math.max(d.lowImpact, d.highImpact),
        range: [Math.min(d.lowImpact, d.highImpact), Math.max(d.lowImpact, d.highImpact)]
    }));

    return (
        <Card className="bg-slate-950 border-slate-800 h-full">
            <CardHeader className="py-3 px-4 border-b border-slate-800">
                <CardTitle className="text-sm font-medium text-slate-300">Sensitivity Tornado Chart (±20% Parameter Variation)</CardTitle>
            </CardHeader>
            <CardContent className="p-4 h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={chartData} margin={{ left: 40, right: 40 }}>
                        <XAxis type="number" domain={[-40, 40]} stroke="#64748b" tickFormatter={(v) => `${v}%`} fontSize={10} label={{ value: '% Change in EUR', position: 'insideBottom', offset: -5, fill: '#64748b' }} />
                        <YAxis dataKey="name" type="category" stroke="#94a3b8" width={100} fontSize={11} tickLine={false} />
                        <Tooltip 
                            cursor={{fill: 'rgba(255,255,255,0.05)'}}
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }}
                            formatter={(val, name, props) => {
                                if (name === 'min') return [`${val.toFixed(1)}%`, 'Low Case'];
                                if (name === 'max') return [`${val.toFixed(1)}%`, 'High Case'];
                                return val;
                            }}
                        />
                        <ReferenceLine x={0} stroke="#475569" strokeDasharray="3 3" />
                        <Bar dataKey="min" fill="#ef4444" barSize={20} stackId="stack" />
                        <Bar dataKey="max" fill="#22c55e" barSize={20} stackId="stack" />
                    </BarChart>
                </ResponsiveContainer>
                <div className="text-center text-xs text-slate-500 mt-2">
                    Shows percent change in Estimated Ultimate Recovery (EUR) relative to base case.
                </div>
            </CardContent>
        </Card>
    );
};

export default SensitivityAnalysis;