import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Share2 } from 'lucide-react';
import { useIRRAnalysis } from '@/context/economics/IRRAnalysisContext';

const ResultsTab = () => {
  const { currentProject } = useIRRAnalysis();

  if (!currentProject) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-slate-400">Please select a project to view results.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Results & Reporting</h2>
          <p className="text-slate-400 text-sm mt-1">Detailed breakdown of economic indicators and generated reports.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
            <Share2 className="w-4 h-4 mr-2" /> Share
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <FileText className="w-4 h-4 mr-2" /> Generate Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
            { label: 'IRR', value: '-- %', color: 'text-blue-400' },
            { label: 'NPV (10%)', value: '$ --', color: 'text-green-400' },
            { label: 'ROI', value: '-- x', color: 'text-purple-400' },
            { label: 'Payback', value: '-- Yrs', color: 'text-orange-400' },
        ].map((item, i) => (
            <Card key={i} className="bg-[#1E293B] border-slate-700">
                <CardContent className="pt-6">
                    <div className={`text-2xl font-bold ${item.color} mb-1`}>{item.value}</div>
                    <div className="text-xs text-slate-400 uppercase font-semibold">{item.label}</div>
                </CardContent>
            </Card>
        ))}
      </div>

      <Card className="bg-[#1E293B] border-slate-700">
        <CardHeader>
            <CardTitle className="text-white">Cumulative Cash Flow</CardTitle>
        </CardHeader>
        <CardContent>
             <div className="h-[400px] flex items-center justify-center border border-dashed border-slate-700 rounded-md bg-slate-900/50">
              <p className="text-sm text-slate-500">Visualization placeholder</p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsTab;