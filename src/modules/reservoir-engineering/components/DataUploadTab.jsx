import React from 'react';
import { useMaterialBalanceStore } from '@/modules/reservoir-engineering/store/materialBalanceStore';
import DataPreviewTable from './DataPreviewTable';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const DataUploadTab = () => {
  const {
    productionData,
    pressureData,
    pvtData,
    fluidProperties,
    rockProperties,
    initialConditions,
    saveAnalysisData,
    setData,
  } = useMaterialBalanceStore();

  const handleClearData = () => {
    setData('productionData', []);
    setData('pressureData', []);
    setData('pvtData', []);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>
            Preview and manage the data associated with this analysis.
            Data is loaded from the selected analysis and can be modified here.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <Button onClick={saveAnalysisData}>Save Changes</Button>
            <Button variant="destructive" onClick={handleClearData} className="ml-2">Clear All Data</Button>
        </CardContent>
      </Card>
      
      <DataPreviewTable data={productionData} title="Production Data Preview" />
      <DataPreviewTable data={pressureData} title="Pressure Data Preview" />
      <DataPreviewTable data={pvtData} title="PVT Data Preview" />
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Fluid Properties</CardTitle></CardHeader>
          <CardContent><pre className="text-sm bg-slate-800 p-4 rounded-md">{JSON.stringify(fluidProperties, null, 2)}</pre></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Rock Properties</CardTitle></CardHeader>
          <CardContent><pre className="text-sm bg-slate-800 p-4 rounded-md">{JSON.stringify(rockProperties, null, 2)}</pre></CardContent>
        </Card>
        <Card>
            <CardHeader><CardTitle>Initial Conditions</CardTitle></CardHeader>
            <CardContent><pre className="text-sm bg-slate-800 p-4 rounded-md">{JSON.stringify(initialConditions, null, 2)}</pre></CardContent>
        </Card>
      </div>

    </div>
  );
};

export default DataUploadTab;