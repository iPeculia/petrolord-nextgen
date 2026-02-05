import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProjectSchema } from '@/services/hydraulics/models/Project';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, PlayCircle, Save } from 'lucide-react';
import { useHydraulicsSimulator } from '@/contexts/HydraulicsSimulatorContext';
import { DEMO_PROJECT } from '@/services/hydraulics/data/demoData';
import { toast } from '@/components/ui/use-toast';

const ProjectForm = ({ onSuccess }) => {
  const { current_project, addProject, updateProject, setCurrentProject } = useHydraulicsSimulator();

  const { register, handleSubmit, setValue, formState: { errors, isDirty }, reset } = useForm({
    resolver: zodResolver(ProjectSchema),
    defaultValues: current_project || {
      name: '',
      description: '',
      location: '',
      unit_system: 'API',
      owner: '00000000-0000-0000-0000-000000000000', // Placeholder
      status: 'Draft',
      created_date: new Date().toISOString()
    }
  });

  useEffect(() => {
    if (current_project) {
      reset(current_project);
    }
  }, [current_project, reset]);

  const onSubmit = (data) => {
    if (current_project) {
      updateProject(current_project.project_id, data);
      toast({ title: "Project updated", description: "Changes saved successfully." });
    } else {
      const newProject = {
        ...data,
        project_id: crypto.randomUUID(),
        created_date: new Date().toISOString()
      };
      addProject(newProject);
      setCurrentProject(newProject);
      toast({ title: "Project created", description: "New project initialized." });
    }
    if (onSuccess) onSuccess();
  };

  const loadDemoData = () => {
    const demo = { ...DEMO_PROJECT, project_id: crypto.randomUUID(), name: `${DEMO_PROJECT.name} (Copy)` };
    reset(demo);
    toast({ title: "Demo data loaded", description: "Form populated with sample values." });
  };

  return (
    <div className="space-y-6 p-4 bg-slate-900 rounded-lg border border-slate-800">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-medium text-slate-200">Project Configuration</h3>
          <p className="text-sm text-slate-500">Define basic project parameters and units.</p>
        </div>
        <Button variant="outline" size="sm" onClick={loadDemoData} className="border-slate-700 hover:bg-slate-800">
          <PlayCircle className="mr-2 h-4 w-4 text-blue-500" /> Use Demo Data
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Project Name */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="name">Project Name <span className="text-red-500">*</span></Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild><Info className="h-3 w-3 text-slate-500 cursor-help" /></TooltipTrigger>
                  <TooltipContent>Enter a descriptive name for your project</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input id="name" {...register("name")} className={errors.name ? "border-red-500" : ""} />
            {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
          </div>

          {/* Location */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="location">Location <span className="text-red-500">*</span></Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild><Info className="h-3 w-3 text-slate-500 cursor-help" /></TooltipTrigger>
                  <TooltipContent>Geographic location of the project</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input id="location" {...register("location")} className={errors.location ? "border-red-500" : ""} />
            {errors.location && <span className="text-xs text-red-500">{errors.location.message}</span>}
          </div>

          {/* Unit System */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="unit_system">Unit System <span className="text-red-500">*</span></Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild><Info className="h-3 w-3 text-slate-500 cursor-help" /></TooltipTrigger>
                  <TooltipContent>Select measurement system (API or Metric)</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Select onValueChange={(val) => setValue("unit_system", val)} defaultValue={current_project?.unit_system || "API"}>
              <SelectTrigger className="bg-slate-900 border-slate-700">
                <SelectValue placeholder="Select system" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="API">API (Field Units)</SelectItem>
                <SelectItem value="Metric">Metric (SI)</SelectItem>
              </SelectContent>
            </Select>
            {errors.unit_system && <span className="text-xs text-red-500">{errors.unit_system.message}</span>}
          </div>
          
           {/* Status (Read-only/Hidden in creation) */}
           <div className="space-y-2 opacity-50 pointer-events-none">
              <Label>Status</Label>
              <Input value="Draft" readOnly className="bg-slate-800" />
           </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="description">Description</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild><Info className="h-3 w-3 text-slate-500 cursor-help" /></TooltipTrigger>
                <TooltipContent>Provide additional context about the project</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Textarea id="description" {...register("description")} className="bg-slate-900 border-slate-700" rows={3} />
          {errors.description && <span className="text-xs text-red-500">{errors.description.message}</span>}
        </div>

        <div className="pt-4 flex justify-end">
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={!isDirty && !!current_project}>
            <Save className="mr-2 h-4 w-4" /> {current_project ? 'Update Project' : 'Create Project'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;