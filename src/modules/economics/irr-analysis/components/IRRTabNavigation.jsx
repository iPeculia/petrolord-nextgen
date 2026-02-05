import React from 'react';
import { cn } from '@/lib/utils';
import { 
  FolderOpen, 
  LineChart, 
  Calculator, 
  BarChart3, 
  Settings, 
} from 'lucide-react';

const IRRTabNavigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'projects', label: 'Dashboard', icon: FolderOpen },
    { id: 'cashflows', label: 'Cashflows', icon: LineChart },
    { id: 'analysis', label: 'Analysis', icon: Calculator },
    { id: 'results', label: 'Results', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-full bg-[#1E293B] border-b border-slate-800 px-4">
      <div className="flex items-center space-x-1 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all relative whitespace-nowrap",
              activeTab === tab.id
                ? "text-blue-400"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            )}
          >
            <tab.icon className={cn("w-4 h-4", activeTab === tab.id ? "text-blue-400" : "text-slate-500")} />
            <span>{tab.label}</span>
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-t-full" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default IRRTabNavigation;