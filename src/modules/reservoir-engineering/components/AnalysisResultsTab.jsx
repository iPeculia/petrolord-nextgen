import React from 'react';
import { useMaterialBalanceStore } from '@/modules/reservoir-engineering/store/materialBalanceStore';
import useMaterialBalanceAnalysis from '@/modules/reservoir-engineering/hooks/useMaterialBalanceAnalysis';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertTriangle } from 'lucide-react';

import ResultsSummaryCard from './ResultsSummaryCard';
import MaterialBalancePlot from './MaterialBalancePlot';
import DriveMechanismBreakdown from './DriveMechanismBreakdown';
import PressureProductionChart from './PressureProductionChart';
import OoipEstimationChart from './OoipEstimationChart';
import InitialConditionsPanel from './InitialConditionsPanel';

const AnalysisResultsTab = () => {
  const { runAnalysis, status, error, results } = useMaterialBalanceAnalysis();
  const { productionData, pvtData } = useMaterialBalanceStore();

  const isDataReady = productionData && pvtData && productionData.length > 0 && pvtData.length > 0;

  const renderContent = () => {
    if (status === 'loading') {
      return (
        <div className="flex flex-col items-center justify-center h-96 text-gray-400">
          <Loader2 className="w-16 h-16 animate-spin text-primary" />
          <p className="mt-4 text-lg">Running material balance calculations...</p>
        </div>
      );
    }
    if (status === 'error') {
      return (
        <Alert variant="destructive" className="max-w-2xl mx-auto">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Analysis Failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      );
    }
    if (status === 'success' && results) {
      return (
        <div className="space-y-6">
          <ResultsSummaryCard results={results} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MaterialBalancePlot plotData={results.plotData} equation={results.equation} rSquared={results.rSquared} />
            <DriveMechanismBreakdown results={results} />
          </div>
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PressureProductionChart productionData={productionData} pvtData={pvtData} />
            <OoipEstimationChart results={results} />
          </div>
        </div>
      );
    }
    
    return (
        <div className="text-center text-gray-500 py-16">
          <p>Once data is loaded, configure initial conditions and run the analysis.</p>
        </div>
    );
  };

  return (
    <div className="space-y-6 mt-4">
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle>Analysis Configuration</CardTitle>
          <CardDescription>Set initial reservoir conditions and run the analysis.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <InitialConditionsPanel disabled={!isDataReady || status === 'loading'}/>
            <Button onClick={runAnalysis} disabled={!isDataReady || status === 'loading'} className="w-full">
                {status === 'loading' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {status === 'success' ? 'Re-run Analysis' : 'Run Material Balance Analysis'}
            </Button>
        </CardContent>
      </Card>
      
      {renderContent()}

    </div>
  );
};

export default AnalysisResultsTab;