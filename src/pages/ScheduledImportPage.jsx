import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useRole } from '@/contexts/RoleContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Search, MoreVertical, Play, Calendar, History, Trash2, Edit } from 'lucide-react';
import { ScheduledImportService } from '@/services/scheduledImportService';
import ScheduledImportForm from '@/components/ScheduledImport/ScheduledImportForm';
import ScheduledImportResultsModal from '@/components/ScheduledImport/ScheduledImportResultsModal';
import { useToast } from '@/components/ui/use-toast';

const ScheduledImportPage = () => {
    const { isViewAsAdmin, isViewAsSuperAdmin } = useRole();
    const { toast } = useToast();
    const [imports, setImports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingImport, setEditingImport] = useState(null);
    const [historyModal, setHistoryModal] = useState({ open: false, id: null, name: '' });
    const [deleteId, setDeleteId] = useState(null);

    const fetchImports = async () => {
        setLoading(true);
        try {
            const data = await ScheduledImportService.getScheduledImports({ page, limit: 10, filters: { search: searchTerm } });
            setImports(data.data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isViewAsAdmin || isViewAsSuperAdmin) {
            fetchImports();
        }
    }, [page, searchTerm, isViewAsAdmin, isViewAsSuperAdmin]);

    // Moved conditional return after hooks to comply with Rules of Hooks
    if (!isViewAsAdmin && !isViewAsSuperAdmin) {
        return <Navigate to="/dashboard" replace />;
    }

    const handleDeleteClick = (id) => {
        setDeleteId(id);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            await ScheduledImportService.deleteScheduledImport(deleteId);
            toast({ title: "Deleted", description: "Schedule removed successfully." });
            fetchImports();
        } catch (error) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } finally {
            setDeleteId(null);
        }
    };

    const handleRunNow = async (id) => {
        try {
            toast({ title: "Job Triggered", description: "Import job has been queued." });
            await ScheduledImportService.runImportNow(id);
        } catch (error) {
            toast({ title: "Run Failed", description: error.message, variant: "destructive" });
        }
    };

    return (
        <div className="space-y-6 p-6 md:p-12 max-w-7xl mx-auto">
            <Helmet>
                <title>Scheduled Imports | Petrolord Admin</title>
            </Helmet>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Scheduled Imports</h1>
                    <p className="text-slate-400">Automate recurring user imports and data synchronization.</p>
                </div>
                <Button onClick={() => setIsCreateOpen(true)} className="bg-[#BFFF00] text-black hover:bg-[#a6dd00]">
                    <Plus className="w-4 h-4 mr-2" /> Create Schedule
                </Button>
            </div>

            <Card className="bg-[#1E293B] border-slate-800">
                <CardHeader className="p-4 border-b border-slate-800 flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">Active Schedules</CardTitle>
                    <div className="relative w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-500" />
                        <Input 
                            placeholder="Search schedules..." 
                            className="pl-8 bg-slate-900 border-slate-700 h-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-slate-900/50">
                            <TableRow>
                                <TableHead className="text-slate-300">Name</TableHead>
                                <TableHead className="text-slate-300">University</TableHead>
                                <TableHead className="text-slate-300">Frequency</TableHead>
                                <TableHead className="text-slate-300">Next Run</TableHead>
                                <TableHead className="text-slate-300">Last Status</TableHead>
                                <TableHead className="text-right text-slate-300">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array(3).fill(0).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><div className="h-4 w-32 bg-slate-800 rounded animate-pulse" /></TableCell>
                                        <TableCell><div className="h-4 w-24 bg-slate-800 rounded animate-pulse" /></TableCell>
                                        <TableCell><div className="h-4 w-16 bg-slate-800 rounded animate-pulse" /></TableCell>
                                        <TableCell><div className="h-4 w-24 bg-slate-800 rounded animate-pulse" /></TableCell>
                                        <TableCell><div className="h-4 w-16 bg-slate-800 rounded animate-pulse" /></TableCell>
                                        <TableCell><div className="h-8 w-8 bg-slate-800 rounded animate-pulse ml-auto" /></TableCell>
                                    </TableRow>
                                ))
                            ) : imports.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center text-slate-500">
                                        No scheduled imports found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                imports.map(item => (
                                    <TableRow key={item.id} className="border-slate-800 hover:bg-slate-800/50">
                                        <TableCell className="font-medium text-white">{item.name}</TableCell>
                                        <TableCell className="text-slate-300">{item.university_applications?.university_name}</TableCell>
                                        <TableCell className="capitalize text-slate-300">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-3 h-3 text-slate-500" />
                                                {item.frequency}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-slate-300">
                                            {item.next_run_at ? new Date(item.next_run_at).toLocaleString() : '-'}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={item.status === 'active' ? 'default' : 'secondary'}
                                                className={item.status === 'active' ? "bg-emerald-500/10 text-emerald-500" : "bg-slate-700"}
                                            >
                                                {item.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="bg-slate-900 border-slate-700 text-white">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => handleRunNow(item.id)}>
                                                        <Play className="mr-2 h-4 w-4" /> Run Now
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => setHistoryModal({ open: true, id: item.id, name: item.name })}>
                                                        <History className="mr-2 h-4 w-4" /> View History
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => { setEditingImport(item); setIsCreateOpen(true); }}>
                                                        <Edit className="mr-2 h-4 w-4" /> Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-red-400 focus:text-red-400" onClick={() => handleDeleteClick(item.id)}>
                                                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Create/Edit Dialog */}
            <Dialog open={isCreateOpen} onOpenChange={(val) => {
                setIsCreateOpen(val);
                if (!val) setEditingImport(null);
            }}>
                <DialogContent className="max-w-2xl bg-[#1E293B] border-slate-700 text-white">
                    <div className="mb-4">
                        <h2 className="text-xl font-bold">{editingImport ? 'Edit Schedule' : 'Create New Import Schedule'}</h2>
                        <p className="text-slate-400 text-sm">Configure recurring imports for automated processing.</p>
                    </div>
                    <ScheduledImportForm 
                        initialData={editingImport}
                        onSave={() => {
                            setIsCreateOpen(false);
                            setEditingImport(null);
                            fetchImports();
                        }}
                        onCancel={() => {
                            setIsCreateOpen(false);
                            setEditingImport(null);
                        }}
                    />
                </DialogContent>
            </Dialog>

            <ScheduledImportResultsModal 
                isOpen={historyModal.open}
                scheduleId={historyModal.id}
                scheduleName={historyModal.name}
                onClose={() => setHistoryModal({ ...historyModal, open: false })}
            />

            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent className="bg-[#1E293B] border-slate-700 text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-400">
                            This action cannot be undone. This will permanently delete the scheduled import.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-slate-800 text-white hover:bg-slate-700 border-slate-600">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default ScheduledImportPage;