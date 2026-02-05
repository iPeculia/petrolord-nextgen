import React from 'react';
import LiftSystemSelector from '../LiftSystemSelector';

const LiftSystemsTab = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Lift Systems</h2>
        <p className="text-slate-400">Select and configure the artificial lift method.</p>
      </div>
      
      <LiftSystemSelector />
    </div>
  );
};

export default LiftSystemsTab;