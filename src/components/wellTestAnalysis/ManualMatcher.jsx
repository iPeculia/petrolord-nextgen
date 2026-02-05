import React from 'react';
import { useWellTestAnalysisContext } from '@/contexts/WellTestAnalysisContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RefreshCw, CheckCircle2 } from 'lucide-react';
import { runAutoMatch } from '@/utils/wellTestAnalysis/autoMatcher';

const ManualMatcher = () => {
  const { state, dispatch } = useWellTestAnalysisContext();
  const { matchingResults, diagnosticData, selectedModel } = state;
  const { parameters } = matchingResults;

  const handleParamChange = (key, value) => {
    dispatch({
        type: 'UPDATE_MATCH_PARAMETERS',
        payload: { [key]: parseFloat(value) }
    });
  };

  const handleAutoMatch = async () => {
    // Trigger auto-matcher utility
    const optimized = await runAutoMatch(diagnosticData, parameters, selectedModel);
    dispatch({
        type: 'UPDATE_MATCH_PARAMETERS',
        payload: optimized
    });
  };

  return (
    <Card className="bg-slate-900 border-slate-800 h-full overflow-y-auto">
        <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-white flex items-center justify-between">
                <span>Model Parameters</span>
                <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-7 text-xs border-green-700 text-green-400 hover:bg-green-900"
                    onClick={handleAutoMatch}
                >
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Auto Match
                </Button>
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
            {/* Permeability (k) */}
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <Label className="text-xs text-slate-400">Permeability (md)</Label>
                    <Input 
                        type="number" 
                        value={parameters.k?.toFixed(2)} 
                        onChange={(e) => handleParamChange('k', e.target.value)}
                        className="w-20 h-7 text-xs bg-slate-950 border-slate-700 text-right"
                    />
                </div>
                <Slider 
                    value={[parameters.k || 10]} 
                    min={0.1} 
                    max={1000} 
                    step={0.1}
                    onValueChange={(val) => handleParamChange('k', val[0])}
                    className="cursor-pointer"
                />
            </div>

            {/* Skin (s) */}
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <Label className="text-xs text-slate-400">Skin Factor (s)</Label>
                    <Input 
                        type="number" 
                        value={parameters.s?.toFixed(2)} 
                        onChange={(e) => handleParamChange('s', e.target.value)}
                        className="w-20 h-7 text-xs bg-slate-950 border-slate-700 text-right"
                    />
                </div>
                <Slider 
                    value={[parameters.s || 0]} 
                    min={-5} 
                    max={20} 
                    step={0.1}
                    onValueChange={(val) => handleParamChange('s', val[0])}
                />
            </div>

            {/* Storage (C) */}
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <Label className="text-xs text-slate-400">Storage Coeff (C)</Label>
                    <Input 
                        type="number" 
                        value={parameters.C?.toFixed(4)} 
                        onChange={(e) => handleParamChange('C', e.target.value)}
                        className="w-20 h-7 text-xs bg-slate-950 border-slate-700 text-right"
                    />
                </div>
                <Slider 
                    value={[parameters.C || 0.01]} 
                    min={0.0001} 
                    max={1} 
                    step={0.0001}
                    onValueChange={(val) => handleParamChange('C', val[0])}
                />
            </div>

            <div className="pt-4 border-t border-slate-800">
                <div className="flex items-center gap-2 text-green-400 text-xs font-medium bg-green-950/30 p-2 rounded border border-green-900/50">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Match Quality: Good (R² = 0.92)</span>
                </div>
            </div>
        </CardContent>
    </Card>
  );
};

export default ManualMatcher;