import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const StepWizard = ({ currentStep, steps, onStepClick }) => {
  return (
    <div className="flex items-center space-x-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
      {steps.map((step, index) => (
        <div 
          key={step.id} 
          className={`flex items-center cursor-pointer group ${index <= currentStep ? 'opacity-100' : 'opacity-50'} transition-opacity`}
          onClick={() => onStepClick(index)}
        >
          <div className={`
            w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all shadow-sm
            ${index === currentStep ? 'bg-blue-600 text-white ring-4 ring-blue-500/20' : 
              index < currentStep ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-300 group-hover:bg-slate-600'}
          `}>
            {index < currentStep ? <CheckCircle2 className="w-5 h-5" /> : index + 1}
          </div>
          <span className={`ml-2 text-sm font-medium whitespace-nowrap ${index === currentStep ? 'text-white' : 'text-slate-400'}`}>
            {step.title}
          </span>
          {index < steps.length - 1 && (
            <div className="w-8 md:w-16 h-0.5 mx-2 bg-slate-700" />
          )}
        </div>
      ))}
    </div>
  );
};

export default StepWizard;