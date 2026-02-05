import React from 'react';
import { useIRRAnalysis } from '@/context/economics/IRRAnalysisContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FolderOpen, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NewProjectModal from './NewProjectModal';
import { useState } from 'react';

const ProjectSelector = () => {
  const { projects, currentProject, selectProject, loading } = useIRRAnalysis();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelect = (value) => {
    if (value === 'new_project_action') {
      setIsModalOpen(true);
    } else {
      selectProject(value);
    }
  };

  return (
    <>
      <div className="w-[200px] lg:w-[260px]">
        <Select 
          value={currentProject?.project_id || ''} 
          onValueChange={handleSelect}
          disabled={loading}
        >
          <SelectTrigger className="w-full bg-slate-900 border-slate-700 text-slate-200 h-8 text-xs">
            <div className="flex items-center gap-2 truncate">
              <FolderOpen className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <SelectValue placeholder="Select Project" />
            </div>
          </SelectTrigger>
          <SelectContent className="bg-[#1E293B] border-slate-700 text-slate-200">
            <SelectItem value="new_project_action" className="text-blue-400 focus:text-blue-300 focus:bg-slate-800 cursor-pointer border-b border-slate-700 pb-2 mb-1">
              <div className="flex items-center gap-2">
                <Plus className="w-3.5 h-3.5" />
                <span>Create New Project</span>
              </div>
            </SelectItem>
            
            {projects.length === 0 ? (
              <div className="p-2 text-xs text-slate-500 text-center italic">No projects found</div>
            ) : (
              projects.map((project) => (
                <SelectItem 
                  key={project.project_id} 
                  value={project.project_id}
                  className="focus:bg-slate-800 focus:text-white cursor-pointer text-xs py-2"
                >
                  {project.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      <NewProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default ProjectSelector;