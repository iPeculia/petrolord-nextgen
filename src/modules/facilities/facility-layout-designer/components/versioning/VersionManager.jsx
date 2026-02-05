import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { History, Save, Eye, GitCompare } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { logAuditAction } from '../../utils/auditLogger';
import CompareVersionsModal from './CompareVersionsModal';

const VersionManager = ({ layoutId, currentData, onRestore }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [versions, setVersions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newVersion, setNewVersion] = useState({ number: '', description: '' });
    const [isCompareOpen, setIsCompareOpen] = useState(false);
    
    const { toast } = useToast();

    useEffect(() => {
        if (layoutId && isOpen) {
            fetchVersions();
        }
    }, [layoutId, isOpen]);

    const fetchVersions = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('facility_layout_versions')
            .select('*, profiles(display_name)')
            .eq('layout_id', layoutId)
            .order('created_at', { ascending: false });
        
        if (error) {
            toast({ title: 'Error fetching versions', description: error.message, variant: 'destructive' });
        } else {
            setVersions(data || []);
            // Suggest next version
            if (data && data.length > 0) {
                const lastVer = data[0].version_number;
                const parts = lastVer.split('.');
                if (parts.length > 0 && !isNaN(parseInt(parts[parts.length-1]))) {
                    const nextNum = parseInt(parts[parts.length-1]) + 1;
                    setNewVersion(prev => ({ ...prev, number: `v1.${nextNum}` }));
                } else {
                    setNewVersion(prev => ({ ...prev, number: 'v1.1' }));
                }
            } else {
                setNewVersion(prev => ({ ...prev, number: 'v1.0' }));
            }
        }
        setLoading(false);
    };

    const handleCreateVersion = async () => {
        if (!newVersion.number) return;
        setLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();

            const payload = {
                layout_id: layoutId,
                version_number: newVersion.number,
                description: newVersion.description,
                status: 'Draft',
                data: currentData, // The full snapshot JSON
                created_by: user.id
            };

            const { error } = await supabase.from('facility_layout_versions').insert(payload);

            if (error) throw error;

            await logAuditAction(layoutId, 'CREATE_VERSION', { version: newVersion.number });

            toast({ title: 'Version Created', description: `Version ${newVersion.number} saved successfully.` });
            setNewVersion({ number: '', description: '' });
            fetchVersions();

        } catch (error) {
            console.error(error);
            toast({ title: 'Error creating version', description: error.message, variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (versionId, newStatus, currentStatus) => {
        // Simple role check simulation (In real app, check user role from context)
        // Ensure workflow consistency
        if (currentStatus === 'Approved' && newStatus === 'Draft') {
             toast({ title: 'Invalid Transition', description: 'Cannot revert Approved version to Draft directly.', variant: 'destructive' });
             return;
        }

        const { error } = await supabase
            .from('facility_layout_versions')
            .update({ status: newStatus })
            .eq('id', versionId);

        if (error) {
            toast({ title: 'Update failed', description: error.message, variant: 'destructive' });
        } else {
            await logAuditAction(layoutId, 'UPDATE_VERSION_STATUS', { version_id: versionId, old: currentStatus, new: newStatus });
            toast({ title: 'Status Updated', description: `Version status changed to ${newStatus}` });
            fetchVersions();
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'Approved': return 'bg-green-500/20 text-green-400 border-green-500/50';
            case 'Review': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
            case 'Archived': return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
            default: return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
        }
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white" title="Version History">
                        <History className="w-4 h-4" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#1a1a1a] border-slate-700 text-white max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
                    <DialogHeader>
                        <DialogTitle className="flex items-center justify-between">
                            <span>Version History</span>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="mr-8 border-slate-600 hover:bg-slate-800"
                                onClick={() => setIsCompareOpen(true)}
                                disabled={versions.length < 2}
                            >
                                <GitCompare className="w-4 h-4 mr-2" /> Compare Versions
                            </Button>
                        </DialogTitle>
                    </DialogHeader>

                    <div className="flex gap-4 flex-1 overflow-hidden pt-4">
                        {/* Create New Version Panel */}
                        <div className="w-1/3 border-r border-slate-700 pr-4 flex flex-col gap-4">
                            <h3 className="font-semibold text-sm text-slate-400 uppercase">Create Snapshot</h3>
                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <Label>Version Number</Label>
                                    <Input 
                                        value={newVersion.number}
                                        onChange={(e) => setNewVersion({...newVersion, number: e.target.value})}
                                        placeholder="e.g. v1.2"
                                        className="bg-slate-900 border-slate-700"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label>Description</Label>
                                    <Textarea 
                                        value={newVersion.description}
                                        onChange={(e) => setNewVersion({...newVersion, description: e.target.value})}
                                        placeholder="What changed in this version?"
                                        className="bg-slate-900 border-slate-700 min-h-[100px]"
                                    />
                                </div>
                                <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleCreateVersion} disabled={loading}>
                                    <Save className="w-4 h-4 mr-2" /> Save Version
                                </Button>
                            </div>
                        </div>

                        {/* Version List */}
                        <div className="flex-1 overflow-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-slate-700 hover:bg-slate-800/50">
                                        <TableHead className="text-slate-400">Version</TableHead>
                                        <TableHead className="text-slate-400">Status</TableHead>
                                        <TableHead className="text-slate-400">Date</TableHead>
                                        <TableHead className="text-slate-400">Author</TableHead>
                                        <TableHead className="text-slate-400 text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {versions.map(ver => (
                                        <TableRow key={ver.id} className="border-slate-800 hover:bg-slate-800/30">
                                            <TableCell className="font-mono font-bold">{ver.version_number}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={getStatusColor(ver.status)}>
                                                    {ver.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-xs text-slate-500">
                                                {format(new Date(ver.created_at), 'MMM d, HH:mm')}
                                            </TableCell>
                                            <TableCell className="text-xs">{ver.profiles?.display_name || 'Unknown'}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                     <Select 
                                                        defaultValue={ver.status} 
                                                        onValueChange={(val) => handleStatusChange(ver.id, val, ver.status)}
                                                        disabled={ver.status === 'Archived'}
                                                    >
                                                        <SelectTrigger className="h-6 w-[100px] text-[10px] bg-slate-900 border-slate-700">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-slate-800 border-slate-700 text-white">
                                                            <SelectItem value="Draft">Draft</SelectItem>
                                                            <SelectItem value="Review">Review</SelectItem>
                                                            <SelectItem value="Approved">Approved</SelectItem>
                                                            <SelectItem value="Archived">Archived</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        className="h-6 w-6 text-blue-400 hover:bg-blue-900/50"
                                                        onClick={() => onRestore && onRestore(ver.data)}
                                                        title="Load this version"
                                                    >
                                                        <Eye className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {versions.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center text-slate-500 py-8">
                                                No versions saved yet.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <CompareVersionsModal 
                isOpen={isCompareOpen}
                onClose={() => setIsCompareOpen(false)}
                layoutId={layoutId}
                versions={versions}
            />
        </>
    );
};

export default VersionManager;