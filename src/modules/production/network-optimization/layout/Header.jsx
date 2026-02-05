import React, { useState } from 'react';
import { useNetworkOptimization } from '@/context/NetworkOptimizationContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Network, HelpCircle, Settings, User, LogOut, ArrowLeft } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';
import NetworkSelector from '../components/NetworkSelector';
import HelpDialog from '../components/HelpDialog';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { currentNetwork } = useNetworkOptimization();
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="h-16 border-b border-slate-800 bg-[#0F172A] px-4 flex items-center justify-between shrink-0 z-20">
      <div className="flex items-center gap-4">
        <Button 
            variant="ghost" 
            size="sm" 
            className="text-slate-400 hover:text-white px-2"
            onClick={() => navigate('/dashboard/modules/production')}
        >
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Back</span>
        </Button>
        <div className="h-6 w-px bg-slate-800" />
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-lg">
          <Network className="h-6 w-6" />
          <span className="hidden md:inline">Network Optimization Studio</span>
        </div>
        
        <div className="h-6 w-px bg-slate-800 hidden md:block" />
        
        <div className="flex items-center gap-4">
           <NetworkSelector />
           <Breadcrumb />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-slate-400 hover:text-white"
          onClick={() => setIsHelpOpen(true)}
        >
          <HelpCircle className="h-5 w-5" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
              <Settings className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-slate-200">
            <DropdownMenuLabel>Settings</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-800" />
            <DropdownMenuItem className="focus:bg-slate-800 focus:text-white cursor-pointer">
              General
            </DropdownMenuItem>
            <DropdownMenuItem className="focus:bg-slate-800 focus:text-white cursor-pointer">
              Display
            </DropdownMenuItem>
            <DropdownMenuItem className="focus:bg-slate-800 focus:text-white cursor-pointer">
              Units
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="h-6 w-px bg-slate-800 mx-1" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/avatars/01.png" alt="@user" />
                <AvatarFallback className="bg-emerald-900 text-emerald-200">PE</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-slate-900 border-slate-800 text-slate-200" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-white">Production Engineer</p>
                <p className="text-xs leading-none text-slate-400">
                  engineer@petrolord.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-800" />
            <DropdownMenuItem className="focus:bg-slate-800 focus:text-white cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="focus:bg-slate-800 focus:text-white cursor-pointer text-red-400 focus:text-red-400"
              onClick={() => navigate('/login')}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <HelpDialog open={isHelpOpen} onOpenChange={setIsHelpOpen} />
    </header>
  );
};

export default Header;