import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import MainLayout from './components/Layout/MainLayout';

// Existing Legacy Components
import WellManager from './components/core/WellManager';
import DataPanel from './components/core/DataPanel';
import ResultsPanel from './components/core/ResultsPanel';
import LogPlotViewer from './components/visualization/LogPlotViewer';
import VisualizationToolbar from './components/visualization/VisualizationToolbar';
import WellUploadPanel from './components/tools/WellUploadPanel';

// Temporary placeholders for new tabs
const PlaceholderTab = ({ name }) => (
  <div className="flex flex-col items-center justify-center h-full w-full text-slate-400 p-10">
    <div className="text-6xl mb-4 opacity-20">🚧</div>
    <h2 className="text-2xl font-bold text-slate-300 mb-2">{name} Interface</h2>
    <p className="text-sm max-w-md text-center text-slate-500">
      This enterprise module is currently under development. Features for {name} will be available in an upcoming release phase.
    </p>
  </div>
);

const PetrophysicalAnalysisPage = () => {
  const [activeTab, setActiveTab] = useState('setup');
  
  // State for legacy components to maintain functionality during migration
  const [wellData, setWellData] = useState([]);
  const [selectedWell, setSelectedWell] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);

  // Legacy Handlers
  const handleWellUpload = (newWell) => {
    setWellData(prev => [...prev, newWell]);
  };

  const handleWellSelect = (wellId) => {
    const well = wellData.find(w => w.id === wellId);
    setSelectedWell(well);
  };

  const handleRunAnalysis = (parameters) => {
    // Logic would go here
    console.log("Running analysis...", parameters);
  };

  // Render logic based on active tab
  const renderContent = () => {
    if (activeTab === 'setup') {
      return (
        <div className="h-full flex flex-col">
          {selectedWell ? (
            <>
               <VisualizationToolbar onRunAnalysis={handleRunAnalysis} />
               <div className="flex-1 overflow-hidden relative">
                  <LogPlotViewer wellData={wellData} selectedWellId={selectedWell?.id} />
               </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 bg-slate-950/50">
              <p className="mb-4">Select or upload a well to begin analysis</p>
              <div className="max-w-md w-full p-6 bg-slate-900 rounded-xl border border-slate-800">
                 <WellUploadPanel onWellUpload={handleWellUpload} />
              </div>
            </div>
          )}
        </div>
      );
    }
    
    const tabNames = {
      'qc': 'Quality Control',
      'sources': 'Data Sources',
      'workflows': 'Workflow Builder',
      'ai-insights': 'AI Insights',
      '3d-viz': '3D Visualization',
      'collaboration': 'Collaboration',
      'security': 'Security & Audit',
      'analytics': 'Advanced Analytics',
      'porosity': 'Porosity Analysis',
      'help': 'Documentation'
    };

    return <PlaceholderTab name={tabNames[activeTab] || 'Unknown'} />;
  };

  // Define sidebars based on active tab
  const renderLeftSidebar = () => {
    if (activeTab === 'setup') {
       return (
         <div className="space-y-6">
            <WellManager 
              wells={wellData} 
              onWellSelect={handleWellSelect} 
              selectedWellId={selectedWell?.id} 
            />
            <div className="pt-4 border-t border-slate-800">
               <h3 className="text-xs font-semibold text-slate-500 uppercase mb-3 px-2">Data Management</h3>
               <WellUploadPanel onWellUpload={handleWellUpload} />
            </div>
         </div>
       );
    }
    return null;
  };

  const renderRightSidebar = () => {
    if (activeTab === 'setup') {
      return (
        <div className="space-y-6">
          <DataPanel selectedWell={selectedWell} />
          <ResultsPanel results={analysisResults} />
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <Helmet>
        <title>Petrophysics Estimator | Petrolord Suite</title>
        <meta name="description" content="Enterprise grade interactive log analysis suite." />
      </Helmet>
      
      <MainLayout 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        leftSidebar={renderLeftSidebar()}
        rightSidebar={renderRightSidebar()}
      >
        {renderContent()}
      </MainLayout>
    </>
  );
};

export default PetrophysicalAnalysisPage;