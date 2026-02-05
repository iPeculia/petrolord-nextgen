import React from 'react';
import { cn } from '@/lib/utils';
import { Database, Upload, LineChart as ChartLine, BarChart, Settings, X } from 'lucide-react';

const Sidebar = ({ activeTab, onTabChange, isOpen, onClose }) => {
  const menuItems = [
    { id: 'wells', label: 'Wells', icon: Database },
    { id: 'test-data', label: 'Test Data', icon: Upload },
    { id: 'analysis', label: 'Analysis', icon: ChartLine },
    { id: 'results', label: 'Results', icon: BarChart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Content */}
      <div className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 w-[220px] bg-[#0F172A] border-r border-slate-800 transition-transform duration-300 ease-in-out transform lg:translate-x-0 flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Mobile Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 lg:hidden">
          <span className="font-semibold text-white">Menu</span>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  if (window.innerWidth < 1024) onClose();
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-blue-600/10 text-blue-400 border border-blue-600/20 shadow-[0_0_10px_rgba(59,130,246,0.15)]" 
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-blue-400" : "text-slate-500")} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Footer Info */}
        <div className="p-4 border-t border-slate-800 text-xs text-slate-500">
          <p>© 2024 PTA Studio</p>
          <p>v1.0.0</p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;