import React from 'react';
import { Link } from 'react-router-dom';
import { useRiskAnalysis } from '@/context/RiskAnalysisContext';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import ProjectSelector from './ProjectSelector';
import { 
  Briefcase, 
  Settings, 
  User, 
  Bell, 
  HelpCircle,
  Menu,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const TABS = [
  'Setup', 
  'QC', 
  'Sources', 
  'Workflows', 
  'AI Insights', 
  '3D Viz', 
  'Collaboration', 
  'Security', 
  'Analytics', 
  'Porosity'
];

const TopNavigationBar = () => {
  const { currentTab, setCurrentTab, toggleLeftSidebar } = useRiskAnalysis();
  const { profile, signOut } = useAuth();

  return (
    <div className="h-[60px] bg-[#1a1a1a] border-b border-[#333] flex items-center px-4 justify-between shrink-0 z-50 w-full">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="lg:hidden text-slate-400 hover:text-white"
          onClick={toggleLeftSidebar}
        >
          <Menu className="w-5 h-5" />
        </Button>

        <Link to="/dashboard/modules/economics">
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white mr-2" title="Back to Economics">
                <ArrowLeft className="w-5 h-5" />
            </Button>
        </Link>
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
            <Briefcase className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-semibold text-slate-100 hidden md:block">
            Risk Analysis Studio
          </span>
        </div>

        <div className="h-6 w-[1px] bg-[#333] mx-2 hidden md:block" />
        
        <ProjectSelector />
      </div>

      {/* Center Section - Tabs */}
      <div className="flex-1 px-4 overflow-x-auto hidden xl:flex justify-center scrollbar-hide">
        <div className="flex items-center gap-1">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setCurrentTab(tab)}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 whitespace-nowrap",
                currentTab === tab 
                  ? "bg-blue-600/20 text-blue-400" 
                  : "text-slate-400 hover:text-slate-200 hover:bg-[#333]"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-[#333]">
          <HelpCircle className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-[#333] relative">
          <Bell className="w-5 h-5" />
          <Badge className="absolute top-1 right-1 w-2 h-2 p-0 bg-red-500 rounded-full border-none" />
        </Button>
        
        <div className="h-6 w-[1px] bg-[#333] mx-1" />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full w-8 h-8 bg-[#333] border border-[#444] p-0 hover:bg-[#444]">
              <User className="w-4 h-4 text-slate-200" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-[#262626] border-[#333] text-slate-200">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{profile?.display_name || 'User'}</span>
                <span className="text-xs text-slate-400 font-normal">{profile?.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#333]" />
            <DropdownMenuItem className="cursor-pointer focus:bg-[#333] focus:text-white">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={signOut} className="cursor-pointer text-red-400 focus:bg-[#333] focus:text-red-300">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default TopNavigationBar;