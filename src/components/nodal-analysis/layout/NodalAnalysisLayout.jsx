import React from 'react';
import { useNavigate } from 'react-router-dom';
import { NodalAnalysisProvider } from '@/context/nodal-analysis/NodalAnalysisContext';
import { Button } from '@/components/ui/button';
import NodalSidebar from './NodalSidebar';

// This layout is now simplified to be just a wrapper if needed, 
// or fully replaced by Studio logic.
// Keeping it simple for backward compatibility if used elsewhere.

const NodalAnalysisLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col">
       {/* 
         The actual layout structure is now handled more robustly in NodalAnalysisStudio 
         to support the fullscreen patterns properly.
         This file remains as a potential lightweight wrapper.
       */}
       {children}
    </div>
  );
};

export const NodalAnalysisWrapper = ({ children }) => (
    <NodalAnalysisProvider>
        <NodalAnalysisLayout>
            {children}
        </NodalAnalysisLayout>
    </NodalAnalysisProvider>
);

export default NodalAnalysisLayout;