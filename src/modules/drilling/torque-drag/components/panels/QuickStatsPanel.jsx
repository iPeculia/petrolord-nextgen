import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from 'lucide-react';

const QuickStatsPanel = () => {
  return (
    <Card className="bg-slate-900 border-slate-700 text-slate-200 mb-4">
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium text-slate-400">Key Metrics</CardTitle>
        <Activity className="h-4 w-4 text-green-500" />
      </CardHeader>
      <CardContent className="space-y-4">
         <div>
            <div className="text-xs text-slate-500 mb-1">Max Inclination</div>
            <div className="text-2xl font-bold">89.5°</div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1">
                <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '90%' }}></div>
            </div>
         </div>
         
         <div>
            <div className="text-xs text-slate-500 mb-1">Max DLS</div>
            <div className="text-2xl font-bold">3.2 <span className="text-xs font-normal text-slate-500">deg/100ft</span></div>
             <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1">
                <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: '45%' }}></div>
            </div>
         </div>

         <div>
            <div className="text-xs text-slate-500 mb-1">String Weight</div>
            <div className="text-2xl font-bold">185 <span className="text-xs font-normal text-slate-500">klb</span></div>
         </div>
      </CardContent>
    </Card>
  );
};

export default QuickStatsPanel;