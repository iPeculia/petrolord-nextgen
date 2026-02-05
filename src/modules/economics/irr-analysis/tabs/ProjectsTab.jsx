import React from 'react';
import { useIRRAnalysis } from '@/context/economics/IRRAnalysisContext';
import { Button } from '@/components/ui/button';
import { Plus, FolderOpen, TrendingUp, DollarSign, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import NewProjectModal from '../components/NewProjectModal';
import { useState } from 'react';

const ProjectsTab = () => {
  const { projects, currentProject, selectProject } = useIRRAnalysis();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!currentProject && projects.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-[#020617]">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto border border-slate-700">
            <FolderOpen className="w-10 h-10 text-slate-400" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">No Projects Found</h2>
            <p className="text-slate-400">
              Get started by creating your first IRR analysis project to evaluate investment opportunities.
            </p>
          </div>
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white w-full max-w-xs"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Project
          </Button>
        </div>
        <NewProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Project Dashboard</h2>
          <p className="text-slate-400 text-sm mt-1">
            Overview of your current analysis project: <span className="text-blue-400 font-medium">{currentProject?.name || 'No Project Selected'}</span>
          </p>
        </div>
        {!currentProject && projects.length > 0 && (
           <Button onClick={() => setIsModalOpen(true)} variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
              <Plus className="w-4 h-4 mr-2" /> New Project
           </Button>
        )}
      </div>

      {!currentProject ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <Card 
              key={project.project_id} 
              className="bg-[#1E293B] border-slate-700 hover:border-blue-500 transition-all cursor-pointer group"
              onClick={() => selectProject(project.project_id)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-blue-900/20 rounded-lg group-hover:bg-blue-600/20 transition-colors">
                    <FolderOpen className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full border ${
                    project.status === 'Active' 
                      ? 'bg-green-900/20 border-green-800 text-green-400' 
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}>
                    {project.status || 'Draft'}
                  </span>
                </div>
                <CardTitle className="text-lg text-white mt-3">{project.name}</CardTitle>
                <CardDescription className="line-clamp-2">{project.description || 'No description provided.'}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-xs text-slate-400 mt-2">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(project.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>{project.type || 'General'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <Card 
            className="bg-[#1E293B]/50 border-slate-700 border-dashed hover:border-blue-500/50 hover:bg-[#1E293B] transition-all cursor-pointer flex flex-col items-center justify-center min-h-[200px]"
            onClick={() => setIsModalOpen(true)}
          >
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-3">
              <Plus className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-slate-300 font-medium">Create New Project</p>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-[#1E293B] border-slate-700 text-white">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-400" />
                NPV Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">--</div>
              <p className="text-xs text-slate-400 mt-1">Net Present Value (10%)</p>
            </CardContent>
          </Card>

          <Card className="bg-[#1E293B] border-slate-700 text-white">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                IRR Result
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">-- %</div>
              <p className="text-xs text-slate-400 mt-1">Internal Rate of Return</p>
            </CardContent>
          </Card>

          <Card className="bg-[#1E293B] border-slate-700 text-white">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-400" />
                Payout Period
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">-- Years</div>
              <p className="text-xs text-slate-400 mt-1">Discounted Payback</p>
            </CardContent>
          </Card>
        </div>
      )}
      
      <NewProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default ProjectsTab;