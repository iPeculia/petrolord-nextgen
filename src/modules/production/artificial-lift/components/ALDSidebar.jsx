import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { LayoutGrid, Layers, Activity, Package, Wrench, BarChart3, Settings, ChevronLeft, Menu, ChevronRight } from 'lucide-react';

const ALDSidebar = ({ activeTab, onTabChange, isCollapsed, toggleCollapse, isMobile, isOpen, toggleOpen }) => {
  const navItems = [
    { id: 'wells', label: 'Wells', icon: LayoutGrid },
    { id: 'reservoir', label: 'Reservoir Data', icon: Layers },
    { id: 'lift-systems', label: 'Lift Systems', icon: Activity },
    { id: 'equipment', label: 'Equipment Catalog', icon: Package },
    { id: 'design', label: 'Design', icon: Wrench },
    { id: 'results', label: 'Results', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const sidebarClasses = cn(
    "fixed left-0 top-0 h-full bg-[#1E293B] border-r border-slate-700 z-50 transition-all duration-300 ease-in-out flex flex-col shadow-xl",
    isMobile 
      ? (isOpen ? "translate-x-0 w-64" : "-translate-x-full w-64") 
      : (isCollapsed ? "w-20" : "w-60"),
    "pt-0" 
  );

  return (
    <>
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={toggleOpen}
        />
      )}

      <aside className={sidebarClasses}>
        {/* App Logo / Header */}
        <div className="h-16 flex items-center justify-center border-b border-slate-700 bg-slate-900/50">
           {(!isCollapsed || isMobile) ? (
             <div className="flex items-center gap-2">
               <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">AL</div>
               <div className="font-bold text-lg text-white tracking-tight">ALD STUDIO</div>
             </div>
           ) : (
             <div className="w-10 h-10 rounded bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">AL</div>
           )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  if (isMobile) toggleOpen();
                }}
                className={cn(
                  "w-full flex items-center p-3 rounded-lg transition-all duration-200 group relative mb-1",
                  isActive 
                    ? "bg-blue-600/10 text-blue-400 border border-blue-600/20 shadow-sm" 
                    : "text-slate-400 hover:bg-slate-800 hover:text-white border border-transparent"
                )}
                title={isCollapsed && !isMobile ? item.label : undefined}
              >
                <Icon className={cn("w-5 h-5 flex-shrink-0 transition-colors", isActive ? "text-blue-400" : "text-slate-500 group-hover:text-white", (!isCollapsed || isMobile) && "mr-3")} />
                
                {(!isCollapsed || isMobile) && (
                  <span className={cn("text-sm font-medium whitespace-nowrap", isActive ? "text-blue-100" : "")}>{item.label}</span>
                )}
                
                {/* Active Indicator Strip */}
                {isActive && !isCollapsed && !isMobile && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-lg" />
                )}
                
                {/* Tooltip for Collapsed State */}
                {isCollapsed && !isMobile && (
                   <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded border border-slate-700 shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 flex items-center">
                     {item.label}
                     <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-slate-800 border-l border-b border-slate-700 rotate-45"></div>
                   </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Collapse Toggle Footer */}
        {!isMobile && (
          <div className="p-4 border-t border-slate-700 bg-slate-900/30">
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn(
                "w-full text-slate-400 hover:text-white hover:bg-slate-800 transition-all",
                isCollapsed ? "justify-center px-0" : "justify-between"
              )}
              onClick={toggleCollapse}
            >
              {!isCollapsed && <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Collapse Menu</span>}
              {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </Button>
          </div>
        )}
      </aside>
    </>
  );
};

export default ALDSidebar;