import React from 'react';
import { cn } from "@/lib/utils";
import { Check } from 'lucide-react';

export const Steps = ({ steps, currentStep }) => {
  return (
    <div className="relative flex justify-between w-full">
      <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -z-10 -translate-y-1/2" />
      <div 
        className="absolute top-1/2 left-0 h-0.5 bg-[#BFFF00] transition-all duration-300 -z-10 -translate-y-1/2"
        style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
      />
      
      {steps.map((step, index) => {
        const isCompleted = currentStep > index + 1;
        const isCurrent = currentStep === index + 1;
        
        return (
          <div key={index} className="flex flex-col items-center gap-2 bg-[#0F172A] px-2">
            <div 
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300",
                isCompleted 
                  ? "bg-[#BFFF00] border-[#BFFF00] text-black" 
                  : isCurrent 
                    ? "bg-[#0F172A] border-[#BFFF00] text-[#BFFF00]" 
                    : "bg-[#0F172A] border-slate-700 text-slate-500"
              )}
            >
              {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
            </div>
            <span 
              className={cn(
                "text-xs font-medium transition-colors duration-300",
                isCurrent || isCompleted ? "text-slate-200" : "text-slate-500"
              )}
            >
              {step.title}
            </span>
          </div>
        );
      })}
    </div>
  );
};