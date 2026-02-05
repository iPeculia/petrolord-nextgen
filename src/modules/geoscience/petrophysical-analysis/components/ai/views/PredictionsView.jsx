import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const PredictionsView = () => {
    // Mock data for visualization
    const data = Array.from({ length: 50 }, (_, i) => ({
        depth: 2000 + (i * 2),
        actual: Math.random() * 0.3,
        predicted: Math.random() * 0.3
    }));

    return (
        <div className="flex flex-col h-full space-y-4">
            <div className="flex justify-between items-center p-4 bg-slate-900 border border-slate-800 rounded-lg">
                <div className="flex gap-4 items-center">
                    <Select defaultValue="porosity">
                        <SelectTrigger className="w-[180px] bg-slate-950 border-slate-700">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="porosity">Porosity (PHI)</SelectItem>
                            <SelectItem value="perm">Permeability (K)</SelectItem>
                            <SelectItem value="sw">Water Saturation (Sw)</SelectItem>
                        </SelectContent>
                    </Select>
                    <span className="text-sm text-slate-400">vs. Measured Log</span>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-500 text-white">Run Prediction</Button>
            </div>

            <Card className="bg-slate-900 border-slate-800 flex-1">
                <CardContent className="h-full p-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                            <XAxis type="number" domain={[0, 0.4]} stroke="#64748b" />
                            <YAxis dataKey="depth" type="number" stroke="#64748b" reversed />
                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                            <Legend />
                            <Line type="monotone" dataKey="actual" stroke="#94a3b8" name="Actual (Measured)" dot={false} strokeWidth={2} />
                            <Line type="monotone" dataKey="predicted" stroke="#10b981" name="AI Prediction" dot={false} strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
};

export default PredictionsView;