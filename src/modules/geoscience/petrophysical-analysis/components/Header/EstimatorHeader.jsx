import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  Settings, Activity, Database, GitBranch, BrainCircuit, Box, Users, Shield, BarChart3, Layers,
  ChevronLeft, Folder, CheckCircle, Clock, Share2, HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import useProjectStore from '@/store/projectStore';

const EstimatorHeader = () => {
  const { currentProject } = useProjectStore();
  const projectName = currentProject?.name || "North Sea";

  const navItems = [
    { name: 'Setup', path: 'setup', icon: Settings },
    { name: 'QC', path: 'qc', icon: Activity },
    { name: 'Sources', path: 'sources', icon: Database },
    { name: 'Workflows', path: 'workflows', icon: GitBranch },
    { name: 'AI Insights', path: 'ai', icon: BrainCircuit },
    { name: '3D Viz', path: '3d', icon: Box },
    { name: 'Collaboration', path: 'collaboration', icon: Users },
    { name: 'Security', path: 'security', icon: Shield },
    { name: 'Analytics', path: 'analytics', icon: BarChart3 },
    { name: 'Porosity', path: 'porosity', icon: Layers },
  ];

  return (
    <header className="bg-[#0F172A] border-b border-slate-800 flex flex-col shrink-0 z-40 relative w-full">
      {/* Top Navigation Row */}
      <div className="h-14 border-b border-slate-800 flex items-center justify-between px-4 bg-[#0B101B] w-full">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="flex items-center text-slate-400 hover:text-white transition-colors text-sm font-medium group">
            <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-0.5 transition-transform" />
            Dashboard
          </Link>
          <div className="h-6 w-px bg-slate-800" />
          <div className="flex items-center gap-3">
             <div className="bg-blue-600/20 p-1.5 rounded shadow-[0_0_10px_rgba(37,99,235,0.2)]">
               <Activity className="w-5 h-5 text-blue-400" />
             </div>
             <div className="flex flex-col">
               <span className="text-white font-bold leading-none tracking-tight text-base">PetroLord</span>
               <span className="text-[10px] text-blue-400 font-bold tracking-widest uppercase">PETROPHYSICS</span>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
           {/* Project Selector */}
           <div className="flex items-center bg-slate-900 border border-slate-700 rounded-md px-3 py-1.5 gap-2 min-w-[200px] hover:border-slate-600 transition-colors cursor-pointer group">
              <Folder className="w-4 h-4 text-[#BFFF00]" />
              <span className="text-sm text-slate-200 truncate flex-1 font-medium group-hover:text-white transition-colors">{projectName}</span>
              <ChevronLeft className="w-3 h-3 text-slate-500 -rotate-90" />
           </div>

           {/* Status Info */}
           <div className="hidden md:flex flex-col items-end mr-2 border-r border-slate-800 pr-4 h-8 justify-center">
              <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">ACTIVE PROJECT</span>
                  <div className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-emerald-500" />
                      <span className="text-xs font-medium text-emerald-500">Saved</span>
                  </div>
              </div>
              <div className="flex items-center justify-between w-full gap-2">
                  <span className="text-sm font-semibold text-white">{projectName}</span>
                  <div className="flex items-center gap-1 text-[10px] text-slate-500">
                      <Clock className="w-3 h-3" />
                      <span>Dec 2 08:08 PM</span>
                  </div>
              </div>
           </div>

           <div className="flex items-center gap-1">
             <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800">
                <Share2 className="w-4 h-4" />
             </Button>
             <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800">
                <Settings className="w-4 h-4" />
             </Button>
           </div>
        </div>
      </div>

      {/* Navigation Ribbon */}
      <div className="h-12 flex items-center w-full bg-[#0F172A]">
        <nav className="flex-1 h-full flex items-center w-full overflow-x-auto no-scrollbar">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex-1 h-full flex items-center justify-center gap-2 text-sm font-medium transition-all duration-200 border-b-2 px-4 whitespace-nowrap min-w-[100px]",
                isActive 
                  ? "border-[#BFFF00] text-[#BFFF00] bg-slate-800/50 shadow-[inset_0_-2px_10px_rgba(191,255,0,0.1)]" 
                  : "border-transparent text-slate-400 hover:text-slate-100 hover:bg-slate-800/30"
              )}
            >
              <item.icon className="w-4 h-4" />
              <span className="hidden xl:inline">{item.name}</span>
              <span className="xl:hidden">{item.name.split(' ')[0]}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default EstimatorHeader;