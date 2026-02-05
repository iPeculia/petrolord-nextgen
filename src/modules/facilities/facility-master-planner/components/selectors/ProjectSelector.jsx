import React from 'react';
import { Check, ChevronDown, Plus, FolderKanban } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useFacilityMasterPlanner } from '../../context/FacilityMasterPlannerContext';

const ProjectSelector = () => {
  const { projects, currentProject, setCurrentProject } = useFacilityMasterPlanner();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-[240px] justify-between border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700">
          <span className="flex items-center gap-2 truncate">
            <FolderKanban className="w-4 h-4 text-[#0066cc]" />
            {currentProject ? currentProject.name : 'Select Project'}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[240px] bg-slate-900 border-slate-700 text-slate-200">
        <DropdownMenuLabel>Projects</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-slate-700" />
        {projects.map((project) => (
          <DropdownMenuItem
            key={project.project_id}
            onSelect={() => setCurrentProject(project)}
            className="focus:bg-slate-800 focus:text-white cursor-pointer"
          >
            <div className="flex items-center justify-between w-full">
              <span className="truncate">{project.name}</span>
              {currentProject?.project_id === project.project_id && (
                <Check className="h-4 w-4 text-[#0066cc]" />
              )}
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator className="bg-slate-700" />
        <DropdownMenuItem className="focus:bg-slate-800 focus:text-white cursor-pointer text-[#0066cc]">
          <Plus className="mr-2 h-4 w-4" />
          <span>Add New Project</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProjectSelector;