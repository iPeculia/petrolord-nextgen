import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

const RatingsComparisonPanel = ({ sections }) => {
    const data = sections.map((s, i) => ({
        name: `Sec ${i+1}`,
        Burst: s.burst_rating,
        Collapse: s.collapse_rating,
        Tensile: s.tensile_strength / 1000 // Convert to kips for scale
    }));

    return (
        <div className="grid grid-cols-1 gap-6">
            <Card className="bg-[#1E293B] border-slate-700 h-[500px] flex flex-col">
                <CardHeader>
                    <CardTitle className="text-sm font-bold text-slate-300 uppercase tracking-wider">Mechanical Ratings Profile</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            barGap={2}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                            <XAxis dataKey="name" stroke="#64748b" />
                            <YAxis yAxisId="pressure" stroke="#8B5CF6" label={{ value: 'Pressure (psi)', angle: -90, position: 'insideLeft', fill: '#8B5CF6' }} />
                            <YAxis yAxisId="tension" orientation="right" stroke="#10B981" label={{ value: 'Tension (kips)', angle: 90, position: 'insideRight', fill: '#10B981' }} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', color: '#F8FAFC' }}
                            />
                            <Legend />
                            <Bar yAxisId="pressure" dataKey="Burst" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                            <Bar yAxisId="pressure" dataKey="Collapse" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                            <Bar yAxisId="tension" dataKey="Tensile" fill="#10B981" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
};

export default RatingsComparisonPanel;