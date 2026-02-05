import React, { useState, useEffect } from 'react';
import { useApplicationLayout } from '@/contexts/ApplicationLayoutContext';
import IRRHeader from './IRRHeader';
import IRRTabNavigation from '../components/IRRTabNavigation';
import IRRFooter from '../components/IRRFooter';
import ProjectsTab from '../tabs/ProjectsTab';
import CashflowsTab from '../tabs/CashflowsTab';
import AnalysisTab from '../tabs/AnalysisTab';
import ResultsTab from '../tabs/ResultsTab';
import SettingsTab from '../tabs/SettingsTab';
import { cn } from '@/lib/utils';

const IRRAnalysisStudio = () => {
  // Safe usage of layout context to prevent "t is not a function" errors
  const layoutContext = useApplicationLayout();
  const setFullscreenApp = layoutContext?.setFullscreenApp || (() => {});
  
  const [activeTab, setActiveTab] = useState('projects');

  useEffect(() => {
    // Enable fullscreen mode when this component mounts
    setFullscreenApp(true);
    return () => setFullscreenApp(false);
  }, [setFullscreenApp]);

  const renderContent = () => {
    switch (activeTab) {
      case 'projects': return <ProjectsTab />;
      case 'cashflows': return <CashflowsTab />;
      case 'analysis': return <AnalysisTab />;
      case 'results': return <ResultsTab />;
      case 'settings': return <SettingsTab />;
      default: return <ProjectsTab />;
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#0F172A] text-slate-100 overflow-hidden">
      {/* Header */}
      <IRRHeader />
      
      {/* Top Tab Navigation */}
      <IRRTabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto bg-[#020617] relative scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
         <div className="h-full w-full">
            {renderContent()}
         </div>
      </main>

      {/* Footer */}
      <IRRFooter />
    </div>
  );
};

export default IRRAnalysisStudio;