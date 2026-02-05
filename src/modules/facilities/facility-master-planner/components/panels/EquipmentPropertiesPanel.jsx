import React from 'react';
import { Cog, Wrench } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PropertyRow = ({ label, value }) => (
  <div className="flex justify-between py-2 border-b border-slate-800 last:border-0">
    <span className="text-sm text-slate-500">{label}</span>
    <span className="text-sm text-slate-200 font-medium text-right">{value}</span>
  </div>
);

const EquipmentPropertiesPanel = ({ equipment }) => {
  if (!equipment) return null;

  return (
    <Card className="bg-[#1a1a1a] border-slate-800 text-slate-200 shadow-none">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-[#ff6600]/10 flex items-center justify-center">
            <Cog className="w-5 h-5 text-[#ff6600]" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold">{equipment.tag_number}</CardTitle>
            <div className="text-xs text-slate-400 mt-1">{equipment.equipment_type}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">

        <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Specifications</h4>
            <PropertyRow label="Manufacturer" value={equipment.manufacturer} />
            <PropertyRow label="Model" value={equipment.model} />
            <PropertyRow label="Condition" value={equipment.condition} />
        </div>
        
        <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Performance</h4>
            <PropertyRow label={`Design (${equipment.design_capacity_unit})`} value={equipment.design_capacity} />
            <PropertyRow label="Current" value={equipment.current_capacity} />
            <PropertyRow label="Status" value={equipment.status} />
        </div>

        <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 flex items-start gap-3">
             <Wrench className="w-4 h-4 text-slate-500 mt-1" />
             <div>
                <div className="text-xs text-slate-500">Last Maintenance</div>
                <div className="text-sm font-medium text-white">
                    {equipment.last_maintenance_date ? new Date(equipment.last_maintenance_date).toLocaleDateString() : 'N/A'}
                </div>
                <div className="text-xs text-slate-600 mt-1">
                    Interval: {equipment.maintenance_interval_months} months
                </div>
             </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default EquipmentPropertiesPanel;