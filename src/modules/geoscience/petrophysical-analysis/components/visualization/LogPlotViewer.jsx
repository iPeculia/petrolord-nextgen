import React from 'react';
import { LogViewerProvider } from '@/modules/geoscience/petrophysical-analysis/context/LogViewerContext';
import LogViewerPanel from './LogViewerPanel';

/**
 * LogPlotViewer - Wrapper Component
 * 
 * Initializes the Context Provider and renders the main Panel.
 * Replaces the previous placeholder.
 */
const LogPlotViewer = () => {
  return (
    <LogViewerProvider>
      <LogViewerPanel />
    </LogViewerProvider>
  );
};

export default LogPlotViewer;