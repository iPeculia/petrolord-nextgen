import React from 'react';
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import ProjectManager from '@/components/project/ProjectManager';
import useProjectStore from '@/store/projectStore';
import { cn } from '@/lib/utils';

const ProjectStatusBadge = () => {
  const { currentProject, loading } = useProjectStore();

  if (loading) return <div className="w-32 h-8 bg-slate-800/50 animate-pulse rounded" />;
  
  if (!currentProject) {
      return (
          <ProjectManager trigger={
             <button className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-dashed border-slate-700 bg-slate-800/30 hover:bg-slate-800 transition-colors">
                <AlertCircle className="w-3 h-3 text-amber-500" />
                <span className="text-xs text-slate-400 font-medium">No Active Project</span>
             </button>
          } />
      );
  }

  const lastModified = currentProject.updated_at ? new Date(currentProject.updated_at) : new Date();
  const formattedDate = lastModified.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  const formattedTime = lastModified.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <ProjectManager trigger={
        <button className={cn(
            "flex items-center gap-3 px-3 py-1.5 rounded-md border transition-all group",
            "border-slate-800 bg-slate-900/50 hover:bg-slate-800 hover:border-slate-700"
        )}>
        <div className="flex flex-col items-start">
            <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase font-bold tracking-wider group-hover:text-blue-400 transition-colors">
                Active Project
            </div>
            <div className="text-sm font-semibold text-slate-200 leading-tight max-w-[150px] truncate">
             {currentProject.name}
            </div>
        </div>

        <div className="h-6 w-px bg-slate-800 mx-1" />

        <div className="flex flex-col items-end min-w-[90px]">
            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-500">
                <CheckCircle2 className="w-3 h-3" />
                <span>Saved</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-slate-500">
            <Clock className="w-3 h-3" />
            <span>{formattedDate} {formattedTime}</span>
            </div>
        </div>
        </button>
    } />
  );
};

export default ProjectStatusBadge;