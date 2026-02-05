import React, { useState } from 'react';
import { useTorqueDrag } from '@/contexts/TorqueDragContext';
import ProjectForm from './forms/ProjectForm';
import WellForm from './forms/WellForm';
import TrajectoryForm from './forms/TrajectoryForm';
import TubularComponentForm from './forms/TubularComponentForm';
import DrillStringForm from './forms/DrillStringForm';
import DrillingFluidForm from './forms/DrillingFluidForm';
import FrictionCoefficientForm from './forms/FrictionCoefficientForm';
import ProgressIndicator from './ProgressIndicator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertCircle } from 'lucide-react';

const SetupWorkspace = () => {
  const { current_project, setCurrentTab } = useTorqueDrag();
  const [activeStep, setActiveStep] = useState('project');

  // If no project is selected, force project step
  // In a real app we might redirect or show a different empty state
  
  return (
    <div className="flex flex-col h-full gap-4">
       <div className="flex-none">
            <ProgressIndicator />
       </div>

       <div className="flex-1 flex gap-4 min-h-0">
           {/* Left Navigation / Steps */}
           <div className="w-64 flex-none bg-slate-900 border border-slate-800 rounded-lg p-2">
               <div className="space-y-1">
                   {[
                       { id: 'project', label: '1. Project Setup' },
                       { id: 'well', label: '2. Well Header' },
                       { id: 'trajectory', label: '3. Trajectory' },
                       { id: 'components', label: '4. Components' },
                       { id: 'string', label: '5. Drill String' },
                       { id: 'fluid', label: '6. Drilling Fluid' },
                       { id: 'friction', label: '7. Friction Factors' }
                   ].map((step) => (
                       <button
                           key={step.id}
                           onClick={() => setActiveStep(step.id)}
                           className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                               activeStep === step.id 
                               ? 'bg-blue-600 text-white' 
                               : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                           }`}
                       >
                           {step.label}
                       </button>
                   ))}
               </div>

               <div className="mt-8 px-2">
                    <div className="bg-slate-800/50 rounded p-3 border border-slate-700">
                        <div className="flex items-center gap-2 mb-2 text-yellow-500">
                            <AlertCircle className="h-4 w-4" />
                            <span className="text-xs font-bold uppercase">Ready?</span>
                        </div>
                        <p className="text-xs text-slate-400 mb-3">
                            Once setup is complete, proceed to the Analysis tab to run simulations.
                        </p>
                        <button 
                            onClick={() => setCurrentTab('Analysis')}
                            className="w-full bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs py-1.5 rounded transition-colors"
                        >
                            Go to Analysis
                        </button>
                    </div>
               </div>
           </div>

           {/* Main Form Area */}
           <div className="flex-1 min-w-0 bg-[#0f172a] rounded-lg overflow-hidden flex flex-col">
               <ScrollArea className="flex-1">
                   <div className="p-1 max-w-4xl mx-auto w-full">
                       {activeStep === 'project' && <ProjectForm onSuccess={() => setActiveStep('well')} />}
                       {activeStep === 'well' && <WellForm onSuccess={() => setActiveStep('trajectory')} />}
                       {activeStep === 'trajectory' && <TrajectoryForm />}
                       {activeStep === 'components' && <TubularComponentForm />}
                       {activeStep === 'string' && <DrillStringForm />}
                       {activeStep === 'fluid' && <DrillingFluidForm />}
                       {activeStep === 'friction' && <FrictionCoefficientForm />}
                   </div>
               </ScrollArea>
           </div>
       </div>
    </div>
  );
};

export default SetupWorkspace;