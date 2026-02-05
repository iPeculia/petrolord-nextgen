import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRiskAnalysis } from '@/context/RiskAnalysisContext';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle, Save, Database } from 'lucide-react';
import { generateDemoData } from '@/services/riskAnalysis/data/demoData';

const projectSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(200, "Name too long"),
  description: z.string().max(1000, "Description too long").optional(),
  type: z.enum(['Oil', 'Gas', 'Renewable', 'Infrastructure']),
  currency: z.enum(['USD', 'EUR', 'GBP']),
  owner: z.string().min(1, "Owner is required"),
});

const ProjectForm = () => {
  const { currentProject, updateProject, addProject } = useRiskAnalysis();
  const { user } = useAuth();
  
  const { register, handleSubmit, setValue, reset, formState: { errors, isDirty } } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      description: '',
      type: 'Oil',
      currency: 'USD',
      owner: user?.id || ''
    }
  });

  useEffect(() => {
    if (currentProject) {
      reset({
        name: currentProject.name,
        description: currentProject.description || '',
        type: currentProject.type || 'Oil',
        currency: currentProject.currency || 'USD',
        owner: currentProject.owner || user?.id
      });
    }
  }, [currentProject, reset, user]);

  const onSubmit = (data) => {
    if (currentProject) {
      updateProject(currentProject.project_id, data);
    } else {
      addProject(data);
    }
  };

  const handleDemoData = () => {
    const demo = generateDemoData(user?.id);
    const demoProject = demo.projects[0];
    setValue('name', demoProject.name + " (Demo)");
    setValue('description', demoProject.description);
    setValue('type', demoProject.type);
    setValue('currency', demoProject.currency);
  };

  return (
    <Card className="bg-[#1a1a1a] border-[#333] text-slate-200 h-full">
      <CardHeader className="pb-4 border-b border-[#333]">
        <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium text-slate-200">Project Configuration</CardTitle>
            <Button variant="outline" size="sm" onClick={handleDemoData} className="border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800">
                <Database className="w-4 h-4 mr-2" />
                Use Demo Data
            </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Project Name */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="name" className="text-slate-300">Project Name <span className="text-red-500">*</span></Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild><HelpCircle className="w-3 h-3 text-slate-500 cursor-help" /></TooltipTrigger>
                  <TooltipContent><p>Enter a descriptive name for your project (3-200 chars)</p></TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input 
              id="name" 
              {...register('name')} 
              className={`bg-[#262626] border-[#404040] text-slate-200 focus:border-blue-500 ${errors.name ? 'border-red-500' : ''}`}
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="description" className="text-slate-300">Description</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild><HelpCircle className="w-3 h-3 text-slate-500 cursor-help" /></TooltipTrigger>
                  <TooltipContent><p>Provide additional context about the project</p></TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Textarea 
              id="description" 
              {...register('description')} 
              className="bg-[#262626] border-[#404040] text-slate-200 focus:border-blue-500 min-h-[100px]"
            />
            {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Project Type */}
            <div className="space-y-2">
              <Label className="text-slate-300">Project Type <span className="text-red-500">*</span></Label>
              <Select onValueChange={(val) => setValue('type', val)} defaultValue={currentProject?.type || 'Oil'}>
                <SelectTrigger className="bg-[#262626] border-[#404040] text-slate-200">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-[#262626] border-[#404040] text-slate-200">
                  <SelectItem value="Oil">Oil</SelectItem>
                  <SelectItem value="Gas">Gas</SelectItem>
                  <SelectItem value="Renewable">Renewable</SelectItem>
                  <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Currency */}
            <div className="space-y-2">
              <Label className="text-slate-300">Currency <span className="text-red-500">*</span></Label>
              <Select onValueChange={(val) => setValue('currency', val)} defaultValue={currentProject?.currency || 'USD'}>
                <SelectTrigger className="bg-[#262626] border-[#404040] text-slate-200">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent className="bg-[#262626] border-[#404040] text-slate-200">
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="pt-4 flex justify-end">
            <Button type="submit" disabled={!isDirty && !!currentProject} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Save className="w-4 h-4 mr-2" />
                {currentProject ? 'Update Project' : 'Create Project'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProjectForm;