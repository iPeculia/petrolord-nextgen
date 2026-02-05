import React from 'react';
import { ZoomIn, ZoomOut, Move, Redo, Undo, Plus, Trash2 } from 'lucide-react';
import LineDrawingMode from './LineDrawingMode';
import { Button } from '@/components/ui/button';
import { useCorrelationPanelStore } from '@/store/correlationPanelStore';
import WellSelectionDialog from './WellSelectionDialog';
import { useUndoRedo } from '@/store/undoRedoStore';
import CurveTrackTemplate from './CurveTrackTemplate';

const Toolbar = ({ panelId, projectId }) => {
  const { setZoomLevel, setInteractionMode } = useCorrelationPanelStore();
  const { undo, redo, canUndo, canRedo } = useUndoRedo();
  
  return (
    <div className="correlation-toolbar flex items-center p-1 border-b">
      <Button variant="ghost" size="icon" onClick={() => setZoomLevel(z => z * 1.2)} title="Zoom In"><ZoomIn className="h-5 w-5" /></Button>
      <Button variant="ghost" size="icon" onClick={() => setZoomLevel(z => z / 1.2)} title="Zoom Out"><ZoomOut className="h-5 w-5" /></Button>
      <Button variant="ghost" size="icon" onClick={() => setInteractionMode('pan')} title="Pan Mode"><Move className="h-5 w-5" /></Button>
      
      <div className="mx-2 h-6 border-l border-slate-300 dark:border-slate-600"></div>

      <Button variant="ghost" size="icon" onClick={undo} disabled={!canUndo} title="Undo"><Undo className="h-5 w-5" /></Button>
      <Button variant="ghost" size="icon" onClick={redo} disabled={!canRedo} title="Redo"><Redo className="h-5 w-5" /></Button>

      <div className="mx-2 h-6 border-l border-slate-300 dark:border-slate-600"></div>

      <WellSelectionDialog panelId={panelId} projectId={projectId}>
        <Button variant="ghost" size="icon" title="Add Well to Panel">
          <Plus className="h-5 w-5" />
        </Button>
      </WellSelectionDialog>

      <CurveTrackTemplate />

      <div className="mx-2 h-6 border-l border-slate-300 dark:border-slate-600"></div>
      
      <LineDrawingMode />

      <Button variant="ghost" size="icon" title="Delete Mode - Not Implemented" disabled><Trash2 className="h-5 w-5" /></Button>
    </div>
  );
};

export default Toolbar;