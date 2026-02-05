import React, { useState, useEffect, useMemo } from 'react';
import { useGlobalDataStore } from '@/store/globalDataStore.js';
import useProjectStore from '@/store/projectStore';
import WellSearch from './WellSearch';
import WellForm from './WellForm';
import WellsList from './WellsList';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw, Database } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
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

const WellsPanel = () => {
  const { 
      wells, 
      activeWell, 
      setActiveWell, 
      loadWells,
      addWell, 
      updateWell, 
      deleteWell, 
      isLoading,
      initializeData
  } = useGlobalDataStore();
  
  const { currentProject } = useProjectStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingWell, setEditingWell] = useState(null);
  const [deletingWell, setDeletingWell] = useState(null); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Force data discovery on mount
  useEffect(() => {
      const discoverData = async () => {
          console.log("WellsPanel: Mounting... initiating data discovery.");
          try {
             // This will fetch ALL wells if project is null, or project specific wells
             await loadWells(currentProject?.id);
          } catch (e) {
              console.error("WellsPanel: Error during discovery:", e);
          }
      };
      discoverData();
  }, [currentProject?.id, loadWells]);

  // Filter wells logic
  const wellList = useMemo(() => {
      const allWells = Object.values(wells || {});
      
      if (!searchTerm) return allWells;

      const term = searchTerm.toLowerCase();
      return allWells.filter(well => 
        well.name.toLowerCase().includes(term) ||
        (well.location && typeof well.location === 'string' && well.location.toLowerCase().includes(term)) ||
        (well.field && well.field.toLowerCase().includes(term))
      );
  }, [wells, searchTerm]);


  const handleCreateWell = async (data) => {
      const projectId = currentProject?.id || 'demo-project';

      setIsSubmitting(true);
      try {
          await addWell({ ...data, project_id: projectId });
          setIsCreateOpen(false);
          toast({
              title: "Success",
              description: `Well "${data.name}" created successfully.`,
              className: "bg-emerald-900 border-emerald-800 text-white"
          });
      } catch (error) {
          console.error("Well creation error:", error);
          toast({
              title: "Creation Failed",
              description: error.message || "Failed to create well",
              variant: "destructive",
          });
      } finally {
          setIsSubmitting(false);
      }
  };

  const handleUpdateWell = async (data) => {
      if (!editingWell) return;
      setIsSubmitting(true);
      try {
          await updateWell(editingWell.id, data);
          setEditingWell(null);
          toast({
              title: "Well Updated",
              description: `Changes to "${data.name}" have been saved.`,
              className: "bg-blue-900 border-blue-800 text-white"
          });
      } catch (error) {
          console.error("Well update error:", error);
          toast({
              title: "Update Failed",
              description: error.message || "Failed to update well",
              variant: "destructive",
          });
      } finally {
          setIsSubmitting(false);
      }
  };

  const handleConfirmDelete = async () => {
      if (!deletingWell) return;
      try {
          await deleteWell(deletingWell.id);
          setDeletingWell(null);
          toast({
              title: "Well Deleted",
              description: "The well has been permanently removed.",
              className: "bg-slate-800 border-slate-700 text-white"
          });
      } catch (error) {
          console.error("Well deletion error:", error);
          toast({
              title: "Deletion Failed",
              description: error.message,
              variant: "destructive",
          });
      }
  };

  const handleRefresh = () => {
      const projectId = currentProject?.id;
      loadWells(projectId);
      toast({ description: "Refreshed well list." });
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 border-r border-slate-800">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 space-y-3 shrink-0 bg-[#0B101B]">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-slate-400" />
                <h3 className="font-semibold text-slate-200">
                    Project Wells 
                    <span className="ml-2 text-xs text-slate-500 font-normal">({wellList.length})</span>
                </h3>
            </div>
            <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500 hover:text-white" onClick={handleRefresh}>
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
                <Button 
                    size="sm" 
                    className="h-7 bg-[#BFFF00] text-slate-900 hover:bg-[#a3d900] font-medium text-xs px-2"
                    onClick={() => setIsCreateOpen(true)}
                >
                    <Plus className="w-3.5 h-3.5 mr-1" /> New
                </Button>
            </div>
        </div>
        <WellSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>
      
      {/* Well List */}
      <div className="flex-1 overflow-hidden bg-slate-950">
        <WellsList 
            wells={wellList}
            activeWellId={activeWell}
            onSelect={setActiveWell}
            onEdit={setEditingWell}
            onDelete={setDeletingWell}
            isLoading={isLoading}
        />
      </div>

      {/* Modals */}
      <WellForm 
        open={isCreateOpen} 
        onOpenChange={setIsCreateOpen}
        onSubmit={handleCreateWell}
        isSubmitting={isSubmitting}
        mode="create"
      />

      {editingWell && (
        <WellForm 
            open={!!editingWell} 
            onOpenChange={(open) => !open && setEditingWell(null)}
            initialData={editingWell}
            onSubmit={handleUpdateWell}
            isSubmitting={isSubmitting}
            mode="edit"
        />
      )}

      <AlertDialog open={!!deletingWell} onOpenChange={(open) => !open && setDeletingWell(null)}>
        <AlertDialogContent className="bg-slate-950 border-slate-800 text-slate-200">
            <AlertDialogHeader>
                <AlertDialogTitle>Delete "{deletingWell?.name}"?</AlertDialogTitle>
                <AlertDialogDescription className="text-slate-400">
                    This action cannot be undone. This will permanently delete the well and all associated logs.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel className="bg-slate-900 text-white border-slate-700 hover:bg-slate-800">Cancel</AlertDialogCancel>
                <AlertDialogAction 
                    className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={handleConfirmDelete}
                >
                    Delete
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default WellsPanel;