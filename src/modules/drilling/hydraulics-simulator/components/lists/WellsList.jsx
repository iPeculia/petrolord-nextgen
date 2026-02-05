import React, { useState } from 'react';
import { useHydraulicsSimulator } from '@/contexts/HydraulicsSimulatorContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Edit, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const WellsList = () => {
  const { current_project, wells, setCurrentWell, deleteWell, setCurrentTab } = useHydraulicsSimulator();
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, wellId: null });

  const projectWells = wells.filter(w => w.project_id === current_project?.project_id);

  const handleLoad = (well) => {
    setCurrentWell(well);
    setCurrentTab('Setup');
    setTimeout(() => document.querySelector('[data-tab="Well"]')?.click(), 100);
    toast({ title: "Well Loaded", description: `Active well set to ${well.name}` });
  };

  const handleDeleteClick = (id, e) => {
    e.stopPropagation();
    setDeleteConfirm({ open: true, wellId: id });
  };

  const confirmDelete = () => {
    if (deleteConfirm.wellId) {
      deleteWell(deleteConfirm.wellId);
      setDeleteConfirm({ open: false, wellId: null });
      toast({ title: "Well Deleted", description: "Well has been removed." });
    }
  };

  if (!current_project) return <div className="p-4 text-center text-slate-500">Select a project to view wells.</div>;

  return (
    <>
      <div className="rounded-md border border-slate-800 overflow-hidden bg-slate-900">
        <Table>
          <TableHeader className="bg-slate-950">
            <TableRow>
              <TableHead>Well Name</TableHead>
              <TableHead>API Number</TableHead>
              <TableHead>Rig</TableHead>
              <TableHead>TD (ft)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projectWells.length === 0 ? (
              <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-slate-500">No wells found for this project.</TableCell>
              </TableRow>
            ) : (
               projectWells.map((well) => (
                  <TableRow key={well.well_id} className="hover:bg-slate-800/50 cursor-pointer" onClick={() => handleLoad(well)}>
                    <TableCell className="font-medium text-slate-200">{well.name}</TableCell>
                    <TableCell>{well.api_number}</TableCell>
                    <TableCell>{well.rig_name}</TableCell>
                    <TableCell>{well.total_depth_ft}</TableCell>
                    <TableCell>
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                            well.status === 'Drilling' ? 'bg-green-900/30 text-green-400' :
                            well.status === 'Completed' ? 'bg-blue-900/30 text-blue-400' :
                            'bg-slate-800 text-slate-400'
                        }`}>
                            {well.status}
                        </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20" onClick={(e) => { e.stopPropagation(); handleLoad(well); }}>
                              <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-900/20" onClick={(e) => handleDeleteClick(well.well_id, e)}>
                              <Trash2 className="h-4 w-4" />
                          </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteConfirm.open} onOpenChange={(open) => setDeleteConfirm({ ...deleteConfirm, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Well</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this well? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-3">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default WellsList;