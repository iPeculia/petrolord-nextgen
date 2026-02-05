import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Droplets, Wind, Zap } from 'lucide-react';

const PressureMaintenanceInfo = ({ parameters }) => {
    const status = parameters.pressureMaintenanceStatus || "None";
    const mechanism = parameters.pressureSupportMechanism || "Natural Depletion";
    
    const getIcon = () => {
        if (mechanism.includes("Water")) return <Droplets className="w-4 h-4 text-blue-400" />;
        if (mechanism.includes("Gas")) return <Wind className="w-4 h-4 text-red-400" />;
        return <Zap className="w-4 h-4 text-yellow-400" />;
    };

    return (
        <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="py-3">
                <CardTitle className="text-sm font-medium text-white flex items-center justify-between">
                    <span>Maintenance & Support</span>
                    <Badge variant={status === 'None' ? 'secondary' : 'default'} className={status === 'Active' ? 'bg-green-600' : 'bg-slate-700'}>
                        {status}
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 py-3">
                <div className="flex items-start gap-3">
                    <div className="mt-1 bg-slate-800 p-2 rounded-md">
                        {getIcon()}
                    </div>
                    <div>
                        <div className="text-xs text-slate-500 uppercase font-semibold">Mechanism</div>
                        <div className="text-sm text-white">{mechanism}</div>
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-slate-950 p-2 rounded border border-slate-800">
                        <div className="text-xs text-slate-500">Voidage Rep. Ratio</div>
                        <div className="font-mono text-blue-400 font-bold">0.85</div>
                    </div>
                    <div className="bg-slate-950 p-2 rounded border border-slate-800">
                         <div className="text-xs text-slate-500">Target Pressure</div>
                         <div className="font-mono text-[#BFFF00] font-bold">3,000 psi</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default PressureMaintenanceInfo;