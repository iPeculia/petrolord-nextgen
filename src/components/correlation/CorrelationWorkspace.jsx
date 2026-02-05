import React, { useEffect, useState } from 'react';
import { useProject } from '@/hooks/useWellLogCorrelation';
import Toolbar from './Toolbar';
import WellListSidebar from './WellListSidebar';
import PropertiesPanel from './PropertiesPanel';
import StatusBar from './StatusBar';
import CorrelationPanel from './CorrelationPanel';
import { Loader2, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCorrelationPanelStore } from '@/store/correlationPanelStore';
import { useToast } from '@/components/ui/use-toast';
import { useGlobalDataStore } from '@/store/globalDataStore.js';


const CorrelationWorkspace = ({ projectId }) => {
  const { data: project, isLoading: projectLoading, isError: projectIsError, error: projectError } = useProject(projectId);
  const { 
    leftSidebarCollapsed, 
    toggleLeftSidebar, 
    rightSidebarCollapsed, 
    toggleRightSidebar
  } = useCorrelationPanelStore();
  const loadWells = useGlobalDataStore(state => state.loadWells);
  
  const [error, setError] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;
    
    const initializeWorkspace = async () => {
      if (!projectId) {
        if (isMounted) {
          setError("No Project ID provided.");
          setIsInitializing(false);
        }
        return;
      }
      
      if (isMounted) setIsInitializing(true);
      
      try {
        // Load all project-related static data once
        await loadWells();

      } catch (err) {
        console.error('Failed to initialize workspace:', err);
        if (isMounted) setError('Failed to load workspace data. Please try again.');
        toast({ title: "Error", description: err.message, variant: 'destructive' });
      } finally {
        if (isMounted) setIsInitializing(false);
      }
    };
    
    initializeWorkspace();

    return () => { isMounted = false; }
  }, [projectId, loadWells, toast]);
  

  if (isInitializing || projectLoading) {
    return <div className="flex items-center justify-center h-full"><Loader2 className="w-8 h-8 animate-spin" /> <span className="ml-2">Loading Workspace...</span></div>;
  }

  if (projectIsError) {
    return (
       <div className="flex items-center justify-center h-full text-center text-destructive bg-destructive/20 p-4">
         <div>
          <AlertTriangle className="w-12 h-12 mx-auto mb-4"/>
           <p className="text-lg font-semibold mb-2">Error Loading Project</p>
           <p className="text-sm mb-4">{projectError?.message || 'Could not load the required project data.'}</p>
           <Button onClick={() => window.location.reload()}>Reload Page</Button>
         </div>
       </div>
     );
  }

  if (error) {
     return (
       <div className="flex items-center justify-center h-full text-center text-destructive bg-destructive/20 p-4">
         <div>
           <AlertTriangle className="w-12 h-12 mx-auto mb-4"/>
           <p className="text-lg font-semibold mb-2">Workspace Error</p>
           <p className="text-sm mb-4">{error}</p>
           <Button onClick={() => window.location.reload()}>Reload Page</Button>
         </div>
       </div>
     );
  }
  
  if (!project) {
     return (
        <div className="flex items-center justify-center h-full text-center">
            <div>
                 <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" /> 
                 <p>Initializing Project...</p>
                 <p className="text-sm text-slate-400 mt-2">If this persists, the project ID might be invalid.</p>
            </div>
        </div>
     );
  }

  const panelId = project.id; // Using project ID as panel ID for simplicity now

  return (
    <div className="correlation-workspace flex flex-col h-full w-full">
      <Toolbar panelId={panelId} projectId={projectId} />
      <div className="flex-grow flex overflow-hidden relative">
        <WellListSidebar isCollapsed={leftSidebarCollapsed} projectId={projectId} />
        
        <main className="flex-grow relative bg-slate-900/50 flex transition-all duration-300">
           <Button
            variant="ghost"
            size="icon"
            onClick={toggleLeftSidebar}
            className="sidebar-toggle left-toggle"
            title={leftSidebarCollapsed ? "Expand Well List" : "Collapse Well List"}
          >
            {leftSidebarCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>

          <CorrelationPanel panelId={panelId} projectId={projectId}/>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleRightSidebar}
            className="sidebar-toggle right-toggle"
            title={rightSidebarCollapsed ? "Expand Properties" : "Collapse Properties"}
          >
            {rightSidebarCollapsed ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </Button>
        </main>

        <PropertiesPanel 
          isCollapsed={rightSidebarCollapsed}
          projectId={projectId}
          panelId={panelId}
        />
      </div>
      <StatusBar />
    </div>
  );
};

export default CorrelationWorkspace;