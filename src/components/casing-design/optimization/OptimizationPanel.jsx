import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, TrendingDown, ShieldCheck } from 'lucide-react';
import { generateOptimizationSuggestions } from '@/utils/optimization/optimizationEngine';

const OptimizationPanel = ({ sections, calculations }) => {
    const suggestions = useMemo(() => generateOptimizationSuggestions(sections, calculations), [sections, calculations]);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                    <Sparkles className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white">AI Optimization Engine</h3>
                    <p className="text-slate-400 text-sm">Automated suggestions to reduce cost and improve safety margins.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {suggestions.map((suggestion, idx) => (
                    <Card key={idx} className="bg-[#1E293B] border-slate-700 border-l-4 border-l-purple-500">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                    {suggestion.type === 'cost' ? (
                                        <TrendingDown className="w-4 h-4 text-emerald-400" />
                                    ) : (
                                        <ShieldCheck className="w-4 h-4 text-blue-400" />
                                    )}
                                    <CardTitle className="text-base font-bold text-white">{suggestion.title}</CardTitle>
                                </div>
                                <span className="text-xs font-bold px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                                    {suggestion.impact}
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-slate-400 text-sm mb-4">{suggestion.description}</p>
                            <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                                Apply Suggestion (Simulate)
                            </Button>
                        </CardContent>
                    </Card>
                ))}
                
                {suggestions.length === 0 && (
                    <div className="text-center py-12 bg-[#1E293B] rounded-lg border border-slate-800 border-dashed">
                        <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto mb-4 opacity-50" />
                        <h4 className="text-white font-medium">Design is Optimized</h4>
                        <p className="text-slate-500 text-sm mt-2">No obvious mechanical inefficiencies detected based on current constraints.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OptimizationPanel;