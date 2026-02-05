import React, { useEffect, useState, Suspense } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { VolumetricsProvider, useVolumetrics } from '@/contexts/VolumetricsContext';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import VolumetricsLayout from '@/components/volumetrics/VolumetricsLayout';
import LeftSidebar from '@/components/volumetrics/LeftSidebar';
import RightSidebar from '@/components/volumetrics/RightSidebar';
import BottomPanel from '@/components/volumetrics/BottomPanel';
import InputTab from '@/components/volumetrics/InputTab';
import ResultsTab from '@/components/volumetrics/ResultsTab';
import VisualizationTab from '@/components/volumetrics/VisualizationTab';
import ProjectManagerDialog from '@/components/volumetrics/ProjectManager.jsx';
import HelpSystem from '@/components/volumetrics/HelpSystem.jsx';
import Glossary from '@/components/volumetrics/Glossary.jsx';
import { ProjectManager } from '@/services/volumetrics/ProjectManager';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Save, PlusCircle, FolderOpen, HelpCircle, BookOpen } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import ErrorBoundary from '@/components/ErrorBoundary.jsx';

// Lazy load components properly
const AnalysisTab = React.lazy(() => import('@/components/volumetrics/AnalysisTab'));

const VolumetricsContent = () => {
    const navigate = useNavigate();
    const { state, actions } = useVolumetrics();
    const { user } = useAuth();
    const { toast } = useToast();
    
    // Dialog States
    const [projectDialog, setProjectDialog] = useState({ open: false, mode: 'open' });
    const [helpOpen, setHelpOpen] = useState(false);
    const [glossaryOpen, setGlossaryOpen] = useState(false);

    useEffect(() => {
        actions.addLog("Volumetrics Pro initialized.", "info");
    }, []);

    const handleSave = async () => {
        const success = await ProjectManager.saveProject(user, state);
        if (success) {
            toast({ title: "Project Saved", description: `${state.project.name} saved locally.` });
            actions.addLog("Project saved successfully.", "success");
        } else {
            toast({ title: "Save Failed", variant: "destructive" });
        }
    };

    return (
        <div className="flex flex-col h-screen bg-[#0F172A] text-slate-100">
             <Helmet>
                <title>Volumetrics Pro | Petrolord</title>
            </Helmet>

            {/* App Header */}
            <header className="h-14 flex items-center justify-between px-4 border-b border-slate-800 bg-slate-950 shrink-0">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard/modules/geoscience')} className="text-slate-400 hover:text-white">
                        <ArrowLeft size={20} />
                    </Button>
                    <div>
                         <h1 className="text-sm font-bold text-white">Volumetrics Pro</h1>
                         <div className="text-[10px] text-slate-500 flex items-center gap-2">
                            Geoscience Hub <span className="text-slate-700">/</span> {state.project.name}
                            <span className="px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-400 uppercase tracking-wider text-[9px]">{state.project.status}</span>
                         </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button size="sm" variant="outline" onClick={() => setProjectDialog({ open: true, mode: 'open' })} className="h-8 text-xs gap-2 border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800">
                                    <PlusCircle size={14} /> New / Open
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Manage Projects</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <div className="h-6 w-px bg-slate-800 mx-1"></div>
                    
                    <Button size="sm" onClick={handleSave} className="h-8 text-xs gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                        <Save size={14} /> Save
                    </Button>

                    <div className="h-6 w-px bg-slate-800 mx-1"></div>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button size="sm" variant="ghost" onClick={() => setGlossaryOpen(true)} className="h-8 w-8 p-0 text-slate-400 hover:text-[#BFFF00]">
                                    <BookOpen size={16} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Glossary</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button size="sm" variant="ghost" onClick={() => setHelpOpen(true)} className="h-8 w-8 p-0 text-slate-400 hover:text-[#BFFF00]">
                                    <HelpCircle size={16} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Help & Guides</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="flex-1 overflow-hidden">
                <VolumetricsLayout
                    leftPanel={<LeftSidebar />}
                    rightPanel={<RightSidebar />}
                    bottomPanel={<BottomPanel />}
                >
                    <div className="h-full flex flex-col">
                         <div className="px-4 pt-4 border-b border-slate-800 bg-slate-900/30">
                            <Tabs 
                                value={state.ui.activeTab} 
                                onValueChange={actions.setActiveTab} 
                                className="w-full"
                            >
                                <TabsList className="bg-slate-900 border border-slate-800">
                                    <TabsTrigger value="input">Input Data</TabsTrigger>
                                    <TabsTrigger value="results">Results</TabsTrigger>
                                    <TabsTrigger value="visualization">Visualization</TabsTrigger>
                                    <TabsTrigger value="analysis">Analysis & Risks</TabsTrigger>
                                </TabsList>
                            </Tabs>
                         </div>
                         
                         <div className="flex-1 overflow-hidden relative">
                            <ErrorBoundary>
                                {state.ui.activeTab === 'input' && <InputTab />}
                                {state.ui.activeTab === 'results' && <ResultsTab />}
                                {state.ui.activeTab === 'visualization' && <VisualizationTab />}
                                {state.ui.activeTab === 'analysis' && (
                                    <Suspense fallback={<div className="flex h-full items-center justify-center text-slate-500">Loading Analysis Module...</div>}>
                                        <AnalysisTab />
                                    </Suspense>
                                )}
                            </ErrorBoundary>
                         </div>
                    </div>
                </VolumetricsLayout>
            </div>

            {/* Dialogs */}
            <ProjectManagerDialog 
                open={projectDialog.open} 
                onOpenChange={(val) => setProjectDialog(prev => ({ ...prev, open: val }))}
                mode={projectDialog.mode} 
            />
            <HelpSystem open={helpOpen} onOpenChange={setHelpOpen} />
            <Glossary open={glossaryOpen} onOpenChange={setGlossaryOpen} />
        </div>
    );
};

const VolumetricsPro = () => (
    <VolumetricsProvider>
        <VolumetricsContent />
    </VolumetricsProvider>
);

export default VolumetricsPro;