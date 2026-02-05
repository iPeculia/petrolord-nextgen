import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const QCMetricWidget = ({ title, value, unit, status, trend, icon: Icon }) => {
  
  const statusColor = {
      good: 'text-emerald-400',
      warning: 'text-amber-400',
      critical: 'text-red-400',
      neutral: 'text-slate-400'
  };

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardContent className="p-4 flex items-center justify-between">
        <div>
           <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">{title}</p>
           <div className="flex items-baseline gap-1">
               <span className="text-2xl font-bold text-white">{value}</span>
               {unit && <span className="text-xs text-slate-500">{unit}</span>}
           </div>
           {trend && <p className="text-xs text-slate-500 mt-1">{trend}</p>}
        </div>
        <div className={cn("p-3 rounded-full bg-slate-800/50", statusColor[status || 'neutral'])}>
            {Icon && <Icon className="w-5 h-5" />}
        </div>
      </CardContent>
    </Card>
  );
};

export default QCMetricWidget;