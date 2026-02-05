import React, { useEffect } from 'react';
import useProjectStore from '@/store/projectStore';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FolderKanban, PlusCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProjectCreationModal from './ProjectCreationModal';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { cn } from '@/lib/utils';

const ProjectSwitcher = () => {
  const { user } = useAuth();
  const { projects, currentProject, setCurrentProject, fetchProjects, loading } = useProjectStore();
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);

  useEffect(() => {
      if (user) {
        fetchProjects();
      }
  }, [fetchProjects, user]);

  const handleValueChange = (value) => {
      if (value === "new_project_action") {
          setIsCreateOpen(true);
          return;
      }
      const project = projects.find(p => p.id === value);
      if (project) setCurrentProject(project);
  };

  if (!user) return null;

  return (
    <>
        <Select value={currentProject?.id || ''} onValueChange={handleValueChange} disabled={loading && projects.length === 0}>
            <SelectTrigger className="w-[240px] bg-slate-900/50 border-slate-700 h-9 text-sm focus:ring-1 focus:ring-slate-600 text-slate-200">
                {loading && projects.length === 0 ? (
                     <div className="flex items-center"><Loader2 className="w-3 h-3 animate-spin mr-2"/> Loading...</div>
                ) : (
                    <div className="flex items-center truncate">
                        <FolderKanban className={cn("w-4 h-4 mr-2 shrink-0", currentProject ? "text-[#BFFF00]" : "text-slate-500")} />
                        <span className="truncate">{currentProject?.name || "Select Project..."}</span>
                    </div>
                )}
            </SelectTrigger>
            <SelectContent className="bg-slate-950 border-slate-800 text-slate-200 max-h-[300px]">
                <div className="px-2 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Recent Projects</div>
                {projects.length === 0 ? (
                    <div className="px-2 py-2 text-sm text-slate-500 text-center italic">No projects found</div>
                ) : (
                    projects.map(p => (
                        <SelectItem key={p.id} value={p.id} className="cursor-pointer focus:bg-slate-800 focus:text-white">
                            <span className="font-medium truncate block max-w-[200px]">{p.name}</span>
                        </SelectItem>
                    ))
                )}
                <div className="p-1 border-t border-slate-800 mt-1">
                    <Button 
                        variant="ghost" 
                        className="w-full justify-start text-xs h-8 text-[#BFFF00] hover:text-[#BFFF00] hover:bg-slate-900"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsCreateOpen(true);
                        }}
                    >
                        <PlusCircle className="w-3.5 h-3.5 mr-2" />
                        Create New Project
                    </Button>
                </div>
            </SelectContent>
        </Select>

        <ProjectCreationModal open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </>
  );
};

export default ProjectSwitcher;