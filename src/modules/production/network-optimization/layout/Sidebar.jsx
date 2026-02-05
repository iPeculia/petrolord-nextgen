import React, { useEffect } from 'react';
import { useNetworkOptimization } from '@/context/NetworkOptimizationContext';
import { Button } from '@/components/ui/button';
import { 
  Network, 
  CircleDot, 
  ArrowRightLeft, 
  Factory, 
  Target, 
  BarChart3, 
  Settings2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import ProgressIndicator from '../components/ProgressIndicator';

const Sidebar = () => {
  const { 
    currentTab, 
    setCurrentTab, 
    sidebarCollapsed, 
    toggleSidebar 
  } = useNetworkOptimization();

  // Keyboard Shortcuts Hook
  useEffect(() => {
    const handleKeyDown = (e) => {
        // Ctrl+N for New Network handled elsewhere or we can trigger modal
        // This is a placeholder for global shortcuts logic if needed in sidebar or layout
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navItems = [
    { id: 'Networks', label: 'Networks', icon: Network },
    { id: 'Nodes', label: 'Nodes', icon: CircleDot },
    { id: 'Pipelines', label: 'Pipelines', icon: ArrowRightLeft },
    { id: 'Facilities', label: 'Facilities', icon: Factory },
    { id: 'Optimization', label: 'Optimization', icon: Target },
    { id: 'Results', label: 'Results', icon: BarChart3 },
    { id: 'Settings', label: 'Settings', icon: Settings2 },
  ];

  return (
    <aside 
      className={cn(
        "bg-[#0F172A] border-r border-slate-800 flex flex-col transition-all duration-300 z-10 relative",
        sidebarCollapsed ? "w-16" : "w-60"
      )}
    >
      <div className="flex-1 py-4 flex flex-col gap-1">
        <TooltipProvider delayDuration={0}>
          {navItems.map((item) => (
            <div key={item.id} className="px-2">
               {sidebarCollapsed ? (
                 <Tooltip>
                   <TooltipTrigger asChild>
                     <Button
                       variant={currentTab === item.id ? "secondary" : "ghost"}
                       className={cn(
                         "w-full justify-center h-10 mb-1",
                         currentTab === item.id 
                           ? "bg-slate-800 text-emerald-400" 
                           : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
                       )}
                       onClick={() => setCurrentTab(item.id)}
                     >
                       <item.icon className="h-5 w-5" />
                     </Button>
                   </TooltipTrigger>
                   <TooltipContent side="right" className="bg-slate-900 border-slate-800 text-white">
                     {item.label}
                   </TooltipContent>
                 </Tooltip>
               ) : (
                 <Button
                   variant={currentTab === item.id ? "secondary" : "ghost"}
                   className={cn(
                     "w-full justify-start h-10 mb-1 gap-3 px-3",
                     currentTab === item.id 
                       ? "bg-slate-800 text-emerald-400" 
                       : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
                   )}
                   onClick={() => setCurrentTab(item.id)}
                 >
                   <item.icon className="h-5 w-5" />
                   <span>{item.label}</span>
                 </Button>
               )}
            </div>
          ))}
        </TooltipProvider>
      </div>

      {!sidebarCollapsed && <ProgressIndicator />}

      <div className="p-2 border-t border-slate-800">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-center text-slate-500 hover:text-slate-200"
          onClick={toggleSidebar}
        >
          {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;