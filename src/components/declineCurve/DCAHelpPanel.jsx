import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Book, PlayCircle, HelpCircle, ExternalLink } from 'lucide-react';

const DCAHelpPanel = () => {
    return (
        <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 flex flex-col gap-4">
                <Card className="bg-slate-900 border-slate-800 flex-1">
                    <CardHeader className="py-3 px-4 border-b border-slate-800">
                        <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                            <Book className="w-4 h-4 text-blue-400" /> User Guide
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <ScrollArea className="h-[500px] p-4">
                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="item-1">
                                    <AccordionTrigger className="text-slate-200">Getting Started</AccordionTrigger>
                                    <AccordionContent className="text-slate-400 text-sm space-y-2">
                                        <p>1. <strong>Select a Well:</strong> Use the well selector in the top left to choose a well.</p>
                                        <p>2. <strong>Import Data:</strong> If no data exists, use the "Import Data" button to upload a CSV with Date, Oil Rate, etc.</p>
                                        <p>3. <strong>Fit Model:</strong> Go to the "Model Fitting" panel, choose a model type (e.g. Hyperbolic), and click "Fit Model".</p>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-2">
                                    <AccordionTrigger className="text-slate-200">Decline Models Explanation</AccordionTrigger>
                                    <AccordionContent className="text-slate-400 text-sm space-y-2">
                                        <p><strong>Exponential (b=0):</strong> Constant percentage decline. Used for late-life wells or conservative estimates.</p>
                                        <p><strong>Hyperbolic (0 &lt; b &lt; 1):</strong> Most common for unconventionals. Decline rate decreases over time.</p>
                                        <p><strong>Harmonic (b=1):</strong> Theoretical maximum decline curve, often seen in gravity drainage.</p>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-3">
                                    <AccordionTrigger className="text-slate-200">Advanced Analytics</AccordionTrigger>
                                    <AccordionContent className="text-slate-400 text-sm space-y-2">
                                        <p>Use the <strong>Advanced Analytics</strong> tab to run probabilistic simulations.</p>
                                        <ul className="list-disc list-inside ml-2">
                                            <li><strong>Monte Carlo:</strong> Runs 1000+ iterations varying qi, Di, and b to estimate P10/P50/P90 reserves.</li>
                                            <li><strong>Sensitivity:</strong> Shows how changing one parameter (like b-factor) impacts EUR.</li>
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>

            <div className="flex flex-col gap-4">
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="py-3 px-4 border-b border-slate-800">
                        <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                            <PlayCircle className="w-4 h-4 text-emerald-400" /> Video Tutorials
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                        {[
                            "Introduction to DCA",
                            "Importing Production Data",
                            "Type Curve Matching",
                            "Exporting Reports"
                        ].map((title, i) => (
                            <div key={i} className="flex items-center gap-3 p-2 rounded hover:bg-slate-800 cursor-pointer group">
                                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                                    <PlayCircle className="w-4 h-4 text-slate-400 group-hover:text-white" />
                                </div>
                                <span className="text-sm text-slate-300">{title}</span>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="py-3 px-4 border-b border-slate-800">
                        <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                            <HelpCircle className="w-4 h-4 text-amber-400" /> Support
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 text-sm text-slate-400">
                        <p className="mb-4">Need help with a specific analysis or encountering an issue?</p>
                        <a href="#" className="flex items-center text-blue-400 hover:text-blue-300">
                            Contact Support Team <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DCAHelpPanel;