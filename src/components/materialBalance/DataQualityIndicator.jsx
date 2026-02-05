import React from 'react';
import { useMaterialBalance } from '@/hooks/useMaterialBalance';
import { CheckCircle2, AlertTriangle, XCircle, Activity } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const DataQualityIndicator = () => {
    const { state } = useMaterialBalance();
    const { productionHistory, pressureData, pvtTables } = state;

    const checks = [
        {
            label: "Production History",
            status: productionHistory.length > 0 ? (productionHistory.length > 10 ? 'good' : 'warn') : 'bad',
            detail: `${productionHistory.length} records`
        },
        {
            label: "Pressure Data",
            status: pressureData.length > 0 ? (pressureData.length > 5 ? 'good' : 'warn') : 'bad',
            detail: `${pressureData.length} points`
        },
        {
            label: "PVT (Bo)",
            status: pvtTables.Bo?.length > 0 ? 'good' : 'bad',
            detail: pvtTables.Bo?.length > 0 ? "Loaded" : "Missing"
        }
    ];

    const getIcon = (status) => {
        if (status === 'good') return <CheckCircle2 className="h-5 w-5 text-[#BFFF00]" />;
        if (status === 'warn') return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
        return <XCircle className="h-5 w-5 text-red-500" />;
    };

    return (
        <Card className="bg-slate-800 border-slate-700 mb-4">
            <CardContent className="p-4">
                <h3 className="text-sm font-medium text-slate-300 mb-3 flex items-center">
                    <Activity className="h-4 w-4 mr-2" /> Data Health
                </h3>
                <div className="space-y-3">
                    {checks.map((check, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                            <div className="flex items-center">
                                {getIcon(check.status)}
                                <span className="ml-2 text-sm text-slate-200">{check.label}</span>
                            </div>
                            <span className="text-xs text-slate-400 bg-slate-900 px-2 py-1 rounded-full">
                                {check.detail}
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default DataQualityIndicator;