import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, AlertCircle, Server, Database, Globe } from 'lucide-react';
import { useRealtimeData } from '@/hooks/useRealtimeData';

const StatusIndicator = ({ status, label }) => (
  <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700">
    <div className="flex items-center gap-3">
      {status === 'operational' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
      {status === 'degraded' && <AlertCircle className="w-5 h-5 text-yellow-500" />}
      {status === 'down' && <XCircle className="w-5 h-5 text-red-500" />}
      <span className="font-medium text-slate-200">{label}</span>
    </div>
    <Badge variant="outline" className={
      status === 'operational' ? 'text-green-400 border-green-900 bg-green-900/20' :
      status === 'degraded' ? 'text-yellow-400 border-yellow-900 bg-yellow-900/20' :
      'text-red-400 border-red-900 bg-red-900/20'
    }>
      {status.toUpperCase()}
    </Badge>
  </div>
);

const SystemStatusPage = () => {
  // Use simulated real-time hook
  const { status: connectionStatus } = useRealtimeData('wss://api.petrolord.com/status');

  return (
    <div className="p-8 space-y-8 bg-[#0F172A] min-h-screen text-white">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">System Status</h1>
          <p className="text-slate-400 mt-1">Real-time monitoring of Petrolord Enterprise services.</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
           <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
           <span className="text-green-400">Systems Normal</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-400">API Latency</CardTitle></CardHeader>
            <CardContent>
               <div className="text-2xl font-bold text-white">42 ms</div>
               <div className="text-xs text-green-400 mt-1">-5ms vs avg</div>
            </CardContent>
         </Card>
         <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-400">Error Rate</CardTitle></CardHeader>
            <CardContent>
               <div className="text-2xl font-bold text-white">0.01%</div>
               <div className="text-xs text-slate-500 mt-1">Last 24 hours</div>
            </CardContent>
         </Card>
         <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-400">Active Sessions</CardTitle></CardHeader>
            <CardContent>
               <div className="text-2xl font-bold text-white">1,240</div>
               <div className="text-xs text-blue-400 mt-1">Real-time</div>
            </CardContent>
         </Card>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader><CardTitle className="text-white">Component Status</CardTitle></CardHeader>
        <CardContent className="space-y-4">
           <StatusIndicator status="operational" label="Core API" />
           <StatusIndicator status="operational" label="Database Clusters" />
           <StatusIndicator status="operational" label="ML Inference Engine" />
           <StatusIndicator status="degraded" label="Legacy Integration Service" />
           <StatusIndicator status="operational" label="CDN & Static Assets" />
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemStatusPage;