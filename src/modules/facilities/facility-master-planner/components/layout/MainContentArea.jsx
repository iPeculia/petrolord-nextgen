import React from 'react';
import { useFacilityMasterPlanner } from '../../context/FacilityMasterPlannerContext';
import BreadcrumbNavigation from '../navigation/BreadcrumbNavigation';
import FacilityLayoutCanvas from '../visualization/FacilityLayoutCanvas';

// Placeholder components for other tabs
const PlaceholderTab = ({ title }) => (
    <div className="flex flex-col items-center justify-center h-full text-slate-500">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p>This module is under development.</p>
    </div>
);

const MainContentArea = () => {
  const { currentTab, isLeftSidebarOpen, isRightPanelOpen } = useFacilityMasterPlanner();

  // Dynamic margin calculation based on sidebar state
  const leftMargin = isLeftSidebarOpen ? 'ml-[240px]' : 'ml-0';
  const rightMargin = isRightPanelOpen ? 'mr-[300px]' : 'mr-0';

  const renderContent = () => {
    switch(currentTab) {
        case 'Overview': return <FacilityLayoutCanvas />;
        case 'Equipment': return <PlaceholderTab title="Equipment List" />;
        case 'Process Units': return <PlaceholderTab title="Process Units" />;
        case 'Production Schedule': return <PlaceholderTab title="Production Profiles" />;
        case 'Master Plan': return <PlaceholderTab title="Master Planning" />;
        case 'Analysis': return <PlaceholderTab title="Capacity & Risk Analysis" />;
        case 'Settings': return <PlaceholderTab title="Settings" />;
        default: return <FacilityLayoutCanvas />;
    }
  };

  return (
    <main 
        className={`bg-[#0f172a] min-h-[calc(100vh-60px)] mt-[60px] ${leftMargin} ${rightMargin} transition-all duration-300 flex flex-col`}
    >
      {/* Breadcrumbs Bar */}
      <div className="h-10 bg-[#1a1a1a] border-b border-[#333333] px-4 flex items-center sticky top-0 z-30">
        <BreadcrumbNavigation />
      </div>

      {/* Dynamic Content */}
      <div className="flex-1 relative">
        {renderContent()}
      </div>
    </main>
  );
};

export default MainContentArea;