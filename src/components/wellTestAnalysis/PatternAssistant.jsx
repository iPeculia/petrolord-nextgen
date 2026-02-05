import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Info } from 'lucide-react';
import { useWellTestAnalysis } from '@/hooks/useWellTestAnalysis';

const PatternAssistant = () => {
  const { state } = useWellTestAnalysis();
  const { flowRegimes } = state;

  // Basic interpretation of detected regimes
  const hasIARF = flowRegimes.some(r => r.type === 'Infinite Acting Radial Flow');
  const hasStorage = flowRegimes.some(r => r.type === 'Wellbore Storage');
  const hasBoundary = flowRegimes.some(r => r.type.includes('Boundary'));

  return (
    <Card className="bg-slate-900 border-slate-800 h-full">
        <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-400" />
                Pattern Recognition
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            {/* Regime List */}
            <div className="space-y-2">
                <h4 className="text-xs font-medium text-slate-400 uppercase">Detected Regimes</h4>
                {flowRegimes.length === 0 && <span className="text-xs text-slate-500">No specific regimes detected yet.</span>}
                <div className="flex flex-wrap gap-2">
                    {flowRegimes.map((r, i) => (
                        <Badge key={i} variant="outline" className="text-xs bg-slate-950 border-slate-700 text-slate-300">
                            {r.type}
                        </Badge>
                    ))}
                </div>
            </div>

            {/* Suggestions */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
                <h4 className="text-xs font-medium text-slate-400 uppercase">Analysis Hints</h4>
                
                {hasStorage && (
                    <div className="flex gap-2 text-xs text-slate-300">
                        <Info className="w-3 h-3 mt-0.5 text-blue-400 shrink-0" />
                        <p>Early time unit slope indicates significant wellbore storage. Ensure your model includes C (storage coefficient).</p>
                    </div>
                )}
                
                {hasIARF ? (
                    <div className="flex gap-2 text-xs text-slate-300">
                        <Info className="w-3 h-3 mt-0.5 text-green-400 shrink-0" />
                        <p>Radial flow plateau detected. Permeability can be estimated reliably from this region.</p>
                    </div>
                ) : (
                    <div className="flex gap-2 text-xs text-slate-300">
                        <Info className="w-3 h-3 mt-0.5 text-orange-400 shrink-0" />
                        <p>No clear radial flow plateau. Permeability estimation may be uncertain or test duration was too short.</p>
                    </div>
                )}

                {hasBoundary && (
                    <div className="flex gap-2 text-xs text-slate-300">
                        <Info className="w-3 h-3 mt-0.5 text-purple-400 shrink-0" />
                        <p>Late time boundary effects observed. Consider bounded reservoir models.</p>
                    </div>
                )}
            </div>
        </CardContent>
    </Card>
  );
};

export default PatternAssistant;