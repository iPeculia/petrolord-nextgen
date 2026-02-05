import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AlertTriangle, ShieldCheck } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const RiskAnalysis = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
             <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="py-3 px-4 border-b border-slate-800">
                    <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-400" /> Risk Matrix
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs text-slate-400">
                            <span>Technical Risk (Geological)</span>
                            <span className="text-red-400">High</span>
                        </div>
                        <Progress value={75} className="h-2 bg-slate-800" indicatorClassName="bg-red-500" />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs text-slate-400">
                            <span>Economic Risk (Price Volatility)</span>
                            <span className="text-amber-400">Medium</span>
                        </div>
                        <Progress value={50} className="h-2 bg-slate-800" indicatorClassName="bg-amber-500" />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs text-slate-400">
                            <span>Operational Risk</span>
                            <span className="text-green-400">Low</span>
                        </div>
                        <Progress value={20} className="h-2 bg-slate-800" indicatorClassName="bg-green-500" />
                    </div>
                </CardContent>
             </Card>

             <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="py-3 px-4 border-b border-slate-800">
                    <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-blue-400" /> Mitigation Strategies
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-2">
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded text-xs text-slate-300">
                        <strong className="block mb-1 text-slate-200">Hedging Strategy</strong>
                        Implement price collars to mitigate downside volatility exposure for 50% of production.
                    </div>
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded text-xs text-slate-300">
                        <strong className="block mb-1 text-slate-200">Intervention Plan</strong>
                        Schedule proactive workover for Well B-02 to address declining artificial lift efficiency.
                    </div>
                </CardContent>
             </Card>
        </div>
    );
};

export default RiskAnalysis;