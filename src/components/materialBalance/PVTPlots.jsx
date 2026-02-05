import React from 'react';
import { useMaterialBalance } from '@/hooks/useMaterialBalance';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const PVTPlots = () => {
    const { state } = useMaterialBalance();
    const { pvtTables } = state;
    const hasData = Object.values(pvtTables).some(arr => arr.length > 0);

    if (!hasData) {
        return (
            <div className="flex items-center justify-center h-64 border-2 border-dashed border-slate-700 rounded-lg text-slate-500">
                No PVT data loaded.
            </div>
        );
    }

    const PlotContainer = ({ title, data, dataKey, color, yLabel }) => (
        <Card className="bg-slate-800 border-slate-700 h-[300px] flex flex-col">
            <CardHeader className="py-2">
                <CardTitle className="text-xs font-medium text-slate-300">{title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-2">
                 {data && data.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="pressure" type="number" domain={['auto', 'auto']} stroke="#94a3b8" fontSize={10} label={{ value: 'Pressure (psi)', position: 'bottom', offset: -5, fill: '#94a3b8', fontSize: 10 }} />
                            <YAxis stroke="#94a3b8" fontSize={10} domain={['auto', 'auto']} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9', fontSize: '12px' }}
                            />
                            <Line type="monotone" dataKey="value" name={dataKey} stroke={color} strokeWidth={2} dot={{ r: 2 }} />
                        </LineChart>
                    </ResponsiveContainer>
                 ) : (
                     <div className="flex items-center justify-center h-full text-slate-600 text-xs">No Data</div>
                 )}
            </CardContent>
        </Card>
    );

    return (
        <div className="space-y-4">
            <Tabs defaultValue="volumetric" className="w-full">
                <TabsList className="bg-slate-900 w-full justify-start">
                    <TabsTrigger value="volumetric">Volumetric Properties</TabsTrigger>
                    <TabsTrigger value="viscosity">Viscosity</TabsTrigger>
                    <TabsTrigger value="ratios">Solution Ratios</TabsTrigger>
                </TabsList>
                
                <TabsContent value="volumetric" className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <PlotContainer title="Oil FVF (Bo)" data={pvtTables.Bo} dataKey="Bo" color="#22c55e" yLabel="rb/stb" />
                    <PlotContainer title="Gas FVF (Bg)" data={pvtTables.Bg} dataKey="Bg" color="#ef4444" yLabel="rb/mscf" />
                </TabsContent>
                
                <TabsContent value="viscosity" className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <PlotContainer title="Oil Viscosity (µo)" data={pvtTables.muO} dataKey="muO" color="#3b82f6" yLabel="cp" />
                    <PlotContainer title="Gas Viscosity (µg)" data={pvtTables.muG} dataKey="muG" color="#eab308" yLabel="cp" />
                </TabsContent>

                <TabsContent value="ratios" className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <PlotContainer title="Solution GOR (Rs)" data={pvtTables.Rs} dataKey="Rs" color="#8b5cf6" yLabel="scf/stb" />
                    <PlotContainer title="Vaporized OGR (Rv)" data={pvtTables.Rv} dataKey="Rv" color="#ec4899" yLabel="stb/mmscf" />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default PVTPlots;