import React from 'react';
import { useNodalAnalysis } from '@/context/nodal-analysis/NodalAnalysisContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Database, Settings, Beaker, PlayCircle, BarChart3, Sliders } from 'lucide-react';

const tabs = [
  { id: 'wells', label: 'Well Data', icon: Database },
  { id: 'equipment', label: 'Equipment', icon: Settings },
  { id: 'fluids', label: 'Fluids', icon: Beaker },
  { id: 'calculations', label: 'Calculations', icon: PlayCircle },
  { id: 'results', label: 'Results', icon: BarChart3 },
];

const TabNavigation = ({ orientation = 'horizontal' }) => {
  const { activeTab, setActiveTab } = useNodalAnalysis();

  if (orientation === 'vertical') {
    return (
        <nav className="flex flex-col gap-1 w-full">
           {tabs.map((tab) => {
             const Icon = tab.icon;
             const isActive = activeTab === tab.id;
             
             return (
               <Button
                 key={tab.id}
                 variant="ghost"
                 onClick={() => setActiveTab(tab.id)}
                 className={cn(
                   "w-full justify-start h-10 px-3 relative transition-all duration-200",
                   isActive 
                     ? "bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 hover:text-blue-300" 
                     : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
                 )}
               >
                 <Icon className={cn("w-4 h-4 mr-3", isActive && "text-blue-500")} />
                 <span className="font-medium text-sm">{tab.label}</span>
               </Button>
             );
           })}
        </nav>
    );
  }

  // Horizontal Tab Bar for Fullscreen App Top Nav
  return (
     <div className="flex items-center gap-1 border-b border-slate-800 bg-[#1E293B] px-4 w-full overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
             const Icon = tab.icon;
             const isActive = activeTab === tab.id;
             
             return (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={cn(
                   "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all duration-200 whitespace-nowrap",
                   isActive 
                     ? "border-blue-500 text-blue-400" 
                     : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700"
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

export default TabNavigation;