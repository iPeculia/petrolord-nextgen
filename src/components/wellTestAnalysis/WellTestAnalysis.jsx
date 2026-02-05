import React, { useState, useEffect } from 'react';
import { useWellTestAnalysisContext } from '@/contexts/WellTestAnalysisContext';
import TopBanner from './TopBanner';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import CenterPlotArea from './CenterPlotArea';
import WTATabNavigation from './WTATabNavigation';
import CalculationLog from './CalculationLog';
import BottomPanel from './BottomPanel';
import HelpSystem from './HelpSystem';
import SettingsPanel from './SettingsPanel';
import WelcomeModal from './WelcomeModal';

const WellTestAnalysis = () => {
  const { state, dispatch } = useWellTestAnalysisContext();
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
        // Ctrl+I to jump to Import
        if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
            e.preventDefault();
            dispatch({ type: 'SET_ACTIVE_TAB', payload: 'data-setup' });
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch]);

  const handleTabChange = (tabId) => {
      dispatch({ type: 'SET_ACTIVE_TAB', payload: tabId });
  };

  return (
    <div className="flex flex-col h-screen bg-[#0F172A] text-slate-200 overflow-hidden">
      <TopBanner onOpenSettings={() => setShowSettings(true)} onOpenHelp={() => setShowHelp(true)} />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: Project Management */}
        <LeftSidebar 
            projects={state.projects} 
            onNewProject={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: 'data-setup' })} 
        />
        
        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 bg-slate-950 border-l border-r border-slate-800 relative">
             {/* Navigation Tabs */}
             <div className="shrink-0 z-10">
                <WTATabNavigation activeTab={state.activeTab} onTabChange={handleTabChange} />
             </div>

             {/* Dynamic Content (Plots, Forms, Reports) */}
             <div className="flex-1 overflow-hidden relative">
                <CenterPlotArea />
             </div>

             {/* Bottom Panel: System Logs & Console */}
             <BottomPanel className="h-32 shrink-0">
                <CalculationLog logs={state.logs} />
             </BottomPanel>
        </main>
        
        {/* Right Sidebar: Properties & Models */}
        <RightSidebar />
      </div>

      {/* Modals & Overlays */}
      <HelpSystem isOpen={showHelp} onOpenChange={setShowHelp} />
      <SettingsPanel isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <WelcomeModal />
    </div>
  );
};

export default WellTestAnalysis;