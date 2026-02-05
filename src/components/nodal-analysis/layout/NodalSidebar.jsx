import React, { useState } from 'react';
import { useNodalAnalysis } from '@/context/nodal-analysis/NodalAnalysisContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { 
  Database, 
  Settings, 
  Beaker, 
  PlayCircle, 
  BarChart3, 
  Settings2,
  FolderOpen,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import CreateSessionModal from '../modals/CreateSessionModal';

const SidebarItem = ({ id, label, icon: Icon, active, collapsed, onClick }) => {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            onClick={onClick}
            className={cn(
              "w-full flex items-center h-10 mb-1 transition-all duration-200 group relative",
              collapsed ? "justify-center px-0" : "justify-start px-3",
              active 
                ? "bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 hover:text-blue-300 before:absolute before:left-0 before:top-1 before:bottom-1 before:w-1 before:bg-blue-500 before:rounded-r-full" 
                : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
            )}
          >
            <Icon className={cn(
              "h-5 w-5 transition-colors",
              active ? "text-blue-500" : "text-slate-400 group-hover:text-slate-200",
              !collapsed && "mr-3"
            )} />
            {!collapsed && (
              <span className="font-medium text-sm truncate">{label}</span>
            )}
          </Button>
        </TooltipTrigger>
        {collapsed && (
          <TooltipContent side="right" className="bg-slate-800 text-slate-100 border-slate-700 ml-2">
            {label}
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};

const SectionHeader = ({ label, collapsed }) => {
  if (collapsed) return <div className="h-4 my-2 border-b border-slate-800 mx-2" />;
  return (
    <div className="px-4 py-2 mt-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
      {label}
    </div>
  );
};

const NodalSidebar = () => {
  const { 
    activeTab, 
    setActiveTab, 
    isSidebarCollapsed, 
    toggleSidebar,
    currentSession, 
    loadSession,
    createSession
  } = useNodalAnalysis();

  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);

  const navigationItems = [
    { section: 'Data Input', items: [
      { id: 'wells', label: 'Well Data', icon: Database },
      { id: 'equipment', label: 'Equipment', icon: Settings },
      { id: 'fluids', label: 'Fluids', icon: Beaker },
    ]},
    { section: 'Calculations', items: [
      { id: 'calculations', label: 'Parameters', icon: PlayCircle },
    ]},
    { section: 'Results', items: [
      { id: 'results', label: 'Results', icon: BarChart3 },
    ]},
    { section: 'Settings', items: [
      { id: 'settings', label: 'Settings', icon: Settings2 },
    ]}
  ];

  const handleSessionSwitch = () => {
    // Navigate to session selector by clearing current session
    loadSession(null); 
  };

  return (
    <div 
      className={cn(
        "flex flex-col h-full bg-[#0F172A] border-r border-slate-800 transition-all duration-300 ease-in-out relative z-50",
        isSidebarCollapsed ? "w-[70px]" : "w-64"
      )}
    >
      {/* Sidebar Header */}
      <div className={cn(
        "h-14 flex items-center border-b border-slate-800 bg-[#0F172A]",
        isSidebarCollapsed ? "justify-center" : "justify-between px-4"
      )}>
        {!isSidebarCollapsed && (
          <div className="flex items-center gap-2 font-semibold text-white">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">NA</span>
            </div>
            <span className="truncate">Nodal Studio</span>
          </div>
        )}
        {isSidebarCollapsed && (
           <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">NA</span>
            </div>
        )}
      </div>

      {/* Navigation Items */}
      <ScrollArea className="flex-1 py-4">
        <div className="px-3 space-y-1">
          {navigationItems.map((section, idx) => (
            <React.Fragment key={idx}>
              <SectionHeader label={section.section} collapsed={isSidebarCollapsed} />
              {section.items.map((item) => (
                <SidebarItem
                  key={item.id}
                  id={item.id}
                  label={item.label}
                  icon={item.icon}
                  active={activeTab === item.id}
                  collapsed={isSidebarCollapsed}
                  onClick={() => setActiveTab(item.id)}
                />
              ))}
            </React.Fragment>
          ))}
        </div>
      </ScrollArea>

      {/* Footer / Session Info */}
      <div className="p-3 border-t border-slate-800 bg-[#0F172A]">
        {currentSession ? (
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  className={cn(
                    "rounded-lg bg-slate-800/50 border border-slate-800 p-2 cursor-pointer hover:bg-slate-800 hover:border-slate-700 transition-all group",
                    isSidebarCollapsed ? "flex justify-center" : "flex items-center gap-3"
                  )}
                  onClick={handleSessionSwitch}
                >
                    <div className="w-8 h-8 rounded bg-blue-500/10 flex items-center justify-center flex-shrink-0 text-blue-400 group-hover:text-blue-300">
                        <FolderOpen className="w-4 h-4" />
                    </div>
                    {!isSidebarCollapsed && (
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-slate-200 truncate">{currentSession.name}</p>
                            <p className="text-[10px] text-slate-500">Switch Session</p>
                        </div>
                    )}
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Current: {currentSession.name}</p>
                <p className="text-xs text-slate-400">Click to switch</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
             <Button 
                variant="outline" 
                className={cn(
                    "w-full border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800",
                    isSidebarCollapsed && "px-0"
                )}
                onClick={() => setIsSessionModalOpen(true)}
            >
                {isSidebarCollapsed ? <FolderOpen className="w-4 h-4" /> : "Open Session"}
            </Button>
        )}
      </div>

      <CreateSessionModal 
        isOpen={isSessionModalOpen} 
        onClose={() => setIsSessionModalOpen(false)}
        onCreate={createSession}
      />
    </div>
  );
};

export default NodalSidebar;