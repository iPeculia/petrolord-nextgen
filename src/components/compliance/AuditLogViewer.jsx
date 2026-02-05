import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { auditService } from '@/services/auditService';
import { Loader2, Search, Filter, Download, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { exportToCSV } from '@/lib/reportExportUtils';

const AuditLogViewer = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  
  // Filters
  const [filters, setFilters] = useState({
    search: '',
    logType: 'all',
    status: 'all',
    severity: 'all'
  });

  // Modal State
  const [selectedLog, setSelectedLog] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, [page, pageSize, filters]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const activeFilters = { ...filters };
      if (activeFilters.logType === 'all') delete activeFilters.logType;
      if (activeFilters.status === 'all') delete activeFilters.status;
      if (activeFilters.severity === 'all') delete activeFilters.severity;

      const { data, count } = await auditService.fetchLogs({
        page,
        pageSize,
        filters: activeFilters
      });
      setLogs(data);
      setTotalCount(count);
    } catch (error) {
      console.error("Failed to fetch logs", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1); // Reset to page 1 on filter change
  };

  const openLogDetails = (log) => {
    setSelectedLog(log);
    setIsModalOpen(true);
  };

  const handleExport = () => {
      // Basic client-side export of current view
      // Ideally this would trigger a backend job for full dataset export
      const exportData = {
          summary: { exportedAt: new Date().toLocaleString() },
          details: logs.map(l => ({
              Timestamp: new Date(l.timestamp).toLocaleString(),
              Action: l.action,
              User: l.profiles?.email || 'System',
              Resource: l.resource_type,
              Status: l.status
          }))
      };
      exportToCSV(exportData, 'Audit_Logs_Export');
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'success': return <Badge className="bg-emerald-500/20 text-emerald-400 border-0">Success</Badge>;
      case 'failure': return <Badge className="bg-red-500/20 text-red-400 border-0">Failure</Badge>;
      default: return <Badge variant="outline" className="text-slate-400">{status}</Badge>;
    }
  };

  const getSeverityBadge = (severity) => {
      if (!severity) return null;
      switch(severity) {
          case 'critical': return <Badge className="bg-red-600 text-white border-0">CRITICAL</Badge>;
          case 'high': return <Badge className="bg-orange-500 text-white border-0">HIGH</Badge>;
          case 'medium': return <Badge className="bg-yellow-500 text-black border-0">MEDIUM</Badge>;
          default: return null;
      }
  };

  return (
    <div className="space-y-4">
      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-end md:items-center bg-[#1E293B] p-4 rounded-lg border border-slate-800">
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search actions or resources..." 
              className="pl-8 bg-slate-900 border-slate-700 text-white"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
          
          <Select value={filters.logType} onValueChange={(val) => handleFilterChange('logType', val)}>
            <SelectTrigger className="w-[150px] bg-slate-900 border-slate-700 text-white">
              <SelectValue placeholder="Log Type" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-700 text-white">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="action">Action</SelectItem>
              <SelectItem value="access">Access</SelectItem>
              <SelectItem value="system">System</SelectItem>
              <SelectItem value="compliance">Compliance</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.status} onValueChange={(val) => handleFilterChange('status', val)}>
            <SelectTrigger className="w-[150px] bg-slate-900 border-slate-700 text-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-700 text-white">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="failure">Failure</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline" className="border-slate-700 hover:bg-slate-800 text-slate-200" onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" /> Export
        </Button>
      </div>

      {/* Data Table */}
      <Card className="bg-[#1E293B] border-slate-800">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-900/50">
              <TableRow className="hover:bg-transparent border-slate-800">
                <TableHead className="text-slate-400">Timestamp</TableHead>
                <TableHead className="text-slate-400">Severity</TableHead>
                <TableHead className="text-slate-400">User</TableHead>
                <TableHead className="text-slate-400">Action</TableHead>
                <TableHead className="text-slate-400">Resource</TableHead>
                <TableHead className="text-slate-400">Status</TableHead>
                <TableHead className="text-right text-slate-400">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#BFFF00]" />
                  </TableCell>
                </TableRow>
              ) : logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-slate-500">
                    No logs found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log.id} className="border-slate-800 hover:bg-slate-800/50">
                    <TableCell className="text-slate-300 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>
                        {getSeverityBadge(log.severity)}
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {log.profiles?.email || <span className="text-slate-500 italic">System</span>}
                    </TableCell>
                    <TableCell className="text-white font-medium">{log.action}</TableCell>
                    <TableCell className="text-slate-300">
                      {log.resource_type} <span className="text-slate-500 text-xs">#{log.resource_id?.slice(0, 8)}</span>
                    </TableCell>
                    <TableCell>{getStatusBadge(log.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => openLogDetails(log)}>
                        <Eye className="w-4 h-4 text-slate-400 hover:text-white" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-slate-400">
        <div>
          Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, totalCount)} of {totalCount} entries
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="border-slate-700 hover:bg-slate-800"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setPage(p => p + 1)}
            disabled={page * pageSize >= totalCount}
            className="border-slate-700 hover:bg-slate-800"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Details Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-[#1E293B] border-slate-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Audit Log Details</DialogTitle>
            <DialogDescription className="text-slate-400">
              Transaction ID: {selectedLog?.id}
            </DialogDescription>
          </DialogHeader>
          
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="text-slate-500 block mb-1">Timestamp</label>
                  <div className="text-slate-200">{new Date(selectedLog.timestamp).toLocaleString()}</div>
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">User Agent</label>
                  <div className="text-slate-200 truncate" title={selectedLog.user_agent}>{selectedLog.user_agent}</div>
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">Action</label>
                  <div className="text-slate-200 font-mono">{selectedLog.action}</div>
                </div>
                 <div>
                  <label className="text-slate-500 block mb-1">Status</label>
                  <div className="text-slate-200">{selectedLog.status.toUpperCase()}</div>
                </div>
              </div>

              <div className="border-t border-slate-700 pt-4">
                <label className="text-slate-500 block mb-2">Technical Details (JSON)</label>
                <pre className="bg-slate-950 p-4 rounded-md overflow-x-auto text-xs font-mono text-emerald-400">
                  {JSON.stringify(selectedLog.details, null, 2)}
                </pre>
              </div>

              {(selectedLog.old_value || selectedLog.new_value) && (
                <div className="grid grid-cols-2 gap-4 border-t border-slate-700 pt-4">
                  <div>
                    <label className="text-slate-500 block mb-2">Old Value</label>
                    <pre className="bg-slate-950 p-2 rounded text-xs text-red-300 overflow-x-auto">
                        {selectedLog.old_value ? JSON.stringify(selectedLog.old_value, null, 2) : 'null'}
                    </pre>
                  </div>
                  <div>
                    <label className="text-slate-500 block mb-2">New Value</label>
                    <pre className="bg-slate-950 p-2 rounded text-xs text-emerald-300 overflow-x-auto">
                        {selectedLog.new_value ? JSON.stringify(selectedLog.new_value, null, 2) : 'null'}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AuditLogViewer;