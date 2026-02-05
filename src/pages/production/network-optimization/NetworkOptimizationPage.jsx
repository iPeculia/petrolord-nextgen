import React from 'react';
import { NetworkOptimizationProvider } from '@/context/NetworkOptimizationContext';
import NetworkOptimizationStudio from '@/modules/production/network-optimization/layout/NetworkOptimizationStudio';
import { Helmet } from 'react-helmet-async';

const NetworkOptimizationPage = () => {
  return (
    <>
      <Helmet>
        <title>Network Optimization Studio | Petrolord</title>
        <meta name="description" content="Advanced production network modeling and optimization" />
      </Helmet>
      
      <NetworkOptimizationProvider>
        <NetworkOptimizationStudio />
      </NetworkOptimizationProvider>
    </>
  );
};

export default NetworkOptimizationPage;