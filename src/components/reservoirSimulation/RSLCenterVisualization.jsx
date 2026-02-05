import React from 'react';
import { useReservoirSimulation } from '@/context/ReservoirSimulationContext.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MapView from './MapView.jsx';
import GeologicalSectionView from './GeologicalSectionView.jsx';
import ChartsView from './ChartsView.jsx'; 
import TimeControls from './TimeControls.jsx';
import { Map, Layers, BarChart3, Database } from 'lucide-react';

const RSLCenterVisualization = () => {
    const { state, dispatch } = useReservoirSimulation();
    const { simulationState } = state;
    const { viewMode } = simulationState;

    const handleViewChange = (value) => {
        dispatch({ type: 'SET_VIEW_MODE', payload: value });
    };

    return (
        <div className="h-full w-full bg-slate-950 flex flex-col overflow-hidden relative">
            <Tabs value={viewMode} onValueChange={handleViewChange} className="flex-1 flex flex-col min-h-0">
                <div className="border-b border-slate-800 bg-slate-900/50 px-4 py-2 flex items-center justify-between shrink-0">
                    <TabsList className="bg-slate-800 border border-slate-700">
                        <TabsTrigger value="map" className="data-[state=active]:bg-slate-700">
                            <Map className="w-4 h-4 mr-2" />
                            Map View
                        </TabsTrigger>
                        <TabsTrigger value="section" className="data-[state=active]:bg-slate-700">
                            <Layers className="w-4 h-4 mr-2" />
                            Section View
                        </TabsTrigger>
                        <TabsTrigger value="charts" className="data-[state=active]:bg-slate-700">
                            <BarChart3 className="w-4 h-4 mr-2" />
                            Charts
                        </TabsTrigger>
                        <TabsTrigger value="data" className="data-[state=active]:bg-slate-700">
                            <Database className="w-4 h-4 mr-2" />
                            Raw Data
                        </TabsTrigger>
                    </TabsList>
                </div>

                <div className="flex-1 overflow-hidden relative min-h-0">
                    <TabsContent value="map" className="h-full w-full m-0 p-0 border-0 absolute inset-0">
                        <MapView />
                    </TabsContent>
                    
                    <TabsContent value="section" className="h-full w-full m-0 p-0 border-0 absolute inset-0">
                        <GeologicalSectionView />
                    </TabsContent>
                    
                    <TabsContent value="charts" className="h-full w-full m-0 p-0 border-0 absolute inset-0 overflow-auto">
                        <div className="h-full w-full p-4">
                             <ChartsView />
                        </div>
                    </TabsContent>

                    <TabsContent value="data" className="h-full w-full m-0 p-0 border-0 absolute inset-0 flex items-center justify-center text-slate-500">
                        Data Table View (Placeholder)
                    </TabsContent>
                </div>
            </Tabs>

            {/* Bottom Time Controls - Always visible at bottom of Center Panel */}
            <TimeControls />
        </div>
    );
};

export default RSLCenterVisualization;