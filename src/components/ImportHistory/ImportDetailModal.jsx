import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Calendar, FileText, User, Building2, RefreshCw, Download, AlertTriangle } from 'lucide-react';
import { ImportHistoryService } from '@/services/importHistoryService';
import ImportRecordsTable from './ImportRecordsTable';
import { useToast } from '@/components/ui/use-toast';

const ImportDetailModal = ({ importId, isOpen, onClose }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(false);
  const { toast } = useToast();

  const fetchDetails = async () => {
    if (!importId) return;
    setLoading(true);
    try {
      const result = await ImportHistoryService.getImportDetails(importId);
      setData(result);
    } catch (error) {
      toast({
        title: "Error fetching details",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && importId) {
      fetchDetails();
    }
  }, [isOpen, importId]);

  const handleRetry = async () => {
    setRetrying(true);
    try {
      const result = await ImportHistoryService.retryFailedRecords(importId);
      
      // Send notification about retry
      ImportHistoryService.sendRetryNotification(importId, result).catch(console.error);
      
      toast({
        title: "Retry Completed",
        description: `Successfully processed ${result.successCount} of ${result.totalRetried} failed records.`,
        className: "bg-emerald-600 text-white border-none"
      });
      fetchDetails(); // Refresh data
    } catch (error) {
      toast({
        title: "Retry Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setRetrying(false);
    }
  };

  const imp = data?.import;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[90vh] flex flex-col bg-[#1E293B] border-slate-700 text-white p-0 gap-0">
        <div className="p-6 border-b border-slate-700">
          <DialogHeader>
            <div className="flex justify-between items-start">
              <div>
                <DialogTitle className="text-xl font-bold flex items-center gap-3">
                  Import Details
                  {imp && (
                    <Badge variant={imp.status === 'completed' && imp.error_count === 0 ? 'success' : 'secondary'} 
                      className={imp?.status === 'completed' && imp?.error_count === 0 
                        ? "bg-emerald-500/20 text-emerald-400" 
                        : "bg-slate-700 text-slate-300"}
                    >
                      {imp?.status}
                    </Badge>
                  )}
                </DialogTitle>
                <DialogDescription className="text-slate-400 mt-1">
                  ID: {importId}
                </DialogDescription>
              </div>
              <div className="flex gap-2">
                 {imp && imp.error_count > 0 && (
                   <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={handleRetry} 
                      disabled={retrying}
                      className="bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
                   >
                     {retrying ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                     Retry Failed
                   </Button>
                 )}
                 <Button variant="outline" size="sm" onClick={onClose} className="border-slate-600 text-slate-300">
                   Close
                 </Button>
              </div>
            </div>
          </DialogHeader>

          {!loading && imp && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-[#0F172A] p-3 rounded-lg border border-slate-800">
                <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                  <Calendar className="w-3 h-3" /> Imported On
                </div>
                <div className="font-semibold text-sm">{new Date(imp.created_at).toLocaleString()}</div>
              </div>
              <div className="bg-[#0F172A] p-3 rounded-lg border border-slate-800">
                <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                  <User className="w-3 h-3" /> Initiated By
                </div>
                <div className="font-semibold text-sm truncate">{imp.admin_name || 'System Admin'}</div>
              </div>
              <div className="bg-[#0F172A] p-3 rounded-lg border border-slate-800">
                <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                  <Building2 className="w-3 h-3" /> University
                </div>
                <div className="font-semibold text-sm truncate">{imp.university_name || 'N/A'}</div>
              </div>
              <div className="bg-[#0F172A] p-3 rounded-lg border border-slate-800">
                <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                  <FileText className="w-3 h-3" /> Stats
                </div>
                <div className="flex gap-3 text-sm">
                  <span className="text-slate-300">Total: {imp.total_records}</span>
                  <span className="text-emerald-400">OK: {imp.success_count}</span>
                  <span className="text-red-400">Err: {imp.error_count}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-[#0F172A]">
          {loading ? (
             <div className="h-full flex items-center justify-center text-slate-400 gap-2">
                <Loader2 className="w-6 h-6 animate-spin" /> Loading details...
             </div>
          ) : (
             <ImportRecordsTable 
                importData={imp} 
                records={data?.records || []} 
                isLoading={false} 
             />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImportDetailModal;