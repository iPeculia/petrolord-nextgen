import React, { useState, useRef } from 'react';
import { useGlobalDataStore } from '@/store/globalDataStore.js';
import { Card } from '@/components/ui/card';
import LogPlotViewer from '@/modules/geoscience/petrophysical-analysis/components/visualization/LogPlotViewer.jsx';
import HistogramPlot from '@/modules/geoscience/petrophysical-analysis/components/charts/HistogramPlot.jsx';
import CrossPlot from '@/modules/geoscience/petrophysical-analysis/components/charts/CrossPlot.jsx';
import CollaborationPanel from '@/modules/geoscience/petrophysical-analysis/components/collaboration/CollaborationPanel.jsx';
import { Button } from '@/components/ui/button';
import { LineChart, BarChart, BoxSelect, FileImage, HelpCircle, MessageSquare, SidebarClose, SidebarOpen } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import html2canvas from 'html2canvas';
import { useToast } from '@/components/ui/use-toast';

const AnalysisWorkspace = () => {
  const { activeWell } = useGlobalDataStore();
  const { toast } = useToast();
  const [activeView, setActiveView] = useState('log'); // 'log', 'histogram', 'crossplot'
  const [showCollab, setShowCollab] = useState(false);
  const workspaceRef = useRef(null);

  const handleScreenshot = async () => {
      if (!workspaceRef.current) return;
      
      try {
          const canvas = await html2canvas(workspaceRef.current, {
              backgroundColor: '#0F172A', // Match dark theme explicitly to prevent white background
              scale: 2, // Higher quality
              logging: false,
              useCORS: true // Ensure cross-origin images are handled
          });
          
          const image = canvas.toDataURL("image/png");
          const link = document.createElement('a');
          link.href = image;
          link.download = `Analysis_Snapshot_${new Date().toISOString().replace(/[:.]/g, '-')}.png`;
          link.click();
          
          toast({ title: "Screenshot Saved", description: "Image downloaded successfully." });
      } catch (e) {
          console.error("Screenshot failed", e);
          toast({ title: "Error", description: "Failed to capture screenshot.", variant: "destructive" });
      }
  };

  return (
    <div className="flex h-full w-full bg-background rounded-lg overflow-hidden border border-border shadow-sm">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0">
          {/* Workspace Toolbar Header */}
          <div className="h-12 border-b border-border bg-card flex items-center justify-between px-4 shrink-0">
            <div className="flex items-center gap-4">
                <h2 className="font-semibold text-sm tracking-wide text-foreground">
                    {activeView === 'log' && 'Log Viewer'}
                    {activeView === 'histogram' && 'Histogram Analysis'}
                    {activeView === 'crossplot' && 'Crossplot Analysis'}
                </h2>
            </div>
            
            <div className="flex items-center space-x-1">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button 
                                variant={activeView === 'log' ? "secondary" : "ghost"} 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={() => setActiveView('log')}
                            >
                                <LineChart className="w-4 h-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Log View</p></TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button 
                                variant={activeView === 'histogram' ? "secondary" : "ghost"} 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={() => setActiveView('histogram')}
                            >
                                <BarChart className="w-4 h-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Histogram View</p></TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button 
                                variant={activeView === 'crossplot' ? "secondary" : "ghost"} 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={() => setActiveView('crossplot')}
                            >
                                <BoxSelect className="w-4 h-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Crossplot View</p></TooltipContent>
                    </Tooltip>
                    
                    <div className="w-px h-4 bg-border mx-1"></div>
                    
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleScreenshot}>
                                <FileImage className="w-4 h-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Export Screenshot</p></TooltipContent>
                    </Tooltip>

                    <div className="w-px h-4 bg-border mx-1"></div>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button 
                                variant={showCollab ? "secondary" : "ghost"} 
                                size="icon" 
                                className="h-8 w-8" 
                                onClick={() => setShowCollab(!showCollab)}
                            >
                                <MessageSquare className="w-4 h-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Toggle Collaboration</p></TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
          </div>

          {/* Main Visualization Area */}
          <div className="flex-1 relative bg-[#0F172A] overflow-hidden" ref={workspaceRef}>
            {activeWell ? (
               <div className="h-full w-full">
                   {activeView === 'log' && <LogPlotViewer />}
                   {activeView === 'histogram' && <HistogramPlot />}
                   {activeView === 'crossplot' && <CrossPlot />}
               </div>
            ) : (
               <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground p-8 text-center animate-in fade-in zoom-in-95 duration-500">
                 <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
                    <LineChart className="w-8 h-8 opacity-50" />
                 </div>
                 <h3 className="text-lg font-medium text-foreground mb-2">No Well Selected</h3>
                 <p className="max-w-xs text-sm">Select a well from the Data Input panel on the left to begin your analysis.</p>
               </div>
            )}
          </div>
      </div>

      {/* Right Collapsible Collaboration Panel */}
      {showCollab && (
          <div className="w-80 h-full border-l border-border bg-card animate-in slide-in-from-right-10 duration-200 flex flex-col">
              <CollaborationPanel />
          </div>
      )}
    </div>
  );
};

export default AnalysisWorkspace;