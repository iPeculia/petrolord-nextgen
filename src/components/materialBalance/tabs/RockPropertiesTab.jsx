import React from 'react';
import { useMaterialBalance } from '@/hooks/useMaterialBalance';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

const RockPropertiesTab = () => {
    const { rockData, currentTank } = useMaterialBalance();

    if (!rockData || !rockData.relPerm) {
         return (
             <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-4">
                <div className="bg-slate-900 p-6 rounded-full">
                    <AlertCircle className="w-12 h-12 text-slate-500" />
                </div>
                <h3 className="text-xl font-medium text-white">No Rock Data</h3>
                <p className="text-slate-400">
                    No relative permeability or capillary pressure data found for {currentTank?.name}.
                </p>
             </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-white">Relative Permeability (Water-Oil)</CardTitle>
                </CardHeader>
                <CardContent className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={rockData.relPerm} margin={{top: 20, right: 30, left: 20, bottom: 20}}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="sw" type="number" domain={[0, 1]} label={{ value: 'Sw (Water Saturation)', position: 'bottom', fill: '#94a3b8' }} stroke="#94a3b8" />
                            <YAxis domain={[0, 1]} label={{ value: 'Rel Perm (kr)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} stroke="#94a3b8" />
                            <Tooltip contentStyle={{backgroundColor: '#1e293b'}} />
                            <Legend />
                            <Line type="monotone" dataKey="krw" name="krw" stroke="#3b82f6" strokeWidth={3} dot={false} />
                            <Line type="monotone" dataKey="kro" name="kro" stroke="#22c55e" strokeWidth={3} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-white">Capillary Pressure</CardTitle>
                </CardHeader>
                <CardContent className="h-[400px] flex items-center justify-center text-slate-500">
                    No Capillary Pressure Data Loaded
                </CardContent>
            </Card>
        </div>
    );
};

export default RockPropertiesTab;