import React, { useState } from 'react';
import { useRiskAnalysis } from '@/context/RiskAnalysisContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  ChevronDown, 
  FolderOpen, 
  Plus, 
  Briefcase,
  Zap,
  Leaf,
  Building,
  Check
} from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const ProjectTypeIcon = ({ type }) => {
  switch (type) {
    case 'Oil': return <Zap className="w-4 h-4 text-amber-500" />;
    case 'Gas': return <Zap className="w-4 h-4 text-blue-500" />;
    case 'Renewable': return <Leaf className="w-4 h-4 text-green-500" />;
    case 'Infrastructure': return <Building className="w-4 h-4 text-slate-400" />;
    default: return <Briefcase className="w-4 h-4 text-slate-400" />;
  }
};

const ProjectSelector = () => {
  const { projects, currentProject, setCurrentProject, addProject } = useRiskAnalysis();
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectType, setNewProjectType] = useState('Oil');

  const handleCreateProject = () => {
    if (!newProjectName.trim()) return;
    
    addProject({
      name: newProjectName,
      type: newProjectType,
      owner: user?.id,
      currency: 'USD',
      status: 'Active'
    });
    
    setNewProjectName('');
    setIsDialogOpen(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="h-10 px-3 bg-[#262626] hover:bg-[#333] border border-[#333] text-slate-200 gap-2 min-w-[200px] justify-between"
          >
            <div className="flex items-center gap-2 truncate">
              <FolderOpen className="w-4 h-4 text-blue-500" />
              <span className="truncate max-w-[140px]">
                {currentProject ? currentProject.name : 'Select Project'}
              </span>
            </div>
            <ChevronDown className="w-4 h-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[240px] bg-[#262626] border-[#333] text-slate-200">
          <DropdownMenuLabel className="text-xs text-slate-400 font-normal">Recent Projects</DropdownMenuLabel>
          {projects.map(project => (
            <DropdownMenuItem 
              key={project.project_id}
              onClick={() => setCurrentProject(project)}
              className="flex items-center gap-2 cursor-pointer focus:bg-[#333] focus:text-white"
            >
              <ProjectTypeIcon type={project.type} />
              <span className="flex-1 truncate">{project.name}</span>
              {currentProject?.project_id === project.project_id && (
                <Check className="w-3 h-3 text-blue-500" />
              )}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator className="bg-[#333]" />
          <DropdownMenuItem 
            className="flex items-center gap-2 cursor-pointer text-blue-400 focus:bg-[#333] focus:text-blue-300"
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#1a1a1a] border-[#333] text-slate-200">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Project Name</Label>
              <Input 
                id="name" 
                value={newProjectName} 
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="North Sea Expansion"
                className="bg-[#262626] border-[#333]"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Project Type</Label>
              <select 
                id="type"
                value={newProjectType}
                onChange={(e) => setNewProjectType(e.target.value)}
                className="flex h-10 w-full rounded-md border border-[#333] bg-[#262626] px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Oil">Oil</option>
                <option value="Gas">Gas</option>
                <option value="Renewable">Renewable</option>
                <option value="Infrastructure">Infrastructure</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-[#333] hover:bg-[#262626] text-slate-300">
              Cancel
            </Button>
            <Button onClick={handleCreateProject} className="bg-blue-600 hover:bg-blue-700 text-white">
              Create Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProjectSelector;