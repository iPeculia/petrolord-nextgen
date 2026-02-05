import React, { useState, useMemo } from 'react';
import { useCorrelationPanelStore } from '@/store/correlationPanelStore';
import { useProject, useStratUnits, useCorrelationPanel } from '@/hooks/useWellLogCorrelation';
import { useTopEditing } from '@/hooks/useTopEditing';
import AnalysisPanel from './AnalysisPanel';
import { useCorrelationAnalysis } from '@/hooks/useCorrelationAnalysis';
import StratUnitManager from './StratUnitManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import TopEditingDialog from './TopEditingDialog';
import { Loader2, PlusCircle, Settings } from 'lucide-react';
import { getStratUnitColor } from '@/lib/colorUtils';
import WellSelectionDialog from './WellSelectionDialog';

const TopList = ({ wellboreId, projectId, panelId }) => {
  const { data: panelData } = useCorrelationPanel(panelId);
  const { data: stratUnits } = useStratUnits(projectId);
  const { isEditing, startEditingTop, deleteTop, startAddingTop } = useTopEditing(wellboreId);

  if (!wellboreId) {
      return <p className="text-slate-400 text-sm p-4 text-center">Select a well to manage its tops.</p>
  }
  
  const panelWell = panelData?.correlation_panel_wells?.find(pw => pw.wellbore_id === wellboreId);
  const tops = panelWell?.wellbores?.well_tops || [];

  const handleAddTop = () => {
    startAddingTop(wellboreId, 1000); 
  };

  return (
    <div className="space-y-2">
      <Button onClick={handleAddTop} className="w-full" variant="outline" size="sm">
        <PlusCircle className="w-4 h-4 mr-2"/> Add New Top
      </Button>
      {tops.length === 0 && <p className="text-slate-400 text-sm text-center pt-4">No tops found for this wellbore.</p>}
      {tops.sort((a,b) => a.depth_md - b.depth_md).map(top => {
        const unitColor = getStratUnitColor(top.strat_unit_id, stratUnits);
        return (
          <div key={top.id} className="flex items-center justify-between p-2 rounded-md bg-slate-800/70 text-sm">
            <div className="flex items-center gap-2">
               <div className="w-2 h-6 rounded" style={{ backgroundColor: unitColor }}></div>
               <div>
                  <p className="font-semibold">{top.top_name}</p>
                  <p className="text-xs text-slate-400">{top.depth_md}m</p>
               </div>
            </div>
            <div className="flex gap-1">
              <Button size="sm" variant="ghost" onClick={() => startEditingTop(top)} disabled={isEditing}>Edit</Button>
              <Button size="sm" variant="destructive" onClick={() => deleteTop(top.id)} disabled={isEditing}>Delete</Button>
            </div>
          </div>
        )
      })}
    </div>
  );
};


const PropertiesPanel = ({ isCollapsed, projectId, panelId }) => {
    const { selectedWellId, selectedTopId, fromTopId } = useCorrelationPanelStore();
    const { data: projectData } = useProject(projectId);
    const { data: stratUnits } = useStratUnits(projectId);
    const analysisHook = useCorrelationAnalysis(projectData);

    const { isEditing, editingTopData, editingWellId, editMode: topEditMode, cancelEditing, saveTop } = useTopEditing();
    const [isWellSelectionOpen, setIsWellSelectionOpen] = useState(false);
    
    const allProjectTops = useMemo(() => {
        return projectData?.wells.flatMap(w => w.wellbores.flatMap(wb => wb.well_tops)) || [];
    }, [projectData]);

    React.useEffect(() => {
        if (selectedTopId && fromTopId) {
            const findTop = (id) => allProjectTops.find(t => t.id === id);
            const toTop = findTop(selectedTopId);
            const fromTop = findTop(fromTopId);

            if (toTop && fromTop) {
                analysisHook.getQualityScore(fromTop, toTop);
            }
        } else {
             analysisHook.setSelectedAnalysis(null);
        }
    }, [selectedTopId, fromTopId, allProjectTops, analysisHook]);

  return (
    <>
    <div className={`properties-panel correlation-sidebar border-l flex flex-col transition-all duration-300 ${isCollapsed ? 'collapsed' : 'expanded'}`}>
      <div className="flex items-center justify-between p-2 border-b border-slate-700 flex-shrink-0 overflow-hidden">
        <h2 className="text-lg font-semibold whitespace-nowrap">Properties</h2>
      </div>
      <div className="flex-grow overflow-y-auto">
        <Tabs defaultValue="analysis" className="w-full">
            <TabsList className="w-full grid grid-cols-4">
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
                <TabsTrigger value="tops">Tops</TabsTrigger>
                <TabsTrigger value="strat-units">Strats</TabsTrigger>
                <TabsTrigger value="panel">Panel</TabsTrigger>
            </TabsList>
            <TabsContent value="analysis" className="p-4">
                <AnalysisPanel analysisHook={analysisHook} />
            </TabsContent>
            <TabsContent value="tops" className="p-4">
                 <h3 className="font-semibold mb-2">Well Tops</h3>
                 {!projectData ? <Loader2 className="animate-spin" /> : 
                  <TopList wellboreId={selectedWellId} projectId={projectId} panelId={panelId}/>
                 }
            </TabsContent>
            <TabsContent value="strat-units" className="p-4">
                <StratUnitManager projectId={projectId} />
            </TabsContent>
            <TabsContent value="panel" className="p-4">
                <h3 className="font-semibold mb-2">Panel Settings</h3>
                <Button onClick={() => setIsWellSelectionOpen(true)} className="w-full" variant="outline">
                    <Settings className="w-4 h-4 mr-2" /> Add / Remove Wells
                </Button>
            </TabsContent>
        </Tabs>
      </div>
    </div>
    
    <TopEditingDialog
      key={editingTopData?.id || 'add-new'}
      isOpen={isEditing && (topEditMode === 'add' || topEditMode === 'edit')}
      onClose={cancelEditing}
      onSave={saveTop}
      topData={editingTopData}
      wellId={editingWellId}
      stratUnits={stratUnits || []}
      editMode={topEditMode}
    />
    <WellSelectionDialog 
      isOpen={isWellSelectionOpen}
      onClose={() => setIsWellSelectionOpen(false)}
      projectId={projectId}
      panelId={panelId}
    />
    </>
  );
};

export default PropertiesPanel;