import React from 'react';
import { Helmet } from 'react-helmet';
import ArtificialLiftApp from '@/modules/production/artificial-lift/layout/ArtificialLiftApp';
import { ArtificialLiftProvider } from '@/modules/production/artificial-lift/context/ArtificialLiftContext';

const ArtificialLiftPage = () => {
  return (
    <>
      <Helmet>
        <title>Artificial Lift Design | PetroLord</title>
        <meta name="description" content="Design and optimize artificial lift systems including ESP, Gas Lift, and Rod Pumps." />
      </Helmet>
      
      <ArtificialLiftProvider>
        <ArtificialLiftApp />
      </ArtificialLiftProvider>
    </>
  );
};

export default ArtificialLiftPage;