import React from 'react';
import { useArtificialLift } from '../context/ArtificialLiftContext';
import { Activity, Droplets, ArrowDown, BarChart2 } from 'lucide-react';

const QuickStatsPanel = () => {
  const { currentWell, getProductionData } = useArtificialLift();
  const productionData = currentWell ? getProductionData(currentWell.well_id) : null;

  if (!currentWell) return null;

  const StatItem = ({ label, value, unit, icon: Icon, color }) => (
    <div className="flex items-center space-x-3 bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
      <div className={`p-2 rounded-md bg-opacity-10 ${color.bg}`}>
        <Icon className={`w-4 h-4 ${color.text}`} />
      </div>
      <div>
        <div className="text-xs text-slate-400 font-medium">{label}</div>
        <div className="flex items-baseline space-x-1">
            <span className="text-sm font-bold text-white">{value}</span>
            <span className="text-xs text-slate-500">{unit}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatItem 
            label="Current Production"
            value={productionData?.current_production_bpd?.toLocaleString() || "0"}
            unit="bpd"
            icon={Droplets}
            color={{ bg: "bg-emerald-500", text: "text-emerald-500" }}
        />
        <StatItem 
            label="Target Production"
            value={productionData?.target_production_bpd?.toLocaleString() || "0"}
            unit="bpd"
            icon={BarChart2}
            color={{ bg: "bg-blue-500", text: "text-blue-500" }}
        />
        <StatItem 
            label="Lift Method"
            value={productionData?.current_lift_method || "None"}
            unit=""
            icon={Activity}
            color={{ bg: "bg-amber-500", text: "text-amber-500" }}
        />
        <StatItem 
            label="Drawdown"
            value={productionData?.current_drawdown?.toLocaleString() || "0"}
            unit="psi"
            icon={ArrowDown}
            color={{ bg: "bg-purple-500", text: "text-purple-500" }}
        />
    </div>
  );
};

export default QuickStatsPanel;