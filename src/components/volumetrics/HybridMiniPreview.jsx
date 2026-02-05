import React from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, DollarSign, Clock, Activity } from 'lucide-react';

const KpiCard = ({ label, value, unit, icon: Icon, color }) => (
    <div className="flex flex-col gap-1 bg-slate-900/50 p-3 rounded border border-slate-800">
        <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-500 uppercase">{label}</span>
            <Icon className={`w-3 h-3 ${color}`} />
        </div>
        <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-slate-200">{value}</span>
            <span className="text-[10px] text-slate-600">{unit}</span>
        </div>
    </div>
);

const HybridMiniPreview = ({ metrics }) => {
    if (!metrics) return null;

    return (
        <Card className="bg-slate-950 border-t border-slate-800 p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <KpiCard 
                label="Net Present Value" 
                value={metrics.npv ? (metrics.npv/1000000).toFixed(1) : '-'} 
                unit="$MM" 
                icon={DollarSign}
                color="text-green-400"
            />
            <KpiCard 
                label="Internal Rate of Return" 
                value={metrics.irr ? (metrics.irr * 100).toFixed(1) : '-'} 
                unit="%" 
                icon={TrendingUp}
                color="text-blue-400"
            />
            <KpiCard 
                label="Payback Period" 
                value={metrics.payback ? metrics.payback.toFixed(1) : '-'} 
                unit="Years" 
                icon={Clock}
                color="text-purple-400"
            />
            <KpiCard 
                label="Profitability Index" 
                value={metrics.totalCapex > 0 ? (metrics.npv / metrics.totalCapex).toFixed(2) : '-'} 
                unit="x" 
                icon={Activity}
                color="text-orange-400"
            />
        </Card>
    );
};

export default HybridMiniPreview;