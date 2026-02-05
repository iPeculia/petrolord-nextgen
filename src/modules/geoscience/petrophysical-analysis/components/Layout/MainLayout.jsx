import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import EstimatorHeader from '../Header/EstimatorHeader';

const MainLayout = ({ children, leftSidebar, rightSidebar }) => {
  // Default to open to ensure visibility
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);

  return (
    <div className="flex flex-col h-screen bg-[#0F172A] text-slate-200 overflow-hidden w-full">
      <EstimatorHeader />
      
      <div className="flex flex-1 overflow-hidden relative w-full">
        {/* Left Sidebar */}
        <div 
            className="relative border-r border-slate-800 bg-slate-950 transition-all duration-300 ease-in-out flex flex-col z-20 shrink-0"
            style={{ width: leftOpen ? '20rem' : '0', minWidth: leftOpen ? '20rem' : '0' }}
        >
            <div className={`flex-1 overflow-hidden w-80 ${!leftOpen ? 'invisible opacity-0' : 'opacity-100'} transition-opacity duration-200`}>
                {leftSidebar}
            </div>
            
            {/* Left Toggle Button */}
            <button
                className="absolute -right-3 top-1/2 -translate-y-1/2 z-50 h-8 w-8 rounded-full border border-slate-700 bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 shadow-lg transition-all flex items-center justify-center focus:outline-none hover:scale-110 cursor-pointer"
                onClick={() => setLeftOpen(!leftOpen)}
                title={leftOpen ? "Collapse Sidebar" : "Expand Sidebar"}
                style={{ transform: 'translateX(50%) translateY(-50%)' }} // Center on border
            >
                {leftOpen ? 
                    <ChevronLeft className="h-4 w-4" /> : 
                    <ChevronRight className="h-4 w-4" />
                }
            </button>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden relative min-w-0 bg-[#0F172A] flex flex-col z-10">
            {children}
        </main>

        {/* Right Sidebar */}
        <div 
            className="relative border-l border-slate-800 bg-slate-950 transition-all duration-300 ease-in-out flex flex-col z-20 shrink-0"
             style={{ width: rightOpen ? '20rem' : '0', minWidth: rightOpen ? '20rem' : '0' }}
        >
             <div className={`flex-1 overflow-hidden w-80 ${!rightOpen ? 'invisible opacity-0' : 'opacity-100'} transition-opacity duration-200`}>
                {rightSidebar}
            </div>
            
            {/* Right Toggle Button */}
            <button
                className="absolute -left-3 top-1/2 -translate-y-1/2 z-50 h-8 w-8 rounded-full border border-slate-700 bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 shadow-lg transition-all flex items-center justify-center focus:outline-none hover:scale-110 cursor-pointer"
                onClick={() => setRightOpen(!rightOpen)}
                title={rightOpen ? "Collapse Sidebar" : "Expand Sidebar"}
                style={{ transform: 'translateX(-50%) translateY(-50%)' }} // Center on border
            >
                {rightOpen ? 
                    <ChevronRight className="h-4 w-4" /> : 
                    <ChevronLeft className="h-4 w-4" />
                }
            </button>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;