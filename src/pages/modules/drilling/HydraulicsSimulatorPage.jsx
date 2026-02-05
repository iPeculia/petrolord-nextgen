import React from 'react';
import { Helmet } from 'react-helmet-async';
import HydraulicsSimulatorStudio from '@/modules/drilling/hydraulics-simulator/layout/HydraulicsSimulatorStudio';

const HydraulicsSimulatorPage = () => {
  return (
    <>
      <Helmet>
        <title>Hydraulics Simulator Studio | Petrolord</title>
        <meta name="description" content="Advanced drilling hydraulics simulation and optimization" />
      </Helmet>
      
      {/* 
        This page renders the standalone studio layout which takes over the entire viewport.
        It bypasses the standard dashboard layout for maximum workspace area.
      */}
      <HydraulicsSimulatorStudio />
    </>
  );
};

export default HydraulicsSimulatorPage;