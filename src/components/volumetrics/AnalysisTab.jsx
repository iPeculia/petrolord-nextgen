import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SensitivityAnalysis from './SensitivityAnalysis';
import MonteCarloAnalysis from './MonteCarloAnalysis';

const AnalysisTab = () => {
    return (
        <div className="h-full flex flex-col bg-slate-950">
            <Tabs defaultValue="montecarlo" className="flex-1 flex flex-col">
                <div className="px-4 py-2 border-b border-slate-800 bg-slate-900/30">
                    <TabsList className="bg-slate-950 border border-slate-800">
                        <TabsTrigger value="montecarlo">Monte Carlo Simulation</TabsTrigger>
                        <TabsTrigger value="sensitivity">Sensitivity Analysis</TabsTrigger>
                        <TabsTrigger value="scenarios">Scenario Manager</TabsTrigger>
                        <TabsTrigger value="portfolio">Portfolio Analysis</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="montecarlo" className="flex-1 p-0 overflow-hidden">
                    <MonteCarloAnalysis />
                </TabsContent>
                
                <TabsContent value="sensitivity" className="flex-1 p-0 overflow-hidden">
                    <SensitivityAnalysis />
                </TabsContent>

                <TabsContent value="scenarios" className="flex-1 p-0 overflow-hidden flex items-center justify-center text-slate-500">
                    <div className="text-center">
                        <h3 className="text-lg font-medium">Scenario Manager</h3>
                        <p className="text-sm">Create, compare and manage multiple development scenarios.</p>
                        <p className="text-xs mt-2 text-[#BFFF00]">Coming in next update</p>
                    </div>
                </TabsContent>

                <TabsContent value="portfolio" className="flex-1 p-0 overflow-hidden flex items-center justify-center text-slate-500">
                    <div className="text-center">
                        <h3 className="text-lg font-medium">Portfolio Analysis</h3>
                        <p className="text-sm">Roll up multiple projects and analyze aggregate risk.</p>
                        <p className="text-xs mt-2 text-[#BFFF00]">Coming in next update</p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AnalysisTab;