import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqs = [
    { 
        q: "Why is my derivative curve noisy?", 
        a: "Derivative noise usually comes from infrequent data sampling or gauge resolution issues. Try increasing the 'Smoothing Window' in the Settings panel (L-spacing)." 
    },
    { 
        q: "How do I identify the radial flow regime?", 
        a: "Look for a horizontal (flat) line on the derivative curve in the log-log plot. The stabilization level of this line is inversely proportional to permeability." 
    },
    { 
        q: "What does a negative skin factor mean?", 
        a: "A negative skin indicates the well is stimulated (e.g., fractured or acidized), meaning the near-wellbore permeability is higher than the reservoir average." 
    },
    { 
        q: "Can I analyze gas wells?", 
        a: "Yes. Ensure you select 'Gas' in the Test Setup. The app uses pseudo-pressure conversions automatically for gas analysis." 
    },
    { 
        q: "My match quality is poor. What should I do?", 
        a: "1. Check your diagnostic plot for regime identification. 2. Manually adjust parameters to get close before running Auto-Match. 3. Verify your input data (rate history and fluid properties)." 
    }
];

const FAQ = ({ filter }) => {
    const filteredFaqs = faqs.filter(item => 
        item.q.toLowerCase().includes(filter.toLowerCase()) || 
        item.a.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Frequently Asked Questions</h3>
            <Accordion type="single" collapsible className="w-full">
                {filteredFaqs.map((item, idx) => (
                    <AccordionItem key={idx} value={`item-${idx}`} className="border-slate-800">
                        <AccordionTrigger className="text-slate-200 hover:text-blue-400">{item.q}</AccordionTrigger>
                        <AccordionContent className="text-slate-400">
                            {item.a}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
};

export default FAQ;