import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ResidualPlot from './ResidualPlot';

const ModelFittingResults = ({ results }) => {
  const { parameters, statistics, residuals, modelType } = results;

  // Formatter
  const fmtNum = (n) => n ? n.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '-';
  const fmtVol = (n) => n ? (n/1e6).toFixed(2) + ' MM' : '-';

  return (
    <div className="space-y-4 h-full flex flex-col">
       {/* Top Metrics Cards */}
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           <Card className="bg-slate-900 border-slate-800 p-4">
               <div className="text-slate-400 text-xs uppercase">Est. Volume (N/G)</div>
               <div className="text-2xl font-bold text-lime-400">
                   {modelType === 'p_z_gas' ? fmtVol(parameters.G) + 'scf' : fmtVol(parameters.N) + 'stb'}
               </div>
           </Card>
           <Card className="bg-slate-900 border-slate-800 p-4">
               <div className="text-slate-400 text-xs uppercase">R-Squared</div>
               <div className="text-2xl font-bold text-blue-400">{statistics.r2.toFixed(4)}</div>
           </Card>
           <Card className="bg-slate-900 border-slate-800 p-4">
               <div className="text-slate-400 text-xs uppercase">RMSE</div>
               <div className="text-2xl font-bold text-slate-200">{statistics.rmse.toFixed(3)}</div>
           </Card>
           <Card className="bg-slate-900 border-slate-800 p-4">
               <div className="text-slate-400 text-xs uppercase">Secondary Param</div>
               <div className="text-2xl font-bold text-slate-200">
                   {parameters.m ? `m=${parameters.m}` : parameters.C ? `C=${parameters.C.toFixed(1)}` : '-'}
               </div>
           </Card>
       </div>

       {/* Detailed Plots */}
       <Card className="flex-1 bg-slate-900/50 border-slate-800 flex flex-col">
           <CardHeader className="py-2 border-b border-slate-800">
               <Tabs defaultValue="residuals" className="w-full">
                   <div className="flex justify-between items-center">
                       <CardTitle className="text-base">Diagnostics</CardTitle>
                       <TabsList>
                           <TabsTrigger value="residuals">Residuals</TabsTrigger>
                           <TabsTrigger value="history_match">History Match</TabsTrigger>
                       </TabsList>
                   </div>
                   
                   <div className="mt-4 h-[400px]">
                       <TabsContent value="residuals" className="h-full mt-0">
                           <ResidualPlot data={residuals} />
                       </TabsContent>
                       <TabsContent value="history_match" className="h-full mt-0 flex items-center justify-center text-slate-500">
                           History match plot placeholder (F_obs vs F_calc)
                       </TabsContent>
                   </div>
               </Tabs>
           </CardHeader>
       </Card>
    </div>
  );
};

export default ModelFittingResults;