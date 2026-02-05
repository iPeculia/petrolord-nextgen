import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useDeclineCurve } from '@/context/DeclineCurveContext';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Layers, ArrowRight } from 'lucide-react';

const ScenarioManager = () => {
    const { currentProject, activeScenarioId, setActiveScenarioId } = useDeclineCurve();
    
    const scenarios = currentProject?.scenarios || [];

    return (
        <div className="h-full flex flex-col p-4 gap-4">
             <Card className="bg-slate-900 border-slate-800 flex-1 flex flex-col">
                <CardHeader className="py-3 px-4 border-b border-slate-800">
                    <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                        <Layers className="w-4 h-4 text-purple-400" /> Analysis Scenarios
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0 flex-1 min-h-0">
                    <ScrollArea className="h-full">
                        <div className="divide-y divide-slate-800">
                            {scenarios.map((scenario, idx) => (
                                <div 
                                    key={scenario.id || idx}
                                    onClick={() => setActiveScenarioId(scenario.id)}
                                    className={`p-4 cursor-pointer hover:bg-slate-800/50 transition-colors ${activeScenarioId === scenario.id ? 'bg-purple-900/10 border-l-2 border-purple-500' : 'border-l-2 border-transparent'}`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <span className={`text-sm font-medium ${activeScenarioId === scenario.id ? 'text-purple-300' : 'text-slate-200'}`}>
                                            {scenario.name}
                                        </span>
                                        {scenario.isBaseCase && <Badge variant="outline" className="text-[10px] border-slate-600 text-slate-400">Base</Badge>}
                                    </div>
                                    <p className="text-xs text-slate-500 mb-2 line-clamp-2">{scenario.description}</p>
                                    
                                    <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 bg-slate-950 p-2 rounded">
                                        <div>Oil: ${scenario.parameters?.oilPrice}</div>
                                        <div>Gas: ${scenario.parameters?.gasPrice}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
};

export default ScenarioManager;