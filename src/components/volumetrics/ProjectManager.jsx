import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ProjectManager } from '@/services/volumetrics/ProjectManager';
import { useVolumetrics } from '@/hooks/useVolumetrics';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { FolderOpen, Plus, Trash2, Save, Clock, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';

const ProjectManagerDialog = ({ open, onOpenChange, mode = 'open' }) => { // mode: 'open' | 'save-as'
    const { state, actions } = useVolumetrics();
    const { user } = useAuth();
    const { toast } = useToast();
    
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newProjectName, setNewProjectName] = useState('');
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState(null);
    
    useEffect(() => {
        if (open) {
            loadProjects();
        }
    }, [open]);

    const loadProjects = () => {
        const list = ProjectManager.listProjects();
        // Sort by date desc
        setProjects(list.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified)));
    };

    const handleCreate = async () => {
        if (!newProjectName.trim()) return;
        setLoading(true);
        try {
            const newProj = await ProjectManager.createProject(user, newProjectName);
            actions.loadProjectState(newProj); // Need to implement this in Context
            toast({ title: "Project Created", description: `"${newProjectName}" created successfully.` });
            onOpenChange(false);
        } catch (err) {
            toast({ title: "Error", description: "Failed to create project.", variant: "destructive" });
        } finally {
            setLoading(false);
            setNewProjectName('');
        }
    };

    const handleOpen = async (id) => {
        setLoading(true);
        try {
            const projData = await ProjectManager.openProject(user, id);
            actions.loadProjectState(projData);
            toast({ title: "Project Loaded", description: `Loaded "${projData.project.name}"` });
            onOpenChange(false);
        } catch (err) {
            toast({ title: "Error", description: "Failed to load project.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (e, id) => {
        e.stopPropagation();
        setProjectToDelete(id);
        setDeleteConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!projectToDelete) return;
        
        try {
            await ProjectManager.deleteProject(user, projectToDelete);
            loadProjects();
            toast({ title: "Project Deleted" });
        } catch (err) {
            toast({ title: "Error", description: "Failed to delete project.", variant: "destructive" });
        } finally {
            setDeleteConfirmOpen(false);
            setProjectToDelete(null);
        }
    };

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[700px] bg-slate-950 border-slate-800 text-slate-100">
                    <DialogHeader>
                        <DialogTitle>{mode === 'open' ? 'Project Manager' : 'Save Project As'}</DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Manage your local Volumetrics Pro projects.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex gap-4 h-[400px]">
                        {/* Left: Create New */}
                        <div className="w-1/3 border-r border-slate-800 pr-4 flex flex-col gap-4">
                            <div>
                                <Label className="text-xs mb-2 block">New Project</Label>
                                <div className="flex flex-col gap-2">
                                    <Input 
                                        placeholder="Project Name..." 
                                        value={newProjectName}
                                        onChange={e => setNewProjectName(e.target.value)}
                                        className="bg-slate-900 border-slate-700"
                                    />
                                    <Button 
                                        onClick={handleCreate} 
                                        disabled={!newProjectName.trim() || loading}
                                        className="w-full bg-[#BFFF00] text-slate-900 hover:bg-[#a3d900]"
                                    >
                                        <Plus className="w-4 h-4 mr-2" /> Create
                                    </Button>
                                </div>
                            </div>
                            
                            <div className="mt-auto p-3 bg-slate-900/50 rounded border border-slate-800 text-xs text-slate-500">
                                <div className="flex items-center gap-2 mb-2 text-slate-300 font-semibold">
                                    <AlertCircle className="w-3 h-3" /> Note
                                </div>
                                Projects are stored in your browser's local storage. Clearing browser data will remove them.
                            </div>
                        </div>

                        {/* Right: List */}
                        <div className="flex-1 pl-2">
                            <Label className="text-xs mb-2 block">Recent Projects</Label>
                            <ScrollArea className="h-full pr-4">
                                {projects.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-40 text-slate-600">
                                        <FolderOpen className="w-10 h-10 mb-2 opacity-20" />
                                        <p>No projects found.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {projects.map(p => (
                                            <div 
                                                key={p.id}
                                                onClick={() => handleOpen(p.id)}
                                                className={`group flex items-center justify-between p-3 rounded border cursor-pointer transition-all hover:bg-slate-900 ${state.project.id === p.id ? 'border-[#BFFF00]/50 bg-[#BFFF00]/5' : 'border-slate-800 bg-slate-950'}`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <FileText className={`w-8 h-8 ${state.project.id === p.id ? 'text-[#BFFF00]' : 'text-slate-500'}`} />
                                                    <div>
                                                        <div className="font-medium text-sm text-slate-200">{p.name}</div>
                                                        <div className="flex items-center gap-2 text-[10px] text-slate-500">
                                                            <Clock className="w-3 h-3" /> 
                                                            {formatDistanceToNow(new Date(p.lastModified), { addSuffix: true })}
                                                        </div>
                                                    </div>
                                                </div>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 h-8 w-8"
                                                    onClick={(e) => handleDeleteClick(e, p.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </ScrollArea>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
                <AlertDialogContent className="bg-slate-950 border-slate-800 text-slate-100">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Project</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-400">
                            Are you sure you want to delete this project? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="flex gap-3 justify-end">
                        <AlertDialogCancel className="bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={handleConfirmDelete}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            Delete
                        </AlertDialogAction>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default ProjectManagerDialog;