import React, { useState } from 'react';
import { useHydraulicsSimulator } from '@/contexts/HydraulicsSimulatorContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Edit, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const ProjectsList = () => {
  const { projects, setCurrentProject, deleteProject, setCurrentTab } = useHydraulicsSimulator();
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, projectId: null });

  const handleLoad = (project) => {
    setCurrentProject(project);
    setCurrentTab('Setup');
    toast({ title: "Project Loaded", description: `Active project set to ${project.name}` });
  };

  const handleDeleteClick = (id, e) => {
    e.stopPropagation();
    setDeleteConfirm({ open: true, projectId: id });
  };

  const confirmDelete = () => {
    if (deleteConfirm.projectId) {
      deleteProject(deleteConfirm.projectId);
      setDeleteConfirm({ open: false, projectId: null });
      toast({ title: "Project Deleted", description: "Project has been removed." });
    }
  };

  return (
    <>
      <div className="rounded-md border border-slate-800 overflow-hidden bg-slate-900">
        <Table>
          <TableHeader className="bg-slate-950">
            <TableRow>
              <TableHead>Project Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Units</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length === 0 ? (
              <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-slate-500">No projects found. Create one to get started.</TableCell>
              </TableRow>
            ) : (
               projects.map((project) => (
                  <TableRow key={project.project_id} className="hover:bg-slate-800/50 cursor-pointer" onClick={() => handleLoad(project)}>
                    <TableCell className="font-medium text-slate-200">{project.name}</TableCell>
                    <TableCell>{project.location}</TableCell>
                    <TableCell>{project.unit_system}</TableCell>
                    <TableCell className="text-slate-400 text-xs">
                      {new Date(project.created_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20" onClick={(e) => { e.stopPropagation(); handleLoad(project); }}>
                              <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-900/20" onClick={(e) => handleDeleteClick(project.project_id, e)}>
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
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this project? This action cannot be undone.
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

export default ProjectsList;