import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useDeclineCurve } from '@/context/DeclineCurveContext';
import { Progress } from '@/components/ui/progress';

const ForecastPanel = () => {
    const { currentWell, activeStream } = useDeclineCurve();

    let eur = 0;
    let remaining = 0;
    let recoveryFactor = 0;

    if (currentWell && currentWell.model) {
        const streamKey = activeStream === 'Gas' ? 'gas' : 'oil';
        const model = currentWell.model[streamKey];
        if (model) {
            eur = model.eur || 0;
            // Calculate cum from data
            const lastData = currentWell.data?.[currentWell.data.length - 1];
            const cumKey = activeStream === 'Gas' ? 'cumGas' : 'cumOil';
            const cum = lastData ? lastData[cumKey] : 0;
            
            remaining = Math.max(0, eur - cum);
            recoveryFactor = eur > 0 ? (cum / eur) * 100 : 0;
        }
    }

    return (
        <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="py-3 px-4 border-b border-slate-800">
                <CardTitle className="text-sm font-medium text-slate-300">Forecast Results ({activeStream})</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
                <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Recovery Progress</span>
                        <span className="text-slate-200">{recoveryFactor.toFixed(1)}%</span>
                    </div>
                    <Progress value={recoveryFactor} className="h-2 bg-slate-800" indicatorClassName="bg-blue-600" />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                        <div className="text-xs text-slate-500">EUR</div>
                        <div className="text-lg font-bold text-white">{(eur / 1000).toFixed(1)}k</div>
                        <div className="text-[10px] text-slate-500">{activeStream === 'Gas' ? 'mcf' : 'bbl'}</div>
                    </div>
                    <div>
                        <div className="text-xs text-slate-500">Remaining</div>
                        <div className="text-lg font-bold text-emerald-400">{(remaining / 1000).toFixed(1)}k</div>
                        <div className="text-[10px] text-slate-500">{activeStream === 'Gas' ? 'mcf' : 'bbl'}</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ForecastPanel;