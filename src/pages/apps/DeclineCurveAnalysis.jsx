import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DeclineCurveProvider, useDeclineCurve } from '@/context/DeclineCurveContext';
import DCHeader from '@/components/declineCurve/DCHeader';
import ProjectManager from '@/components/declineCurve/ProjectManager';
import WellSelector from '@/components/declineCurve/WellSelector';
import ModelFittingPanel from '@/components/declineCurve/ModelFittingPanel';
import AnalysisParametersPanel from '@/components/declineCurve/AnalysisParametersPanel';
import ForecastPanel from '@/components/declineCurve/ForecastPanel';
import ScenarioManager from '@/components/declineCurve/ScenarioManager';
import GroupManager from '@/components/declineCurve/GroupManager';
import BasePlots from '@/components/declineCurve/BasePlots';
import TypeCurveChart from '@/components/declineCurve/TypeCurveChart';
import KPICards from '@/components/declineCurve/KPICards';
import DataImporter from '@/components/declineCurve/DataImporter';
import DashboardPanel from '@/components/declineCurve/DashboardPanel';
import ExportImportPanel from '@/components/declineCurve/ExportImportPanel';
import AdvancedAnalyticsPanel from '@/components/declineCurve/AdvancedAnalyticsPanel';
import DCASettingsPanel from '@/components/declineCurve/DCASettingsPanel';
import DCAHelpPanel from '@/components/declineCurve/DCAHelpPanel';
import BatchProcessing from '@/components/declineCurve/BatchProcessing';
import CollaborationPanel from '@/components/declineCurve/CollaborationPanel';
import AuditLogging from '@/components/declineCurve/AuditLogging';
import CustomModelBuilder from '@/components/declineCurve/CustomModelBuilder';
import OptimizationPanel from '@/components/declineCurve/OptimizationPanel';
import RiskAnalysis from '@/components/declineCurve/RiskAnalysis';
import AdvancedVisualizations from '@/components/declineCurve/AdvancedVisualizations';
import NotificationCenter from '@/components/declineCurve/NotificationCenter';
import TemplateManager from '@/components/declineCurve/TemplateManager';
import SearchPanel from '@/components/declineCurve/SearchPanel';
import DataQualityTools from '@/components/declineCurve/DataQualityTools';
import VersioningPanel from '@/components/declineCurve/VersioningPanel';
import SampleDataTutorial from '@/components/declineCurve/SampleDataTutorial';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft } from 'lucide-react';
import { loadPermianBasinSampleData } from '@/utils/permianBasinDataLoader';

const AppNavBar = () => {
  const navigate = useNavigate();
  const { currentProject } = useDeclineCurve(); // Assuming currentProject is available for title
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
        <span className="text-xs font-semibold text-slate-200">Decline Curve Analysis: {currentProject?.name || 'New Project'}</span>
    </div>
  );
};

const DCALayout = () => {
    const { currentWell, currentProject, loadProjectData } = useDeclineCurve();
    const [isImporterOpen, setIsImporterOpen] = useState(false);
    const [mainTab, setMainTab] = useState('dashboard'); // Start on Dashboard
    const [tutorialOpen, setTutorialOpen] = useState(false);

    // Effect to auto-open tutorial if sample data is loaded for the first time
    useEffect(() => {
        if (currentProject?.id === 'proj-permian-demo' && !localStorage.getItem('dca_tutorial_seen')) {
            setTutorialOpen(true);
            localStorage.setItem('dca_tutorial_seen', 'true');
        }
    }, [currentProject]);

    const showImportCTA = currentProject && currentWell && (!currentWell.data || currentWell.data.length === 0) && mainTab === 'decline';

    return (
        <div className="flex flex-col h-screen bg-[#020617] text-slate-100 overflow-hidden font-sans">
            <AppNavBar />
            <DCHeader />
            
            <div className="flex-1 flex overflow-hidden">
                {/* Left Sidebar */}
                {(mainTab === 'decline' || mainTab === 'typecurve') && (
                    <aside className="w-72 bg-[#0B1120] border-r border-slate-800 flex flex-col shrink-0 z-20">
                        <ScrollArea className="flex-1">
                            <div className="p-4 space-y-4">
                                <ProjectManager />
                                <Tabs defaultValue="wells" className="w-full">
                                    <TabsList className="w-full bg-slate-900 border border-slate-800 h-8">
                                        <TabsTrigger value="wells" className="text-xs h-6 flex-1">Wells</TabsTrigger>
                                        <TabsTrigger value="groups" className="text-xs h-6 flex-1">Groups</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="wells" className="mt-4 space-y-4">
                                        <WellSelector />
                                        <ModelFittingPanel /> 
                                        <AnalysisParametersPanel />
                                        <ForecastPanel />
                                    </TabsContent>
                                    <TabsContent value="groups" className="mt-4">
                                        <GroupManager />
                                    </TabsContent>
                                </Tabs>
                            </div>
                        </ScrollArea>
                    </aside>
                )}

                {/* Main Content Area */}
                <main className="flex-1 flex flex-col min-w-0 bg-[#020617] relative">
                    {/* Navigation Tabs */}
                    <div className="h-10 border-b border-slate-800 bg-[#0B1120] flex items-center px-4 gap-4 overflow-x-auto no-scrollbar">
                        <Tabs value={mainTab} onValueChange={setMainTab} className="h-full">
                            <TabsList className="bg-transparent border-0 p-0 h-full gap-2">
                                <TabsTrigger value="dashboard" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:text-blue-400 text-xs h-full px-2">
                                    Dashboard
                                </TabsTrigger>
                                <TabsTrigger value="decline" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:text-blue-400 text-xs h-full px-2">
                                    Decline Analysis
                                </TabsTrigger>
                                <TabsTrigger value="typecurve" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:text-blue-400 text-xs h-full px-2">
                                    Type Curves
                                </TabsTrigger>
                                <TabsTrigger value="analytics" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:text-blue-400 text-xs h-full px-2">
                                    Adv. Analytics
                                </TabsTrigger>
                                <TabsTrigger value="batch" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:text-blue-400 text-xs h-full px-2">
                                    Batch
                                </TabsTrigger>
                                <TabsTrigger value="collaboration" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:text-blue-400 text-xs h-full px-2">
                                    Team
                                </TabsTrigger>
                                <TabsTrigger value="enterprise" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:text-blue-400 text-xs h-full px-2">
                                    Enterprise
                                </TabsTrigger>
                                <TabsTrigger value="export" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:text-blue-400 text-xs h-full px-2">
                                    Data
                                </TabsTrigger>
                                <TabsTrigger value="settings" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:text-blue-400 text-xs h-full px-2">
                                    Settings
                                </TabsTrigger>
                                <TabsTrigger value="help" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:text-blue-400 text-xs h-full px-2">
                                    Help
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                        <div className="flex-1"></div>
                        {mainTab === 'decline' && <KPICards />} 
                    </div>

                    <div className="flex-1 p-4 relative overflow-hidden">
                         {showImportCTA && (
                            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px]">
                                <Card className="w-[400px] bg-slate-900 border-slate-800 p-8 flex flex-col items-center text-center">
                                    <h3 className="text-xl font-semibold text-white mb-2">No Production Data</h3>
                                    <p className="text-slate-400 mb-6">Import CSV data to begin decline curve analysis for this well.</p>
                                    <Button onClick={() => setIsImporterOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                                        Import Data
                                    </Button>
                                </Card>
                            </div>
                         )}

                         {/* Content Switching */}
                         {mainTab === 'dashboard' && <DashboardPanel />}
                         {mainTab === 'decline' && <BasePlots />}
                         {mainTab === 'typecurve' && <TypeCurveChart wellData={currentWell?.data} />}
                         {mainTab === 'analytics' && <AdvancedAnalyticsPanel />}
                         {mainTab === 'batch' && <BatchProcessing />}
                         {mainTab === 'collaboration' && <CollaborationPanel />}
                         {mainTab === 'export' && <ExportImportPanel />}
                         {mainTab === 'settings' && <DCASettingsPanel />}
                         {mainTab === 'help' && <DCAHelpPanel />}
                         
                         {/* Enterprise Tab with Extended Sub-Tabs */}
                         {mainTab === 'enterprise' && (
                             <Tabs defaultValue="audit" className="h-full flex flex-col">
                                <ScrollArea orientation="horizontal" className="w-full pb-2 shrink-0">
                                    <TabsList className="bg-slate-900 border border-slate-800 w-fit inline-flex h-9">
                                        <TabsTrigger value="audit" className="text-xs px-3 h-7">Audit Logs</TabsTrigger>
                                        <TabsTrigger value="custom" className="text-xs px-3 h-7">Custom Models</TabsTrigger>
                                        <TabsTrigger value="optimization" className="text-xs px-3 h-7">Optimization</TabsTrigger>
                                        <TabsTrigger value="risk" className="text-xs px-3 h-7">Risk Analysis</TabsTrigger>
                                        <TabsTrigger value="viz" className="text-xs px-3 h-7">3D Viz</TabsTrigger>
                                        <TabsTrigger value="notifications" className="text-xs px-3 h-7">Notifications</TabsTrigger>
                                        <TabsTrigger value="templates" className="text-xs px-3 h-7">Templates</TabsTrigger>
                                        <TabsTrigger value="search" className="text-xs px-3 h-7">Search</TabsTrigger>
                                        <TabsTrigger value="quality" className="text-xs px-3 h-7">Data Quality</TabsTrigger>
                                        <TabsTrigger value="versions" className="text-xs px-3 h-7">Versioning</TabsTrigger>
                                    </TabsList>
                                </ScrollArea>
                                
                                <div className="flex-1 mt-2 min-h-0 relative">
                                    <TabsContent value="audit" className="h-full m-0 absolute inset-0"><AuditLogging /></TabsContent>
                                    <TabsContent value="custom" className="h-full m-0 absolute inset-0"><CustomModelBuilder /></TabsContent>
                                    <TabsContent value="optimization" className="h-full m-0 absolute inset-0"><OptimizationPanel /></TabsContent>
                                    <TabsContent value="risk" className="h-full m-0 absolute inset-0"><RiskAnalysis /></TabsContent>
                                    <TabsContent value="viz" className="h-full m-0 absolute inset-0"><AdvancedVisualizations /></TabsContent>
                                    <TabsContent value="notifications" className="h-full m-0 absolute inset-0"><NotificationCenter /></TabsContent>
                                    <TabsContent value="templates" className="h-full m-0 absolute inset-0"><TemplateManager /></TabsContent>
                                    <TabsContent value="search" className="h-full m-0 absolute inset-0"><SearchPanel /></TabsContent>
                                    <TabsContent value="quality" className="h-full m-0 absolute inset-0"><DataQualityTools /></TabsContent>
                                    <TabsContent value="versions" className="h-full m-0 absolute inset-0"><VersioningPanel /></TabsContent>
                                </div>
                             </Tabs>
                         )}
                    </div>
                    
                    {/* Status Bar */}
                    <div className="h-8 border-t border-slate-800 bg-[#0B1120] px-4 flex items-center justify-between text-[10px] text-slate-500 shrink-0">
                        <div className="flex items-center gap-4">
                            <span>Status: Online</span>
                            {currentWell && <span>Active Well: {currentWell.name}</span>}
                            {currentProject?.id === 'proj-permian-demo' && (
                                <span className="text-blue-400 font-medium">Sample Data Loaded</span>
                            )}
                        </div>
                        <div className="flex gap-2 items-center">
                             <Badge variant="outline" className="border-emerald-500/20 text-emerald-500 text-[9px] h-4">
                                Phase 5: Complete
                             </Badge>
                             <span>DCA v5.0.0</span>
                        </div>
                    </div>
                </main>

                {/* Right Sidebar - Only visible in Decline mode */}
                {mainTab === 'decline' && (
                    <aside className="w-80 bg-[#0B1120] border-l border-slate-800 flex flex-col shrink-0 hidden xl:flex">
                         <ScenarioManager />
                    </aside>
                )}
            </div>

            <DataImporter isOpen={isImporterOpen} onClose={() => setIsImporterOpen(false)} />
            <SampleDataTutorial open={tutorialOpen} onOpenChange={setTutorialOpen} />
        </div>
    );
};

const DeclineCurveAnalysisPage = () => {
    return (
        <DeclineCurveProvider>
            <DCALayout />
        </DeclineCurveProvider>
    );
};

export default DeclineCurveAnalysisPage;