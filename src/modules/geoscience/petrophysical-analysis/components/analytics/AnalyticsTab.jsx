import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Filter, Download, BarChart3, Activity, PieChart, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AnalyticsDashboardPanel from './AnalyticsDashboardPanel';
import GenericCharts from './charts/GenericCharts';
import ReportsTabContent from './ReportsTabContent'; // Imported new component

const AnalyticsTab = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="h-full flex flex-col bg-[#0F172A] text-slate-200 p-4 overflow-hidden">
      {/* Header */}
      <div className="mb-6 shrink-0 flex justify-between items-end">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-500" />
            Advanced Analytics
          </h2>
          <p className="text-sm text-slate-400">Data insights, statistical analysis, and trending.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="border-slate-700 text-slate-300">
            <Filter className="w-4 h-4 mr-2" /> Filters
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="bg-slate-900 border-slate-800 w-full justify-start shrink-0 h-12 mb-4 p-1">
          <TabsTrigger value="dashboard" className="data-[state=active]:bg-slate-800 data-[state=active]:text-[#BFFF00]">
            <Activity className="w-4 h-4 mr-2" /> Dashboard
          </TabsTrigger>
          <TabsTrigger value="data-analysis" className="data-[state=active]:bg-slate-800 data-[state=active]:text-[#BFFF00]">
            <BarChart3 className="w-4 h-4 mr-2" /> Data Analysis
          </TabsTrigger>
          <TabsTrigger value="custom-metrics" className="data-[state=active]:bg-slate-800 data-[state=active]:text-[#BFFF00]">
            <PieChart className="w-4 h-4 mr-2" /> Custom Metrics
          </TabsTrigger>
          <TabsTrigger value="reports" className="data-[state=active]:bg-slate-800 data-[state=active]:text-[#BFFF00]">
            <FileText className="w-4 h-4 mr-2" /> Reports
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-hidden relative rounded-lg border border-slate-800 bg-slate-950/50">
          <TabsContent value="dashboard" className="h-full m-0 p-0">
             <AnalyticsDashboardPanel />
          </TabsContent>
          
          <TabsContent value="data-analysis" className="h-full m-0 p-4 overflow-auto">
             <GenericCharts />
          </TabsContent>
          
          <TabsContent value="custom-metrics" className="h-full m-0 p-8 flex items-center justify-center text-slate-500">
             Custom Metrics (Coming Soon)
          </TabsContent>

          {/* Fully Implemented Reports Tab */}
          <TabsContent value="reports" className="h-full m-0 p-0 overflow-hidden">
             <ReportsTabContent />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default AnalyticsTab;