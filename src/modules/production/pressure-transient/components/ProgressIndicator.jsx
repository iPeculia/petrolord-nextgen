import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, Circle } from 'lucide-react';

const ProgressIndicator = ({ steps, currentStep, completedSteps }) => {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between relative">
        {/* Progress Bar Background */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-800 -z-10 rounded-full" />
        
        {/* Active Progress Bar */}
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 -z-10 rounded-full transition-all duration-500"
          style={{ width: `${(Math.max(0, currentStep) / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(index) || index < currentStep;
          const isCurrent = index === currentStep;
          
          return (
            <div key={step.id} className="flex flex-col items-center gap-2">
              <div 
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 border-2 bg-[#0F172A]",
                  isCompleted ? "border-blue-500 text-blue-500" :
                  isCurrent ? "border-blue-500 text-white bg-blue-600/20" :
                  "border-slate-700 text-slate-700"
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : isCurrent ? (
                  <span className="text-xs font-bold">{index + 1}</span>
                ) : (
                  <Circle className="w-5 h-5" />
                )}
              </div>
              <span className={cn(
                "text-xs font-medium whitespace-nowrap transition-colors",
                isCurrent ? "text-blue-400" : 
                isCompleted ? "text-slate-300" : "text-slate-600"
              )}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressIndicator;