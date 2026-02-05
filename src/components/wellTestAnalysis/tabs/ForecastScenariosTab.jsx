import React from 'react';
import ForecastPlot from '../plots/ForecastPlot';
import IPRPlot from '../plots/IPRPlot';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useWellTestAnalysisContext } from '@/contexts/WellTestAnalysisContext';

const ForecastScenariosTab = () => {
  const { state } = useWellTestAnalysisContext();
  const { matchingResults } = state;
  const isMatched = matchingResults.quality.rating !== 'Not Matched';

  return (
    <div className="flex flex-col h-full bg-slate-950 p-4">
        <Tabs defaultValue="forecast" className="flex-1 flex flex-col h-full">
            <div className="flex justify-between items-center mb-4 shrink-0">
                <TabsList className="bg-slate-900 border border-slate-800">
                    <TabsTrigger value="forecast">Production Forecast</TabsTrigger>
                    <TabsTrigger value="ipr">IPR Analysis</TabsTrigger>
                </TabsList>
                
                {!isMatched && (
                    <div className="text-yellow-500 text-sm flex items-center gap-2 bg-yellow-500/10 px-3 py-1 rounded border border-yellow-500/20">
                        <span>⚠️ Models must be matched before accurate forecasting</span>
                    </div>
                )}
            </div>
            
            <div className="flex-1 flex gap-4 min-h-0">
                {/* Main Visualization Area */}
                <div className="flex-1 min-w-0">
                    <TabsContent value="forecast" className="h-full mt-0">
                        <ForecastPlot />
                    </TabsContent>
                    
                    <TabsContent value="ipr" className="h-full mt-0">
                        <IPRPlot />
                    </TabsContent>
                </div>

                {/* Right Sidebar Controls (Placeholder for Scenario Builder) */}
                <Card className="w-80 bg-slate-900 border-slate-800 shrink-0 flex flex-col">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold text-white">Scenario Controls</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div className="text-xs text-slate-400">
                            Create hypothetical production scenarios based on the matched reservoir model.
                         </div>
                         {/* Future Scenario Builder Components go here */}
                         <div className="p-4 bg-slate-950 rounded border border-slate-800 border-dashed text-center text-xs text-slate-500">
                            Scenario Builder Active
                         </div>
                    </CardContent>
                </Card>
            </div>
        </Tabs>
    </div>
  );
};

export default ForecastScenariosTab;