import React, { useEffect, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { MaterialBalanceProvider } from '@/contexts/MaterialBalanceContext';
import { HelpProvider, useHelp } from '@/contexts/HelpContext';
import { useMaterialBalance } from '@/hooks/useMaterialBalance';
import MBHeader from '@/components/materialBalance/MBHeader';
import MBTabNavigation from '@/components/materialBalance/MBTabNavigation';
import MBLeftSidebar from '@/components/materialBalance/MBLeftSidebar';
import MBRightSidebar from '@/components/materialBalance/MBRightSidebar';
import MBBottomPanel from '@/components/materialBalance/MBBottomPanel';
import SampleDataInitializer from '@/components/materialBalance/SampleDataInitializer';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Button } from '@/components/ui/button';
import { PanelLeftOpen, PanelRightOpen, PanelBottomOpen, HelpCircle, ArrowLeft } from 'lucide-react';

// Tabs
import DashboardTab from '@/components/materialBalance/tabs/DashboardTab';
import DataTankSetupTab from '@/components/materialBalance/tabs/DataTankSetupTab';
import DiagnosticsTab from '@/components/materialBalance/tabs/DiagnosticsTab';
import ModelFittingTab from '@/components/materialBalance/tabs/ModelFittingTab';
import ForecastScenariosTab from '@/components/materialBalance/tabs/ForecastScenariosTab';
import ExportLinksTab from '@/components/materialBalance/tabs/ExportLinksTab';
import RockPropertiesTab from '@/components/materialBalance/tabs/RockPropertiesTab';
import WellManagementTab from '@/components/materialBalance/tabs/WellManagementTab';
import GroupingTab from '@/components/materialBalance/tabs/GroupingTab';
import PressureAnalysisTab from '@/components/materialBalance/tabs/PressureAnalysisTab';

// Help & Training
import HelpGuide from '@/components/materialBalance/HelpGuide';
import TrainingDashboard from '@/components/materialBalance/training/TrainingDashboard';
import VideoTutorials from '@/components/materialBalance/training/VideoTutorials';
import InteractiveTutorial from '@/components/materialBalance/training/InteractiveTutorial';
import CaseStudies from '@/components/materialBalance/training/CaseStudies';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Help Components
import HelpModal from '@/components/materialBalance/HelpModal';
import HelpSidebar from '@/components/materialBalance/HelpSidebar';
import ContextualHelpWrapper from '@/components/materialBalance/ContextualHelpWrapper';

const TrainingTabContainer = () => {
  return (
    <div className="h-full flex flex-col gap-4">
      <Tabs defaultValue="dashboard" className="h-full flex flex-col">
         <div className="border-b border-slate-800 pb-2">
            <TabsList className="bg-slate-900 border-slate-800">
               <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
               <TabsTrigger value="videos">Videos</TabsTrigger>
               <TabsTrigger value="interactive">Interactive</TabsTrigger>
               <TabsTrigger value="cases">Case Studies</TabsTrigger>
            </TabsList>
         </div>
         <div className="flex-1 overflow-auto mt-2 pr-2">
            <TabsContent value="dashboard"><TrainingDashboard /></TabsContent>
            <TabsContent value="videos"><VideoTutorials /></TabsContent>
            <TabsContent value="interactive"><InteractiveTutorial /></TabsContent>
            <TabsContent value="cases"><CaseStudies /></TabsContent>
         </div>
      </Tabs>
    </div>
  );
};

const HelpToggle = () => {
  const { setIsSidebarOpen } = useHelp();
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={() => setIsSidebarOpen(true)}
      className="absolute top-14 right-8 z-30 h-8 w-8 p-0 bg-slate-900 border border-slate-700 rounded-md text-slate-400 hover:text-[#BFFF00] hover:border-[#BFFF00]/50"
      title="Open Help Assistant"
    >
       <HelpCircle className="h-4 w-4" />
    </Button>
  );
};

// Navigation Bar Component
const AppNavBar = () => {
  const navigate = useNavigate();
  const { currentProject } = useMaterialBalance();
  return (
    <div className="h-10 bg-slate-950 border-b border-slate-800 flex items-center px-4 shrink-0">
        <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/dashboard/modules/reservoir')} 
            className="text-slate-400 hover:text-white flex items-center gap-2 h-8 px-2"
        >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-xs font-medium">Back to Module</span>
        </Button>
        <div className="h-4 w-px bg-slate-800 mx-3" />
        <span className="text-xs font-semibold text-slate-200">Material Balance Pro: {currentProject?.name || 'New Project'}</span>
    </div>
  );
};

const MaterialBalanceContent = () => {
  const { projectId } = useParams();
  const { 
    dispatch, 
    activeTab,
    ui,
    toggleLeftSidebar,
    toggleRightSidebar,
    toggleBottomPanel,
    tanks
  } = useMaterialBalance(); 

  useEffect(() => {
    if (projectId) dispatch({ type: 'SET_PROJECT', payload: projectId });
  }, [projectId, dispatch]);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard': return <ContextualHelpWrapper content="Dashboard Overview" topicId="dashboard-kpis"><DashboardTab /></ContextualHelpWrapper>;
      case 'data-tank-setup': return <DataTankSetupTab />;
      case 'wells': return <WellManagementTab />;
      case 'rock-props': return <RockPropertiesTab />;
      case 'pressure-analysis': return <PressureAnalysisTab />;
      case 'diagnostics': return <DiagnosticsTab />;
      case 'analysis-aquifer': return <ModelFittingTab />;
      case 'model-fitting': return <ModelFittingTab />;
      case 'forecast': return <ForecastScenariosTab />;
      case 'forecast-scenarios': return <ForecastScenariosTab />;
      case 'grouping': return <GroupingTab />;
      case 'export': return <ExportLinksTab />;
      case 'export-links': return <ExportLinksTab />;
      case 'help': return <HelpGuide />;
      case 'training': return <TrainingTabContainer />;
      default: return <DashboardTab />;
    }
  };

  const isLeftOpen = ui?.leftSidebarOpen ?? true;
  const isRightOpen = ui?.rightSidebarOpen ?? true;
  const isBottomOpen = ui?.bottomPanelOpen ?? true;

  if (!tanks || tanks.length === 0) {
      return (
          <div className="h-screen bg-[#0F172A] text-white font-sans overflow-hidden flex flex-col">
             <AppNavBar />
             <MBHeader />
             <SampleDataInitializer />
          </div>
      );
  }

  return (
    <div className="flex flex-col h-screen bg-[#0F172A] text-white overflow-hidden font-sans relative">
      <Helmet>
        <title>Material Balance Analysis - PetroLord</title>
      </Helmet>
      
      <HelpModal />
      <HelpSidebar />
      <HelpToggle />

      <AppNavBar />
      <MBHeader />
      
      <div className="flex flex-1 overflow-hidden relative">
        <MBLeftSidebar />
        
        <div className="flex-1 flex flex-col min-w-0 bg-[#1E293B] relative z-0">
          {!isLeftOpen && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute top-14 left-0 z-20 h-8 w-6 p-0 bg-slate-900 border-r border-y border-slate-700 rounded-r-md text-slate-400 hover:text-white"
                onClick={toggleLeftSidebar}
              >
                  <PanelLeftOpen className="h-4 w-4" />
              </Button>
          )}

          {!isRightOpen && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute top-14 right-0 z-20 h-8 w-6 p-0 bg-slate-900 border-l border-y border-slate-700 rounded-l-md text-slate-400 hover:text-white"
                onClick={toggleRightSidebar}
              >
                  <PanelRightOpen className="h-4 w-4" />
              </Button>
          )}
          
          <MBTabNavigation activeTab={activeTab} setActiveTab={(val) => dispatch({ type: 'SET_ACTIVE_TAB', payload: val })} />
          
          <div className="flex-1 overflow-auto p-4 relative scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
             <ErrorBoundary>
                <Suspense fallback={<div className="flex items-center justify-center h-full text-slate-500">Loading tab...</div>}>
                    {renderActiveTab()}
                </Suspense>
             </ErrorBoundary>
          </div>
          
          <MBBottomPanel />
          
           {!isBottomOpen && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute bottom-0 right-4 z-20 h-6 w-8 p-0 bg-slate-900 border-x border-t border-slate-700 rounded-t-md text-slate-400 hover:text-white"
                onClick={toggleBottomPanel}
              >
                  <PanelBottomOpen className="h-4 w-4" />
              </Button>
          )}
        </div>
        
        <MBRightSidebar />
      </div>
    </div>
  );
};

const MaterialBalancePro = () => {
  return (
    <MaterialBalanceProvider>
      <HelpProvider>
         <ErrorBoundary>
            <MaterialBalanceContent />
         </ErrorBoundary>
      </HelpProvider>
    </MaterialBalanceProvider>
  );
};

export default MaterialBalancePro;