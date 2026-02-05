import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, FileText, Loader2, RefreshCw } from 'lucide-react';
import { analyticsService } from '@/services/analyticsService';
import { useToast } from '@/components/ui/use-toast';
import { exportToCSV, exportToPDF, exportToExcel } from '@/lib/reportExportUtils';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const REPORT_TYPES = [
  { id: 'user_activity', name: 'User Activity Report' },
  { id: 'application', name: 'Application Report' },
  { id: 'university', name: 'University Report' },
  { id: 'department', name: 'Department Report' },
  { id: 'performance', name: 'Performance Report' }
];

const DATE_RANGES = [
  { id: '7d', name: 'Last 7 Days' },
  { id: '30d', name: 'Last 30 Days' },
  { id: '90d', name: 'Last 90 Days' },
  { id: 'year', name: 'This Year' }
];

const AnalyticsReports = () => {
  const { toast } = useToast();
  const { profile } = useAuth();
  const [reportType, setReportType] = useState('user_activity');
  const [dateRange, setDateRange] = useState('30d');
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);

  const generateReport = async () => {
    setLoading(true);
    setReportData(null);
    try {
      let data;
      const range = getDateRangeObject(dateRange);

      switch(reportType) {
        case 'user_activity':
          data = await analyticsService.getUserActivityReport(range);
          break;
        case 'application':
          data = await analyticsService.getApplicationReport(range);
          break;
        case 'university':
          data = await analyticsService.getUniversityReport();
          break;
        case 'department':
          data = await analyticsService.getDepartmentReport();
          break;
        case 'performance':
          // Mocking performance for now
          data = [
            { metric: 'Avg Response Time', value: '145ms', status: 'Optimal' },
            { metric: 'Uptime', value: '99.98%', status: 'Excellent' },
            { metric: 'Error Rate', value: '0.02%', status: 'Low' },
            { metric: 'Database Load', value: '24%', status: 'Normal' }
          ];
          break;
        default:
          data = [];
      }
      setReportData(data);
      toast({ title: "Report Generated", description: `${REPORT_TYPES.find(r => r.id === reportType).name} ready.` });
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Generation Failed", description: "Could not generate report." });
    } finally {
      setLoading(false);
    }
  };

  const getDateRangeObject = (key) => {
    const end = new Date();
    const start = new Date();
    switch(key) {
      case '7d': start.setDate(end.getDate() - 7); break;
      case '30d': start.setDate(end.getDate() - 30); break;
      case '90d': start.setDate(end.getDate() - 90); break;
      case 'year': start.setFullYear(end.getFullYear() - 1); break;
      default: start.setDate(end.getDate() - 30);
    }
    return { start, end };
  };

  const handleExport = (format) => {
    if (!reportData || reportData.length === 0) return;
    const title = REPORT_TYPES.find(r => r.id === reportType).name;
    const range = getDateRangeObject(dateRange);
    
    if (format === 'csv') exportToCSV({ details: reportData }, title);
    if (format === 'pdf') exportToPDF({ details: reportData, summary: {} }, title, { from: range.start, to: range.end }, profile?.email || 'Admin');
    if (format === 'excel') exportToExcel({ details: reportData, summary: {} }, title);

    toast({ title: "Export Started", description: `Downloading ${format.toUpperCase()}...` });
  };

  // Helper to render table headers dynamically
  const renderTable = () => {
    if (!reportData || reportData.length === 0) return <div className="text-center py-10 text-slate-500">No data available for this selection.</div>;
    
    const headers = Object.keys(reportData[0]);

    return (
      <div className="rounded-md border border-slate-700 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-800">
            <TableRow>
              {headers.map(h => (
                <TableHead key={h} className="text-slate-300 capitalize">{h.replace(/([A-Z])/g, ' $1').trim()}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {reportData.map((row, i) => (
              <TableRow key={i} className="hover:bg-slate-800/50 border-slate-700">
                {headers.map(h => (
                  <TableCell key={`${i}-${h}`} className="text-slate-300">{row[h]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="bg-[#1E293B] border-slate-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#BFFF00]" />
            Report Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="w-full md:w-1/3 space-y-2">
              <label className="text-sm font-medium text-slate-300">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="bg-slate-950 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700 text-white">
                  {REPORT_TYPES.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full md:w-1/3 space-y-2">
              <label className="text-sm font-medium text-slate-300">Date Range</label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="bg-slate-950 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700 text-white">
                  {DATE_RANGES.map(r => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={generateReport} 
              disabled={loading}
              className="bg-[#BFFF00] text-black hover:bg-[#a3d900] w-full md:w-auto font-bold"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <RefreshCw className="w-4 h-4 mr-2" />}
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {reportData && (
        <Card className="bg-[#1E293B] border-slate-800 animate-in fade-in slide-in-from-bottom-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Report Results</CardTitle>
            <div className="flex gap-2">
               <Button variant="outline" size="sm" onClick={() => handleExport('csv')} className="border-slate-600 text-slate-300 hover:text-white">CSV</Button>
               <Button variant="outline" size="sm" onClick={() => handleExport('excel')} className="border-slate-600 text-slate-300 hover:text-white">Excel</Button>
               <Button size="sm" onClick={() => handleExport('pdf')} className="bg-slate-700 text-white hover:bg-slate-600"><Download className="w-4 h-4 mr-2" /> PDF</Button>
            </div>
          </CardHeader>
          <CardContent>
             {renderTable()}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AnalyticsReports;