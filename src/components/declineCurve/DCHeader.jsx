import React, { useState } from 'react';
import { ArrowLeft, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useDeclineCurve } from '@/context/DeclineCurveContext';
import SampleDataTutorial from './SampleDataTutorial';

const DCHeader = () => {
    const navigate = useNavigate();
    const { currentProject } = useDeclineCurve();
    const [tutorialOpen, setTutorialOpen] = useState(false);

    return (
        <header className="h-14 border-b border-slate-800 bg-[#0B1120] flex items-center justify-between px-4 shrink-0 z-50">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')} className="text-slate-400 hover:text-white">
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-sm font-bold text-white leading-none">Decline Curve Analysis</h1>
                    <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-2">
                        Geoscience Module 
                        <span className="text-slate-700">/</span>
                        <span className="text-blue-400">{currentProject?.name || "No Project Loaded"}</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2">
                 <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-slate-400 hover:text-[#BFFF00] text-xs"
                    onClick={() => setTutorialOpen(true)}
                >
                    <HelpCircle className="w-4 h-4 mr-1.5" /> Tutorial
                </Button>
            </div>

            <SampleDataTutorial open={tutorialOpen} onOpenChange={setTutorialOpen} />
        </header>
    );
};

export default DCHeader;