import React from 'react';
import { NodalAnalysisProvider, useNodalAnalysis } from '@/context/nodal-analysis/NodalAnalysisContext';
import NodalHeader from './NodalHeader';
import NodalSidebar from './NodalSidebar';
import { Toaster } from '@/components/ui/toaster';
import { useApplicationLayout } from '@/contexts/ApplicationLayoutContext';
import { cn } from '@/lib/utils';

// StudioLayout manages the internal layout of the Nodal Analysis App
const StudioLayout = ({ children }) => {
  const { currentSession } = useNodalAnalysis();
  
  // If no session is active, we might want to hide the full sidebar or show a minimal version
  // For now, we'll keep it consistent and let NodalSidebar handle the empty state
  
  return (
    <div className="flex h-screen bg-[#0F172A] text-slate-100 overflow-hidden w-full">
      {/* 
          Collapsible Sidebar
          Only visible when a session is active, otherwise we might want a different layout
          But for consistency, we keep it. 
       */}
       {currentSession && <NodalSidebar />}

      <div className="flex flex-col flex-1 min-w-0 bg-[#0B1120] relative">
         {/* Dedicated Header */}
         <NodalHeader />

         {/* Main Workspace Area */}
         <main className="flex-1 overflow-hidden relative">
             <div className="h-full w-full overflow-y-auto scroll-smooth custom-scrollbar">
                {children}
             </div>
         </main>
      </div>
      <Toaster />
    </div>
  );
};

const NodalAnalysisStudio = ({ children }) => {
  return (
    <NodalAnalysisProvider>
      <StudioLayout>
        {children}
      </StudioLayout>
    </NodalAnalysisProvider>
  );
};

export default NodalAnalysisStudio;