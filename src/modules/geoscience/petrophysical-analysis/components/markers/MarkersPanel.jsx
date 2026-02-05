import React, { useState, useMemo } from 'react';
import { useGlobalDataStore } from '@/store/globalDataStore.js';
import MarkersList from './MarkersList';
import MarkerForm from './MarkerForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter, SlidersHorizontal } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

const MarkersPanel = () => {
    const { activeWell, markers, addMarker, editMarker, removeMarker, setActiveMarker, activeMarkerId } = useGlobalDataStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingMarker, setEditingMarker] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const wellMarkers = markers[activeWell] || [];

    // Filter markers
    const filteredMarkers = useMemo(() => {
        if (!searchTerm) return wellMarkers;
        const lowerTerm = searchTerm.toLowerCase();
        return wellMarkers.filter(m => 
            m.name.toLowerCase().includes(lowerTerm) || 
            m.marker_type.toLowerCase().includes(lowerTerm)
        );
    }, [wellMarkers, searchTerm]);

    const handleCreate = async (data) => {
        if (!activeWell) return;
        setIsSubmitting(true);
        try {
            await addMarker({ ...data, well_id: activeWell });
            setIsCreateOpen(false);
            toast({ title: "Marker Created", description: `${data.name} added at ${data.depth}m` });
        } catch (error) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdate = async (data) => {
        if (!editingMarker) return;
        setIsSubmitting(true);
        try {
            await editMarker(editingMarker.id, data);
            setEditingMarker(null);
            toast({ title: "Marker Updated", description: `${data.name} updated successfully.` });
        } catch (error) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (markerId) => {
        try {
            await removeMarker(activeWell, markerId);
            toast({ title: "Marker Deleted", description: "Marker removed successfully." });
        } catch (error) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        }
    };

    if (!activeWell) {
        return (
            <div className="p-4 text-center text-slate-500 mt-10">
                <p>Please select a well to manage markers.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-slate-950 border-r border-slate-800">
            {/* Header */}
            <div className="p-4 border-b border-slate-800 space-y-3 bg-slate-900/20">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold text-slate-200">Formation Markers</h3>
                        <p className="text-xs text-slate-500">{wellMarkers.length} total markers</p>
                    </div>
                    <Button 
                        size="sm" 
                        className="h-8 bg-[#BFFF00] text-slate-900 hover:bg-[#a3d900] font-medium text-xs"
                        onClick={() => setIsCreateOpen(true)}
                    >
                        <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Marker
                    </Button>
                </div>
                
                <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                    <Input 
                        placeholder="Search markers..." 
                        className="h-9 pl-8 bg-slate-900 border-slate-800 text-xs focus-visible:ring-1 focus-visible:ring-[#BFFF00]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* List */}
            <div className="flex-1 p-2">
                <MarkersList 
                    markers={filteredMarkers}
                    activeMarkerId={activeMarkerId}
                    onSelect={(m) => setActiveMarker(m.id)}
                    onEdit={setEditingMarker}
                    onDelete={handleDelete}
                />
            </div>

            {/* Create Modal */}
            <MarkerForm 
                open={isCreateOpen}
                onOpenChange={setIsCreateOpen}
                onSubmit={handleCreate}
                isSubmitting={isSubmitting}
                mode="create"
            />

            {/* Edit Modal */}
            {editingMarker && (
                <MarkerForm 
                    open={!!editingMarker}
                    onOpenChange={(open) => !open && setEditingMarker(null)}
                    initialData={editingMarker}
                    onSubmit={handleUpdate}
                    isSubmitting={isSubmitting}
                    mode="edit"
                />
            )}
        </div>
    );
};

export default MarkersPanel;