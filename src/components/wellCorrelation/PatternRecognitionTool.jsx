import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScanLine } from 'lucide-react';

const PatternRecognitionTool = () => {
    return (
        <Card className="bg-slate-950 border-slate-800 h-full">
            <CardHeader className="border-b border-slate-800 pb-3">
                <CardTitle className="text-sm font-medium text-slate-200 flex items-center">
                    <ScanLine className="w-4 h-4 mr-2 text-purple-400" /> Pattern Recognition
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
                <div className="h-full flex flex-col gap-3">
                    <div className="p-3 bg-slate-900/50 rounded border border-slate-800">
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                            <span>Fining Upward Sequence</span>
                            <span className="text-emerald-400">85% Match</span>
                        </div>
                        <div className="h-12 w-full bg-slate-800 rounded overflow-hidden relative">
                            <div className="absolute inset-0 opacity-20 bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
                            <svg className="w-full h-full" preserveAspectRatio="none">
                                <path d="M0,40 Q20,10 40,30 T100,10" fill="none" stroke="#10b981" strokeWidth="2" />
                            </svg>
                        </div>
                    </div>
                    <div className="p-3 bg-slate-900/50 rounded border border-slate-800">
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                            <span>Coarsening Upward</span>
                            <span className="text-amber-400">62% Match</span>
                        </div>
                        <div className="h-12 w-full bg-slate-800 rounded overflow-hidden">
                             <svg className="w-full h-full" preserveAspectRatio="none">
                                <path d="M0,10 Q40,40 80,20 T100,40" fill="none" stroke="#f59e0b" strokeWidth="2" />
                            </svg>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default PatternRecognitionTool;