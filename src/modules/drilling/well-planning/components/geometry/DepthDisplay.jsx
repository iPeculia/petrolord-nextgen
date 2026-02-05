import React from 'react';
import { useWellPlanningDesign } from '@/contexts/WellPlanningDesignContext';
import { ArrowDown, ArrowRight, Activity, Ruler } from 'lucide-react';

const DepthCard = ({ label, value, unit, icon: Icon, colorClass }) => (
  <div className="bg-[#252541] border border-[#2f2f50] rounded p-3 flex items-center justify-between">
    <div>
      <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">{label}</div>
      <div className={`text-lg font-mono font-medium ${colorClass}`}>
        {value} <span className="text-xs text-slate-500">{unit}</span>
      </div>
    </div>
    {Icon && <Icon className={`h-5 w-5 opacity-20 ${colorClass}`} />}
  </div>
);

const DepthDisplay = () => {
  const { geometryState } = useWellPlanningDesign();
  const { stats } = geometryState;

  // Defaults to 0 if stats aren't calculated yet
  const md = stats?.totalMD?.toFixed(0) || '0';
  const tvd = stats?.totalTVD?.toFixed(0) || '0';
  const disp = stats?.displacement?.toFixed(0) || '0';
  const maxInc = stats?.maxInc?.toFixed(1) || '0.0';

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
      <DepthCard 
        label="Measured Depth" 
        value={md} 
        unit="ft" 
        icon={Ruler} 
        colorClass="text-[#FFC107]" 
      />
      <DepthCard 
        label="True Vertical Depth" 
        value={tvd} 
        unit="ft" 
        icon={ArrowDown} 
        colorClass="text-[#4CAF50]" 
      />
      <DepthCard 
        label="Displacement" 
        value={disp} 
        unit="ft" 
        icon={ArrowRight} 
        colorClass="text-blue-400" 
      />
      <DepthCard 
        label="Max Inclination" 
        value={maxInc} 
        unit="deg" 
        icon={Activity} 
        colorClass="text-purple-400" 
      />
    </div>
  );
};

export default DepthDisplay;