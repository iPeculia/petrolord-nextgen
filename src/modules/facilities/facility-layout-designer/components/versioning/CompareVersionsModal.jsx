import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from '@/components/ui/badge';
import { ArrowRight, PlusCircle, MinusCircle, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { format } from 'date-fns';

const CompareVersionsModal = ({ isOpen, onClose, layoutId, versions }) => {
    const [versionAId, setVersionAId] = useState(null);
    const [versionBId, setVersionBId] = useState(null);
    const [diffResult, setDiffResult] = useState(null);
    const [loading, setLoading] = useState(false);

    // Auto-select latest two versions when opened
    useEffect(() => {
        if (isOpen && versions.length >= 2) {
            setVersionAId(versions[1].id); // Older
            setVersionBId(versions[0].id); // Newer
        } else if (isOpen && versions.length === 1) {
             setVersionBId(versions[0].id);
        }
    }, [isOpen, versions]);

    useEffect(() => {
        if (versionAId && versionBId) {
            calculateDiff();
        }
    }, [versionAId, versionBId]);

    const calculateDiff = async () => {
        setLoading(true);
        // Fetch full data for selected versions if not already loaded
        // (Assuming 'versions' prop might be lightweight, we fetch full row here to be safe)
        const { data: verA } = await supabase.from('facility_layout_versions').select('*').eq('id', versionAId).single();
        const { data: verB } = await supabase.from('facility_layout_versions').select('*').eq('id', versionBId).single();

        if (!verA || !verB) {
            setLoading(false);
            return;
        }

        const itemsA = verA.data.equipment || [];
        const itemsB = verB.data.equipment || [];

        const added = [];
        const removed = [];
        const modified = [];
        const unchanged = [];

        // Create map of A items
        const mapA = new Map(itemsA.map(i => [i.id, i]));

        // Check B against A
        itemsB.forEach(itemB => {
            const itemA = mapA.get(itemB.id);
            if (!itemA) {
                added.push(itemB);
            } else {
                // Check for modifications (simplified check on key props)
                const isModified = 
                    itemA.lat !== itemB.lat || 
                    itemA.lng !== itemB.lng ||
                    itemA.type !== itemB.type ||
                    JSON.stringify(itemA.properties) !== JSON.stringify(itemB.properties);
                
                if (isModified) {
                    modified.push({ old: itemA, new: itemB });
                } else {
                    unchanged.push(itemB);
                }
                mapA.delete(itemB.id); // Remove handled item
            }
        });

        // Remaining items in MapA were removed
        mapA.forEach(itemA => removed.push(itemA));

        setDiffResult({ added, removed, modified, unchanged, verA, verB });
        setLoading(false);
    };

    const getVersionLabel = (id) => {
        const v = versions.find(v => v.id === id);
        return v ? `${v.version_number} (${format(new Date(v.created_at), 'MMM d')})` : 'Select Version';
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-[#1a1a1a] border-slate-700 text-white max-w-4xl max-h-[85vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Compare Layout Versions</DialogTitle>
                </DialogHeader>

                <div className="flex items-center gap-4 py-4 bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                    <div className="flex-1">
                        <label className="text-xs text-slate-500 mb-1 block">Baseline Version (A)</label>
                        <Select value={versionAId} onValueChange={setVersionAId}>
                            <SelectTrigger className="bg-slate-800 border-slate-700">
                                <SelectValue placeholder="Select Version A" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-700 text-white">
                                {versions.map(v => (
                                    <SelectItem key={v.id} value={v.id}>{v.version_number} - {v.status}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <ArrowRight className="text-slate-500" />
                    <div className="flex-1">
                        <label className="text-xs text-slate-500 mb-1 block">Comparison Version (B)</label>
                        <Select value={versionBId} onValueChange={setVersionBId}>
                            <SelectTrigger className="bg-slate-800 border-slate-700">
                                <SelectValue placeholder="Select Version B" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-700 text-white">
                                {versions.map(v => (
                                    <SelectItem key={v.id} value={v.id}>{v.version_number} - {v.status}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden flex flex-col gap-4">
                    {loading && <div className="text-center text-slate-400 py-8">Calculating differences...</div>}
                    
                    {!loading && diffResult && (
                        <div className="grid grid-cols-4 gap-4 h-full">
                            {/* Summary Cards */}
                            <div className="col-span-4 grid grid-cols-4 gap-4">
                                <div className="bg-emerald-950/30 border border-emerald-900/50 p-3 rounded text-center">
                                    <div className="text-2xl font-bold text-emerald-500">{diffResult.added.length}</div>
                                    <div className="text-xs text-emerald-300">Added</div>
                                </div>
                                <div className="bg-red-950/30 border border-red-900/50 p-3 rounded text-center">
                                    <div className="text-2xl font-bold text-red-500">{diffResult.removed.length}</div>
                                    <div className="text-xs text-red-300">Removed</div>
                                </div>
                                <div className="bg-amber-950/30 border border-amber-900/50 p-3 rounded text-center">
                                    <div className="text-2xl font-bold text-amber-500">{diffResult.modified.length}</div>
                                    <div className="text-xs text-amber-300">Modified</div>
                                </div>
                                <div className="bg-slate-800/50 border border-slate-700 p-3 rounded text-center">
                                    <div className="text-2xl font-bold text-slate-400">{diffResult.unchanged.length}</div>
                                    <div className="text-xs text-slate-500">Unchanged</div>
                                </div>
                            </div>

                            {/* Detailed List */}
                            <ScrollArea className="col-span-4 h-[300px] border border-slate-800 rounded-lg bg-slate-900/30 p-4">
                                <div className="space-y-2">
                                    {diffResult.added.map(item => (
                                        <div key={item.id} className="flex items-center gap-3 p-2 bg-emerald-950/10 border border-emerald-900/30 rounded">
                                            <PlusCircle className="w-4 h-4 text-emerald-500" />
                                            <div className="flex-1">
                                                <div className="text-sm font-medium text-emerald-200">{item.tag} <span className="text-emerald-500/50 text-xs ml-2">({item.type})</span></div>
                                            </div>
                                        </div>
                                    ))}

                                    {diffResult.removed.map(item => (
                                        <div key={item.id} className="flex items-center gap-3 p-2 bg-red-950/10 border border-red-900/30 rounded">
                                            <MinusCircle className="w-4 h-4 text-red-500" />
                                            <div className="flex-1">
                                                <div className="text-sm font-medium text-red-200">{item.tag} <span className="text-red-500/50 text-xs ml-2">({item.type})</span></div>
                                            </div>
                                        </div>
                                    ))}

                                    {diffResult.modified.map(({old, new: newItem}) => (
                                        <div key={newItem.id} className="flex items-center gap-3 p-2 bg-amber-950/10 border border-amber-900/30 rounded">
                                            <AlertCircle className="w-4 h-4 text-amber-500" />
                                            <div className="flex-1">
                                                <div className="text-sm font-medium text-amber-200">{newItem.tag}</div>
                                                <div className="text-xs text-amber-500/70">
                                                    {old.lat !== newItem.lat || old.lng !== newItem.lng ? 'Position moved. ' : ''}
                                                    {JSON.stringify(old.properties) !== JSON.stringify(newItem.properties) ? 'Properties changed.' : ''}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    
                                    {diffResult.added.length === 0 && diffResult.removed.length === 0 && diffResult.modified.length === 0 && (
                                        <div className="text-center text-slate-500 py-8 flex flex-col items-center">
                                            <CheckCircle className="w-8 h-8 mb-2 opacity-50" />
                                            No differences found between these versions.
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={onClose}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CompareVersionsModal;