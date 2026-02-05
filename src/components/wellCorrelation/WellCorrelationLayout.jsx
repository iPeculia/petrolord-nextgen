import React, { useState, useEffect } from 'react';
import WellListPanel from './WellListPanel';
import SettingsPanel from './SettingsPanel';
import ActivityLog from './ActivityLog';
import TabNavigation from './TabNavigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

const WellCorrelationLayout = ({ children, activeTab, onTabChange }) => {
    // State with localStorage persistence
    const [leftOpen, setLeftOpen] = useState(() => {
        try { return JSON.parse(localStorage.getItem('wc_leftOpen') ?? 'true'); } catch { return true; }
    });
    const [rightOpen, setRightOpen] = useState(() => {
        try { return JSON.parse(localStorage.getItem('wc_rightOpen') ?? 'true'); } catch { return true; }
    });
    const [bottomOpen, setBottomOpen] = useState(() => {
        try { return JSON.parse(localStorage.getItem('wc_bottomOpen') ?? 'true'); } catch { return true; }
    });

    // Persist state changes
    useEffect(() => localStorage.setItem('wc_leftOpen', JSON.stringify(leftOpen)), [leftOpen]);
    useEffect(() => localStorage.setItem('wc_rightOpen', JSON.stringify(rightOpen)), [rightOpen]);
    useEffect(() => localStorage.setItem('wc_bottomOpen', JSON.stringify(bottomOpen)), [bottomOpen]);

    return (
        <div className="flex flex-col h-full w-full bg-[#0F172A] text-slate-100 overflow-hidden relative">
            {/* Top Navigation Bar */}
            <TabNavigation value={activeTab} onValueChange={onTabChange} />

            <div className="flex-1 flex overflow-hidden relative">
                {/* Left Sidebar Container */}
                <div 
                    className={cn(
                        "border-r border-slate-800 bg-[#0F172A] shrink-0 sidebar-transition flex flex-col relative z-20",
                        leftOpen ? "w-72 translate-x-0" : "w-0"
                    )}
                >
                    <div className={cn("flex-1 overflow-hidden min-w-[18rem]", !leftOpen && "invisible")}>
                         <WellListPanel />
                    </div>
                    
                    {/* Left Toggle Button */}
                    <button
                        onClick={() => setLeftOpen(!leftOpen)}
                        className="absolute -right-3 top-1/2 -translate-y-1/2 z-50 h-8 w-6 rounded-r-md border-y border-r border-slate-700 bg-slate-800 hover:bg-slate-700 hover:text-[#CCFF00] text-slate-400 flex items-center justify-center cursor-pointer shadow-md transition-colors"
                        title={leftOpen ? "Collapse Sidebar" : "Expand Sidebar"}
                        style={{ right: '-24px' }} // Always push out
                    >
                        {leftOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
                    </button>
                </div>

                {/* Center Column */}
                <div className="flex-1 flex flex-col min-w-0 bg-[#0F172A] relative overflow-hidden z-10">
                    {/* Main Content */}
                    <div className="flex-1 overflow-hidden relative bg-[#0F172A]">
                        {children}
                    </div>

                    {/* Bottom Panel */}
                    <div 
                        className={cn(
                            "border-t border-slate-800 bg-[#0F172A] sidebar-transition flex flex-col relative z-20",
                            bottomOpen ? "h-48" : "h-9"
                        )}
                    >
                        {/* Bottom Header / Toggle */}
                        <div 
                            className="flex items-center justify-between px-3 py-1 bg-[#1E293B] border-b border-slate-800 shrink-0 h-9 cursor-pointer hover:bg-slate-800/80 transition-colors" 
                            onClick={() => setBottomOpen(!bottomOpen)}
                        >
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                <Activity size={14} className={bottomOpen ? "text-[#CCFF00]" : "text-slate-500"} />
                                System Activity
                            </div>
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-500 hover:text-white hover:bg-slate-700">
                                {bottomOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                            </Button>
                        </div>
                        
                        <div className="flex-1 overflow-hidden bg-[#0F172A]">
                            <ActivityLog />
                        </div>
                    </div>
                </div>

                {/* Right Sidebar Container */}
                <div 
                    className={cn(
                        "border-l border-slate-800 bg-[#0F172A] shrink-0 sidebar-transition flex flex-col relative z-20",
                        rightOpen ? "w-72 translate-x-0" : "w-0"
                    )}
                >
                     <div className={cn("flex-1 overflow-hidden min-w-[18rem]", !rightOpen && "invisible")}>
                        <SettingsPanel />
                    </div>

                    {/* Right Toggle Button */}
                    <button
                        onClick={() => setRightOpen(!rightOpen)}
                        className="absolute top-1/2 -translate-y-1/2 z-50 h-8 w-6 rounded-l-md border-y border-l border-slate-700 bg-slate-800 hover:bg-slate-700 hover:text-[#CCFF00] text-slate-400 flex items-center justify-center cursor-pointer shadow-md transition-colors"
                        title={rightOpen ? "Collapse Sidebar" : "Expand Sidebar"}
                        style={{ left: '-24px' }}
                    >
                        {rightOpen ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WellCorrelationLayout;