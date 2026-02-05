import React from 'react';
import { Activity, Info } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const ResultsPanel = () => {
  return (
    <div className="flex flex-col h-full w-full">
      {/* Header */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-white">Results</h2>
          <Activity className="w-4 h-4 text-blue-400" />
        </div>
        <p className="text-xs text-slate-400">Computed reservoir properties.</p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-8">
          
          {/* Average Properties */}
          <div>
            <h3 className="text-xs font-bold text-[#BFFF00] uppercase tracking-wider mb-3">Average Properties</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-slate-800/50">
                <span className="text-sm text-slate-300">Porosity (Avg)</span>
                <span className="text-sm font-mono font-bold text-white">0.001 v/v</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-800/50">
                <span className="text-sm text-slate-300">Water Saturation (Avg)</span>
                <span className="text-sm font-mono font-bold text-white">1.000 v/v</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-800/50">
                <span className="text-sm text-slate-300">Shale Volume (Avg)</span>
                <span className="text-sm font-mono font-bold text-white">0.417 v/v</span>
              </div>
            </div>
          </div>

          {/* Reservoir Summary */}
          <div>
            <h3 className="text-xs font-bold text-[#BFFF00] uppercase tracking-wider mb-3">Reservoir Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-slate-800/50">
                <span className="text-sm text-slate-300">Net-to-Gross</span>
                <span className="text-sm font-mono font-bold text-white">0.000 fr</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-800/50">
                <span className="text-sm text-slate-300">Est. Permeability</span>
                <span className="text-sm font-mono font-bold text-white">0.000 mD</span>
              </div>
            </div>
          </div>

          {/* Criteria Box */}
          <div className="bg-slate-800/30 rounded-lg border border-slate-700/50 p-4">
            <div className="flex items-center gap-2 mb-2">
               <Info className="w-3 h-3 text-slate-400" />
               <span className="text-xs font-semibold text-slate-400">Pay criteria used:</span>
            </div>
            <ul className="text-xs text-slate-400 space-y-1 pl-1">
               <li>• Porosity &gt; 10%</li>
               <li>• Vsh &lt; 40%</li>
               <li>• Sw &lt; 50%</li>
            </ul>
          </div>

        </div>
      </ScrollArea>
    </div>
  );
};

export default ResultsPanel;