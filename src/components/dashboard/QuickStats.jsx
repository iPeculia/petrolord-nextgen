import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Thermometer, Droplet } from 'lucide-react';

const StatItem = ({ label, value, unit, trend, icon: Icon, colorClass }) => (
  <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-900/50 border border-slate-800">
    <div className={`p-2 rounded-md ${colorClass} bg-opacity-10`}>
      <Icon className={`w-4 h-4 ${colorClass.replace('bg-', 'text-')}`} />
    </div>
    <div>
      <p className="text-xs text-slate-500 font-medium uppercase">{label}</p>
      <div className="flex items-baseline gap-1">
        <span className="text-lg font-bold text-slate-200">{value}</span>
        <span className="text-xs text-slate-500">{unit}</span>
      </div>
    </div>
    {trend && (
      <div className={`ml-auto text-xs font-medium ${trend > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
        {trend > 0 ? '+' : ''}{trend}%
      </div>
    )}
  </div>
);

const QuickStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatItem 
        label="Avg Reservoir Pressure" 
        value="3,450" 
        unit="psi" 
        trend={-2.1} 
        icon={TrendingDown}
        colorClass="bg-orange-500 text-orange-400"
      />
      <StatItem 
        label="Reservoir Temp" 
        value="185" 
        unit="°F" 
        trend={0.5} 
        icon={Thermometer}
        colorClass="bg-red-500 text-red-400"
      />
      <StatItem 
        label="Daily Production" 
        value="12.5" 
        unit="Mbbl" 
        trend={4.2} 
        icon={TrendingUp}
        colorClass="bg-emerald-500 text-emerald-400"
      />
      <StatItem 
        label="Water Cut" 
        value="28" 
        unit="%" 
        trend={1.1} 
        icon={Droplet}
        colorClass="bg-blue-500 text-blue-400"
      />
    </div>
  );
};

export default QuickStats;