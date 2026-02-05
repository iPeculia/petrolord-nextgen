import React from 'react';
import { Settings, HelpCircle, User, Box } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTorqueDrag } from '@/contexts/TorqueDragContext';
import ProjectSelector from './ProjectSelector';
import WellSelector from './WellSelector';

const TopNavigationBar = () => {
  const { current_tab, setCurrentTab } = useTorqueDrag();
  
  const tabs = ['Setup', 'Trajectory', 'Pipe String', 'Analysis', 'Results', 'Settings'];

  return (
    <div className="h-[60px] bg-[#1a1a1a] border-b border-slate-800 flex items-center justify-between px-4 w-full z-50">
      {/* Left Section: Logo & Title */}
      <div className="flex items-center gap-3 w-[240px] min-w-[240px]">
        <div className="h-8 w-8 bg-blue-600 rounded-md flex items-center justify-center">
          <Box className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-white font-bold text-sm leading-tight">Torque & Drag</h1>
          <p className="text-slate-400 text-xs">Analysis Studio</p>
        </div>
      </div>

      {/* Center-Left: Selectors */}
      <div className="flex items-center h-[36px] bg-slate-900 rounded-md border border-slate-700 ml-4">
        <ProjectSelector />
        <WellSelector />
      </div>

      {/* Center: Main Tabs */}
      <div className="flex-1 flex justify-center px-4">
        <div className="flex bg-slate-900 p-1 rounded-md border border-slate-700">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setCurrentTab(tab)}
              className={`px-4 py-1.5 text-sm font-medium rounded-sm transition-all ${
                current_tab === tab
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Right Section: Actions */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800">
          <HelpCircle className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800">
          <Settings className="h-5 w-5" />
        </Button>
        <div className="w-px h-6 bg-slate-700 mx-1"></div>
        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default TopNavigationBar;