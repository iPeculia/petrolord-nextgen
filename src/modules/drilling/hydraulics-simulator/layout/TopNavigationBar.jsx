import React from 'react';
import { useHydraulicsSimulator } from '@/contexts/HydraulicsSimulatorContext';
import ProjectSelector from '../components/ProjectSelector';
import WellSelector from '../components/WellSelector';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Settings, HelpCircle, User, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

const TopNavigationBar = () => {
  const { current_tab, setCurrentTab } = useHydraulicsSimulator();

  return (
    <div className="h-[60px] bg-[#1a1a1a] border-b border-slate-800 flex items-center justify-between px-4 w-full z-50">
      {/* Left Section: Logo & Title */}
      <div className="flex items-center gap-3 w-[240px]">
        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center shadow-lg shadow-blue-900/20">
            {/* Simple Pump Icon SVG */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
        </div>
        <div className="flex flex-col">
            <span className="text-slate-100 font-bold text-sm tracking-tight">Hydraulics Simulator</span>
            <span className="text-slate-500 text-[10px] uppercase tracking-wider">Studio Edition</span>
        </div>
      </div>

      {/* Center-Left: Selectors */}
      <div className="flex items-center gap-4 border-l border-slate-800 pl-4">
        <ProjectSelector />
        <div className="h-4 w-px bg-slate-800"></div>
        <WellSelector />
      </div>

      {/* Center: Tabs */}
      <div className="flex-1 flex justify-center">
        <Tabs value={current_tab} onValueChange={setCurrentTab} className="w-auto">
            <TabsList className="bg-slate-900 border border-slate-800">
                <TabsTrigger value="Setup">Setup</TabsTrigger>
                <TabsTrigger value="Hydraulics">Hydraulics</TabsTrigger>
                <TabsTrigger value="Simulation">Simulation</TabsTrigger>
                <TabsTrigger value="Results">Results</TabsTrigger>
                <TabsTrigger value="Settings">Settings</TabsTrigger>
            </TabsList>
        </Tabs>
      </div>

      {/* Right Section: Actions */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800">
            <HelpCircle className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800 relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#1a1a1a]"></span>
        </Button>
        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800">
            <Settings className="h-5 w-5" />
        </Button>
        
        <div className="h-8 w-px bg-slate-800 mx-2"></div>
        
        <Link to="/dashboard/profile">
            <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-transparent hover:ring-blue-500 transition-all">
                <AvatarImage src="/avatars/user.png" />
                <AvatarFallback className="bg-blue-900 text-blue-200 text-xs">US</AvatarFallback>
            </Avatar>
        </Link>
      </div>
    </div>
  );
};

export default TopNavigationBar;