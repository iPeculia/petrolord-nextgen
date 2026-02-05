import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Droplets, Fuel, Gauge, Minus, Plus } from 'lucide-react';

const SummaryItem = ({ title, value, unit, icon }) => (
    <div className="p-4 bg-slate-800/50 rounded-lg flex flex-col items-center justify-center text-center">
        <div className="flex items-center gap-2">
            {icon}
            <p className="text-sm text-gray-400">{title}</p>
        </div>
        <p className="text-2xl font-bold mt-1">{value}</p>
        <p className="text-xs text-gray-500">{unit}</p>
    </div>
);

const ResultsSummaryCard = ({ results }) => {
    if (!results) return null;

    const ooip = results.ooip ? (results.ooip / 1e6).toFixed(2) : '--';
    const primaryDrive = "Solution Gas"; // Placeholder
    const recoveryFactor = '--'; // Placeholder
    const remainingReserves = '--'; // Placeholder

    return (
        <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
                <CardTitle>Key Results Summary</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <SummaryItem title="OOIP" value={ooip} unit="MMstb" icon={<Fuel className="w-4 h-4" />} />
                <SummaryItem title="Recovery Factor" value={recoveryFactor} unit="%" icon={<Gauge className="w-4 h-4" />} />
                <SummaryItem title="Primary Drive" value={primaryDrive} unit="" icon={<Droplets className="w-4 h-4" />} />
                <SummaryItem title="Remaining Reserves" value={remainingReserves} unit="MMstb" icon={<Plus className="w-4 h-4" />} />
            </CardContent>
        </Card>
    );
};

export default ResultsSummaryCard;