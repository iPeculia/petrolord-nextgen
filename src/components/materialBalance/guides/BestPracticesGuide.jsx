import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

const BestPracticesGuide = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-4">Best Practices</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader><CardTitle className="text-white">Data Quality</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-slate-400">
            <p className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-1 shrink-0" /> Normalize production rates to monthly volumes.</p>
            <p className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-1 shrink-0" /> Filter out outliers in pressure survey data.</p>
            <p className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-1 shrink-0" /> Ensure PVT samples match reservoir temperature.</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader><CardTitle className="text-white">Analysis Strategy</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-slate-400">
            <p className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-1 shrink-0" /> Always start with the simplest model (Volumetric).</p>
            <p className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-1 shrink-0" /> Use diagnostic plots before running regression.</p>
            <p className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-1 shrink-0" /> Validate results against volumetric (Map-based) OOIP.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BestPracticesGuide;