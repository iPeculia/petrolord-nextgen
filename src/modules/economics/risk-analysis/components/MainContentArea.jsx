import React from 'react';
import { useRiskAnalysis } from '@/context/RiskAnalysisContext';
import Breadcrumb from './Breadcrumb';
import { Card } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

// Setup Workspace Import
import SetupWorkspace from './setup/SetupWorkspace';

const PlaceholderContent = ({ title }) => (
  <Card className="bg-[#1a1a1a] border-[#333] p-12 flex flex-col items-center justify-center text-center h-[400px]">
    <div className="w-16 h-16 rounded-full bg-[#262626] flex items-center justify-center mb-4">
      <AlertCircle className="w-8 h-8 text-slate-500" />
    </div>
    <h3 className="text-xl font-semibold text-slate-200 mb-2">{title} Module</h3>
    <p className="text-slate-400 max-w-md">
      This module is currently under development. Features for {title.toLowerCase()} will be available in the next phase.
    </p>
  </Card>
);

const MainContentArea = () => {
  const { currentTab, currentProject } = useRiskAnalysis();

  if (!currentProject) {
    return (
      <div className="flex-1 bg-[#141414] p-8 flex flex-col items-center justify-center gap-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-[#262626] rounded-full flex items-center justify-center mx-auto mb-6 border border-[#333]">
              <span className="text-3xl">🏗️</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-200 mb-3">Welcome to Risk Analysis Studio</h2>
          <p className="text-slate-400 mb-8">
            To begin your risk assessment journey, please select an existing project from the top left menu or create a new one.
          </p>
          <div className="p-4 bg-blue-900/20 border border-blue-800/50 rounded-lg text-sm text-blue-200">
             Tip: Use the project selector in the top navigation bar to get started.
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (currentTab) {
      case 'Setup':
        return <SetupWorkspace />;
      case 'QC':
        return <PlaceholderContent title="Quality Control" />;
      case 'Sources':
        return <PlaceholderContent title="Data Sources" />;
      case 'Workflows':
        return <PlaceholderContent title="Workflows" />;
      case 'AI Insights':
        return <PlaceholderContent title="AI Insights" />;
      case '3D Viz':
        return <PlaceholderContent title="3D Visualization" />;
      case 'Collaboration':
        return <PlaceholderContent title="Collaboration" />;
      case 'Security':
        return <PlaceholderContent title="Security" />;
      case 'Analytics':
        return <PlaceholderContent title="Analytics" />;
      case 'Porosity':
        return <PlaceholderContent title="Porosity Analysis" />;
      default:
        return <PlaceholderContent title="Unknown" />;
    }
  };

  return (
    <div className="flex-1 bg-[#141414] overflow-hidden flex flex-col">
      <div className="p-4 min-h-full flex flex-col h-full">
        <Breadcrumb />
        <div className="flex-1 h-full overflow-hidden">
            {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default MainContentArea;