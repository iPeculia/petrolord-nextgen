import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useDeclineCurve } from '@/context/DeclineCurveContext';
import { Badge } from '@/components/ui/badge';

const ModelFittingPanel = () => {
    const { currentWell, fitConfig, activeStream } = useDeclineCurve();

    // Determine current model parameters to display
    // If we have a fitted model in well object, use it, otherwise use context state (manual fit)
    let displayModel = fitConfig;
    let qualityMetrics = null;

    if (currentWell && currentWell.model) {
        const streamKey = activeStream === 'Gas' ? 'gas' : 'oil';
        if (currentWell.model[streamKey]) {
            displayModel = currentWell.model[streamKey];
            qualityMetrics = {
                r2: displayModel.r2,
                rmse: displayModel.rmse,
                confidence: displayModel.confidence
            };
        }
    }

    return (
        <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="py-3 px-4 border-b border-slate-800">
                <CardTitle className="text-sm font-medium text-slate-300">Model Parameters ({activeStream})</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs text-slate-500">Model Type</label>
                        <div className="text-sm font-medium text-slate-200 capitalize">{displayModel.modelType || 'Hyperbolic'}</div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs text-slate-500">Initial Rate (qi)</label>
                        <div className="text-sm font-medium text-blue-400">{displayModel.qi?.toFixed(1) || '-'} bbl/d</div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs text-slate-500">Decline Rate (Di)</label>
                        <div className="text-sm font-medium text-slate-200">{(displayModel.Di * 100).toFixed(1)}% /yr</div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs text-slate-500">b-factor</label>
                        <div className="text-sm font-medium text-slate-200">{displayModel.b?.toFixed(2) || '-'}</div>
                    </div>
                </div>

                {qualityMetrics && (
                    <div className="pt-2 border-t border-slate-800 mt-2">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs text-slate-400">Fit Quality</span>
                            <Badge variant="outline" className={`text-[10px] ${qualityMetrics.r2 > 0.9 ? 'text-green-400 border-green-900' : 'text-amber-400 border-amber-900'}`}>
                                {qualityMetrics.confidence || 'Manual'}
                            </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex justify-between">
                                <span className="text-slate-500">R²</span>
                                <span className="text-slate-200">{qualityMetrics.r2 || '-'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">RMSE</span>
                                <span className="text-slate-200">{qualityMetrics.rmse || '-'}</span>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default ModelFittingPanel;