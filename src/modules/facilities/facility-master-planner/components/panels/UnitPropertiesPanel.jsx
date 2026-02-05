import React from 'react';
import { Database, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PropertyRow = ({ label, value, highlight }) => (
  <div className="flex justify-between py-2 border-b border-slate-800 last:border-0">
    <span className="text-sm text-slate-500">{label}</span>
    <span className={`text-sm font-medium text-right ${highlight ? 'text-yellow-500' : 'text-slate-200'}`}>{value}</span>
  </div>
);

const UnitPropertiesPanel = ({ unit }) => {
  if (!unit) return null;

  const utilization = (unit.current_capacity_bpd / unit.design_capacity_bpd) * 100;

  return (
    <Card className="bg-[#1a1a1a] border-slate-800 text-slate-200 shadow-none">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-[#0066cc]/10 flex items-center justify-center">
            <Database className="w-5 h-5 text-[#0066cc]" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold truncate max-w-[200px]">{unit.name}</CardTitle>
            <div className="text-xs text-slate-400 mt-1">{unit.unit_type}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        
        <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
            <div className="text-xs text-slate-500 mb-1">Utilization</div>
            <div className="flex items-end justify-between">
                <span className="text-2xl font-bold text-white">{utilization.toFixed(1)}%</span>
                <span className="text-xs text-[#0066cc] mb-1 font-medium">{unit.status}</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div 
                    className="h-full bg-[#0066cc] rounded-full" 
                    style={{ width: `${Math.min(utilization, 100)}%` }} 
                />
            </div>
        </div>

        <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Capacities (bpd)</h4>
            <PropertyRow label="Design" value={unit.design_capacity_bpd.toLocaleString()} />
            <PropertyRow label="Current" value={unit.current_capacity_bpd.toLocaleString()} />
            <PropertyRow label="Bottleneck" value={unit.bottleneck_capacity_bpd.toLocaleString()} highlight />
        </div>
        
        <div className="pt-2">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Function</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
                {unit.function}
            </p>
        </div>

      </CardContent>
    </Card>
  );
};

export default UnitPropertiesPanel;