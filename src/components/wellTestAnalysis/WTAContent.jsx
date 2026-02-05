import React, { useEffect } from 'react';
import TopBanner from './TopBanner';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import CenterPlotArea from './CenterPlotArea';
import BottomPanel from './BottomPanel';
import WTATabNavigation from './WTATabNavigation';
import CalculationLog from './CalculationLog';
import { useWellTestAnalysis } from '@/hooks/useWellTestAnalysis';

const WTAContent = () => {
  const { 
    currentWell, 
    currentTest, 
    projects, 
    logs, 
    activeTab, 
    setActiveTab,
    loadSampleData
  } = useWellTestAnalysis();

  // Load sample data on mount for demo
  useEffect(() => {
     loadSampleData();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-[#0F172A] text-white overflow-hidden">
       {/* Top Banner */}
       <TopBanner currentWell={currentWell} currentTest={currentTest} />

       {/* Main Layout */}
       <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar */}
          <LeftSidebar projects={projects} />

          {/* Center Content Area */}
          <div className="flex-1 flex flex-col min-w-0">
             <WTATabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
             <CenterPlotArea />
             
             {/* Bottom Panel */}
             <BottomPanel>
                <CalculationLog logs={logs} />
             </BottomPanel>
          </div>

          {/* Right Sidebar */}
          <RightSidebar />
       </div>
    </div>
  );
};

export default WTAContent;