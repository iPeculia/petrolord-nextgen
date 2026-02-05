import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Waves, ArrowRight, BookOpen, HelpCircle, FileText } from 'lucide-react';
import SampleDataLoader from './SampleDataLoader';
import { useWellTestAnalysisContext } from '@/contexts/WellTestAnalysisContext';

const WelcomeModal = () => {
    const [open, setOpen] = useState(false);
    const [showSamples, setShowSamples] = useState(false);
    const [dontShowAgain, setDontShowAgain] = useState(false);
    const { dispatch } = useWellTestAnalysisContext();

    useEffect(() => {
        const hasSeen = localStorage.getItem('wta_welcome_seen');
        if (!hasSeen) {
            // Small delay to ensure smooth entry animation after app load
            const timer = setTimeout(() => setOpen(true), 500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        if (dontShowAgain) {
            localStorage.setItem('wta_welcome_seen', 'true');
        }
        setOpen(false);
    };

    const handleQuickStart = () => {
        // Here you might trigger a guided tour state in context
        // dispatch({ type: 'START_TOUR' }); 
        handleClose();
    };

    return (
        <Dialog open={open} onOpenChange={(val) => { if(!val) handleClose(); else setOpen(val); }}>
            <DialogContent className="max-w-3xl bg-slate-950 border-slate-800 text-white">
                {!showSamples ? (
                    <>
                        <DialogHeader className="space-y-4">
                            <div className="mx-auto bg-blue-500/10 p-4 rounded-full w-20 h-20 flex items-center justify-center border border-blue-500/20">
                                <Waves className="w-10 h-10 text-blue-400" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl text-center font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                                    Welcome to Well Test Analysis
                                </DialogTitle>
                                <DialogDescription className="text-center text-slate-400 mt-2 text-base">
                                    Next-generation pressure transient analysis (PTA) software for the modern energy enterprise.
                                </DialogDescription>
                            </div>
                        </DialogHeader>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6">
                            <Button 
                                variant="outline" 
                                className="h-auto py-4 flex flex-col gap-2 border-slate-800 bg-slate-900/50 hover:bg-slate-800 hover:border-blue-500/50"
                                onClick={handleQuickStart}
                            >
                                <BookOpen className="w-6 h-6 text-emerald-400" />
                                <span className="font-semibold text-white">Quick Guide</span>
                                <span className="text-xs text-slate-500 font-normal">Learn the basics in 2 mins</span>
                            </Button>
                            
                            <Button 
                                variant="outline" 
                                className="h-auto py-4 flex flex-col gap-2 border-slate-800 bg-slate-900/50 hover:bg-slate-800 hover:border-blue-500/50"
                                onClick={() => setShowSamples(true)}
                            >
                                <FileText className="w-6 h-6 text-blue-400" />
                                <span className="font-semibold text-white">Sample Data</span>
                                <span className="text-xs text-slate-500 font-normal">Explore with demo datasets</span>
                            </Button>

                            <Button 
                                variant="outline" 
                                className="h-auto py-4 flex flex-col gap-2 border-slate-800 bg-slate-900/50 hover:bg-slate-800 hover:border-blue-500/50"
                                onClick={handleClose}
                            >
                                <HelpCircle className="w-6 h-6 text-purple-400" />
                                <span className="font-semibold text-white">Help Center</span>
                                <span className="text-xs text-slate-500 font-normal">Documentation & Support</span>
                            </Button>
                        </div>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                             <div className="flex items-center space-x-2">
                                <Checkbox 
                                    id="dont-show" 
                                    checked={dontShowAgain}
                                    onCheckedChange={setDontShowAgain}
                                    className="border-slate-600 data-[state=checked]:bg-blue-600"
                                />
                                <Label htmlFor="dont-show" className="text-sm text-slate-400 cursor-pointer">Don't show this again</Label>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="ghost" onClick={handleClose} className="text-slate-400 hover:text-white">Skip</Button>
                                <Button onClick={() => setShowSamples(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                                    Load Data <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle>Select Sample Data</DialogTitle>
                            <DialogDescription>Choose a dataset to instantly populate the workspace.</DialogDescription>
                        </DialogHeader>
                        <SampleDataLoader onClose={handleClose} />
                        <DialogFooter className="mt-4">
                            <Button variant="ghost" onClick={() => setShowSamples(false)}>Back</Button>
                            <Button variant="outline" onClick={handleClose}>Close</Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default WelcomeModal;