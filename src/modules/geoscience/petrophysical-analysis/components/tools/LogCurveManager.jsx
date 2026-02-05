import React, { useState } from 'react';
import { useGlobalDataStore } from '@/store/globalDataStore.js';
import { deleteWellLog } from '@/api/globalDataApi.js';
import { Button } from '@/components/ui/button';
import { Trash2, Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from "@/components/ui/alert-dialog";
import ManualCurveForm from './ManualCurveForm';

const LogCurveManager = () => {
    const { activeWell, wellLogs, loadLogsForWell } = useGlobalDataStore();
    const { toast } = useToast();
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [logToDelete, setLogToDelete] = useState(null);
    
    const logs = activeWell ? wellLogs[activeWell] : {};
    const logKeys = logs ? Object.keys(logs) : [];

    const handleDeleteClick = (logType) => {
        setLogToDelete(logType);
        setDeleteConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!logToDelete) return;
        try {
            await deleteWellLog(activeWell, logToDelete);
            await loadLogsForWell(activeWell);
            toast({ title: "Deleted", description: `Curve ${logToDelete} deleted.` });
        } catch (e) {
            toast({ title: "Error", description: e.message, variant: "destructive" });
        } finally {
            setDeleteConfirmOpen(false);
            setLogToDelete(null);
        }
    };

    if (!activeWell) return <div className="text-xs text-muted-foreground p-4 text-center">Select a well to manage curves.</div>;

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center p-2 border-b border-border">
                <h3 className="text-xs font-semibold">Available Curves</h3>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0"><Plus className="w-4 h-4" /></Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader><DialogTitle>Add Manual Curve</DialogTitle></DialogHeader>
                        <ManualCurveForm onSuccess={() => loadLogsForWell(activeWell)} />
                    </DialogContent>
                </Dialog>
            </div>
            <ScrollArea className="flex-1">
                {logKeys.length === 0 ? (
                    <p className="text-xs text-muted-foreground p-4 text-center">No logs found.</p>
                ) : (
                    <div className="p-2 space-y-1">
                        {logKeys.map(key => (
                            <div key={key} className="flex items-center justify-between p-2 bg-muted/30 rounded text-xs group hover:bg-muted/50">
                                <div>
                                    <span className="font-medium text-foreground block">{key}</span>
                                    <span className="text-[10px] text-muted-foreground">
                                        {logs[key].value_array?.length || 0} pts • {logs[key].unit || '-'}
                                    </span>
                                </div>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:text-destructive transition-opacity"
                                    onClick={() => handleDeleteClick(key)}
                                >
                                    <Trash2 className="w-3 h-3" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </ScrollArea>

            <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogTitle>Delete Curve</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete {logToDelete}? This action cannot be undone.
                    </AlertDialogDescription>
                    <div className="flex justify-end gap-2">
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default LogCurveManager;