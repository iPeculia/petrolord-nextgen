import React from 'react';
import { 
  LayoutGrid, 
  PenTool, 
  Wrench, 
  BarChart3, 
  GitCompare, 
  Settings 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const ALDTabNavigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'wells', label: 'Wells', icon: LayoutGrid },
    { id: 'designs', label: 'Designs', icon: PenTool },
    { id: 'equipment', label: 'Equipment', icon: Wrench },
    { id: 'results', label: 'Results', icon: BarChart3 },
    { id: 'comparison', label: 'Comparison', icon: GitCompare },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="bg-[#0F172A] border-b border-slate-700 px-6">
      <div className="flex space-x-1 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                isActive 
                  ? "border-blue-500 text-blue-400 bg-slate-800/50" 
                  : "border-transparent text-slate-400 hover:text-white hover:bg-slate-800/30"
              )}
            >
              <Icon className={cn("w-4 h-4", isActive ? "text-blue-500" : "text-slate-500")} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ALDTabNavigation;