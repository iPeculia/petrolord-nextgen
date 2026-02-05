import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useArtificialLift } from '../context/ArtificialLiftContext';
import { 
  ArrowLeft, 
  Settings, 
  User, 
  CheckCircle2, 
  Share2, 
  Activity,
  FolderOpen,
  ChevronDown
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const ALDHeader = ({ activeTab, onTabChange }) => {
  const navigate = useNavigate();
  const { currentWell, wells, setCurrentWellId } = useArtificialLift();

  const navigationTabs = [
    { id: 'wells', label: 'Setup' },
    { id: 'reservoir', label: 'Reservoir' },
    { id: 'lift-systems', label: 'Lift Systems' },
    { id: 'equipment', label: 'Equipment' },
    { id: 'design', label: 'Design' },
    { id: 'results', label: 'Analysis' },
    { id: 'settings', label: 'Settings' }
  ];

  return (
    <header className="bg-[#0F172A] border-b border-slate-800 h-14 flex items-center justify-between px-4 z-50 shrink-0 select-none">
      
      {/* Left Section: Back & Brand */}
      <div className="flex items-center gap-4 min-w-[200px]">
        <Button 
          variant="ghost" 
          size="sm"
          className="text-slate-400 hover:text-white hover:bg-slate-800 h-8 w-8 p-0"
          onClick={() => navigate('/dashboard/modules/production')}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-lg ring-1 ring-white/10">
            AL
          </div>
          <div>
            <h1 className="text-sm font-bold text-white leading-none tracking-tight">Artificial Lift</h1>
            <span className="text-[10px] text-blue-400 font-medium tracking-wider uppercase">Design Studio</span>
          </div>
        </div>
      </div>

      {/* Center Section: Navigation Tabs */}
      <nav className="flex items-center h-full px-4 overflow-x-auto scrollbar-none mask-fade-sides">
        <div className="flex items-center space-x-1 h-full">
          {navigationTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "relative px-4 h-full flex items-center text-sm font-medium transition-all duration-200 border-b-2",
                activeTab === tab.id 
                  ? "text-blue-400 border-blue-500 bg-blue-500/5" 
                  : "text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-800/50"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Right Section: Context & Actions */}
      <div className="flex items-center gap-3 min-w-[200px] justify-end">
        
        {/* Project/Well Selector */}
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white gap-2 min-w-[140px] justify-between">
                    <div className="flex items-center gap-2 truncate">
                        <FolderOpen className="w-3.5 h-3.5 text-blue-500" />
                        <span className="truncate max-w-[100px]">{currentWell ? currentWell.name : "Select Well"}</span>
                    </div>
                    <ChevronDown className="w-3 h-3 opacity-50" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 bg-[#1E293B] border-slate-700 text-slate-200">
                <DropdownMenuLabel className="text-xs font-medium text-slate-500 uppercase tracking-wider">Active Wells</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-700" />
                {wells.length > 0 ? (
                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                        {wells.map(w => (
                            <DropdownMenuItem 
                                key={w.well_id} 
                                onClick={() => setCurrentWellId(w.well_id)}
                                className="cursor-pointer hover:bg-slate-700 focus:bg-slate-700 flex justify-between group"
                            >
                                <span className={cn(currentWell?.well_id === w.well_id ? "text-blue-400 font-medium" : "text-slate-300")}>
                                    {w.name}
                                </span>
                                {w.status === 'Active' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
                            </DropdownMenuItem>
                        ))}
                    </div>
                ) : (
                    <div className="p-4 text-center text-xs text-slate-500">No wells found</div>
                )}
            </DropdownMenuContent>
        </DropdownMenu>

        <div className="h-5 w-px bg-slate-800" />

        <div className="flex items-center gap-1 text-xs text-slate-500">
            <span className="flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                <CheckCircle2 className="w-3 h-3" /> Saved
            </span>
        </div>

        <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800">
                <Share2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800">
                <Settings className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-slate-800 text-slate-400 hover:text-white ring-1 ring-slate-700">
                <User className="w-4 h-4" />
            </Button>
        </div>
      </div>
    </header>
  );
};

export default ALDHeader;