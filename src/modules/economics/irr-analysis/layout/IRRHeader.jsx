import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, HelpCircle, Settings, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useIRRAnalysis } from '@/context/economics/IRRAnalysisContext';
import ProjectSelector from '../components/ProjectSelector';

const IRRHeader = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { currentProject } = useIRRAnalysis();

  return (
    <header className="h-14 bg-[#1E293B] border-b border-slate-800 flex items-center justify-between px-4 z-20 shrink-0">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/dashboard/modules/economics')}
          className="text-slate-400 hover:text-white hover:bg-slate-800 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Back to Module</span>
        </Button>

        <div className="h-6 w-px bg-slate-700 mx-2 hidden sm:block"></div>

        <div className="flex flex-col">
          <h1 className="text-sm font-semibold text-slate-100 tracking-wide">
            IRR Analysis Studio
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Economics Module</span>
            {currentProject && (
              <>
                <span>/</span>
                <span className="text-blue-400">{currentProject.name}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:block">
           <ProjectSelector />
        </div>

        <div className="h-6 w-px bg-slate-700 mx-2 hidden sm:block"></div>

        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800" title="Help">
          <HelpCircle className="h-5 w-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8 border border-slate-700">
                <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.email} />
                <AvatarFallback className="bg-blue-600 text-white text-xs">
                  {user?.email?.substring(0, 2).toUpperCase() || 'US'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-[#1E293B] border-slate-800 text-slate-200" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-white">{user?.user_metadata?.full_name || 'User'}</p>
                <p className="text-xs leading-none text-slate-400">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-800" />
            <DropdownMenuItem className="focus:bg-slate-800 focus:text-white cursor-pointer">
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="focus:bg-slate-800 focus:text-white cursor-pointer">
              Global Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-800" />
            <DropdownMenuItem 
              className="focus:bg-slate-800 focus:text-white cursor-pointer text-red-400 focus:text-red-400"
              onClick={() => signOut()}
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default IRRHeader;