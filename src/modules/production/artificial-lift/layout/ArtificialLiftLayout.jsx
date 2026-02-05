import React, { useState, useEffect } from 'react';
import ALDHeader from './ALDHeader';
import ALDLeftSidebar from '../components/ALDLeftSidebar';
import ALDRightSidebar from '../components/ALDRightSidebar';
import { useArtificialLift } from '../context/ArtificialLiftContext';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import ProgressIndicator from '../components/ProgressIndicator';
import SmartGuidance from '../components/SmartGuidance';
import QuickStatsPanel from '../components/QuickStatsPanel';

const ArtificialLiftLayout = ({ children, activeTab, onTabChange }) => {
  // Sidebar state
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Load sidebar preferences
  useEffect(() => {
    const savedLeft = localStorage.getItem('ald_left_sidebar_collapsed');
    const savedRight = localStorage.getItem('ald_right_sidebar_collapsed');
    if (savedLeft) setLeftSidebarCollapsed(JSON.parse(savedLeft));
    if (savedRight) setRightSidebarCollapsed(JSON.parse(savedRight));
  }, []);

  // Save sidebar preferences
  const toggleLeftSidebar = () => {
    const newState = !leftSidebarCollapsed;
    setLeftSidebarCollapsed(newState);
    localStorage.setItem('ald_left_sidebar_collapsed', JSON.stringify(newState));
  };

  const toggleRightSidebar = () => {
    const newState = !rightSidebarCollapsed;
    setRightSidebarCollapsed(newState);
    localStorage.setItem('ald_right_sidebar_collapsed', JSON.stringify(newState));
  };

  // Keyboard Shortcuts
  const { toast } = useToast();
  useEffect(() => {
    const handleKeyDown = (e) => {
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            toast({ title: "Configuration Saved", description: "Your current progress has been saved." });
        }
        if (e.ctrlKey && e.key === 'n') {
             e.preventDefault();
             onTabChange('wells');
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onTabChange, toast]);

  // Handle responsive check
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setLeftSidebarCollapsed(true);
        setRightSidebarCollapsed(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { currentWell } = useArtificialLift();

  return (
    <div className="flex flex-col h-screen w-screen bg-[#0F172A] overflow-hidden text-slate-200 font-sans selection:bg-blue-500/30">
      
      {/* Top Header with Tabs */}
      <ALDHeader activeTab={activeTab} onTabChange={onTabChange} />

      {/* Main Workspace Area */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Left Sidebar */}
        <ALDLeftSidebar 
          activeTab={activeTab} 
          onTabChange={onTabChange}
          isCollapsed={leftSidebarCollapsed}
          toggleCollapse={toggleLeftSidebar}
          isMobile={isMobile}
        />

        {/* Center Content */}
        <main className={cn(
          "flex-1 overflow-y-auto overflow-x-hidden bg-[#0F172A] transition-all duration-300 ease-in-out flex flex-col",
          // Add margins based on sidebar states if not absolute/overlay
        )}>
           {/* Progress Indicator Sticky Top */}
           <div className="sticky top-0 z-10 backdrop-blur-md bg-[#0F172A]/80 border-b border-slate-800">
              <ProgressIndicator />
           </div>

           <div className="flex-1 p-6 space-y-6 max-w-[1920px] mx-auto w-full">
              {/* Contextual Smart Guidance (Only show if not in design mode to save space) */}
              {activeTab !== 'design' && <SmartGuidance onAction={onTabChange} />}

              {/* Main Page Content */}
              <div className="animate-in fade-in duration-300 slide-in-from-bottom-2">
                {children}
              </div>
           </div>
        </main>

        {/* Right Sidebar */}
        <ALDRightSidebar 
          isCollapsed={rightSidebarCollapsed}
          toggleCollapse={toggleRightSidebar}
          onTabChange={onTabChange}
        />
      </div>
    </div>
  );
};

export default ArtificialLiftLayout;