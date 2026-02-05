import React from 'react';
import { Helmet } from 'react-helmet-async';
import { FacilityMasterPlannerProvider } from '@/modules/facilities/facility-master-planner/context/FacilityMasterPlannerContext';
import TopBar from '@/modules/facilities/facility-master-planner/components/layout/TopBar';
import TabNavigation from '@/modules/facilities/facility-master-planner/components/layout/TabNavigation';
import LeftSidebarCollapsible from '@/modules/facilities/facility-master-planner/components/layout/LeftSidebarCollapsible';
import RightPanelCollapsible from '@/modules/facilities/facility-master-planner/components/layout/RightPanelCollapsible';
import PlanningWorkspace from '@/modules/facilities/facility-master-planner/components/layout/PlanningWorkspace';

const FacilityMasterPlannerStudio = () => {
  return (
    <FacilityMasterPlannerProvider>
      <Helmet>
        <title>Facility Master Planner | Petrolord</title>
        <meta name="description" content="Strategic facility planning and optimization studio." />
      </Helmet>
      
      {/* 
        Main Application Container 
        Uses flex-col to stack TopBar/Tabs and Content Area.
        Content Area uses flex-row for Sidebars + Workspace.
      */}
      <div className="h-screen w-screen overflow-hidden bg-[#0f172a] text-slate-100 font-sans selection:bg-[#0066cc] selection:text-white flex flex-col">
        
        {/* Fixed Header Section */}
        <TopBar />
        <TabNavigation />

        {/* Main Flexible Content Area */}
        <div className="flex-1 flex overflow-hidden relative">
            
            {/* Left Sidebar - Collapsible with width transition */}
            <LeftSidebarCollapsible />
            
            {/* Center Workspace - Grows to fill available space */}
            <PlanningWorkspace />
            
            {/* Right Panel - Collapsible with width transition */}
            <RightPanelCollapsible />
            
        </div>
      </div>
    </FacilityMasterPlannerProvider>
  );
};

export default FacilityMasterPlannerStudio;