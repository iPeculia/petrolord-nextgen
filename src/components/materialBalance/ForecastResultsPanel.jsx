import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const ForecastResultsPanel = ({ results }) => {
    const { forecast, reserves, abandonmentYear } = results;

    return (
        <div className="space-y-4 h-full flex flex-col">
            <div className="grid grid-cols-3 gap-4">
                 <Card className="bg-slate-900 border-slate-800 p-4">
                     <div className="text-slate-400 text-xs uppercase">Remaining Reserves</div>
                     <div className="text-2xl font-bold text-lime-400">{(reserves/1e6).toFixed(2)} MMstb</div>
                 </Card>
                 <Card className="bg-slate-900 border-slate-800 p-4">
                     <div className="text-slate-400 text-xs uppercase">Abandonment Year</div>
                     <div className="text-2xl font-bold text-blue-400">{abandonmentYear}</div>
                 </Card>
                 <Card className="bg-slate-900 border-slate-800 p-4">
                     <div className="text-slate-400 text-xs uppercase">Final Pressure</div>
                     <div className="text-2xl font-bold text-slate-200">{forecast[forecast.length-1]?.pressure.toFixed(0)} psi</div>
                 </Card>
            </div>

            <Card className="flex-1 bg-slate-900/50 border-slate-800 p-4">
                 <h4 className="text-sm font-medium text-slate-400 mb-4">Production Profile</h4>
                 <ResponsiveContainer width="100%" height="90%">
                     <LineChart data={forecast}>
                         <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                         <XAxis dataKey="time" label={{ value: 'Months', position: 'bottom', fill: '#94a3b8' }} stroke="#94a3b8" />
                         <YAxis yAxisId="left" stroke="#3b82f6" label={{ value: 'Pressure (psi)', angle: -90, position: 'insideLeft', fill: '#3b82f6' }} />
                         <YAxis yAxisId="right" orientation="right" stroke="#22c55e" label={{ value: 'Cum Prod (stb)', angle: 90, position: 'insideRight', fill: '#22c55e' }} />
                         <Tooltip contentStyle={{ backgroundColor: '#1e293b' }} />
                         <Legend />
                         <Line yAxisId="left" type="monotone" dataKey="pressure" stroke="#3b82f6" name="Pressure" dot={false} strokeWidth={2} />
                         <Line yAxisId="right" type="monotone" dataKey="Np_cum" stroke="#22c55e" name="Cum Oil" dot={false} strokeWidth={2} />
                     </LineChart>
                 </ResponsiveContainer>
            </Card>
        </div>
    );
};

export default ForecastResultsPanel;