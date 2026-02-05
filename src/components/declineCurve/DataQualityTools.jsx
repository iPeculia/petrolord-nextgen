import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ShieldCheck, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { useDeclineCurve } from '@/context/DeclineCurveContext';
import { checkQuality } from '@/utils/declineCurve/DataQuality';

const DataQualityTools = () => {
    const { currentWell, activeStream } = useDeclineCurve();
    const [report, setReport] = useState(null);

    const runCheck = () => {
        if (!currentWell?.data) return;
        const rateKey = activeStream === 'Oil' ? 'oilRate' : activeStream === 'Gas' ? 'gasRate' : 'waterRate';
        const result = checkQuality(currentWell.data, rateKey);
        setReport(result);
    };

    return (
        <Card className="bg-slate-900 border-slate-800 h-full flex flex-col">
            <CardHeader className="py-3 px-4 border-b border-slate-800 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> Data Quality
                </CardTitle>
                <Button size="sm" variant="outline" className="h-8 border-slate-700 bg-slate-900" onClick={runCheck}>
                    <RefreshCw className="w-3 h-3 mr-2" /> Run Check
                </Button>
            </CardHeader>
            <CardContent className="p-4 flex-1 min-h-0 flex flex-col gap-4">
                {!report ? (
                    <div className="text-center text-slate-500 py-8">
                        Run a check to analyze current well data.
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between bg-slate-950 p-4 rounded border border-slate-800">
                            <div>
                                <div className="text-sm text-slate-400">Quality Score</div>
                                <div className={`text-3xl font-bold ${report.score > 80 ? 'text-green-400' : report.score > 50 ? 'text-amber-400' : 'text-red-400'}`}>
                                    {report.score}/100
                                </div>
                            </div>
                            <div className="w-1/2">
                                <Progress value={report.score} className="h-2 bg-slate-800" indicatorClassName={report.score > 80 ? 'bg-green-500' : 'bg-amber-500'} />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            <div className="bg-slate-950 p-2 rounded border border-slate-800 text-center">
                                <div className="text-lg font-bold text-white">{report.metrics.totalPoints}</div>
                                <div className="text-[10px] text-slate-500">Total Points</div>
                            </div>
                            <div className="bg-slate-950 p-2 rounded border border-slate-800 text-center">
                                <div className="text-lg font-bold text-red-400">{report.metrics.negativeValues}</div>
                                <div className="text-[10px] text-slate-500">Negative</div>
                            </div>
                            <div className="bg-slate-950 p-2 rounded border border-slate-800 text-center">
                                <div className="text-lg font-bold text-amber-400">{report.metrics.zeroValues}</div>
                                <div className="text-[10px] text-slate-500">Zero Rate</div>
                            </div>
                        </div>

                        <div className="flex-1 min-h-0 flex flex-col border border-slate-800 rounded bg-slate-950">
                            <div className="p-2 border-b border-slate-800 text-xs font-semibold text-slate-400">Issues Found</div>
                            <ScrollArea className="flex-1">
                                <div className="divide-y divide-slate-800">
                                    {report.issues.length === 0 ? (
                                        <div className="p-4 text-center text-green-500 flex items-center justify-center gap-2">
                                            <CheckCircle className="w-4 h-4" /> No critical issues.
                                        </div>
                                    ) : (
                                        report.issues.map((issue, i) => (
                                            <div key={i} className="p-2 flex gap-2 text-xs hover:bg-slate-900">
                                                <AlertCircle className="w-3 h-3 text-red-400 mt-0.5" />
                                                <div>
                                                    <div className="text-slate-300">{issue.message}</div>
                                                    <div className="text-slate-500">{new Date(issue.date).toLocaleDateString()}</div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </ScrollArea>
                        </div>
                        
                        <Button className="w-full bg-slate-800 hover:bg-slate-700 text-xs">
                            Export Quality Report
                        </Button>
                    </>
                )}
            </CardContent>
        </Card>
    );
};

export default DataQualityTools;