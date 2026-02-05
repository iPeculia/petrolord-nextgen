import React from 'react';
import { Helmet } from 'react-helmet';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../components/Layout/MainLayout';
import DataPanel from '../components/core/DataPanel';
import ResultsPanel from '../components/core/ResultsPanel';
import LogPlotViewer from '../components/visualization/LogPlotViewer';
import AnalyticsTab from '../components/analytics/AnalyticsTab';
import QCTab from '../components/qc/QCTab';
import SourcesTab from '../components/sources/SourcesTab';
import WorkflowsTab from '../components/workflows/WorkflowsTab';
import AIInsightsTab from '../components/ai/AIInsightsTab';
import Visualization3DTab from '../components/3d/Visualization3DTab';
import ReportingExportTab from '../components/reporting/ReportingExportTab';
import SecurityTab from '../components/security/SecurityTab';
import CollaborationPanel from '../components/collaboration/CollaborationPanel';
import PorosityModelingTab from '../components/porosity/PorosityModelingTab';
import { LogViewerProvider } from '../context/LogViewerContext';

const PetrophysicalAnalysisPage = () => {
  return (
    <>
      <Helmet>
        <title>Petrophysical Analysis | PetroLord</title>
        <meta name="description" content="Advanced petrophysical analysis and log interpretation." />
      </Helmet>
      
      <LogViewerProvider>
        <MainLayout
          leftSidebar={<DataPanel />}
          rightSidebar={<ResultsPanel />}
        >
          <Routes>
             <Route path="/" element={<Navigate to="setup" replace />} />
             <Route path="/setup" element={<LogPlotViewer />} />
             <Route path="/analytics" element={<AnalyticsTab />} />
             <Route path="/qc" element={<QCTab />} />
             <Route path="/sources" element={<SourcesTab />} />
             <Route path="/workflows" element={<WorkflowsTab />} />
             <Route path="/ai" element={<AIInsightsTab />} />
             <Route path="/3d" element={<Visualization3DTab />} />
             <Route path="/reporting" element={<ReportingExportTab />} />
             <Route path="/security" element={<SecurityTab />} />
             <Route path="/collaboration" element={<CollaborationPanel />} />
             <Route path="/porosity" element={<PorosityModelingTab />} />
             
             {/* Fallback */}
             <Route path="*" element={<Navigate to="setup" replace />} />
          </Routes>
        </MainLayout>
      </LogViewerProvider>
    </>
  );
};

export default PetrophysicalAnalysisPage;