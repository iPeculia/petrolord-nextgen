import React from 'react';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, Database, Activity, Settings2, 
  TrendingUp, Layers, Archive, BoxSelect, Share2,
  GraduationCap, HelpCircle, Gauge 
} from 'lucide-react';
import { useHelp } from '@/contexts/HelpContext';

const MBTabNavigation = ({ activeTab, setActiveTab }) => {
  // Fixed: React Hooks must be called unconditionally
  const helpContext = useHelp();
  const unreadCount = helpContext?.unreadCount || 0;

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'data-tank-setup', label: 'Data & Tanks', icon: Database },
    { id: 'wells', label: 'Wells', icon: Layers },
    { id: 'rock-props', label: 'Rock Props', icon: Layers },
    { id: 'pressure-analysis', label: 'Pressure', icon: Gauge },
    { id: 'diagnostics', label: 'Diagnostics', icon: Activity },
    { id: 'analysis-aquifer', label: 'Analysis & Aquifer', icon: Settings2 },
    { id: 'forecast', label: 'Forecast', icon: TrendingUp },
    { id: 'groups', label: 'Groups', icon: BoxSelect },
    { id: 'export', label: 'Export', icon: Share2 },
    { id: 'training', label: 'Training', icon: GraduationCap },
    { id: 'help', label: 'Help Guide', icon: HelpCircle },
  ];

  return (
    <div className="bg-slate-900 border-b border-slate-800 px-4 flex items-center gap-1 overflow-x-auto scrollbar-hide shrink-0 h-12">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors relative whitespace-nowrap h-full border-b-2",
              isActive 
                ? "text-[#BFFF00] border-[#BFFF00] bg-slate-800/50" 
                : "text-slate-400 border-transparent hover:text-white hover:bg-slate-800"
            )}
          >
            <Icon className="w-4 h-4" />
            {tab.label}
            {/* Show indicator for unread help items */}
            {tab.id === 'help' && unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default MBTabNavigation;