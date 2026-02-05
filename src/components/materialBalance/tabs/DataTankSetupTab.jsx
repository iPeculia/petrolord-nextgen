import React from 'react';
import TankSetupForm from '@/components/materialBalance/TankSetupForm';
import MBADataImporter from '@/components/materialBalance/MBADataImporter';
import SampleDataManager from '@/components/materialBalance/SampleDataManager';
import PVTPlots from '@/components/materialBalance/PVTPlots';
import MBHistoryPlots from '@/components/materialBalance/MBHistoryPlots';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const DataTankSetupTab = () => {
    return (
        <div className="space-y-4 h-full flex flex-col">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-shrink-0">
                <div className="lg:col-span-4 space-y-4">
                    <TankSetupForm />
                    <SampleDataManager />
                </div>
                <div className="lg:col-span-8">
                     <MBADataImporter />
                </div>
            </div>
            
            <div className="flex-1 min-h-[400px]">
                <Tabs defaultValue="history" className="h-full flex flex-col">
                    <TabsList className="bg-slate-800 w-fit">
                        <TabsTrigger value="history">Production & Pressure History</TabsTrigger>
                        <TabsTrigger value="pvt">PVT Properties</TabsTrigger>
                    </TabsList>
                    <TabsContent value="history" className="flex-1 mt-2">
                        <MBHistoryPlots />
                    </TabsContent>
                    <TabsContent value="pvt" className="flex-1 mt-2">
                        <PVTPlots />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};
export default DataTankSetupTab;