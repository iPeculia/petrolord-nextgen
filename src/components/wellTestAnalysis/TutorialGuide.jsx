import React from 'react';
import { TUTORIAL_STEPS } from '@/data/wellTestAnalysis/tutorialWorkflows';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle2, Circle } from 'lucide-react';

const TutorialGuide = () => {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-2">Step-by-Step Tutorials</h3>
            <Accordion type="single" collapsible className="w-full">
                {TUTORIAL_STEPS.map((tutorial, idx) => (
                    <AccordionItem key={tutorial.id} value={tutorial.id} className="border-slate-800">
                        <AccordionTrigger className="text-slate-200 hover:text-blue-400 hover:no-underline">
                            <span className="flex items-center gap-2 text-sm">
                                <span className="bg-slate-800 w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono">
                                    {idx + 1}
                                </span>
                                {tutorial.title}
                            </span>
                        </AccordionTrigger>
                        <AccordionContent className="pl-9 pt-2">
                            <ul className="space-y-3 relative border-l border-slate-800 ml-1 pl-4">
                                {tutorial.steps.map((step, sIdx) => (
                                    <li key={sIdx} className="text-sm text-slate-400 relative">
                                        <div className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-slate-800 border border-slate-600" />
                                        {step}
                                    </li>
                                ))}
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
};

export default TutorialGuide;