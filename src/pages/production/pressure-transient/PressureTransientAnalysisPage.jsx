import React from 'react';
import { PressureTransientProvider } from '@/context/PressureTransientContext';
import PressureTransientStudio from '@/modules/production/pressure-transient/layout/PressureTransientStudio';
import { Helmet } from 'react-helmet-async';

const PressureTransientAnalysisPage = () => {
  return (
    <PressureTransientProvider>
      <Helmet>
        <title>Pressure Transient Analysis | Petrolord</title>
        <meta name="description" content="Advanced pressure transient analysis studio for reservoir characterization." />
      </Helmet>
      <PressureTransientStudio />
    </PressureTransientProvider>
  );
};

export default PressureTransientAnalysisPage;