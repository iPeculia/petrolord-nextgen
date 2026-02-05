import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GitCompare, RefreshCw } from 'lucide-react';

const LogSimilarityTool = () => {
    return (
        <Card className="bg-slate-950 border-slate-800 h-full">
            <CardHeader className="border-b border-slate-800 pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-slate-200 flex items-center">
                        <GitCompare className="w-4 h-4 mr-2 text-blue-400" /> Log Similarity Matrix
                    </CardTitle>
                    <Button size="sm" variant="ghost" className="h-7 px-2 text-slate-400 hover:text-white">
                        <RefreshCw className="w-3 h-3" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-4">
                <div className="flex flex-col items-center justify-center h-64 text-slate-500 space-y-2">
                    <p className="text-sm">Select logs to compare patterns.</p>
                    <div className="grid grid-cols-3 gap-1 w-48">
                        {[1,0.8,0.4, 0.8,1,0.6, 0.4,0.6,1].map((val, i) => (
                            <div key={i} className="h-12 w-full rounded flex items-center justify-center text-xs font-mono font-bold text-slate-900"
                                 style={{ backgroundColor: `rgba(59, 130, 246, ${val})`, opacity: val < 0.5 ? 0.3 : 1 }}
                            >
                                {val.toFixed(1)}
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default LogSimilarityTool;