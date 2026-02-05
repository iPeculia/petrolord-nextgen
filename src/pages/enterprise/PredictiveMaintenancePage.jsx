import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, PenTool, Calendar } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const PredictiveMaintenancePage = () => {
  const healthData = [
    { name: 'Pump A', health: 95 },
    { name: 'Pump B', health: 82 },
    { name: 'Comp C', health: 45 },
    { name: 'Gen D', health: 98 },
    { name: 'Sep E', health: 75 },
  ];

  return (
    <div className="p-8 space-y-8 bg-[#0F172A] min-h-screen text-white animate-in fade-in">
      <h1 className="text-3xl font-bold flex items-center gap-3">
        <Activity className="w-8 h-8 text-[#BFFF00]" />
        Predictive Maintenance
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card className="bg-slate-900 border-slate-800 col-span-2">
            <CardHeader><CardTitle className="text-white">Equipment Health Status</CardTitle></CardHeader>
            <CardContent className="h-[300px]">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={healthData}>
                     <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                     <XAxis dataKey="name" stroke="#94a3b8" />
                     <YAxis stroke="#94a3b8" />
                     <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
                     <Bar dataKey="health" fill="#BFFF00" radius={[4, 4, 0, 0]} />
                  </BarChart>
               </ResponsiveContainer>
            </CardContent>
         </Card>

         <Card className="bg-slate-900 border-slate-800">
            <CardHeader><CardTitle className="text-white">Upcoming Maintenance</CardTitle></CardHeader>
            <CardContent className="space-y-4">
               <div className="p-3 bg-red-500/10 border border-red-500/20 rounded">
                  <div className="flex justify-between mb-1">
                     <span className="text-red-400 font-medium">Compressor C</span>
                     <span className="text-red-400 text-xs">Critical</span>
                  </div>
                  <p className="text-xs text-slate-400">Predicted failure in 3 days. Schedule overhaul immediately.</p>
               </div>
               <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded">
                  <div className="flex justify-between mb-1">
                     <span className="text-yellow-400 font-medium">Separator E</span>
                     <span className="text-yellow-400 text-xs">Warning</span>
                  </div>
                  <p className="text-xs text-slate-400">Efficiency drop detected. Clean filters within 7 days.</p>
               </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
};

export default PredictiveMaintenancePage;