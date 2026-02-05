import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useDebounce } from '@/hooks/useDebounce';
import { useToast } from '@/components/ui/use-toast';
import { getEmailLogs, deleteEmailLog } from '@/lib/emailLogger';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import EmailDetailModal from '@/components/EmailDetailModal';
import EmailResendModal from '@/components/EmailResendModal';
import { Mail, MoreHorizontal, Eye, Trash2, ArrowUpDown, ChevronLeft, ChevronRight, Search, CheckCircle, XCircle, Clock, AlertCircle, Redo } from 'lucide-react';

const LOGS_PER_PAGE = 20;

const emailTypes = ['all', 'certificate', 'password_reset', 'welcome', 'notification', 'course_update', 'admin_invitation', 'university_approval', 'university_rejection', 'other'];
const statuses = ['all', 'sent', 'failed', 'bounced', 'pending'];

const AdminEmailLogsPage = () => {
    const { toast } = useToast();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalLogs, setTotalLogs] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const [filters, setFilters] = useState({ type: 'all', status: 'all', dateRange: {} });
    const [sort, setSort] = useState({ by: 'created_at', ascending: false });
    const [selectedLog, setSelectedLog] = useState(null);
    const [isDetailOpen, setDetailOpen] = useState(false);
    const [isResendOpen, setResendOpen] = useState(false);
    const [isDeleteOpen, setDeleteOpen] = useState(false);

    const loadLogs = useCallback(async () => {
        setLoading(true);
        try {
            const { logs: fetchedLogs, count } = await getEmailLogs({
                page: currentPage,
                searchTerm: debouncedSearchTerm,
                filters,
                sort,
            });
            setLogs(fetchedLogs);
            setTotalLogs(count);
        } catch (err) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to fetch email logs.' });
        } finally {
            setLoading(false);
        }
    }, [currentPage, debouncedSearchTerm, filters, sort, toast]);

    useEffect(() => {
        loadLogs();
    }, [loadLogs]);

    const handleSort = (column) => {
        setSort(s => ({ by: column, ascending: s.by === column ? !s.ascending : true }));
    };

    const handleDelete = async () => {
        if (!selectedLog) return;
        try {
            await deleteEmailLog(selectedLog.id);
            toast({ title: 'Success', description: 'Email log deleted.' });
            loadLogs();
        } catch (err) {
            toast({ variant: 'destructive', title: 'Error', description: err.message });
        }
        setDeleteOpen(false);
        setSelectedLog(null);
    };

    const StatusBadge = ({ status }) => {
        const variants = {
            sent: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/20' },
            failed: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/20' },
            bounced: { icon: AlertCircle, color: 'text-orange-400', bg: 'bg-orange-500/20' },
            pending: { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
        };
        const { icon, color, bg } = variants[status] || { icon: AlertCircle, color: 'text-gray-400', bg: 'bg-gray-500/20' };
        return (
            <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${color} ${bg}`}>
                {React.createElement(icon, { className: "w-3 h-3 mr-1" })}
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const totalPages = Math.ceil(totalLogs / LOGS_PER_PAGE);

    return (
        <>
            <Helmet><title>Email Logs - Petrolord</title></Helmet>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2 flex items-center"><Mail className="w-8 h-8 mr-4" />Email Logs</h1>
                        <p className="text-xl text-gray-400">Monitor all outgoing emails from the system.</p>
                    </div>
                </div>

                <div className="bg-[#1E293B] rounded-lg p-4 mb-6 border border-gray-800 flex flex-wrap items-center gap-4">
                    <div className="relative flex-grow min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
                        <Input placeholder="Search recipient or subject..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 w-full" />
                    </div>
                    <Select value={filters.type} onValueChange={value => setFilters(f => ({ ...f, type: value }))}>
                        <SelectTrigger className="flex-grow min-w-[150px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {emailTypes.map(t => <SelectItem key={t} value={t}>{t.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Select value={filters.status} onValueChange={value => setFilters(f => ({ ...f, status: value }))}>
                        <SelectTrigger className="flex-grow min-w-[150px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {statuses.map(s => <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                
                <div className="bg-[#1E293B] rounded-lg border border-gray-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-[#0F172A]">
                                <tr>
                                    {['recipient_email', 'subject', 'email_type', 'status', 'created_at'].map(col => (
                                        <th key={col} className="px-6 py-3 text-left font-semibold text-gray-300">
                                            <button onClick={() => handleSort(col)} className="flex items-center gap-2">
                                                {col.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                <ArrowUpDown className="w-3 h-3" />
                                            </button>
                                        </th>
                                    ))}
                                    <th className="px-6 py-3 text-right font-semibold text-gray-300">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {loading ? (
                                    Array.from({ length: 10 }).map((_, i) => (
                                        <tr key={i}><td colSpan="6" className="p-4"><div className="h-4 bg-slate-700 rounded animate-pulse"></div></td></tr>
                                    ))
                                ) : logs.length === 0 ? (
                                    <tr><td colSpan="6" className="text-center py-10 text-gray-400">No email logs found.</td></tr>
                                ) : (
                                    logs.map(log => (
                                        <tr key={log.id} className="hover:bg-slate-800/50">
                                            <td className="px-6 py-4 text-white font-medium">{log.recipient_email}</td>
                                            <td className="px-6 py-4 text-gray-300 truncate max-w-xs">{log.subject}</td>
                                            <td className="px-6 py-4 text-gray-300">{log.email_type}</td>
                                            <td className="px-6 py-4"><StatusBadge status={log.status} /></td>
                                            <td className="px-6 py-4 text-gray-300">{new Date(log.created_at).toLocaleString()}</td>
                                            <td className="px-6 py-4 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => { setSelectedLog(log); setDetailOpen(true); }}><Eye className="mr-2 h-4 w-4" /> View Details</DropdownMenuItem>
                                                        {log.status === 'failed' && <DropdownMenuItem onClick={() => { setSelectedLog(log); setResendOpen(true); }}><Redo className="mr-2 h-4 w-4" /> Resend</DropdownMenuItem>}
                                                        <DropdownMenuItem onClick={() => { setSelectedLog(log); setDeleteOpen(true); }} className="text-red-500"><Trash2 className="mr-2 h-4 w-4" /> Delete Log</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-6">
                    <span className="text-sm text-gray-400">Page {currentPage} of {totalPages} ({totalLogs} logs)</span>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}><ChevronLeft className="h-4 w-4 mr-1" /> Previous</Button>
                        <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next <ChevronRight className="h-4 w-4 ml-1" /></Button>
                    </div>
                </div>

            </motion.div>

            <EmailDetailModal log={selectedLog} isOpen={isDetailOpen} onClose={() => setDetailOpen(false)} onResend={(log) => { setDetailOpen(false); setSelectedLog(log); setResendOpen(true); }} />
            <EmailResendModal log={selectedLog} isOpen={isResendOpen} onClose={() => setResendOpen(false)} onResent={loadLogs} />

            <AlertDialog open={isDeleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Email Log?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the log. This action cannot be undone. Are you sure?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default AdminEmailLogsPage;