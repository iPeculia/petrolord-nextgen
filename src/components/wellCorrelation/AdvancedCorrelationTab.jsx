import React from 'react';
import LogSimilarityTool from './LogSimilarityTool';
import PatternRecognitionTool from './PatternRecognitionTool';
import SuggestionPanel from './SuggestionPanel';
import { Card } from '@/components/ui/card';
import { Map } from 'lucide-react';

const AdvancedCorrelationTab = () => {
    return (
        <div className="h-full p-6 bg-slate-900/20 overflow-hidden flex flex-col">
            <div className="mb-4 shrink-0">
                <h2 className="text-xl font-bold text-white">Advanced Correlation Tools</h2>
                <p className="text-sm text-slate-400">Automated analysis and pattern recognition assistance.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
                {/* Left Column: Suggestions & Patterns */}
                <div className="space-y-6 flex flex-col min-h-0">
                    <div className="flex-1 min-h-0">
                        <SuggestionPanel />
                    </div>
                    <div className="h-1/3 min-h-[200px]">
                        <PatternRecognitionTool />
                    </div>
                </div>

                {/* Middle Column: Matrix & Analysis */}
                <div className="space-y-6 flex flex-col min-h-0">
                    <div className="flex-1 min-h-0">
                        <LogSimilarityTool />
                    </div>
                </div>

                {/* Right Column: Structural Context (Placeholder) */}
                <div className="flex flex-col min-h-0">
                    <Card className="bg-slate-950 border-slate-800 h-full flex flex-col">
                        <div className="p-4 border-b border-slate-800 flex items-center gap-2 text-slate-200 font-medium">
                            <Map className="w-4 h-4 text-emerald-400" /> Structural Context
                        </div>
                        <div className="flex-1 bg-slate-900/50 relative overflow-hidden flex items-center justify-center text-slate-600">
                            <div className="text-center">
                                <Map className="w-12 h-12 mx-auto mb-2 opacity-20" />
                                <p className="text-sm">Map View Placeholder</p>
                                <p className="text-xs">Well locations and fault traces</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AdvancedCorrelationTab;