import React from 'react';
import { useWellTestAnalysisContext } from '@/contexts/WellTestAnalysisContext';
import DataSetupTab from './tabs/DataSetupTab';
import DiagnosticsTab from './tabs/DiagnosticsTab';
import ModelMatchTab from './tabs/ModelMatchTab';
import ForecastScenariosTab from './tabs/ForecastScenariosTab';
import ExportLinksTab from './tabs/ExportLinksTab';

const CenterPlotArea = () => {
  const { state } = useWellTestAnalysisContext();
  const { activeTab } = state;

  switch (activeTab) {
      case 'data-setup':
          return <DataSetupTab />;
      case 'diagnostics':
          return <DiagnosticsTab />;
      case 'model-match':
          return <ModelMatchTab />;
      case 'forecast':
          return <ForecastScenariosTab />;
      case 'export':
          return <ExportLinksTab />;
      default:
          return <DataSetupTab />;
  }
};

export default CenterPlotArea;