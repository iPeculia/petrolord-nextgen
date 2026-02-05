import React from 'react';
import { useWellCorrelation } from '@/contexts/WellCorrelationContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AlertTriangle, CheckCircle2, AlertOctagon } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const QCTool = () => {
    const { state } = useWellCorrelation();
    const { wells } = state;

    // Mock QC Logic
    const issues = [];
    if (wells.length > 0) {
        issues.push({ type: 'warning', text: 'Check KB elevation consistency for Well-1', well: 'Discovery-1X' });
        if (wells.some(w => !w.curves || w.curves.length === 0)) {
            issues.push({ type: 'error', text: 'No log curves found', well: 'Appraisal-2' });
        }
    }

    return (
        <Card className="bg-slate-950 border-slate-800 h-full flex flex-col">
            <CardHeader className="border-b border-slate-800 pb-3 shrink-0">
                <CardTitle className="text-sm font-medium text-slate-200 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2 text-amber-400" /> Quality Control
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                    {issues.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 text-slate-500">
                            <CheckCircle2 className="w-8 h-8 mb-2 text-emerald-500/50" />
                            <p className="text-sm">All checks passed.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-800">
                            {issues.map((issue, idx) => (
                                <div key={idx} className="p-3 flex gap-3 hover:bg-slate-900/50">
                                    <div className="mt-0.5">
                                        {issue.type === 'error' 
                                            ? <AlertOctagon className="w-4 h-4 text-red-500" />
                                            : <AlertTriangle className="w-4 h-4 text-amber-500" />
                                        }
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-300">{issue.text}</p>
                                        <p className="text-xs text-slate-500 mt-0.5">Well: {issue.well}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </CardContent>
        </Card>
    );
};

export default QCTool;