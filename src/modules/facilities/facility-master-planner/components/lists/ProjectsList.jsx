import React, { useState } from 'react';
import { FolderKanban, Edit2, Trash2, ArrowRight } from 'lucide-react';
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
import ProjectForm from '../forms/ProjectForm';
import { cn } from '@/lib/utils';

const ProjectsList = ({ onSelect }) => {
  const { projects, deleteProject, currentProject, setCurrentProject } = useFacilityMasterPlanner();
  const [editingId, setEditingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const handleEdit = (e, project) => {
    e.stopPropagation();
    setEditingId(project.project_id);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (e, id) => {
    e.stopPropagation();
    setDeleteId(id);
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      deleteProject(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Available Projects</h3>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" onClick={() => setEditingId(null)} className="border-dashed border-slate-700 hover:border-blue-500 hover:text-blue-500">
                    + New Project
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-[#1a1a1a] border-slate-800 text-white p-0 overflow-hidden">
                <ProjectForm 
                    onClose={() => setIsFormOpen(false)} 
                    editProject={editingId ? projects.find(p => p.project_id === editingId) : null} 
                />
            </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {projects.map(project => (
            <div 
                key={project.project_id}
                onClick={() => {
                    setCurrentProject(project);
                    if(onSelect) onSelect(project);
                }}
                className={cn(
                    "group relative p-4 rounded-lg border transition-all cursor-pointer hover:shadow-lg",
                    currentProject?.project_id === project.project_id
                        ? "bg-blue-600/10 border-blue-500/50" 
                        : "bg-[#1a1a1a] border-slate-800 hover:border-slate-600"
                )}
            >
                <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                        <div className={cn(
                            "p-2 rounded-md",
                            currentProject?.project_id === project.project_id ? "bg-blue-500 text-white" : "bg-slate-800 text-slate-400"
                        )}>
                            <FolderKanban className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-white group-hover:text-blue-400 transition-colors">{project.name}</h4>
                            <div className="text-xs text-slate-500 mt-1 flex gap-2">
                                <span>{project.location}</span>
                                <span>•</span>
                                <span>{project.facility_type}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                         <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white" onClick={(e) => handleEdit(e, project)}>
                            <Edit2 className="w-3.5 h-3.5" />
                         </Button>
                         <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-400" onClick={(e) => handleDeleteClick(e, project.project_id)}>
                            <Trash2 className="w-3.5 h-3.5" />
                         </Button>
                    </div>
                </div>

                {currentProject?.project_id === project.project_id && (
                    <div className="absolute right-4 bottom-4">
                        <ArrowRight className="w-4 h-4 text-blue-500 animate-pulse" />
                    </div>
                )}
            </div>
        ))}

        {projects.length === 0 && (
            <div className="text-center py-8 text-slate-500 bg-slate-900/30 rounded-lg border border-dashed border-slate-800">
                <p>No projects found. Create one to begin.</p>
            </div>
        )}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="bg-[#1a1a1a] border-slate-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              This action cannot be undone. This will permanently delete the project and all associated facilities.
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

export default ProjectsList;