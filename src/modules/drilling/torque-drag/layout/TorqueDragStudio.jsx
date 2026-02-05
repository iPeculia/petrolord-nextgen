import React from 'react';
import TopNavigationBar from '../components/TopNavigationBar';
import LeftSidebar from '../components/LeftSidebar';
import MainContentArea from '../components/MainContentArea';
import RightPanel from '../components/RightPanel';
import Footer from '../components/Footer';
import { useTorqueDrag } from '@/contexts/TorqueDragContext';

const TorqueDragStudio = () => {
  const { rightPanelCollapsed, toggleRightPanel } = useTorqueDrag();

  return (
    <div className="h-screen w-screen bg-[#1a1a1a] text-slate-200 flex flex-col overflow-hidden font-sans">
      <TopNavigationBar />
      
      <div className="flex-1 flex overflow-hidden">
        <LeftSidebar />
        
        <div className="flex-1 flex flex-col min-w-0">
          <MainContentArea />
        </div>
        
        <RightPanel />
        
        {/* Toggle handle for right panel if collapsed - simplified into topbar or internal panel logic usually, 
            but adding a small absolute handle is a nice touch if desired. 
            For now, relying on the header toggle in RightPanel or TopNav actions.
        */}
        {rightPanelCollapsed && (
            <div 
                className="w-4 bg-slate-800 hover:bg-slate-700 cursor-pointer flex items-center justify-center border-l border-slate-700"
                onClick={toggleRightPanel}
                title="Expand Details"
            >
                <span className="text-slate-400 text-xs rotate-90 whitespace-nowrap">DETAILS</span>
            </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default TorqueDragStudio;