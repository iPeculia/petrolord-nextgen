import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';

const InteractiveTutorial = () => {
  const [step, setStep] = useState(0);
  const steps = [
    { title: "Welcome", content: "This interactive guide will walk you through the core features of the module." },
    { title: "Navigation", content: "Use the top tabs to switch between Data, Analysis, and Reporting views." },
    { title: "Project Setup", content: "Start by defining your Reservoir Parameters in the 'Data & Tanks' tab." },
    { title: "Completion", content: "You are now ready to start your first analysis!" }
  ];

  return (
    <div className="max-w-xl mx-auto mt-10">
      <Card className="bg-slate-900 border-[#BFFF00]/50 border-2">
        <CardContent className="p-8 text-center space-y-6">
          <div className="text-sm text-[#BFFF00] font-bold tracking-widest uppercase">Tutorial • Step {step + 1} of {steps.length}</div>
          <h2 className="text-3xl font-bold text-white">{steps[step].title}</h2>
          <p className="text-lg text-slate-300">{steps[step].content}</p>
          
          <div className="flex justify-center gap-4 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setStep(Math.max(0, step - 1))} 
              disabled={step === 0}
              className="border-slate-700 text-white hover:bg-slate-800"
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            
            {step < steps.length - 1 ? (
              <Button 
                onClick={() => setStep(step + 1)}
                className="bg-[#BFFF00] text-black hover:bg-[#BFFF00]/90"
              >
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button 
                className="bg-green-500 text-white hover:bg-green-600"
                onClick={() => setStep(0)}
              >
                Finish <Check className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InteractiveTutorial;