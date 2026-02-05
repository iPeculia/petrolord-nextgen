import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowDownRight, ArrowUpRight, Minus, Activity } from 'lucide-react';

const StatItem = ({ label, value, unit, trend, subtext, color = "text-white" }) => (
    <div className="flex flex-col">
        <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">{label}</span>
        <div className="flex items-baseline gap-1 mt-1">
            <span className={`text-2xl font-bold ${color}`}>{value}</span>
            <span className="text-xs text-slate-500">{unit}</span>
        </div>
        {trend && (
            <div className={`flex items-center text-xs mt-1 ${trend > 0 ? 'text-red-400' : 'text-green-400'}`}>
                {trend > 0 ? <ArrowDownRight className="w-3 h-3 mr-1" /> : <ArrowUpRight className="w-3 h-3 mr-1" />}
                {Math.abs(trend)} psi/mo
            </div>
        )}
        {subtext && <div className="text-xs text-slate-500 mt-1">{subtext}</div>}
    </div>
);

const PressureStatistics = ({ parameters, history }) => {
    // Calculate basic stats from history if available
    const currentP = history.length > 0 ? history[history.length - 1].averagePressure : parameters.currentPressure;
    const initialP = parameters.initialPressure;
    const decline = initialP - currentP;
    
    // Simple calc for decline rate over last few points
    let recentDeclineRate = 0;
    if (history.length >= 3) {
        const last = history[history.length - 1].averagePressure;
        const prev = history[history.length - 4].averagePressure;
        recentDeclineRate = (prev - last) / 3;
    }

    return (
        <Card className="col-span-1 md:col-span-4 bg-slate-900 border-slate-800">
            <CardContent className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4 divide-x divide-slate-800/50">
                <StatItem 
                    label="Current Pressure" 
                    value={Math.round(currentP)} 
                    unit="psia" 
                    trend={parseFloat(recentDeclineRate.toFixed(1))}
                    color="text-[#BFFF00]"
                />
                <div className="pl-4">
                    <StatItem 
                        label="Total Decline" 
                        value={Math.round(decline)} 
                        unit="psi" 
                        subtext={`${((decline/initialP)*100).toFixed(1)}% of Initial`}
                    />
                </div>
                <div className="pl-4">
                    <StatItem 
                        label="Bubble Point" 
                        value={parameters.bubblePointPressure || 'N/A'} 
                        unit="psia" 
                        color="text-blue-400"
                        subtext={currentP < parameters.bubblePointPressure ? "Below Pb (Two Phase)" : "Above Pb (Undersaturated)"}
                    />
                </div>
                <div className="pl-4">
                     <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Status</span>
                     <div className="flex items-center gap-2 mt-2">
                        <Activity className="w-5 h-5 text-green-500" />
                        <span className="text-sm font-medium text-white">Active Monitoring</span>
                     </div>
                     <div className="text-xs text-slate-500 mt-1">Next Survey: 15 Days</div>
                </div>
            </CardContent>
        </Card>
    );
};

export default PressureStatistics;