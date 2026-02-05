import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GitBranch, Clock, RotateCcw } from 'lucide-react';
import { getHistory } from '@/utils/declineCurve/VersioningEngine';
import { useDeclineCurve } from '@/context/DeclineCurveContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const VersioningPanel = () => {
    const { currentProjectId } = useDeclineCurve();
    const history = getHistory(currentProjectId);

    return (
        <Card className="bg-slate-900 border-slate-800 h-full flex flex-col">
            <CardHeader className="py-3 px-4 border-b border-slate-800">
                <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-purple-400" /> Version Control
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1 min-h-0">
                <ScrollArea className="h-full">
                    <div className="p-4 space-y-6 relative">
                        {/* Timeline Line */}
                        <div className="absolute left-[27px] top-6 bottom-6 w-px bg-slate-800"></div>
                        
                        {history.map((ver, i) => (
                            <div key={ver.id} className="relative pl-10">
                                <div className={`absolute left-5 top-1.5 w-3 h-3 rounded-full border-2 ${i===0 ? 'bg-purple-500 border-purple-900' : 'bg-slate-900 border-slate-600'}`}></div>
                                <div className="bg-slate-950 border border-slate-800 rounded p-3">
                                    <div className="flex justify-between items-start mb-1">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="text-[10px] h-5 px-1">{ver.version}</Badge>
                                            <span className="text-sm font-semibold text-slate-200">{ver.change}</span>
                                        </div>
                                        <span className="text-[10px] text-slate-500 flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> {new Date(ver.date).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="text-xs text-slate-500 mb-2">Committed by {ver.user}</div>
                                    {i > 0 && (
                                        <Button size="sm" variant="outline" className="h-6 text-[10px] border-slate-800 hover:bg-slate-900">
                                            <RotateCcw className="w-3 h-3 mr-1" /> Rollback
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
};

export default VersioningPanel;