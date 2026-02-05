import React from 'react';
import { useRiskAnalysis } from '@/context/RiskAnalysisContext';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

const Breadcrumb = () => {
  const { currentProject, currentTab } = useRiskAnalysis();

  return (
    <div className="flex items-center gap-2 text-sm text-slate-500 mb-4 px-1">
      <div className="flex items-center gap-1 hover:text-slate-300 cursor-pointer transition-colors">
        <Home className="w-3.5 h-3.5" />
        <span>Projects</span>
      </div>
      
      {currentProject && (
        <>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-medium text-slate-400 hover:text-slate-200 cursor-pointer transition-colors">
            {currentProject.name}
          </span>
        </>
      )}
      
      {currentTab && (
        <>
           <ChevronRight className="w-3.5 h-3.5" />
           <span className="font-medium text-blue-400">
             {currentTab}
           </span>
        </>
      )}
    </div>
  );
};

export default Breadcrumb;