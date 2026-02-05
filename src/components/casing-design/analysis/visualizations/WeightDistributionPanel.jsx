import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { formatNumber } from '@/components/casing-design/utils/calculationUtils';

const WeightDistributionPanel = ({ sections }) => {
    // 1. Prepare data for Pie Chart (Weight by Grade)
    const weightByGrade = {};
    let totalWeight = 0;

    sections.forEach(s => {
        const length = s.bottom_depth - s.top_depth;
        const weight = length * s.weight;
        totalWeight += weight;
        
        if (weightByGrade[s.grade]) {
            weightByGrade[s.grade] += weight;
        } else {
            weightByGrade[s.grade] = weight;
        }
    });

    const pieData = Object.keys(weightByGrade).map(grade => ({
        name: grade,
        value: weightByGrade[grade]
    }));

    // 2. Prepare data for Bar Chart (Weight by Section)
    const barData = sections.map((s, i) => ({
        name: `Sec ${i+1}`,
        weight: (s.bottom_depth - s.top_depth) * s.weight,
        grade: s.grade
    }));

    const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <Card className="bg-[#1E293B] border-slate-700 flex flex-col h-[400px]">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold text-slate-300 uppercase tracking-wider">Weight by Grade</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 min-h-0 relative">
                    <div className="absolute inset-0 pb-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    formatter={(value) => `${formatNumber(value / 1000, 1)} klb`}
                                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', color: '#F8FAFC' }}
                                />
                                <Legend verticalAlign="bottom" height={36}/>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none mt-[-18px]">
                            <span className="text-2xl font-bold text-white block">{formatNumber(totalWeight / 1000, 1)}</span>
                            <span className="text-xs text-slate-500 uppercase">Total klb</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Bar Chart */}
            <Card className="bg-[#1E293B] border-slate-700 flex flex-col h-[400px]">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold text-slate-300 uppercase tracking-wider">Weight per Section</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 min-h-0 relative">
                    <div className="absolute inset-0 pb-4 pr-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData} margin={{ top: 20, right: 0, left: 0, bottom: 5 }}>
                                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip 
                                    cursor={{fill: '#334155', opacity: 0.2}}
                                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', color: '#F8FAFC' }}
                                    formatter={(value) => [`${formatNumber(value, 0)} lbs`, 'Weight']}
                                />
                                <Bar dataKey="weight" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default WeightDistributionPanel;