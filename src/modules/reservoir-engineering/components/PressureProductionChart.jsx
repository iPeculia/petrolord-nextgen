import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 p-2 rounded-md text-sm text-white">
        <p className="label">{`Date: ${label}`}</p>
        <p style={{ color: payload[0].color }}>{`Pressure: ${payload[0].value.toFixed(0)} psi`}</p>
        <p style={{ color: payload[1].color }}>{`Cum. Prod.: ${(payload[1].value / 1e6).toFixed(2)} MMstb`}</p>
      </div>
    );
  }
  return null;
};

const PressureProductionChart = ({ productionData, pvtData }) => {
    if (!productionData || productionData.length === 0) {
        return (
             <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle>Pressure vs. Production</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-64 flex items-center justify-center text-gray-500">
                        <p>Upload data to see the chart.</p>
                    </div>
                </CardContent>
            </Card>
        );
    }
    
    return (
        <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
                <CardTitle>Pressure vs. Cumulative Production</CardTitle>
                <CardDescription>Reservoir performance over time</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={productionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="date" stroke="#9ca3af" />
                        <YAxis yAxisId="left" stroke="#8884d8" label={{ value: 'Pressure (psi)', angle: -90, position: 'insideLeft', fill: '#8884d8' }} />
                        <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" label={{ value: 'Cumulative Oil (stb)', angle: 90, position: 'insideRight', fill: '#82ca9d' }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line yAxisId="left" type="monotone" dataKey="pressure" stroke="#8884d8" dot={false} name="Pressure" />
                        <Line yAxisId="right" type="monotone" dataKey="cumulative_production" stroke="#82ca9d" dot={false} name="Cumulative Production" />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export default PressureProductionChart;