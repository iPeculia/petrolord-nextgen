import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ModelBuilder from './ModelBuilder';
import ModelAnalysis from './ModelAnalysis';
import ModelValidation from './ModelValidation';
import ModelLibrary from './ModelLibrary';
import ModelComparison from './ModelComparison';
import ModelExport from './ModelExport';
import ErrorBoundary from '@/components/ErrorBoundary';
import { usePorosityStore } from '@/modules/geoscience/petrophysical-analysis/store/porosityStore';
import { useGlobalDataStore } from '@/store/globalDataStore';

const PorosityModelingTab = () => {
    const [activeTab, setActiveTab] = useState('analysis');
    const { models } = usePorosityStore();
    const { activeWell } = useGlobalDataStore();

    // Ensure store is ready
    const isReady = models !== undefined && activeWell !== undefined;

    if (!isReady) {
         return <div className="p-8 text-center text-slate-500">Initializing Modeling Engine...</div>;
    }

    return (
        <div className="h-full flex flex-col bg-[#0F172A] text-slate-200 p-4 overflow-hidden">
             <div className="mb-4 flex items-center justify-between shrink-0">
                <div>
                    <h2 className="text-xl font-semibold text-white mb-1">Porosity Modeling</h2>
                    <p className="text-sm text-slate-400">Advanced porosity estimation using probabilistic and regression models.</p>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
                <TabsList className="bg-slate-900 border-slate-800 w-full justify-start shrink-0 h-12 mb-4 p-1">
                    <TabsTrigger value="analysis" className="data-[state=active]:bg-slate-800 data-[state=active]:text-[#BFFF00]">Analysis & Viewer</TabsTrigger>
                    <TabsTrigger value="builder" className="data-[state=active]:bg-slate-800 data-[state=active]:text-[#BFFF00]">Model Builder</TabsTrigger>
                    <TabsTrigger value="validation" className="data-[state=active]:bg-slate-800 data-[state=active]:text-[#BFFF00]">Validation</TabsTrigger>
                    <TabsTrigger value="library" className="data-[state=active]:bg-slate-800 data-[state=active]:text-[#BFFF00]">Model Library</TabsTrigger>
                    <TabsTrigger value="comparison" className="data-[state=active]:bg-slate-800 data-[state=active]:text-[#BFFF00]">Comparison</TabsTrigger>
                    <TabsTrigger value="export" className="data-[state=active]:bg-slate-800 data-[state=active]:text-[#BFFF00]">Export</TabsTrigger>
                </TabsList>

                <div className="flex-1 overflow-hidden relative">
                    <TabsContent value="analysis" className="h-full m-0 data-[state=inactive]:hidden">
                        <ErrorBoundary><ModelAnalysis /></ErrorBoundary>
                    </TabsContent>
                    <TabsContent value="builder" className="h-full m-0 data-[state=inactive]:hidden">
                        <ErrorBoundary><ModelBuilder /></ErrorBoundary>
                    </TabsContent>
                    <TabsContent value="validation" className="h-full m-0 data-[state=inactive]:hidden">
                        <ErrorBoundary><ModelValidation /></ErrorBoundary>
                    </TabsContent>
                    <TabsContent value="library" className="h-full m-0 data-[state=inactive]:hidden">
                        <ErrorBoundary><ModelLibrary /></ErrorBoundary>
                    </TabsContent>
                    <TabsContent value="comparison" className="h-full m-0 data-[state=inactive]:hidden">
                        <ErrorBoundary><ModelComparison /></ErrorBoundary>
                    </TabsContent>
                    <TabsContent value="export" className="h-full m-0 data-[state=inactive]:hidden">
                        <ErrorBoundary><ModelExport /></ErrorBoundary>
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
};

export default PorosityModelingTab;