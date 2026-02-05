import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, ChevronLeft, Check, BookOpen } from 'lucide-react';

const TUTORIAL_STEPS = [
    {
        title: "Welcome to Permian Analysis",
        content: "This sample dataset includes 10 realistic wells from the Midland and Delaware basins. This tutorial will guide you through the key features available with this data.",
        image: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    },
    {
        title: "Well Selection & Production",
        content: "Use the 'Wells' tab on the left to navigate between different assets. The 'Decline Analysis' view shows historical production (Oil, Gas, Water) and operational events like shut-ins.",
        highlight: "base-plots"
    },
    {
        title: "Model Fitting",
        content: "Each well comes with pre-fitted Arps decline models. You can adjust the b-factor and decline rates in the 'Model Fitting' panel to optimize the fit.",
        highlight: "model-fitting"
    },
    {
        title: "Scenarios & Economics",
        content: "Explore different economic futures in the 'Scenarios' panel. Compare the 'Base Case' against 'High Price' or 'Uplift' scenarios to see impact on EUR and NPV.",
        highlight: "scenarios"
    },
    {
        title: "Advanced Analytics",
        content: "Check the 'Adv. Analytics' tab for cluster analysis, anomaly detection (identifying downtime), and sensitivity analysis charts.",
        highlight: "analytics"
    }
];

const SampleDataTutorial = ({ open, onOpenChange }) => {
    const [step, setStep] = useState(0);

    const handleNext = () => {
        if (step < TUTORIAL_STEPS.length - 1) setStep(step + 1);
        else onOpenChange(false);
    };

    const handlePrev = () => {
        if (step > 0) setStep(step - 1);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-2xl p-0 overflow-hidden">
                <div className="flex h-[400px]">
                    {/* Left Image/Graphic Area */}
                    <div className="w-1/3 bg-slate-950 relative overflow-hidden hidden md:block">
                        <div className="absolute inset-0 bg-blue-600/10 z-10"></div>
                        {TUTORIAL_STEPS[step].image && (
                            <img 
                                src={TUTORIAL_STEPS[step].image} 
                                alt="Tutorial" 
                                className="w-full h-full object-cover opacity-60"
                            />
                        )}
                        <div className="absolute bottom-4 left-4 z-20">
                            <Badge className="bg-blue-600 hover:bg-blue-700">
                                Step {step + 1}/{TUTORIAL_STEPS.length}
                            </Badge>
                        </div>
                    </div>

                    {/* Right Content Area */}
                    <div className="flex-1 p-6 flex flex-col">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-blue-400" />
                                {TUTORIAL_STEPS[step].title}
                            </DialogTitle>
                        </DialogHeader>
                        
                        <div className="flex-1 py-6">
                            <p className="text-slate-300 leading-relaxed">
                                {TUTORIAL_STEPS[step].content}
                            </p>
                            
                            {TUTORIAL_STEPS[step].highlight && (
                                <div className="mt-4 p-3 bg-slate-800/50 rounded border border-slate-700 text-xs text-slate-400">
                                    <span className="text-blue-400 font-semibold">Tip:</span> Look for the <span className="text-white font-medium">{TUTORIAL_STEPS[step].highlight}</span> section in the interface.
                                </div>
                            )}
                        </div>

                        <DialogFooter className="flex justify-between sm:justify-between items-center mt-auto">
                            <Button 
                                variant="ghost" 
                                onClick={handlePrev} 
                                disabled={step === 0}
                                className="text-slate-400 hover:text-white"
                            >
                                <ChevronLeft className="w-4 h-4 mr-1" /> Back
                            </Button>
                            <div className="flex gap-2">
                                <Button 
                                    variant="outline" 
                                    onClick={() => onOpenChange(false)}
                                    className="border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800"
                                >
                                    Skip
                                </Button>
                                <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700 text-white">
                                    {step === TUTORIAL_STEPS.length - 1 ? (
                                        <>Finish <Check className="w-4 h-4 ml-1" /></>
                                    ) : (
                                        <>Next <ChevronRight className="w-4 h-4 ml-1" /></>
                                    )}
                                </Button>
                            </div>
                        </DialogFooter>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default SampleDataTutorial;