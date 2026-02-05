import React from 'react';
import { Helmet } from 'react-helmet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, FileBarChart, Settings } from 'lucide-react';
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard';
import AnalyticsReports from '@/components/analytics/AnalyticsReports';

const AdminAnalyticsPage = () => {
  return (
    <>
      <Helmet>
        <title>Advanced Analytics | Petrolord Admin</title>
      </Helmet>
      
      <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Analytics & Reporting</h1>
            <p className="text-slate-400 mt-1">Real-time insights and comprehensive reporting for system performance.</p>
          </div>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="bg-[#1E293B] border border-slate-800 p-1 w-full md:w-auto">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-[#BFFF00] data-[state=active]:text-black gap-2 px-6">
              <BarChart3 className="w-4 h-4" /> Dashboard
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-[#BFFF00] data-[state=active]:text-black gap-2 px-6">
              <FileBarChart className="w-4 h-4" /> Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
             <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
             <AnalyticsReports />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default AdminAnalyticsPage;