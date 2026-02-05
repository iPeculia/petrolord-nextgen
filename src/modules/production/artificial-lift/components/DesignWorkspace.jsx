import React from 'react';
import { useArtificialLift } from '../context/ArtificialLiftContext';
import LiftSystemSelector from './LiftSystemSelector';
import EquipmentCatalogBrowser from './EquipmentCatalogBrowser';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlayCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const DesignWorkspace = () => {
  const { currentWell, getReservoirProperties } = useArtificialLift();
  const reservoir = currentWell ? getReservoirProperties(currentWell.well_id) : null;

  if (!currentWell) {
     return <div className="text-center p-8 text-slate-500">Select a well to begin design.</div>;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-14rem)] gap-4">
        {/* Top Section: Context & System Selection */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 flex-none">
            {/* Well Summary Panel (Left) */}
            <Card className="bg-slate-800 border-slate-700 lg:col-span-1">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base text-white">Well Summary</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-3">
                    <div>
                        <span className="text-slate-500 block">Name</span>
                        <span className="text-slate-200 font-medium">{currentWell.name}</span>
                    </div>
                    <div>
                        <span className="text-slate-500 block">Location</span>
                        <span className="text-slate-200">{currentWell.location}</span>
                    </div>
                    <Separator className="bg-slate-700" />
                    <div className="grid grid-cols-2 gap-2">
                         <div>
                            <span className="text-slate-500 block text-xs">MD</span>
                            <span className="text-slate-200">{currentWell.depth_md} ft</span>
                        </div>
                        <div>
                            <span className="text-slate-500 block text-xs">TVD</span>
                            <span className="text-slate-200">{currentWell.depth_tvd} ft</span>
                        </div>
                    </div>
                    {reservoir && (
                         <div className="grid grid-cols-2 gap-2">
                            <div>
                                <span className="text-slate-500 block text-xs">Pressure</span>
                                <span className="text-slate-200">{reservoir.static_pressure} psi</span>
                            </div>
                            <div>
                                <span className="text-slate-500 block text-xs">Temp</span>
                                <span className="text-slate-200">{reservoir.temperature}°F</span>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Lift Selection (Center-Right) */}
            <div className="lg:col-span-3 space-y-4">
                <LiftSystemSelector />
            </div>
        </div>

        {/* Bottom Section: Equipment & Action */}
        <div className="flex-1 min-h-0 grid grid-cols-1 gap-4">
            <Card className="bg-slate-800 border-slate-700 flex flex-col overflow-hidden">
                <CardHeader className="pb-2 border-b border-slate-700 bg-slate-800 z-10">
                    <CardTitle className="text-base text-white">Equipment Selection</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-4">
                    <EquipmentCatalogBrowser />
                </CardContent>
                <div className="p-4 border-t border-slate-700 bg-slate-800">
                     <Button className="w-full bg-blue-600 hover:bg-blue-700 py-6 text-lg">
                        <PlayCircle className="w-6 h-6 mr-2" /> Run Design Simulation
                     </Button>
                </div>
            </Card>
        </div>
    </div>
  );
};

export default DesignWorkspace;