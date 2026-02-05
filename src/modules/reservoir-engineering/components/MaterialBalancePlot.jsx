import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend, Line } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-800 border border-slate-700 p-2 rounded-md text-sm text-white">
        <p>{`F: ${data.f.toFixed(2)}`}</p>
        <p>{`Eo_total: ${data.eo_total.toFixed(4)}`}</p>
        <p>{`Pressure: ${data.pressure} psi`}</p>
      </div>
    );
  }
  return null;
};

const MaterialBalancePlot = ({ plotData, equation, rSquared }) => {
    if (!plotData || plotData.length === 0) {
        return (
             <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle>Material Balance Plot (F vs. Eₒ + ...)</CardTitle>
                    <CardDescription>Awaiting analysis results...</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-64 flex items-center justify-center text-gray-500">
                        <p>Run analysis to generate the plot.</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const trendlineData = [
        { x: Math.min(...plotData.map(d => d.eo_total)), y: parseFloat(equation.split(' * E_total + ')[1]) + Math.min(...plotData.map(d => d.eo_total)) * parseFloat(equation.split(' * E_total')[0].split('F = ')[1]) },
        { x: Math.max(...plotData.map(d => d.eo_total)), y: parseFloat(equation.split(' * E_total + ')[1]) + Math.max(...plotData.map(d => d.eo_total)) * parseFloat(equation.split(' * E_total')[0].split('F = ')[1]) }
    ];

    return (
        <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
                <CardTitle>Material Balance Plot</CardTitle>
                <CardDescription>
                    {`Equation: ${equation} | R²: ${rSquared.toFixed(4)}`}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="eo_total" type="number" name="Eₒ + mE₉ + Efw" unit="" stroke="#9ca3af" label={{ value: 'Eₒ + mE₉ + Efw', position: 'insideBottom', offset: -10, fill: '#9ca3af' }} />
                        <YAxis dataKey="f" type="number" name="F" unit="MMbbl" stroke="#9ca3af" label={{ value: 'F (MMbbl)', angle: -90, position: 'insideLeft', fill: '#9ca3af' }} />
                        <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                        <Legend />
                        <Scatter name="Data Points" data={plotData} fill="#8884d8" shape="circle" />
                         <Line
                            dataKey="y"
                            data={trendlineData}
                            stroke="#82ca9d"
                            dot={false}
                            strokeWidth={2}
                            name="Trendline"
                            legendType="line"
                            isAnimationActive={false}
                        />
                    </ScatterChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export default MaterialBalancePlot;