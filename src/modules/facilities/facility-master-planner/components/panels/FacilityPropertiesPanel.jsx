import React from 'react';
import { Building2, MapPin, Calendar, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PropertyRow = ({ label, value }) => (
  <div className="flex justify-between py-2 border-b border-slate-800 last:border-0">
    <span className="text-sm text-slate-500">{label}</span>
    <span className="text-sm text-slate-200 font-medium text-right">{value}</span>
  </div>
);

const FacilityPropertiesPanel = ({ facility }) => {
  if (!facility) return null;

  return (
    <Card className="bg-[#1a1a1a] border-slate-800 text-slate-200 shadow-none">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-[#00cc66]/10 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-[#00cc66]" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold">{facility.name}</CardTitle>
            <div className="text-xs text-[#00cc66] flex items-center gap-1 mt-1">
                <Activity className="w-3 h-3" />
                {facility.status}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        
        <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">General</h4>
            <PropertyRow label="Type" value={facility.facility_type} />
            <PropertyRow label="Location" value={facility.location} />
            <PropertyRow label="Installed" value={new Date(facility.installation_date).toLocaleDateString()} />
        </div>

        <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Design Capacities</h4>
            <PropertyRow label="Oil (bpd)" value={facility.design_capacity_oil_bpd.toLocaleString()} />
            <PropertyRow label="Gas (mmscfd)" value={facility.design_capacity_gas_mmscfd.toLocaleString()} />
            <PropertyRow label="Water (bpd)" value={facility.design_capacity_water_bpd.toLocaleString()} />
        </div>
        
        <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Current Throughput</h4>
            <PropertyRow label="Oil (bpd)" value={facility.current_capacity_oil_bpd.toLocaleString()} />
            <PropertyRow label="Gas (mmscfd)" value={facility.current_capacity_gas_mmscfd.toLocaleString()} />
            <PropertyRow label="Water (bpd)" value={facility.current_capacity_water_bpd.toLocaleString()} />
        </div>

      </CardContent>
    </Card>
  );
};

export default FacilityPropertiesPanel;