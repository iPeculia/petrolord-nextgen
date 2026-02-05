import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDeclineCurve } from '@/context/DeclineCurveContext';
import { detectAnomalies } from '@/utils/declineCurve/MachineLearningEngine';
import { AlertTriangle, Activity, Search, FileDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

const AnomalyDetection = () => {
    const { currentWell, activeStream } = useDeclineCurve();
    const [anomalies, setAnomalies] = useState(null);

    const handleScan = () => {
        if (!currentWell || !currentWell.data) return;
        const results = detectAnomalies(currentWell.data, activeStream === 'Oil' ? 'oilRate' : activeStream === 'Gas' ? 'gasRate' : 'waterRate');
        setAnomalies(results);
    };

    return (
        <div className="h-full flex flex-col space-y-4">
            <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b border-slate-800">
                    <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-amber-400" /> Production Anomaly Detector
                    </CardTitle>
                    <Button size="sm" variant="outline" className="h-8 border-slate-700 bg-slate-900" onClick={handleScan}>
                        <Search className="w-3 h-3 mr-2" /> Scan Data
                    </Button>
                </CardHeader>
                <CardContent className="p-0">
                    {anomalies === null ? (
                        <div className="p-8 text-center text-slate-500">
                            <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
                            <p>Run a scan to detect outlying production behavior.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col h-[400px]">
                            <div className="p-4 bg-slate-950 border-b border-slate-800 grid grid-cols-3 gap-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-white">{anomalies.length}</div>
                                    <div className="text-xs text-slate-500">Events Found</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-red-400">{anomalies.filter(a => a.severity === 'High').length}</div>
                                    <div className="text-xs text-slate-500">High Severity</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-amber-400">{anomalies.filter(a => a.severity === 'Medium').length}</div>
                                    <div className="text-xs text-slate-500">Medium Severity</div>
                                </div>
                            </div>
                            
                            <ScrollArea className="flex-1">
                                {anomalies.length === 0 ? (
                                    <div className="p-8 text-center text-green-500">
                                        No significant anomalies detected. Data appears clean.
                                    </div>
                                ) : (
                                    <div className="divide-y divide-slate-800">
                                        {anomalies.map((anomaly, i) => (
                                            <div key={i} className="p-4 hover:bg-slate-800/50 transition-colors flex items-start gap-3">
                                                <div className={`mt-1 p-1.5 rounded-full ${anomaly.severity === 'High' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                                    <AlertTriangle className="w-4 h-4" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between mb-1">
                                                        <span className="text-sm font-medium text-slate-200">{new Date(anomaly.date).toLocaleDateString()}</span>
                                                        <Badge variant="outline" className={`text-[10px] h-5 ${anomaly.severity === 'High' ? 'border-red-500/50 text-red-400' : 'border-amber-500/50 text-amber-400'}`}>
                                                            {anomaly.severity}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-xs text-slate-400">{anomaly.description}</p>
                                                    <div className="mt-2 text-[10px] text-slate-500 font-mono bg-slate-900 inline-block px-2 py-1 rounded">
                                                        Rate: {anomaly.value.toFixed(1)}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </ScrollArea>
                            
                            <div className="p-3 border-t border-slate-800 bg-slate-900">
                                <Button variant="ghost" size="sm" className="w-full text-slate-400 hover:text-white" disabled={anomalies.length === 0}>
                                    <FileDown className="w-4 h-4 mr-2" /> Export Report
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default AnomalyDetection;