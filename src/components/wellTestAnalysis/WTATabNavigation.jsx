import React from 'react';
import { cn } from '@/lib/utils';
import { Database, Activity, GitGraph, TrendingUp, Share2 } from 'lucide-react';

const WTATabNavigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'data-setup', label: 'Data & Setup', icon: Database },
    { id: 'diagnostics', label: 'Diagnostics', icon: Activity },
    { id: 'model-match', label: 'Model Match', icon: GitGraph },
    { id: 'forecast', label: 'Forecast', icon: TrendingUp },
    { id: 'export', label: 'Export', icon: Share2 },
  ];

  return (
    <div className="flex items-center gap-1 px-4 border-b border-slate-800 bg-slate-900 overflow-x-auto">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap",
              isActive 
                ? "border-[#BFFF00] text-[#BFFF00] bg-slate-800/50" 
                : "border-transparent text-slate-400 hover:text-white hover:bg-slate-800"
            )}
          >
            <Icon className="w-4 h-4" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default WTATabNavigation;