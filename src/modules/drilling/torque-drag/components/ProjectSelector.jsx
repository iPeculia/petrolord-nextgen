import React from 'react';
import { ChevronDown, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useTorqueDrag } from '@/contexts/TorqueDragContext';

const ProjectSelector = () => {
  const { projects, current_project, setCurrentProject } = useTorqueDrag();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="h-full px-3 py-2 hover:bg-slate-800 text-slate-300 border-r border-slate-800 rounded-none flex items-center gap-2 min-w-[200px] justify-between"
        >
          <div className="flex items-center gap-2">
            <FolderOpen className="h-4 w-4 text-blue-500" />
            <span className="truncate max-w-[140px]">
              {current_project ? current_project.name : 'Select Project'}
            </span>
          </div>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[240px] bg-slate-900 border-slate-700 text-slate-300">
        <DropdownMenuLabel>Projects</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-slate-700" />
        {projects.map((project) => (
          <DropdownMenuItem
            key={project.project_id}
            className={`cursor-pointer focus:bg-slate-800 focus:text-white ${
              current_project?.project_id === project.project_id ? 'bg-slate-800 text-white' : ''
            }`}
            onClick={() => setCurrentProject(project)}
          >
            <FolderOpen className="mr-2 h-4 w-4 text-blue-500" />
            <span>{project.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProjectSelector;