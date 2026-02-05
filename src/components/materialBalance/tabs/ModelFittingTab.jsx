import React, { useState } from 'react';
import { useMaterialBalance } from '@/hooks/useMaterialBalance';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { AlertCircle } from 'lucide-react';

// Components
import ModelFittingPanel from '../ModelFittingPanel'; 
import WaterInfluxPanel from '../WaterInfluxPanel';

const ModelFittingTab = () => {
    const { productionHistory, pressureData } = useMaterialBalance();
    const [fittingMode, setFittingMode] = useState('regression');

    const hasData = productionHistory?.length > 0 && pressureData?.length > 0;

    if (!hasData) {
        return (
             <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-4">
                <div className="bg-slate-900 p-6 rounded-full">
                    <AlertCircle className="w-12 h-12 text-slate-500" />
                </div>
                <h3 className="text-xl font-medium text-white">Insufficient Data</h3>
                <p className="text-slate-400 max-w-md">
                    Model fitting requires both production history and pressure data. 
                    Please return to the <strong>Data & Tank Setup</strong> tab to import or enter your reservoir data.
                </p>
             </div>
        );
    }

    return (
        <div className="h-full flex flex-col space-y-4">
             <div className="flex justify-between items-center px-2 shrink-0">
                 <div>
                    <h2 className="text-lg font-bold text-white">Advanced Model Fitting</h2>
                    <p className="text-xs text-slate-400">Estimate OOIP/OGIP and aquifer parameters.</p>
                 </div>
                 
                 <Tabs value={fittingMode} onValueChange={setFittingMode} className="w-[400px]">
                    <TabsList className="grid w-full grid-cols-2 bg-slate-900 border-slate-800">
                        <TabsTrigger value="regression" className="data-[state=active]:bg-slate-800 data-[state=active]:text-[#BFFF00]">
                            Regression Analysis
                        </TabsTrigger>
                        <TabsTrigger value="water_influx" className="data-[state=active]:bg-slate-800 data-[state=active]:text-[#BFFF00]">
                             Water Influx Models
                        </TabsTrigger>
                    </TabsList>
                 </Tabs>
             </div>

             <div className="flex-1 overflow-hidden relative rounded-lg border border-slate-800 bg-slate-950/50">
                {fittingMode === 'regression' && (
                    <div className="h-full overflow-y-auto">
                        <ModelFittingPanel />
                    </div>
                )}
                {fittingMode === 'water_influx' && (
                    <div className="h-full overflow-y-auto">
                        <WaterInfluxPanel />
                    </div>
                )}
             </div>
        </div>
    );
};

export default ModelFittingTab;