import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const DriveMechanismBreakdown = ({ results }) => {
    if (!results) {
        return (
             <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle>Drive Mechanism Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-64 flex items-center justify-center text-gray-500">
                        <p>Run analysis to see drive mechanisms.</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // This is a placeholder. Real calculation would be more complex.
    const data = [
        { name: 'Solution Gas Drive', value: 70 },
        { name: 'Water Influx', value: results.estimatedWaterInflux > 0 ? 20 : 0 },
        { name: 'Gas Cap', value: results.gasCapRatio > 0 ? 10 : 0 },
    ].filter(d => d.value > 0);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
                <CardTitle>Drive Mechanism Breakdown</CardTitle>
                <CardDescription>Estimated contribution of each drive mechanism.</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export default DriveMechanismBreakdown;