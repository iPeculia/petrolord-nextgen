import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Folder, Search, Users, Calendar, Globe, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import useProjectStore from '@/store/projectStore';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import ProjectDetailsModal from './ProjectDetailsModal';

const ProjectList = () => {
  const { projects, currentProject, setCurrentProject, deleteProject } = useProjectStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const filteredProjects = projects.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.client_name && p.client_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleEdit = (project, e) => {
      e.stopPropagation();
      setEditingProject(project);
      setDetailsOpen(true);
  };

  if (projects.length === 0) {
      return <div className="p-8 text-center text-slate-500 text-sm border border-dashed border-slate-800 rounded-lg bg-slate-900/30">
          No projects found. Create one to get started.
      </div>;
  }

  return (
    <div className="space-y-4">
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input 
                placeholder="Filter projects..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-slate-900 border-slate-700 h-9 text-sm"
            />
        </div>

        <ScrollArea className="h-[350px] pr-4">
        <div className="space-y-2">
            {filteredProjects.map((project) => (
            <div
                key={project.id}
                onClick={() => setCurrentProject(project)}
                className={cn(
                "group flex flex-col gap-2 p-3 rounded-lg border cursor-pointer transition-all relative",
                currentProject?.id === project.id 
                    ? "bg-blue-950/20 border-blue-500/40 shadow-[0_0_10px_rgba(59,130,246,0.1)]" 
                    : "bg-slate-900/40 border-slate-800 hover:bg-slate-800/60 hover:border-slate-700"
                )}
            >
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className={cn(
                            "p-2 rounded-lg",
                            currentProject?.id === project.id ? "bg-blue-500/20 text-blue-400" : "bg-slate-800 text-slate-500"
                        )}>
                            <Folder className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className={cn("text-sm font-semibold truncate", currentProject?.id === project.id ? "text-blue-100" : "text-slate-200")}>
                                {project.name}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <span className="flex items-center gap-1"><Calendar className="w-3 h-3"/> {new Date(project.updated_at).toLocaleDateString()}</span>
                                {project.client_name && <span>• {project.client_name}</span>}
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        {project.is_public ? 
                            <Badge variant="outline" className="text-[10px] h-5 border-slate-700 text-slate-400 gap-1"><Globe className="w-3 h-3"/> Public</Badge> 
                            : 
                            <Badge variant="outline" className="text-[10px] h-5 border-slate-700 text-slate-500 gap-1"><Lock className="w-3 h-3"/> Private</Badge>
                        }
                        {currentProject?.id === project.id && <Badge className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/20 text-[10px] h-5">Active</Badge>}
                    </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/50 mt-1">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="capitalize">{project.type}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                        <span className="flex items-center gap-1"><Users className="w-3 h-3"/> Team</span>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-slate-400 hover:text-white hover:bg-slate-700" onClick={(e) => handleEdit(project, e)}>
                            <Edit className="w-3.5 h-3.5" />
                        </Button>
                        
                        <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-7 w-7 text-slate-400 hover:text-red-400 hover:bg-red-900/20" 
                            onClick={(e) => e.stopPropagation()}
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-slate-950 border-slate-800 text-slate-200" onClick={(e) => e.stopPropagation()}>
                            <AlertDialogHeader>
                            <AlertDialogTitle className="text-white">Delete Project?</AlertDialogTitle>
                            <AlertDialogDescription className="text-slate-400">
                                This action cannot be undone. This will permanently delete "{project.name}" and all associated data.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel className="bg-slate-900 text-white border-slate-700 hover:bg-slate-800 hover:text-white">Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                                className="bg-red-600 text-white hover:bg-red-700"
                                onClick={(e) => {
                                e.stopPropagation();
                                deleteProject(project.id);
                                }}
                            >
                                Delete
                            </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            </div>
            ))}
        </div>
        </ScrollArea>

        <ProjectDetailsModal 
            project={editingProject} 
            open={detailsOpen} 
            onOpenChange={setDetailsOpen} 
        />
    </div>
  );
};

export default ProjectList;