import React from 'react';
import ReservoirPropertiesForm from '../forms/ReservoirPropertiesForm';
import DataValidationSummary from '../DataValidationSummary';

const ReservoirDataTab = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-start">
        <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">Reservoir Data</h2>
            <p className="text-slate-400">Manage reservoir fluid properties and conditions.</p>
        </div>
        <div className="hidden lg:block w-64">
             <DataValidationSummary />
        </div>
      </div>
      
      <ReservoirPropertiesForm />
    </div>
  );
};

export default ReservoirDataTab;