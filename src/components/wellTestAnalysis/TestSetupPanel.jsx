import React from 'react';
import { useWellTestAnalysis } from '@/hooks/useWellTestAnalysis';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, AlertTriangle } from 'lucide-react';

const TestSetupPanel = () => {
  const { state, dispatch, log } = useWellTestAnalysis();
  const { testConfig, validationResult, standardizedData } = state;

  const handleChange = (key, value) => {
    dispatch({ type: 'UPDATE_TEST_CONFIG', payload: { [key]: value } });
  };

  const handleComplete = () => {
    dispatch({ type: 'COMPLETE_IMPORT' });
    log('Import and Setup Complete. Ready for analysis.', 'success');
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Setup Form */}
        <div className="lg:col-span-2 space-y-6">
            <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-white">Test Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-slate-300">Test Type</Label>
                            <Select value={testConfig.type} onValueChange={(v) => handleChange('type', v)}>
                                <SelectTrigger className="bg-slate-950 border-slate-700"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="drawdown">Drawdown</SelectItem>
                                    <SelectItem value="buildup">Buildup</SelectItem>
                                    <SelectItem value="injection">Injection</SelectItem>
                                    <SelectItem value="falloff">Falloff</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-slate-300">Fluid Type</Label>
                            <Select value={testConfig.fluidType} onValueChange={(v) => handleChange('fluidType', v)}>
                                <SelectTrigger className="bg-slate-950 border-slate-700"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="oil">Oil</SelectItem>
                                    <SelectItem value="gas">Gas</SelectItem>
                                    <SelectItem value="water">Water</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-slate-300">Porosity (fraction)</Label>
                            <Input type="number" value={testConfig.porosity} onChange={(e) => handleChange('porosity', parseFloat(e.target.value))} className="bg-slate-950 border-slate-700" step="0.01" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-slate-300">Total Compressibility (1/psi)</Label>
                            <Input type="number" value={testConfig.compressibility} onChange={(e) => handleChange('compressibility', parseFloat(e.target.value))} className="bg-slate-950 border-slate-700" step="1e-6" />
                        </div>
                         <div className="space-y-2">
                            <Label className="text-slate-300">Wellbore Radius (ft)</Label>
                            <Input type="number" value={testConfig.rw} onChange={(e) => handleChange('rw', parseFloat(e.target.value))} className="bg-slate-950 border-slate-700" step="0.01" />
                        </div>
                         <div className="space-y-2">
                            <Label className="text-slate-300">Reservoir Thickness (ft)</Label>
                            <Input type="number" value={testConfig.h} onChange={(e) => handleChange('h', parseFloat(e.target.value))} className="bg-slate-950 border-slate-700" step="1" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button className="bg-[#BFFF00] text-black hover:bg-[#a3d900] w-full md:w-auto" onClick={handleComplete}>
                    Finish Setup & Go to Analysis
                </Button>
            </div>
        </div>

        {/* Right Col: Quality Summary */}
        <div className="space-y-6">
            <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-white text-base">Data Quality Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-sm">Valid Points</span>
                        <span className="text-white font-mono">{standardizedData.length}</span>
                    </div>
                    
                    {validationResult?.stats?.timeRange && (
                        <div className="space-y-1">
                            <span className="text-slate-400 text-sm">Time Range (hrs)</span>
                            <div className="flex justify-between text-xs font-mono text-slate-300 bg-slate-950 p-2 rounded">
                                <span>{validationResult.stats.timeRange[0].toFixed(2)}</span>
                                <span>to</span>
                                <span>{validationResult.stats.timeRange[1].toFixed(2)}</span>
                            </div>
                        </div>
                    )}
                     
                    {validationResult?.stats?.pressureRange && (
                        <div className="space-y-1">
                            <span className="text-slate-400 text-sm">Pressure Range (psia)</span>
                            <div className="flex justify-between text-xs font-mono text-slate-300 bg-slate-950 p-2 rounded">
                                <span>{validationResult.stats.pressureRange[0].toFixed(2)}</span>
                                <span>to</span>
                                <span>{validationResult.stats.pressureRange[1].toFixed(2)}</span>
                            </div>
                        </div>
                    )}

                    <div className="pt-4 border-t border-slate-800">
                        {validationResult?.isValid ? (
                            <Alert className="bg-green-900/20 border-green-900 text-green-400">
                                <CheckCircle className="h-4 w-4" />
                                <AlertTitle>Data Looks Good</AlertTitle>
                                <AlertDescription className="text-xs">Quality Score: {validationResult.score}/100</AlertDescription>
                            </Alert>
                        ) : (
                            <Alert className="bg-red-900/20 border-red-900 text-red-400">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertTitle>Data Issues Found</AlertTitle>
                                <AlertDescription className="text-xs">
                                    {validationResult?.issues.map((i,idx) => <div key={idx}>{i}</div>)}
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default TestSetupPanel;