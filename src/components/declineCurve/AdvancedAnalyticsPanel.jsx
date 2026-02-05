import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useDeclineCurve } from '@/context/DeclineCurveContext';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const AdvancedAnalyticsPanel = () => {
    const { currentProject } = useDeclineCurve();

    // Mock Sensitivity Data based on scenarios if available
    const data = currentProject?.scenarios?.map(s => ({
        name: s.name,
        npv: (s.parameters?.oilPrice || 50) * 10000 // Mock calculation
    })) || [];

    return (
        <div className="h-full flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-1/2">
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="py-3 px-4 border-b border-slate-800">
                        <CardTitle className="text-sm font-medium text-slate-300">Scenario NPV Sensitivity</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                                <XAxis type="number" stroke="#94a3b8" tick={{fontSize: 10}} />
                                <YAxis dataKey="name" type="category" width={100} stroke="#94a3b8" tick={{fontSize: 10}} />
                                <Tooltip 
                                    contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9'}}
                                    itemStyle={{color: '#10b981'}}
                                    cursor={{fill: '#1e293b'}}
                                />
                                <Bar dataKey="npv" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} name="Est. NPV ($)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                
                <Card className="bg-slate-900 border-slate-800">
                     <CardHeader className="py-3 px-4 border-b border-slate-800">
                        <CardTitle className="text-sm font-medium text-slate-300">Anomaly Detection</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                        <div className="text-center text-slate-500 text-sm mt-10">
                            Select a well to run anomaly detection algorithms.
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdvancedAnalyticsPanel;