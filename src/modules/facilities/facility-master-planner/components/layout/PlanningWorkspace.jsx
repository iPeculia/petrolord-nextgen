import React from 'react';
import { useFacilityMasterPlanner } from '../../context/FacilityMasterPlannerContext';
import FacilityLayoutVisualization from '../visualization/FacilityLayoutVisualization';
import ProductionScheduleForm from '../forms/ProductionScheduleForm';
import ProjectsList from '../lists/ProjectsList';
import FacilitiesList from '../lists/FacilitiesList';
import SmartGuidance from '../guidance/SmartGuidance';
import ProgressIndicator from '../guidance/ProgressIndicator';
import AnalysisResultsPanel from '../panels/AnalysisResultsPanel';
import EquipmentList from '../equipment/EquipmentList';
import HelpCenter from '../help/HelpCenter';
import SettingsPanel from '../settings/SettingsPanel';
import NotificationCenter from '../notifications/NotificationCenter';
import ScenarioComparisonTab from '../tabs/ScenarioComparisonTab';

const PlanningWorkspace = () => {
  const { 
    currentTab, 
    currentProject, 
    isHelpOpen, 
    setIsHelpOpen,
    isSettingsOpen,
    setIsSettingsOpen,
    isNotificationsOpen,
    setIsNotificationsOpen
  } = useFacilityMasterPlanner();

  const renderContent = () => {
    switch (currentTab) {
      case 'Overview':
        return currentProject ? <FacilityLayoutVisualization /> : (
            <div className="p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
                <SmartGuidance />
                <ProjectsList />
            </div>
        );
      case 'Process Units':
        // Reuse visualization for units tab for now, specific list view usually here
        return currentProject ? <FacilityLayoutVisualization /> : <div className="p-8 text-center text-slate-500">Select a project first</div>;
      case 'Equipment':
        return <div className="p-6"><EquipmentList /></div>;
      case 'Production Schedule':
        return <ProductionScheduleForm />;
      case 'Analysis':
        return <AnalysisResultsPanel />;
      case 'Scenario Comparison':
        return <ScenarioComparisonTab />;
      case 'Settings':
        // Inline settings view if tab selected, distinct from modal
        return (
            <div className="p-8 max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <ProjectsList />
                <FacilitiesList />
            </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4">
            <div className="p-4 bg-slate-800/30 rounded-full">
                 {/* Placeholder Icon */}
            </div>
            <div className="text-center">
              <h3 className="text-lg font-medium text-white mb-2">{currentTab}</h3>
              <p>This module is currently under development.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <main className="flex-1 relative flex flex-col bg-[#0f172a] overflow-hidden">
       {/* Global Modals */}
       <HelpCenter open={isHelpOpen} onOpenChange={setIsHelpOpen} />
       <SettingsPanel open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
       <NotificationCenter open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen} />

       {/* Workspace Header - Guidance & Progress */}
       {currentProject && currentTab !== 'Analysis' && currentTab !== 'Settings' && currentTab !== 'Scenario Comparison' && (
        <div className="px-6 py-4 flex items-center justify-between border-b border-slate-800 bg-[#131b2b] shrink-0 z-10 shadow-sm">
            <SmartGuidance />
            <div className="hidden lg:block ml-4">
                <ProgressIndicator />
            </div>
        </div>
       )}

       <div className="flex-1 relative overflow-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
         {renderContent()}
       </div>
    </main>
  );
};

export default PlanningWorkspace;