import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { helpData } from '@/data/volumetrics/helpData';

const HelpSystem = ({ open, onOpenChange }) => {
    const [activeTab, setActiveTab] = useState('quickstart');

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[800px] h-[600px] bg-slate-950 border-slate-800 text-slate-100 p-0 flex overflow-hidden">
                {/* Sidebar */}
                <div className="w-48 bg-slate-900 border-r border-slate-800 p-2 flex flex-col gap-1">
                    <div className="p-4 text-sm font-bold text-slate-400 uppercase tracking-wider">Documentation</div>
                    {helpData.tabs.map(tab => {
                        const Icon = tab.icon;
                        return (
                            <Button
                                key={tab.id}
                                variant="ghost"
                                onClick={() => setActiveTab(tab.id)}
                                className={`justify-start text-sm h-10 ${activeTab === tab.id ? 'bg-slate-800 text-[#BFFF00]' : 'text-slate-400'}`}
                            >
                                <Icon className="w-4 h-4 mr-2" /> {tab.label}
                            </Button>
                        );
                    })}
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col">
                    <DialogHeader className="p-6 border-b border-slate-800">
                        <DialogTitle>{helpData.tabs.find(t => t.id === activeTab)?.label}</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="flex-1 p-6">
                        {helpData.content[activeTab]}
                    </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default HelpSystem;