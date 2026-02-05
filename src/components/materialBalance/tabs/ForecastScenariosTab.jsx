import React, { useState } from 'react';
import { useMaterialBalance } from '@/hooks/useMaterialBalance';
import ForecastingPanel from '../ForecastingPanel';
import { AlertCircle } from 'lucide-react';

const ForecastScenariosTab = () => {
    const { productionHistory } = useMaterialBalance();
    const hasData = productionHistory?.length > 0;

    if (!hasData) {
        return (
             <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-4">
                <div className="bg-slate-900 p-6 rounded-full">
                    <AlertCircle className="w-12 h-12 text-slate-500" />
                </div>
                <h3 className="text-xl font-medium text-white">No Production History</h3>
                <p className="text-slate-400 max-w-md">
                    Forecasting requires historical production data to initialize decline curves.
                </p>
             </div>
        );
    }

    return (
        <div className="h-full flex flex-col space-y-4">
             <div className="flex justify-between items-center px-2">
                 <div>
                    <h2 className="text-lg font-bold text-white">Production Forecasting & Scenarios</h2>
                    <p className="text-xs text-slate-400">Generate future production profiles and estimate reserves.</p>
                 </div>
             </div>

             <div className="flex-1 overflow-hidden relative rounded-lg border border-slate-800 bg-slate-950/50">
                 <ForecastingPanel />
             </div>
        </div>
    );
};

export default ForecastScenariosTab;