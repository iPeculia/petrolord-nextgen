import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const WorkflowsGuide = () => {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Common Workflows</h2>
        <p className="text-slate-400">Step-by-step guides for standard engineering tasks.</p>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="bg-slate-900 border border-slate-800 w-full justify-start overflow-x-auto">
          <TabsTrigger value="basic">Basic Analysis</TabsTrigger>
          <TabsTrigger value="aquifer">Aquifer Modeling</TabsTrigger>
          <TabsTrigger value="comparison">Scenario Compare</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="mt-6">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader><CardTitle className="text-white">Standard Material Balance Analysis</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <ol className="list-decimal list-inside space-y-4 text-slate-300">
                <li className="pl-2">
                  <span className="font-semibold text-[#BFFF00]">Data Import</span>
                  <p className="text-sm text-slate-400 mt-1 ml-6">Navigate to 'Data & Tanks'. Use the CSV importer to upload monthly production and static pressure survey data.</p>
                </li>
                <li className="pl-2">
                  <span className="font-semibold text-[#BFFF00]">PVT Configuration</span>
                  <p className="text-sm text-slate-400 mt-1 ml-6">Enter reservoir temperature, initial pressure, and fluid specific gravities. Verify the generated Bo and Rs curves look reasonable.</p>
                </li>
                <li className="pl-2">
                  <span className="font-semibold text-[#BFFF00]">Diagnostic Check</span>
                  <p className="text-sm text-slate-400 mt-1 ml-6">Go to 'Diagnostics'. Inspect the 'F vs Eo' plot. If the line is straight passing through origin, assume volumetric depletion. If it curves up, consider aquifer influx.</p>
                </li>
                <li className="pl-2">
                  <span className="font-semibold text-[#BFFF00]">Model Fitting</span>
                  <p className="text-sm text-slate-400 mt-1 ml-6">Use the regression tool to solve for N (OOIP). Check the R² value for fit quality.</p>
                </li>
              </ol>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="aquifer" className="mt-6">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader><CardTitle className="text-white">Aquifer Influx Analysis</CardTitle></CardHeader>
            <CardContent>
              <p className="text-slate-300 mb-4">For reservoirs with water drive support:</p>
              <ol className="list-decimal list-inside space-y-4 text-slate-300">
                <li className="pl-2">
                  <span className="font-semibold text-[#BFFF00]">Select Model</span>
                  <p className="text-sm text-slate-400 mt-1 ml-6">Choose between Van Everdingen-Hurst (unsteady state) or Fetkovich (pseudo-steady state) models.</p>
                </li>
                <li className="pl-2">
                  <span className="font-semibold text-[#BFFF00]">Estimate Parameters</span>
                  <p className="text-sm text-slate-400 mt-1 ml-6">Input aquifer geometry (radial/linear), radius, and permeability.</p>
                </li>
                <li className="pl-2">
                  <span className="font-semibold text-[#BFFF00]">History Match</span>
                  <p className="text-sm text-slate-400 mt-1 ml-6">Adjust aquifer strength (influx constant) until the pressure decline matches historical data.</p>
                </li>
              </ol>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="mt-6">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader><CardTitle className="text-white">Scenario Comparison</CardTitle></CardHeader>
            <CardContent>
              <p className="text-slate-300 mb-4">Evaluate uncertainty:</p>
              <ol className="list-decimal list-inside space-y-4 text-slate-300">
                <li className="pl-2">
                  <span className="font-semibold text-[#BFFF00]">Create Base Case</span>
                  <p className="text-sm text-slate-400 mt-1 ml-6">Establish your most likely model.</p>
                </li>
                <li className="pl-2">
                  <span className="font-semibold text-[#BFFF00]">Clone & Modify</span>
                  <p className="text-sm text-slate-400 mt-1 ml-6">Clone the base case. Modify a key uncertainty (e.g., Aquifer Size, Initial GOR).</p>
                </li>
                <li className="pl-2">
                  <span className="font-semibold text-[#BFFF00]">Compare</span>
                  <p className="text-sm text-slate-400 mt-1 ml-6">Use the 'Scenarios' tab to overlay production forecasts and EURs for all cases.</p>
                </li>
              </ol>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkflowsGuide;