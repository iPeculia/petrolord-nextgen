import React from 'react';
import { useHydraulicsSimulator } from '@/contexts/HydraulicsSimulatorContext';
import { Activity, Droplets, Gauge, ArrowDownToLine, Zap } from 'lucide-react';

const StatItem = ({ icon: Icon, label, value, unit, color }) => (
    <div className="flex items-center justify-between p-2 bg-slate-800/50 rounded border border-slate-700 hover:bg-slate-800 transition-colors">
        <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-full bg-${color}-500/10`}>
                <Icon className={`h-4 w-4 text-${color}-500`} />
            </div>
            <span className="text-xs text-slate-400 font-medium">{label}</span>
        </div>
        <div className="text-right">
            <span className="text-sm font-bold text-slate-200">{value}</span>
            {unit && <span className="text-xs text-slate-500 ml-1">{unit}</span>}
        </div>
    </div>
);

const QuickStatsPanel = () => {
    const { current_scenario } = useHydraulicsSimulator();

    if (!current_scenario) return <div className="p-4 text-center text-slate-500 text-xs">No scenario active</div>;

    return (
        <div className="space-y-2 p-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-1">Quick Indicators</h3>
            
            <StatItem icon={Droplets} label="Flow Rate" value={current_scenario.flow_rate_gpm} unit="gpm" color="blue" />
            <StatItem icon={Gauge} label="SPP" value="3,150" unit="psi" color="green" />
            <StatItem icon={Activity} label="ECD @ TD" value="14.6" unit="ppg" color="yellow" />
            <StatItem icon={ArrowDownToLine} label="ROP" value={current_scenario.rate_of_penetration_ft_per_hr} unit="ft/hr" color="purple" />
            <StatItem icon={Zap} label="Pump Power" value="980" unit="hp" color="red" />
        </div>
    );
};

export default QuickStatsPanel;