import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMaterialBalance } from '@/hooks/useMaterialBalance';
import ModelFittingResults from './ModelFittingResults';
import AquiferSetupForm from './AquiferSetupForm';
import { fitModel } from '@/services/materialBalance/ModelFittingEngine';
import { useToast } from '@/components/ui/use-toast';
import { Calculator } from 'lucide-react';

const MBModelFitting = () => {
  const { diagnosticsData, tankData, updateModelResults } = useMaterialBalance();
  const { toast } = useToast();
  
  const [modelType, setModelType] = useState('volumetric_oil');
  const [aquiferParams, setAquiferParams] = useState({ type: 'steady_state', constant: 100 });
  const [isFitting, setIsFitting] = useState(false);
  const [fitResults, setFitResults] = useState(null);

  const handleRunFitting = async () => {
    setIsFitting(true);
    try {
      // Simulate delay for heavy calc
      await new Promise(r => setTimeout(r, 500));
      
      const results = fitModel(modelType, diagnosticsData, { aquifer: aquiferParams });
      setFitResults(results);
      updateModelResults(results); // Store in context
      
      toast({ title: "Fitting Complete", description: `R²: ${results.statistics.r2.toFixed(4)}` });
    } catch (error) {
      toast({ title: "Fitting Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsFitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Configuration Panel */}
      <div className="lg:col-span-1 space-y-4">
        <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
                <CardTitle className="text-lg">Model Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>Model Type</Label>
                    <Select value={modelType} onValueChange={setModelType}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="volumetric_oil">Volumetric Oil (No Aquifer)</SelectItem>
                            <SelectItem value="solution_gas">Solution Gas Drive</SelectItem>
                            <SelectItem value="gas_cap_drive">Gas Cap Drive</SelectItem>
                            <SelectItem value="water_drive_steady">Water Drive (Steady State)</SelectItem>
                            <SelectItem value="p_z_gas">Volumetric Gas (P/Z)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Conditional Inputs */}
                {modelType.includes('water') && (
                    <AquiferSetupForm params={aquiferParams} onChange={setAquiferParams} />
                )}

                {modelType === 'gas_cap_drive' && (
                    <div className="space-y-2">
                         <Label>Gas Cap Ratio (m) - Initial Guess</Label>
                         <Input type="number" defaultValue="0.5" step="0.1" />
                    </div>
                )}

                <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 mt-4" 
                    onClick={handleRunFitting}
                    disabled={isFitting || !diagnosticsData.length}
                >
                    {isFitting ? <Calculator className="animate-spin mr-2 h-4 w-4" /> : "Run Regression"}
                </Button>
            </CardContent>
        </Card>
        
        {/* Help / Quick Stats */}
        <Card className="bg-slate-900/50 border-slate-800">
             <CardContent className="p-4 text-sm text-slate-400">
                 <p>Select a reservoir model to estimate In-Place Volumes (N/G) and drive parameters.</p>
                 <p className="mt-2">Use the "Water Drive" option to include aquifer influx calculations.</p>
             </CardContent>
        </Card>
      </div>

      {/* Results Panel */}
      <div className="lg:col-span-2 h-full min-h-[500px]">
          {fitResults ? (
              <ModelFittingResults results={fitResults} />
          ) : (
              <div className="h-full flex flex-col items-center justify-center border border-dashed border-slate-700 rounded-lg bg-slate-900/30 text-slate-500">
                  <Calculator className="h-12 w-12 mb-4 opacity-50" />
                  <p>Configure and run model fitting to view results</p>
              </div>
          )}
      </div>
    </div>
  );
};

export default MBModelFitting;