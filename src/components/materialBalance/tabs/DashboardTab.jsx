import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMaterialBalance } from '@/hooks/useMaterialBalance';
import { Activity, Droplets, Database, AlertCircle, BarChart3, Layers } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

const DashboardTab = () => {
    const { tanks, groups, productionHistory, activeTab } = useMaterialBalance();

    const stats = {
        totalTanks: tanks.length,
        activeTanks: tanks.filter(t => t.status === 'Active').length,
        totalProd: 1250000, // Mock aggregate
        avgPressure: 2850
    };

    const tankDistribution = tanks.reduce((acc, tank) => {
        acc[tank.type] = (acc[tank.type] || 0) + 1;
        return acc;
    }, {});
    
    const chartData = Object.entries(tankDistribution).map(([name, value]) => ({ name, value }));
    const COLORS = ['#3b82f6', '#22c55e', '#eab308'];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-400 font-medium">Total Reservoirs</p>
                            <h3 className="text-2xl font-bold text-white mt-1">{stats.totalTanks}</h3>
                        </div>
                        <div className="p-3 bg-blue-500/10 rounded-full">
                            <Layers className="w-6 h-6 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-400 font-medium">Active Status</p>
                            <h3 className="text-2xl font-bold text-emerald-400 mt-1">{stats.activeTanks}</h3>
                        </div>
                        <div className="p-3 bg-emerald-500/10 rounded-full">
                            <Activity className="w-6 h-6 text-emerald-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-400 font-medium">Total Groups</p>
                            <h3 className="text-2xl font-bold text-white mt-1">{groups.length}</h3>
                        </div>
                        <div className="p-3 bg-purple-500/10 rounded-full">
                            <Database className="w-6 h-6 text-purple-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-400 font-medium">Data Health</p>
                            <h3 className="text-2xl font-bold text-[#BFFF00] mt-1">98%</h3>
                        </div>
                        <div className="p-3 bg-[#BFFF00]/10 rounded-full">
                            <BarChart3 className="w-6 h-6 text-[#BFFF00]" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-white text-base">Reservoir Types</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                                <YAxis stroke="#64748b" fontSize={12} />
                                <Tooltip contentStyle={{backgroundColor: '#1e293b', borderColor: '#334155'}} cursor={{fill: 'transparent'}} />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-white text-base">Recent Activities</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1,2,3].map((i) => (
                                <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-800/50 transition-colors">
                                    <div className="w-2 h-2 mt-2 rounded-full bg-blue-500" />
                                    <div>
                                        <p className="text-sm text-slate-300">Updated production history for Tank MB-00{i}</p>
                                        <p className="text-xs text-slate-500">2 hours ago</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DashboardTab;