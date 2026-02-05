import React from 'react';
import { cn } from '@/lib/utils';
import { 
  FolderOpen, 
  LineChart, 
  Calculator, 
  BarChart3, 
  Settings, 
} from 'lucide-react';

const IRRSidebar = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
  const navItems = [
    { id: 'projects', label: 'Projects', icon: FolderOpen },
    { id: 'cashflows', label: 'Cashflows', icon: LineChart },
    { id: 'analysis', label: 'Analysis', icon: Calculator },
    { id: 'results', label: 'Results', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={cn(
            "fixed inset-0 bg-black/50 z-20 lg:hidden transition-opacity", 
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsOpen(false)}
      />

      <aside 
        className={cn(
          "fixed lg:relative z-30 flex flex-col h-full bg-[#1E293B] border-r border-slate-800 transition-all duration-300 ease-in-out w-[240px]",
          isOpen ? "translate-x-0" : "-translate-x-full lg:w-[0px] lg:translate-x-0 lg:overflow-hidden lg:border-r-0"
        )}
      >
        <div className="p-4 h-16 flex items-center border-b border-slate-800">
          <div className="flex items-center gap-2 font-bold text-lg text-blue-400">
            <Calculator className="w-6 h-6" />
            <span className="whitespace-nowrap">IRR Studio</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (window.innerWidth < 1024) setIsOpen(false);
              }}
              className={cn(
                "flex items-center w-full gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                activeTab === item.id 
                  ? "bg-blue-600/10 text-blue-400" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              )}
            >
              <item.icon className={cn("w-5 h-5", activeTab === item.id ? "text-blue-400" : "text-slate-500")} />
              <span className="whitespace-nowrap">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default IRRSidebar;