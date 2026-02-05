import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertTriangle, Info } from 'lucide-react';

const PressureAnomalies = ({ history }) => {
    // Detect simple anomalies (large jumps)
    const anomalies = [];
    
    if (history && history.length > 1) {
        for (let i = 1; i < history.length; i++) {
            const current = history[i];
            const prev = history[i-1];
            const change = Math.abs(current.averagePressure - prev.averagePressure);
            
            // Threshold for anomaly: > 100 psi jump or specific comment
            if (change > 100 || current.comment) {
                anomalies.push({
                    date: current.date,
                    type: current.averagePressure > prev.averagePressure ? 'Pressure Buildup' : 'Rapid Drawdown',
                    change: current.averagePressure - prev.averagePressure,
                    description: current.comment || `Significant pressure ${current.averagePressure > prev.averagePressure ? 'increase' : 'drop'} detected.`
                });
            }
        }
    }

    return (
        <Card className="bg-slate-900 border-slate-800 max-h-[300px] flex flex-col">
            <CardHeader className="py-3">
                <CardTitle className="text-sm font-medium text-white flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-400" />
                    Detected Anomalies
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1 min-h-0">
                <ScrollArea className="h-full">
                    {anomalies.length > 0 ? (
                        <div className="divide-y divide-slate-800">
                            {anomalies.map((anomaly, idx) => (
                                <div key={idx} className="p-3 hover:bg-slate-800/50 transition-colors text-sm">
                                    <div className="flex justify-between mb-1">
                                        <span className="text-slate-300 font-medium">{anomaly.type}</span>
                                        <span className="text-xs text-slate-500">{anomaly.date}</span>
                                    </div>
                                    <p className="text-slate-400 text-xs">{anomaly.description}</p>
                                    <div className={`text-xs mt-1 ${anomaly.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        Delta: {anomaly.change > 0 ? '+' : ''}{Math.round(anomaly.change)} psi
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-4 text-center text-slate-500 text-sm">
                            <Info className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            No significant anomalies detected in the pressure history.
                        </div>
                    )}
                </ScrollArea>
            </CardContent>
        </Card>
    );
};

export default PressureAnomalies;