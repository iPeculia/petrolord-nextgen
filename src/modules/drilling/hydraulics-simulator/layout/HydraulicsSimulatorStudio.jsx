import React from 'react';
import { HydraulicsSimulatorProvider } from '@/contexts/HydraulicsSimulatorContext';
import TopNavigationBar from './TopNavigationBar';
import LeftSidebar from './LeftSidebar';
import RightPanel from './RightPanel';
import MainContentArea from './MainContentArea';
import Footer from './Footer';

const HydraulicsSimulatorStudioContent = () => {
  return (
    <div className="flex flex-col h-screen w-screen bg-[#1a1a1a] text-slate-200 overflow-hidden font-sans">
      <TopNavigationBar />
      
      <div className="flex flex-1 overflow-hidden relative">
        <LeftSidebar />
        <MainContentArea />
        <RightPanel />
      </div>

      <Footer />
    </div>
  );
};

const HydraulicsSimulatorStudio = () => {
  return (
    <HydraulicsSimulatorProvider>
      <HydraulicsSimulatorStudioContent />
    </HydraulicsSimulatorProvider>
  );
};

export default HydraulicsSimulatorStudio;