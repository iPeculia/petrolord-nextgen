import React from 'react';
import { useWellCorrelation } from '@/contexts/WellCorrelationContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Lightbulb, Check, X } from 'lucide-react';

const SuggestionPanel = () => {
    const { state, actions } = useWellCorrelation();
    const { suggestions } = state;

    return (
        <Card className="bg-slate-950 border-slate-800 h-full flex flex-col">
            <CardHeader className="border-b border-slate-800 pb-3 shrink-0">
                <CardTitle className="text-sm font-medium text-slate-200 flex items-center">
                    <Lightbulb className="w-4 h-4 mr-2 text-yellow-400" /> Auto-Suggestions
                    <span className="ml-2 text-xs bg-slate-800 px-2 py-0.5 rounded-full text-slate-400">{suggestions.length}</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                    <div className="divide-y divide-slate-800">
                        {suggestions.length === 0 ? (
                            <div className="p-6 text-center text-slate-500 text-xs">
                                No suggestions available. Import more wells to generate correlations.
                            </div>
                        ) : (
                            suggestions.map((sugg) => (
                                <div key={sugg.id} className="p-3 hover:bg-slate-900/50 transition-colors">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-xs font-semibold text-slate-300">{sugg.type}</span>
                                        <span className="text-[10px] text-slate-500">{(sugg.confidence * 100).toFixed(0)}% Conf.</span>
                                    </div>
                                    <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                                        {sugg.description}
                                    </p>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="outline" className="h-6 text-[10px] border-slate-700 text-emerald-400 hover:bg-emerald-950/30 w-full">
                                            <Check className="w-3 h-3 mr-1" /> Apply
                                        </Button>
                                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-slate-500 hover:text-red-400">
                                            <X className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
};

export default SuggestionPanel;