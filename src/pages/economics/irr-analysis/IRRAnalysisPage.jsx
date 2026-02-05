import React from 'react';
import { Helmet } from 'react-helmet-async';
import { IRRAnalysisProvider } from '@/context/economics/IRRAnalysisContext';
import IRRAnalysisStudio from '@/modules/economics/irr-analysis/layout/IRRAnalysisStudio';
import { useApplicationLayout } from '@/contexts/ApplicationLayoutContext';

// Wrapped component to safely access layout context
const IRRAnalysisPageContent = () => {
    return <IRRAnalysisStudio />;
};

const IRRAnalysisPage = () => {
  return (
    <IRRAnalysisProvider>
      <Helmet>
        <title>IRR Analysis Studio | Petrolord</title>
        <meta name="description" content="Internal Rate of Return Analysis Tool" />
      </Helmet>
      <IRRAnalysisPageContent />
    </IRRAnalysisProvider>
  );
};

export default IRRAnalysisPage;