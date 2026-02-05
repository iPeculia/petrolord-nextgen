import React, { useState } from 'react';
import { QCProvider } from '@/modules/geoscience/petrophysical-analysis/context/QCContext';
import QCToolbar from './QCToolbar';
import QCDashboardView from './views/QCDashboardView';
import AnomalyInspectionView from './views/AnomalyInspectionView';
import ReportsExportView from './views/ReportsExportView';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const QCContent = () => {
  const [view, setView] = useState('dashboard');

  return (
    <div className="flex flex-col h-full bg-[#0B101B] text-slate-200">
      <QCToolbar />
      
      <div className="flex-1 overflow-hidden flex flex-col">
         <div className="px-6 pt-4 border-b border-slate-800/50">
             <Tabs value={view} onValueChange={setView} className="w-full">
                <TabsList className="bg-slate-900 border border-slate-800">
                    <TabsTrigger value="dashboard">QC Dashboard</TabsTrigger>
                    <TabsTrigger value="anomalies">Anomaly Inspection</TabsTrigger>
                    <TabsTrigger value="reports">Reports & Export</TabsTrigger>
                </TabsList>
             </Tabs>
         </div>

         <div className="flex-1 overflow-y-auto p-6">
             {view === 'dashboard' && <QCDashboardView />}
             {view === 'anomalies' && <AnomalyInspectionView />}
             {view === 'reports' && <ReportsExportView />}
         </div>
      </div>
    </div>
  );
};

const QCTab = () => {
  return (
    <QCProvider>
      <QCContent />
    </QCProvider>
  );
};

export default QCTab;