import React from 'react';
import { useCorrelationPanelStore } from '@/store/correlationPanelStore';

const StatusBar = () => {
  const { cursorDepth, zoomLevel, selectedWellId, selectedTopId, isDrawingLine } = useCorrelationPanelStore(state => ({
    cursorDepth: state.cursorDepth,
    zoomLevel: state.zoomLevel,
    selectedWellId: state.selectedWellId,
    selectedTopId: state.selectedTopId,
    isDrawingLine: state.isDrawingLine,
  }));

  const getStatusText = () => {
    if (isDrawingLine) return "Draw Line Mode: Select a target top";
    return "Ready";
  };

  return (
    <div className="correlation-statusbar flex items-center justify-between px-4 py-1 border-t text-xs text-slate-400">
      <div className="flex items-center space-x-4">
        <span>Zoom: {zoomLevel.toFixed(1)}x</span>
        <span>Depth: {cursorDepth ? `${cursorDepth.toFixed(2)}m` : 'N/A'}</span>
      </div>
       <div className="flex items-center space-x-4">
        <span>Selected Well: {selectedWellId ? selectedWellId.slice(0, 8) : 'None'}</span>
        <span>Selected Top: {selectedTopId ? selectedTopId.slice(0, 8) : 'None'}</span>
      </div>
      <div>
        <span>Status: {getStatusText()}</span>
      </div>
    </div>
  );
};

export default StatusBar;