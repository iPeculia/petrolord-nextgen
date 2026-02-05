import React from 'react';
import { Helmet } from 'react-helmet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShieldCheck, FileText, Settings, Activity } from 'lucide-react';
import ComplianceDashboard from '@/components/compliance/ComplianceDashboard';
import AuditLogViewer from '@/components/compliance/AuditLogViewer';
import RetentionPolicies from '@/components/compliance/RetentionPolicies';
import AdminComplianceReportsPage from '@/pages/AdminComplianceReportsPage'; // Reuse existing if suitable or import components

const AdminCompliancePage = () => {
  return (
    <>
      <Helmet>
        <title>Compliance & Audit | Petrolord Admin</title>
      </Helmet>
      
      <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Compliance Center</h1>
            <p className="text-slate-400 mt-1">Audit logs, security monitoring, and data retention management.</p>
          </div>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="bg-[#1E293B] border border-slate-800 p-1 w-full md:w-auto flex flex-wrap h-auto">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-[#BFFF00] data-[state=active]:text-black gap-2 px-6">
              <Activity className="w-4 h-4" /> Dashboard
            </TabsTrigger>
            <TabsTrigger value="audit-logs" className="data-[state=active]:bg-[#BFFF00] data-[state=active]:text-black gap-2 px-6">
              <FileText className="w-4 h-4" /> Audit Logs
            </TabsTrigger>
            <TabsTrigger value="retention" className="data-[state=active]:bg-[#BFFF00] data-[state=active]:text-black gap-2 px-6">
              <Settings className="w-4 h-4" /> Policies
            </TabsTrigger>
            {/* Reports are linked via separate page usually, but can be embedded if simple */}
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6 animate-in fade-in duration-300">
             <ComplianceDashboard />
          </TabsContent>

          <TabsContent value="audit-logs" className="space-y-6 animate-in fade-in duration-300">
             <AuditLogViewer />
          </TabsContent>

          <TabsContent value="retention" className="space-y-6 animate-in fade-in duration-300">
             <RetentionPolicies />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default AdminCompliancePage;