import React from 'react';
import { useWellTestAnalysis } from '@/hooks/useWellTestAnalysis';
import DataImport from '../DataImport';
import ColumnMapper from '../ColumnMapper';
import TestSetupPanel from '../TestSetupPanel';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const StepIndicator = ({ currentStep }) => {
    const steps = ['upload', 'map', 'setup', 'complete'];
    const currentIndex = steps.indexOf(currentStep);

    return (
        <div className="flex items-center justify-center py-6 mb-6">
            {steps.map((step, idx) => {
                const isCompleted = steps.indexOf(step) < currentIndex || currentStep === 'complete';
                const isCurrent = step === currentStep;
                
                return (
                    <div key={step} className="flex items-center">
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                            isCompleted ? "bg-[#BFFF00] text-black" : isCurrent ? "bg-white text-black" : "bg-slate-800 text-slate-500"
                        )}>
                            {isCompleted ? <Check className="w-4 h-4" /> : idx + 1}
                        </div>
                        <span className={cn(
                            "ml-2 mr-6 text-sm font-medium capitalize",
                            isCurrent ? "text-white" : "text-slate-500"
                        )}>
                            {step}
                        </span>
                        {idx < steps.length - 1 && (
                            <div className="w-12 h-[1px] bg-slate-800 mr-6" />
                        )}
                    </div>
                );
            })}
        </div>
    );
};

const DataSetupTab = () => {
  const { state } = useWellTestAnalysis();
  const { importStep } = state;

  return (
    <div className="h-full flex flex-col bg-slate-950 overflow-auto">
       <div className="shrink-0 bg-slate-900 border-b border-slate-800">
           <StepIndicator currentStep={importStep} />
       </div>
       
       <div className="flex-1 p-4">
           {importStep === 'upload' && <DataImport />}
           {importStep === 'map' && <ColumnMapper />}
           {importStep === 'setup' && <TestSetupPanel />}
           
           {importStep === 'complete' && (
               <div className="flex flex-col items-center justify-center h-full text-center">
                   <div className="bg-[#BFFF00]/10 p-6 rounded-full mb-4">
                       <Check className="w-12 h-12 text-[#BFFF00]" />
                   </div>
                   <h2 className="text-2xl font-bold text-white mb-2">Data Ready</h2>
                   <p className="text-slate-400 max-w-md">
                       Your data has been imported, mapped, and validated successfully. 
                       You can now proceed to the diagnostics tab to begin your analysis.
                   </p>
               </div>
           )}
       </div>
    </div>
  );
};

export default DataSetupTab;