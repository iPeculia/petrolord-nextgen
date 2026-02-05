import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  ChevronRight, 
  LayoutGrid, 
  Layers, 
  Database,
  Activity, 
  Wind, 
  Cog, 
  Package, 
  BarChart2, 
  GitCompare, 
  Wrench,
  ChevronDown
} from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const ALDLeftSidebar = ({ activeTab, onTabChange, isCollapsed, toggleCollapse, isMobile }) => {
  const [openSections, setOpenSections] = React.useState({
    setup: true,
    systems: true,
    equipment: true,
    analysis: true
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const menuGroups = [
    {
      id: 'setup',
      title: 'WELL SETUP',
      items: [
        { id: 'wells', label: 'Configuration', icon: LayoutGrid },
        { id: 'reservoir', label: 'Reservoir Properties', icon: Layers },
        // Production data often lives within wells tab in this schema, but could be separate
        { id: 'production', label: 'Production Data', icon: Database, action: () => onTabChange('wells') } 
      ]
    },
    {
      id: 'systems',
      title: 'LIFT SYSTEMS',
      items: [
        { id: 'lift-systems', label: 'System Selection', icon: Activity },
        // These could be sub-tabs or specific modes in the lift-systems tab
        { id: 'esp', label: 'ESP Design', icon: Activity, indent: true, action: () => onTabChange('lift-systems') },
        { id: 'gaslift', label: 'Gas Lift Design', icon: Wind, indent: true, action: () => onTabChange('lift-systems') },
        { id: 'rodpump', label: 'Rod Pump Design', icon: Cog, indent: true, action: () => onTabChange('lift-systems') },
      ]
    },
    {
      id: 'equipment',
      title: 'EQUIPMENT',
      items: [
        { id: 'equipment', label: 'Catalog Browser', icon: Package },
      ]
    },
    {
      id: 'analysis',
      title: 'ANALYSIS',
      items: [
        { id: 'design', label: 'Design Workspace', icon: Wrench },
        { id: 'results', label: 'Results & Plots', icon: BarChart2 },
        { id: 'comparison', label: 'Comparison', icon: GitCompare, action: () => onTabChange('results') },
      ]
    }
  ];

  return (
    <aside 
      className={cn(
        "flex flex-col bg-[#0F172A] border-r border-slate-800 transition-all duration-300 ease-in-out relative z-40 h-full",
        isCollapsed ? "w-12" : "w-64"
      )}
    >
      {/* Sidebar Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar py-4 space-y-6">
        {menuGroups.map((group) => (
          <Collapsible 
            key={group.id} 
            open={isCollapsed ? false : openSections[group.id]} 
            onOpenChange={() => !isCollapsed && toggleSection(group.id)}
            className="px-2"
          >
            {!isCollapsed && (
              <CollapsibleTrigger className="flex items-center justify-between w-full px-2 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider hover:text-slate-300 mb-1 group">
                {group.title}
                <ChevronDown className={cn("w-3 h-3 transition-transform duration-200", openSections[group.id] ? "" : "-rotate-90")} />
              </CollapsibleTrigger>
            )}
            
            {/* If collapsed, show icons only for the group items without collapsible logic affecting visibility */}
            <div className={cn(isCollapsed ? "flex flex-col gap-2" : "")}>
                {isCollapsed ? (
                     group.items.filter(item => !item.indent).map(item => (
                        <SidebarItemIcon 
                            key={item.id} 
                            item={item} 
                            activeTab={activeTab} 
                            onTabChange={onTabChange} 
                        />
                     ))
                ) : (
                    <CollapsibleContent className="space-y-0.5">
                        {group.items.map(item => (
                            <SidebarItem 
                                key={item.id} 
                                item={item} 
                                activeTab={activeTab} 
                                onTabChange={onTabChange} 
                            />
                        ))}
                    </CollapsibleContent>
                )}
            </div>
          </Collapsible>
        ))}
      </div>

      {/* Collapse Toggle */}
      <div className="p-2 border-t border-slate-800 bg-[#0F172A]">
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full h-8 flex items-center justify-center text-slate-500 hover:text-white hover:bg-slate-800"
          onClick={toggleCollapse}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>
    </aside>
  );
};

const SidebarItem = ({ item, activeTab, onTabChange }) => {
    const isActive = activeTab === item.id;
    const handleClick = () => {
        if (item.action) item.action();
        else onTabChange(item.id);
    };

    return (
        <button
            onClick={handleClick}
            className={cn(
                "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 group relative",
                isActive 
                    ? "text-white bg-blue-600/10" 
                    : "text-slate-400 hover:text-white hover:bg-slate-800",
                item.indent && "pl-9 text-xs"
            )}
        >
            {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-blue-500 rounded-r-full" />}
            <item.icon className={cn("w-4 h-4 flex-shrink-0", isActive ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300")} />
            <span className="truncate">{item.label}</span>
        </button>
    );
};

const SidebarItemIcon = ({ item, activeTab, onTabChange }) => {
    const isActive = activeTab === item.id;
    const handleClick = () => {
        if (item.action) item.action();
        else onTabChange(item.id);
    };

    return (
         <button
            onClick={handleClick}
            className={cn(
                "w-8 h-8 mx-auto flex items-center justify-center rounded-md transition-all duration-200 relative group",
                isActive 
                    ? "text-blue-400 bg-blue-500/10" 
                    : "text-slate-500 hover:text-white hover:bg-slate-800"
            )}
            title={item.label}
        >
            <item.icon className="w-4 h-4" />
            {/* Tooltip on hover */}
            <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 border border-slate-700 shadow-xl transition-opacity">
                {item.label}
            </div>
        </button>
    )
}

export default ALDLeftSidebar;