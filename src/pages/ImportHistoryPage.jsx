import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useRole } from '@/contexts/RoleContext';
import { Navigate } from 'react-router-dom';
import { useImportHistory } from '@/hooks/useImportHistory';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Eye, MoreHorizontal, Filter } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ImportDetailModal from '@/components/ImportHistory/ImportDetailModal';
import BulkActionsPanel from '@/components/ImportHistory/BulkActionsPanel';
import { supabase } from '@/lib/customSupabaseClient';

const ImportHistoryPage = () => {
    const { isViewAsAdmin, isViewAsSuperAdmin } = useRole();
    const { toast } = useToast();
    const [page, setPage] = useState(1);
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [detailId, setDetailId] = useState(null);
    const { data: historyData, isLoading, refresh } = useImportHistory(page);
    const [isProcessing, setIsProcessing] = useState(false);

    if (!isViewAsAdmin && !isViewAsSuperAdmin) return <Navigate to="/dashboard" replace />;

    const toggleSelection = (id) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedIds(newSet);
    };

    const toggleAll = () => {
        if (selectedIds.size === historyData.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(historyData.map(d => d.id)));
        }
    };

    const handleBulkAction = async (actionType) => {
        if (selectedIds.size === 0) return;
        setIsProcessing(true);
        try {
            // Call Edge Function
            const { error } = await supabase.functions.invoke(`bulk-${actionType}-imports`, {
                body: { importIds: Array.from(selectedIds) }
            });
            if (error) throw error;
            
            toast({ title: "Success", description: `${actionType} operation completed.` });
            setSelectedIds(new Set());
            refresh();
        } catch (error) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="p-6 md:p-12 space-y-6 max-w-7xl mx-auto">
            <Helmet>
                <title>Import History | Petrolord</title>
            </Helmet>

            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Import History</h1>
                    <p className="text-slate-400">Manage bulk user provisioning logs.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="border-slate-700">
                        <Filter className="w-4 h-4 mr-2" /> Filters
                    </Button>
                </div>
            </div>

            <div className="bg-[#1E293B] border border-slate-800 rounded-lg overflow-hidden">
                <Table>
                    <TableHeader className="bg-[#0F172A]">
                        <TableRow>
                            <TableHead className="w-[50px]">
                                <Checkbox 
                                    checked={historyData.length > 0 && selectedIds.size === historyData.length}
                                    onCheckedChange={toggleAll}
                                />
                            </TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>University</TableHead>
                            <TableHead>Admin</TableHead>
                            <TableHead className="text-center">Stats</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow><TableCell colSpan={7} className="h-32 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-[#BFFF00]" /></TableCell></TableRow>
                        ) : historyData.map((item) => (
                            <TableRow key={item.id} className="hover:bg-slate-800/50">
                                <TableCell>
                                    <Checkbox 
                                        checked={selectedIds.has(item.id)}
                                        onCheckedChange={() => toggleSelection(item.id)}
                                    />
                                </TableCell>
                                <TableCell className="text-slate-300">
                                    <div className="flex flex-col">
                                        <span>{new Date(item.created_at).toLocaleDateString()}</span>
                                        <span className="text-xs text-slate-500">{new Date(item.created_at).toLocaleTimeString()}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-slate-300">{item.university_name || 'N/A'}</TableCell>
                                <TableCell className="text-slate-300">{item.admin_name || 'System'}</TableCell>
                                <TableCell className="text-center">
                                    <Badge variant="outline" className="border-slate-700 text-slate-400">
                                        {item.success_count} / {item.total_records}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                     <Badge className={
                                         item.status === 'completed' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : 
                                         item.status === 'failed' ? "bg-red-500/10 text-red-500 border-red-500/20" : "bg-blue-500/10 text-blue-500"
                                     }>
                                         {item.status}
                                     </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><MoreHorizontal className="w-4 h-4" /></Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="bg-[#0F172A] border-slate-700 text-white">
                                            <DropdownMenuItem onClick={() => setDetailId(item.id)}>
                                                <Eye className="w-4 h-4 mr-2" /> View Details
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <BulkActionsPanel 
                selectedCount={selectedIds.size}
                onClear={() => setSelectedIds(new Set())}
                onArchive={() => handleBulkAction('archive')}
                onDelete={() => handleBulkAction('delete')}
                onDownload={() => handleBulkAction('download')}
                isProcessing={isProcessing}
            />

            <ImportDetailModal 
                importId={detailId} 
                isOpen={!!detailId} 
                onClose={() => setDetailId(null)} 
            />
        </div>
    );
};

export default ImportHistoryPage;