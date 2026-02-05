import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Download, CheckCircle, XCircle } from 'lucide-react';
import { ScheduledImportService } from '@/services/scheduledImportService';

const ScheduledImportResultsModal = ({ scheduleId, scheduleName, isOpen, onClose }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && scheduleId) {
      loadHistory();
    }
  }, [isOpen, scheduleId]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await ScheduledImportService.getImportHistory(scheduleId);
      setHistory(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-[#1E293B] border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle>Run History: {scheduleName}</DialogTitle>
          <DialogDescription className="text-slate-400">
            View execution logs for this scheduled import.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 border rounded-md border-slate-700 overflow-hidden max-h-[60vh] overflow-y-auto">
            <Table>
                <TableHeader className="bg-slate-900 sticky top-0 z-10">
                    <TableRow>
                        <TableHead className="text-slate-300">Run Date</TableHead>
                        <TableHead className="text-slate-300">Status</TableHead>
                        <TableHead className="text-right text-slate-300">Records</TableHead>
                        <TableHead className="text-right text-slate-300">Success</TableHead>
                        <TableHead className="text-right text-slate-300">Errors</TableHead>
                        <TableHead className="text-right text-slate-300">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                                <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#BFFF00]" />
                            </TableCell>
                        </TableRow>
                    ) : history.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                                No run history found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        history.map(log => (
                            <TableRow key={log.id} className="border-slate-800 hover:bg-slate-800/50">
                                <TableCell>{new Date(log.created_at).toLocaleString()}</TableCell>
                                <TableCell>
                                    <Badge variant={log.status === 'completed' ? 'success' : 'secondary'}
                                        className={
                                            log.status === 'completed' ? "bg-emerald-500/10 text-emerald-500" :
                                            log.status === 'failed' ? "bg-red-500/10 text-red-500" : "bg-slate-700"
                                        }
                                    >
                                        {log.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">{log.total_records}</TableCell>
                                <TableCell className="text-right text-emerald-400">{log.success_count}</TableCell>
                                <TableCell className="text-right text-red-400">{log.error_count}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <Download className="w-4 h-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduledImportResultsModal;