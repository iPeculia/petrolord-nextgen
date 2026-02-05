import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, HelpCircle } from 'lucide-react';

const TroubleshootingGuide = () => {
  return (
    <div className="space-y-6">
       <h2 className="text-2xl font-bold text-white mb-4">Troubleshooting</h2>

       <div className="grid gap-4">
         <Alert className="bg-red-500/10 border-red-500/50 text-white">
           <AlertCircle className="h-4 w-4 stroke-red-400" />
           <AlertTitle className="text-red-400">Calculation Failed / NaN Results</AlertTitle>
           <AlertDescription className="text-slate-300 mt-2">
             <strong>Causes:</strong>
             <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
               <li>Pressure data is not strictly decreasing (physics violation for simple depletion).</li>
               <li>PVT properties undefined for current pressure range.</li>
               <li>Division by zero in Bg (Gas FVF) if pressure is 0.</li>
             </ul>
             <div className="mt-2 font-medium">Solution: Check your input CSV for zeros or non-numeric characters. Ensure pressure range covers all production dates.</div>
           </AlertDescription>
         </Alert>

         <Alert className="bg-yellow-500/10 border-yellow-500/50 text-white">
           <HelpCircle className="h-4 w-4 stroke-yellow-400" />
           <AlertTitle className="text-yellow-400">Sample Data Not Loading</AlertTitle>
           <AlertDescription className="text-slate-300 mt-2">
             If the "Load Sample Data" button does nothing, you might already have active data in the browser cache.
             <br />
             <strong>Solution:</strong> Try refreshing the page or using the "Clear Data" option in Settings (if enabled).
           </AlertDescription>
         </Alert>

         <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
           <h3 className="text-lg font-semibold text-white mb-4">Common Issues & Fixes</h3>
           <div className="space-y-4">
             <div>
               <h4 className="font-medium text-[#BFFF00]">Charts are Empty</h4>
               <p className="text-sm text-slate-400">Ensure a reservoir is selected in the left sidebar. If you just loaded data, try switching tabs to refresh the view.</p>
             </div>
             <div>
               <h4 className="font-medium text-[#BFFF00]">Cannot Save Project</h4>
               <p className="text-sm text-slate-400">Project saving requires an active internet connection and Supabase authentication. Check your network status.</p>
             </div>
           </div>
         </div>
       </div>
    </div>
  );
};

export default TroubleshootingGuide;