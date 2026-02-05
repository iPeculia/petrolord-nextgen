import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTorqueDrag } from '@/contexts/TorqueDragContext';

const WellPropertiesPanel = () => {
  const { current_well } = useTorqueDrag();

  if (!current_well) return (
    <div className="text-slate-500 text-sm text-center py-4">No well selected</div>
  );

  return (
    <Card className="bg-slate-900 border-slate-700 text-slate-200 mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-slate-400">Well Properties</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="grid grid-cols-2 gap-2">
            <span className="text-slate-500">Name:</span>
            <span className="text-right font-medium">{current_well.name}</span>
            
            <span className="text-slate-500">API:</span>
            <span className="text-right font-medium">{current_well.api_number}</span>
            
            <span className="text-slate-500">Rig:</span>
            <span className="text-right font-medium">{current_well.rig_name}</span>
            
            <span className="text-slate-500">Water Depth:</span>
            <span className="text-right font-medium">{current_well.water_depth_ft} ft</span>
            
            <span className="text-slate-500">Total Depth:</span>
            <span className="text-right font-medium">{current_well.total_depth_ft} ft</span>
            
            <span className="text-slate-500">Status:</span>
            <span className="text-right font-medium text-blue-400">{current_well.status}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default WellPropertiesPanel;