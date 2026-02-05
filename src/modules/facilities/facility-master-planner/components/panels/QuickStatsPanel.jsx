import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useFacilityMasterPlanner } from '../../context/FacilityMasterPlannerContext';

const StatItem = ({ label, value, subtext }) => (
    <div className="mb-4 last:mb-0">
        <div className="text-xs text-slate-500 mb-1">{label}</div>
        <div className="text-xl font-bold text-white tracking-tight">{value}</div>
        {subtext && <div className="text-[10px] text-slate-400">{subtext}</div>}
    </div>
);

const QuickStatsPanel = () => {
    const { currentFacility, processUnits } = useFacilityMasterPlanner();

    if (!currentFacility) return null;

    const utilization = (currentFacility.current_capacity_oil_bpd / currentFacility.design_capacity_oil_bpd) * 100;
    const bottleneck = processUnits.find(u => 
        u.facility_id === currentFacility.facility_id && 
        (u.current_capacity_bpd / u.design_capacity_bpd) > 0.95
    );

    return (
        <Card className="bg-slate-900 border-slate-800 text-slate-200 shadow-none mt-4">
            <CardContent className="pt-6">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">Quick Stats</h4>
                
                <StatItem 
                    label="Total Oil Capacity" 
                    value={`${(currentFacility.design_capacity_oil_bpd / 1000).toFixed(0)}k bpd`} 
                    subtext="Design Limit"
                />
                 <StatItem 
                    label="Current Utilization" 
                    value={`${utilization.toFixed(1)}%`}
                    subtext={utilization > 90 ? "High Load" : "Normal Load"}
                />
                 <StatItem 
                    label="Critical Bottleneck" 
                    value={bottleneck ? bottleneck.name : "None Detected"} 
                    subtext={bottleneck ? "Immediate Action Required" : "System Healthy"}
                />
            </CardContent>
        </Card>
    );
};

export default QuickStatsPanel;