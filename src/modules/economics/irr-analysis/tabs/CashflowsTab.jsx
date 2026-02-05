import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Upload, Plus } from 'lucide-react';
import { useIRRAnalysis } from '@/context/economics/IRRAnalysisContext';

const CashflowsTab = () => {
  const { currentProject } = useIRRAnalysis();

  if (!currentProject) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-slate-400">Please select a project to manage cashflows.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Cashflow Management</h2>
          <p className="text-slate-400 text-sm mt-1">Define project costs, revenues, and production schedules.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
            <Upload className="w-4 h-4 mr-2" /> Import CSV
          </Button>
          <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-[#1E293B] border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg text-white font-medium">CAPEX Schedule</CardTitle>
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-white">
              <Plus className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border border-dashed border-slate-700 rounded-md bg-slate-900/50">
              <p className="text-sm text-slate-500">No capital expenditure data</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1E293B] border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg text-white font-medium">OPEX Schedule</CardTitle>
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-white">
              <Plus className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border border-dashed border-slate-700 rounded-md bg-slate-900/50">
              <p className="text-sm text-slate-500">No operating expenditure data</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1E293B] border-slate-700 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg text-white font-medium">Production & Revenue</CardTitle>
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-white">
              <Plus className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
             <div className="h-64 flex items-center justify-center border border-dashed border-slate-700 rounded-md bg-slate-900/50">
              <p className="text-sm text-slate-500">No production data available</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CashflowsTab;