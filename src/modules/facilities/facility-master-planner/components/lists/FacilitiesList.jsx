import React, { useState } from 'react';
import { Building2, Edit2, Trash2, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFacilityMasterPlanner } from '../../context/FacilityMasterPlannerContext';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
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
import FacilityForm from '../forms/FacilityForm';
import { cn } from '@/lib/utils';

const FacilitiesList = () => {
  const { facilities, deleteFacility, currentProject, currentFacility, setCurrentFacility } = useFacilityMasterPlanner();
  const [editingId, setEditingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Filter facilities by current project
  const projectFacilities = currentProject 
    ? facilities.filter(f => f.project_id === currentProject.project_id)
    : [];

  const handleEdit = (e, facility) => {
    e.stopPropagation();
    setEditingId(facility.facility_id);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (e, id) => {
    e.stopPropagation();
    setDeleteId(id);
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      deleteFacility(deleteId);
      setDeleteId(null);
    }
  };

  if (!currentProject) return (
    <div className="p-8 text-center text-slate-500">
        Please select a project first.
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Facilities in {currentProject.name}</h3>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" onClick={() => setEditingId(null)} className="border-dashed border-slate-700 hover:border-emerald-500 hover:text-emerald-500">
                    + New Facility
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-[#1a1a1a] border-slate-800 text-white p-0 overflow-hidden">
                <FacilityForm 
                    onClose={() => setIsFormOpen(false)} 
                    editFacility={editingId ? facilities.find(f => f.facility_id === editingId) : null} 
                />
            </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projectFacilities.map(facility => (
            <div 
                key={facility.facility_id}
                onClick={() => setCurrentFacility(facility)}
                className={cn(
                    "group relative p-4 rounded-lg border transition-all cursor-pointer hover:shadow-lg bg-[#1a1a1a]",
                    currentFacility?.facility_id === facility.facility_id
                        ? "border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]" 
                        : "border-slate-800 hover:border-slate-600"
                )}
            >
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded bg-emerald-500/10 flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-white">{facility.name}</h4>
                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                <Activity className="w-3 h-3 text-emerald-500" />
                                <span>{facility.status}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                         <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-white" onClick={(e) => handleEdit(e, facility)}>
                            <Edit2 className="w-3 h-3" />
                         </Button>
                         <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-red-400" onClick={(e) => handleDeleteClick(e, facility.facility_id)}>
                            <Trash2 className="w-3 h-3" />
                         </Button>
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-900/50 p-2 rounded">
                        <div className="text-slate-500">Design Cap</div>
                        <div className="text-white font-medium">{(facility.design_capacity_oil_bpd/1000).toFixed(0)}k bpd</div>
                    </div>
                    <div className="bg-slate-900/50 p-2 rounded">
                        <div className="text-slate-500">Utilization</div>
                        <div className="text-white font-medium">
                            {((facility.current_capacity_oil_bpd / facility.design_capacity_oil_bpd) * 100).toFixed(1)}%
                        </div>
                    </div>
                </div>
            </div>
        ))}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="bg-[#1a1a1a] border-slate-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              This action cannot be undone. This will permanently delete the facility and remove its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-slate-700 text-white hover:bg-slate-800 hover:text-white">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700 text-white border-none">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FacilitiesList;