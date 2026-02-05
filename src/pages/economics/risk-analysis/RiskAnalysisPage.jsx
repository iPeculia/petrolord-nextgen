import React from 'react';
import RiskAnalysisStudio from '@/modules/economics/risk-analysis/layout/RiskAnalysisStudio';
import { Helmet } from 'react-helmet-async';

const RiskAnalysisPage = () => {
  return (
    <>
      <Helmet>
        <title>Risk Analysis Studio | PetroLord</title>
        <meta name="description" content="Advanced Risk Analysis & Monte Carlo Simulation" />
      </Helmet>
      <RiskAnalysisStudio />
    </>
  );
};

export default RiskAnalysisPage;