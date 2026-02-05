import React from 'react';
import { 
  Settings, CheckSquare, Database, GitBranch, Brain, Box, 
  Users, Lock, BarChart2, Layers, HelpCircle 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate, useLocation } from 'react-router-dom';

const tabs = [
  { id: 'setup', label: 'Setup', icon: Settings, path: '' }, // Default route
  { id: 'qc', label: 'QC', icon: CheckSquare, path: 'qc' },
  { id: 'sources', label: 'Sources', icon: Database, path: 'sources' },
  { id: 'workflows', label: 'Workflows', icon: GitBranch, path: 'workflows' },
  { id: 'ai', label: 'AI Insights', icon: Brain, path: 'ai' },
  { id: '3d', label: '3D Viz', icon: Box, path: '3d' },
  { id: 'collaboration', label: 'Collaboration', icon: Users, path: 'collaboration' },
  { id: 'security', label: 'Security', icon: Lock, path: 'security' },
  { id: 'analytics', label: 'Analytics', icon: BarChart2, path: 'analytics' },
  { id: 'porosity', label: 'Porosity', icon: Layers, path: 'porosity' },
  { id: 'help', label: 'Help', icon: HelpCircle, path: 'help' },
];

const NavigationRibbon = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Base path for the module
  const basePath = '/modules/geoscience/petrophysical-analysis';

  // Determine active tab based on current pathname
  const getCurrentTab = () => {
    const path = location.pathname.replace(basePath, '').replace(/^\//, '');
    return path === '' ? 'setup' : path;
  };

  const activeTab = getCurrentTab();

  const handleTabClick = (tab) => {
    navigate(`${basePath}${tab.path ? `/${tab.path}` : ''}`);
  };

  return (
    <div className="flex items-center w-full bg-slate-900 border-b border-slate-800 px-2 overflow-x-auto no-scrollbar">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id || (tab.id === 'setup' && activeTab === '');
        
        return (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab)}
            className={cn(
              "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2 whitespace-nowrap outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500/50",
              isActive 
                ? "text-[#BFFF00] border-[#BFFF00] bg-slate-800/50" 
                : "text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-800/30"
            )}
          >
            <Icon className={cn("w-4 h-4", isActive ? "text-[#BFFF00]" : "text-slate-500")} />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default NavigationRibbon;