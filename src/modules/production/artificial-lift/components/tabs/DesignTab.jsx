import React from 'react';
import DesignWorkspace from '../DesignWorkspace';

const DesignTab = () => {
  return (
    <div className="h-full space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Design Workspace</h2>
        <p className="text-slate-400">Configure, simulate, and optimize your lift system.</p>
      </div>
      
      <DesignWorkspace />
    </div>
  );
};

export default DesignTab;