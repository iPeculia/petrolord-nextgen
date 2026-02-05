import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const QuickReferenceCard = () => {
  return (
    <Card className="bg-slate-950 border-slate-800 print:border-black">
      <CardContent className="p-6 space-y-4">
        <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-2">Material Balance Cheat Sheet</h2>
        
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="text-[#BFFF00] font-semibold mb-2">Key Equations</h3>
            <ul className="text-sm text-slate-300 space-y-1">
              <li><strong className="text-white">F</strong> = N(Eo + mEg + Efw) + We</li>
              <li><strong className="text-white">F</strong> = Total Withdrawal (rb)</li>
              <li><strong className="text-white">Eo</strong> = Oil Expansion (rb/stb)</li>
              <li><strong className="text-white">Eg</strong> = Gas Expansion (rb/stb)</li>
            </ul>
          </div>
          <div>
             <h3 className="text-[#BFFF00] font-semibold mb-2">Diagnostic Plots</h3>
             <ul className="text-sm text-slate-300 space-y-1">
               <li><strong className="text-white">F vs Eo</strong>: Straight line = Volumetric</li>
               <li><strong className="text-white">F/Eo vs Eg/Eo</strong>: Havlena-Odeh for Gas Cap</li>
               <li><strong className="text-white">P/Z vs Gp</strong>: Gas Reservoir</li>
             </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickReferenceCard;