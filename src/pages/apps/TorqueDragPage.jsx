import React from 'react';
import { TorqueDragProvider } from '@/contexts/TorqueDragContext';
import TorqueDragStudio from '@/modules/drilling/torque-drag/layout/TorqueDragStudio';

const TorqueDragPage = () => {
  return (
    <TorqueDragProvider>
      <TorqueDragStudio />
    </TorqueDragProvider>
  );
};

export default TorqueDragPage;