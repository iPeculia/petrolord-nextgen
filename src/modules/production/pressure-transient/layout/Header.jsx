import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, HelpCircle, Settings, User, ArrowLeft, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const Header = ({ onToggleSidebar, onNewWell }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  return (
    <header className="h-16 bg-[#0F172A] border-b border-slate-800 flex items-center justify-between px-4 lg:px-6 z-30 sticky top-0">
      <div className="flex items-center gap-4">
        <button 
          onClick={onToggleSidebar}
          className="p-2 -ml-2 text-slate-400 hover:text-white lg:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="hidden lg:flex h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800"
            onClick={() => navigate('/dashboard/modules/production')}
            title="Back to Production Module"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="h-6 w-px bg-slate-800 hidden lg:block" />
          <h1 className="text-lg font-semibold text-white tracking-tight">Pressure Transient Analysis Studio</h1>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <Button 
          onClick={onNewWell}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 hidden sm:flex"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Well
        </Button>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800">
            <HelpCircle className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800">
            <Settings className="w-5 h-5" />
          </Button>
        </div>

        <div className="h-6 w-px bg-slate-800" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" alt={user?.email} />
                <AvatarFallback className="bg-blue-600 text-white text-xs">
                  {user?.email?.substring(0, 2).toUpperCase() || 'US'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-[#1E293B] border-slate-800 text-white" align="end">
            <DropdownMenuItem className="focus:bg-slate-800 cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="focus:bg-slate-800 cursor-pointer">
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;