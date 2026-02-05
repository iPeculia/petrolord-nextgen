import React from 'react';
import { User, Settings, Bell, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useFacilityMasterPlanner } from '../../context/FacilityMasterPlannerContext';
import ProjectSelector from '../selectors/ProjectSelector';
import FacilitySelector from '../selectors/FacilitySelector';
import useKeyboardShortcuts from '../../hooks/useKeyboardShortcuts';

const TopNavigationBar = () => {
  const { 
    currentTab, 
    setCurrentTab, 
    setIsHelpOpen, 
    setIsSettingsOpen, 
    setIsNotificationsOpen,
    unreadCount 
  } = useFacilityMasterPlanner();

  useKeyboardShortcuts({
    '?': () => setIsHelpOpen(true),
    'Ctrl+,': () => setIsSettingsOpen(true),
    'Ctrl+N': () => setIsNotificationsOpen(true)
  });

  const tabs = [
    'Overview',
    'Equipment',
    'Process Units',
    'Production Schedule',
    'Analysis',
    'Settings'
  ];

  return (
    <header className="h-[60px] bg-[#1a1a1a] border-b border-[#333333] flex items-center justify-between px-4 fixed top-0 left-0 right-0 z-50">
      {/* Left Section: Logo & Title */}
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="font-bold text-white text-lg">F</span>
        </div>
        <h1 className="text-white font-semibold text-lg hidden md:block">Facility Master Planner Studio</h1>
      </div>

      {/* Center-Left: Selectors */}
      <div className="hidden lg:flex items-center gap-2 ml-8">
        <ProjectSelector />
        <FacilitySelector />
      </div>

      {/* Center: Tabs */}
      <nav className="hidden xl:flex items-center gap-1 mx-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setCurrentTab(tab)}
            className={cn(
              "px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200",
              currentTab === tab 
                ? "bg-[#0066cc]/20 text-[#0066cc]" 
                : "text-slate-400 hover:text-white hover:bg-white/5"
            )}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* Right Section: Actions */}
      <div className="flex items-center gap-2">
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => setIsNotificationsOpen(true)} className="text-slate-400 hover:text-white hover:bg-white/5 relative">
                        <Bell className="w-5 h-5" />
                        {unreadCount > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
                    </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-slate-900 border-slate-700 text-white">Notifications ({unreadCount})</TooltipContent>
            </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => setIsHelpOpen(true)} className="text-slate-400 hover:text-white hover:bg-white/5">
                        <HelpCircle className="w-5 h-5" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-slate-900 border-slate-700 text-white">Help Center (?)</TooltipContent>
            </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => setIsSettingsOpen(true)} className="text-slate-400 hover:text-white hover:bg-white/5">
                        <Settings className="w-5 h-5" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-slate-900 border-slate-700 text-white">Settings (Ctrl+,)</TooltipContent>
            </Tooltip>
        </TooltipProvider>

        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center ml-2 border border-slate-600">
          <User className="w-4 h-4 text-slate-300" />
        </div>
      </div>
    </header>
  );
};

export default TopNavigationBar;