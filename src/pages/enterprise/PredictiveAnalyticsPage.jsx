import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts';
import { TrendingUp, AlertTriangle, Calendar } from 'lucide-react';

const data = [
  { month: 'Jan', production: 4000, forecast: 4100 },
  { month: 'Feb', production: 3000, forecast: 3200 },
  { month: 'Mar', production: 2000, forecast: 2400 },
  { month: 'Apr', production: 2780, forecast: 2800 },
  { month: 'May', production: 1890, forecast: 2100 },
  { month: 'Jun', production: 2390, forecast: 2400 },
  { month: 'Jul', production: 3490, forecast: 3500 },
  { month: 'Aug', production: 3800, forecast: 3700, isForecast: true },
  { month: 'Sep', production: 3900, forecast: 3900, isForecast: true },
];

const PredictiveAnalyticsPage = () => {
  return (
    <div className="p-8 space-y-6 bg-[#0F172A] min-h-screen text-white">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Predictive Analytics</h1>
          <p className="text-slate-400 mt-1">Forecast production, detect anomalies, and optimize operations.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-slate-900 border-slate-800 col-span-2">
          <CardHeader>
             <CardTitle className="text-white flex items-center gap-2">
               <TrendingUp className="w-5 h-5 text-green-500" /> Production Forecast
             </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorFore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
                <Area type="monotone" dataKey="production" stroke="#8884d8" fillOpacity={1} fill="url(#colorProd)" />
                <Area type="monotone" dataKey="forecast" stroke="#82ca9d" strokeDasharray="5 5" fillOpacity={1} fill="url(#colorFore)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="space-y-6">
            <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-500" /> Anomaly Detection
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded flex items-start gap-3">
                            <AlertTriangle className="w-4 h-4 text-red-500 mt-1" />
                            <div>
                                <h4 className="text-sm font-semibold text-red-400">Pressure Spike Detected</h4>
                                <p className="text-xs text-slate-400">Well A-12 bottom hole pressure exceeded threshold by 15%.</p>
                                <span className="text-[10px] text-slate-500 mt-1 block">2 hours ago</span>
                            </div>
                        </div>
                        <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded flex items-start gap-3">
                            <AlertTriangle className="w-4 h-4 text-yellow-500 mt-1" />
                            <div>
                                <h4 className="text-sm font-semibold text-yellow-400">Flow Rate Deviation</h4>
                                <p className="text-xs text-slate-400">Production declined faster than decline curve model.</p>
                                <span className="text-[10px] text-slate-500 mt-1 block">5 hours ago</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default PredictiveAnalyticsPage;