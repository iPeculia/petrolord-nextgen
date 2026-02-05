import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileBarChart } from 'lucide-react';
import { usePressureTransient } from '@/context/PressureTransientContext';

const ResultsTab = () => {
  const { currentWell } = usePressureTransient();
  
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold text-white">Results Summary</h2>
        <p className="text-slate-400">
            {currentWell ? `Analysis Report for ${currentWell.name}` : "Global Results Overview"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {['Permeability', 'Skin Factor', 'Reservoir Pressure', 'Drainage Area'].map((metric) => (
          <Card key={metric} className="bg-slate-900 border-slate-800">
            <CardContent className="pt-6">
              <p className="text-sm text-slate-400">{metric}</p>
              <h3 className="text-2xl font-bold text-white mt-2">--</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-slate-900 border-slate-800 mt-6">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <FileBarChart className="w-12 h-12 text-slate-600 mb-4" />
          <h3 className="text-lg font-medium text-slate-300">No Analysis Results</h3>
          <p className="text-slate-500 max-w-sm">
            Complete the analysis workflow to generate reservoir property estimates.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsTab;