import React, { useEffect } from 'react';
import { useApplicationLayout } from '@/contexts/ApplicationLayoutContext';
import TopNavigationBar from '../components/TopNavigationBar';
import LeftSidebar from '../components/LeftSidebar';
import RightPanel from '../components/RightPanel';
import MainContentArea from '../components/MainContentArea';
import { RiskAnalysisProvider } from '@/context/RiskAnalysisContext';

const StudioContent = () => {
  const layoutContext = useApplicationLayout();
  // Safe access to setFullscreenApp with fallback
  const setFullscreenApp = layoutContext?.setFullscreenApp || (() => {});

  useEffect(() => {
    // Enable fullscreen mode (hides default dashboard sidebar/header)
    setFullscreenApp(true);
    return () => setFullscreenApp(false);
  }, [setFullscreenApp]);

  return (
    <div className="flex flex-col h-screen w-full bg-[#1a1a1a] text-slate-100 overflow-hidden font-sans">
      <TopNavigationBar />
      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar />
        <MainContentArea />
        <RightPanel />
      </div>
    </div>
  );
};

const RiskAnalysisStudio = () => {
  return (
    <RiskAnalysisProvider>
      <StudioContent />
    </RiskAnalysisProvider>
  );
};

export default RiskAnalysisStudio;