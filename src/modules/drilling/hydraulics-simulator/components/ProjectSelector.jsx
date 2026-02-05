import React from 'react';
import { useHydraulicsSimulator } from '@/contexts/HydraulicsSimulatorContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FolderGit2 } from 'lucide-react';

const ProjectSelector = () => {
  const { projects, current_project, setCurrentProject } = useHydraulicsSimulator();

  const handleSelect = (value) => {
    const selected = projects.find(p => p.project_id === value);
    if (selected) setCurrentProject(selected);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="bg-slate-800 p-1.5 rounded">
        <FolderGit2 className="h-4 w-4 text-blue-400" />
      </div>
      <Select value={current_project?.project_id || ''} onValueChange={handleSelect}>
        <SelectTrigger className="w-[180px] h-8 bg-slate-800 border-slate-700 text-slate-200 focus:ring-blue-500">
          <SelectValue placeholder="Select Project" />
        </SelectTrigger>
        <SelectContent className="bg-slate-900 border-slate-700 text-slate-200">
          {projects.map(project => (
            <SelectItem key={project.project_id} value={project.project_id} className="focus:bg-slate-800 focus:text-white cursor-pointer">
              {project.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ProjectSelector;