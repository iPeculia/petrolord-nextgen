import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const OoipEstimationChart = ({ results }) => {
    if (!results || !results.ooip) {
        return (
             <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle>OOIP Estimation</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-64 flex items-center justify-center text-gray-500">
                        <p>Run analysis to see OOIP estimation.</p>
                    </div>
                </CardContent>
            </Card>
        );
    }
    
    const data = [
        {
            name: 'Material Balance',
            ooip: (results.ooip / 1e6).toFixed(2), // in MMstb
        },
    ];

    return (
        <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
                <CardTitle>OOIP Estimation Comparison</CardTitle>
                <CardDescription>Comparing OOIP from different methods.</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis type="number" stroke="#9ca3af" label={{ value: 'OOIP (MMstb)', position: 'insideBottom', offset: -5, fill: '#9ca3af' }} />
                        <YAxis type="category" dataKey="name" stroke="#9ca3af" width={120} />
                        <Tooltip cursor={{fill: '#ffffff10'}}/>
                        <Legend />
                        <Bar dataKey="ooip" fill="#8884d8" name="OOIP (MMstb)" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export default OoipEstimationChart;