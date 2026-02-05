import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, User, ArrowLeft, X, Layout } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useApplicationLayout } from '@/contexts/ApplicationLayoutContext';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ViewAsSelector from '@/components/ViewAsSelector';
import NotificationBell from '@/components/notifications/NotificationBell';

const Header = () => {
  const { user, signOut, profile } = useAuth();
  const { isFullScreen, currentAppName, moduleName, exitFullScreen } = useApplicationLayout();
  const navigate = useNavigate();

  return (
    <header className="bg-[#1E293B] border-b border-slate-800 h-16 flex items-center justify-between px-4 md:px-6 z-20 transition-all duration-300">
      
      {/* LEFT SECTION */}
      <div className="flex items-center gap-4">
        
        {/* Full Screen Mode: Show Back Navigation */}
        {isFullScreen ? (
            <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-4 duration-300">
                <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-slate-400 hover:text-white hover:bg-slate-800 gap-2 pl-0"
                    onClick={exitFullScreen}
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="hidden sm:inline">Back to {moduleName || 'Dashboard'}</span>
                </Button>
                <div className="h-6 w-px bg-slate-700"></div>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[#BFFF00] tracking-wide uppercase px-2 py-0.5 rounded-sm bg-[#BFFF00]/10 border border-[#BFFF00]/20">
                        {currentAppName}
                    </span>
                </div>
            </div>
        ) : (
            /* Normal Mode: Mobile Trigger & View Selector */
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="md:hidden text-slate-400">
                    <Menu className="w-6 h-6" />
                </Button>
                
                {/* View As Selector - placed prominently in header for Admins */}
                <div className="hidden md:block">
                    <ViewAsSelector />
                </div>
            </div>
        )}
      </div>

      {/* CENTER SECTION (Optional Search) */}
      {!isFullScreen && (
        <div className="hidden md:flex items-center relative max-w-md w-full mx-4 transition-all">
            <Search className="absolute left-3 text-slate-500 w-4 h-4" />
            <input 
            type="text" 
            placeholder="Search resources, wells, or reports..." 
            className="w-full bg-slate-900 border border-slate-700 rounded-full py-1.5 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:border-[#BFFF00] transition-colors"
            />
        </div>
      )}

      {/* RIGHT SECTION: Actions & Profile */}
      <div className="flex items-center space-x-2 md:space-x-4">
        
        {/* In Full Screen Mode, show an explicit 'Exit' button for clarity */}
        {isFullScreen && (
             <Button 
                variant="outline" 
                size="sm" 
                className="hidden sm:flex border-red-900/50 text-red-400 hover:bg-red-950/30 hover:text-red-300 hover:border-red-800"
                onClick={exitFullScreen}
             >
                <X className="w-4 h-4 mr-2" />
                Exit Tool
             </Button>
        )}

        {/* Integrated Notification Bell */}
        <NotificationBell />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8 border border-slate-600">
                <AvatarImage src={user?.user_metadata?.avatar_url} alt={profile?.display_name || "User"} />
                <AvatarFallback className="bg-slate-700 text-slate-200">
                    {profile?.display_name ? profile.display_name.charAt(0).toUpperCase() : <User className="w-4 h-4"/>}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-[#1E293B] border-slate-700 text-slate-200" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-white">{profile?.display_name || "User"}</p>
                <p className="text-xs leading-none text-slate-400">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-700" />
            
            {/* Mobile View As Selector fallback */}
            {!isFullScreen && (
                <div className="md:hidden px-2 py-2">
                    <ViewAsSelector />
                </div>
            )}
            
            <DropdownMenuItem className="hover:bg-slate-700 focus:bg-slate-700 cursor-pointer">
                <Link to="/profile" className="w-full flex items-center">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-slate-700 focus:bg-slate-700 cursor-pointer">
                <Link to="/settings" className="w-full flex items-center">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-700" />
            <DropdownMenuItem className="hover:bg-slate-700 focus:bg-slate-700 text-red-400 cursor-pointer" onClick={signOut}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;