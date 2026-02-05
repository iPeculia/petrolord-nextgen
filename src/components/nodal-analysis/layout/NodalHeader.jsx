import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle, Settings, ChevronDown, Menu, ArrowLeft, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNodalAnalysis } from '@/context/nodal-analysis/NodalAnalysisContext';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import HelpModal from '../modals/HelpModal';
import SettingsModal from '../modals/SettingsModal';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const NodalHeader = () => {
  const navigate = useNavigate();
  const { currentSession, isSidebarCollapsed, toggleSidebar } = useNodalAnalysis();
  const { user, signOut } = useAuth();
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <header className="h-14 border-b border-slate-800 bg-[#0F172A] px-4 flex items-center justify-between sticky top-0 z-40 shadow-sm shrink-0">
      {/* Left: Branding & Context */}
      <div className="flex items-center gap-4">
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleSidebar}
                        className="text-slate-400 hover:text-white hidden md:flex"
                    >
                        {isSidebarCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    {isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>

        <div className="flex items-center gap-2">
            <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/dashboard/modules/production')}
                className="text-slate-400 hover:text-white gap-2 px-2"
            >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Production</span>
            </Button>
            
            <span className="text-slate-700">/</span>

            <h1 className="font-bold text-sm text-white tracking-tight">
                Nodal Analysis Studio
            </h1>
        </div>
        
        {/* Active Context Indicator */}
        {currentSession && (
             <div className="hidden lg:flex items-center gap-3 ml-4 pl-4 border-l border-slate-800">
               <Badge variant="outline" className="border-blue-500/30 bg-blue-500/10 text-blue-300 font-normal px-2.5 py-0.5">
                  Session: {currentSession.name}
               </Badge>
            </div>
        )}
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center gap-1">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-slate-400 hover:text-white"
                            onClick={() => setIsHelpOpen(true)}
                        >
                            <HelpCircle className="w-4 h-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Help</TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-slate-400 hover:text-white"
                            onClick={() => setIsSettingsOpen(true)}
                        >
                            <Settings className="w-4 h-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Session Settings</TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>

        <div className="h-4 w-px bg-slate-800 mx-2 hidden md:block" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="pl-1 pr-1 gap-2 h-8 hover:bg-slate-800 rounded-full border border-transparent hover:border-slate-700 transition-all">
              <Avatar className="h-6 w-6 border border-slate-700">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback className="bg-blue-600 text-white text-[10px]">
                    {user?.email?.substring(0, 2).toUpperCase() || 'US'}
                </AvatarFallback>
              </Avatar>
              <div className="text-left hidden lg:block">
                  <p className="text-xs font-medium text-white leading-none max-w-[100px] truncate">{user?.email?.split('@')[0]}</p>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-500 hidden lg:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-[#1E293B] border-slate-800 text-slate-200">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-700" />
            <DropdownMenuItem className="focus:bg-slate-800 focus:text-white cursor-pointer" onClick={() => setIsSettingsOpen(true)}>
                 <Settings className="w-4 h-4 mr-2" /> Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-400 focus:bg-slate-800 focus:text-red-300 cursor-pointer" onClick={signOut}>
                Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Modals */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </header>
  );
};

export default NodalHeader;