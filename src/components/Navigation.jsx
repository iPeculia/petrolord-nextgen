import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  User, 
  Search,
  BookOpen,
  BarChart3,
  ShieldCheck,
  Zap,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navigation = () => {
  const { user, profile, signOut } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;
  const isAdmin = profile?.role === 'super_admin' || profile?.role === 'admin';

  // Generate initials for avatar
  const getInitials = (name) => {
      if (!name) return 'U';
      return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0F172A]/95 backdrop-blur-md border-b border-slate-800 h-16">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        
        {/* Logo & Main Links */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#BFFF00] to-emerald-600 p-[1px]">
               <div className="w-full h-full bg-[#0F172A] rounded-lg flex items-center justify-center group-hover:bg-transparent transition-colors">
                  <Zap className="w-4 h-4 text-[#BFFF00] group-hover:text-black transition-colors" />
               </div>
            </div>
            <span className="text-lg font-bold text-white tracking-tight">Petrolord <span className="text-[#BFFF00]">NextGen</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
             <Link to="/dashboard">
                <Button variant="ghost" className={`${isActive('/dashboard') ? 'text-[#BFFF00] bg-white/5' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                   <LayoutDashboard className="w-4 h-4 mr-2" />
                   Dashboard
                </Button>
             </Link>
             <Link to="/search">
                <Button variant="ghost" className={`${isActive('/search') ? 'text-[#BFFF00] bg-white/5' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                   <Search className="w-4 h-4 mr-2" />
                   Search
                </Button>
             </Link>
             <Link to="/dashboard/courses">
                <Button variant="ghost" className={`${isActive('/dashboard/courses') ? 'text-[#BFFF00] bg-white/5' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                   <BookOpen className="w-4 h-4 mr-2" />
                   Courses
                </Button>
             </Link>
             {isAdmin && (
               <>
                 <Link to="/dashboard/analytics">
                    <Button variant="ghost" className={`${isActive('/dashboard/analytics') ? 'text-[#BFFF00] bg-white/5' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                       <BarChart3 className="w-4 h-4 mr-2" />
                       Analytics
                    </Button>
                 </Link>
                 <Link to="/dashboard/compliance">
                    <Button variant="ghost" className={`${isActive('/dashboard/compliance') ? 'text-[#BFFF00] bg-white/5' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                       <ShieldCheck className="w-4 h-4 mr-2" />
                       Compliance
                    </Button>
                 </Link>
               </>
             )}
          </div>
        </div>

        {/* Right Side - User Menu */}
        <div className="flex items-center gap-4">
          {user ? (
             <DropdownMenu>
               <DropdownMenuTrigger asChild>
                 <Button variant="ghost" className="relative h-9 w-9 rounded-full ring-2 ring-[#BFFF00]/20 hover:ring-[#BFFF00] transition-all p-0">
                   <Avatar className="h-9 w-9">
                     <AvatarImage src={profile?.avatar_url} alt={profile?.display_name} />
                     <AvatarFallback className="bg-slate-800 text-[#BFFF00] border border-slate-700">
                        {getInitials(profile?.display_name || user.email)}
                     </AvatarFallback>
                   </Avatar>
                 </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent className="w-56 bg-[#1E293B] border-slate-800 text-slate-200" align="end" forceMount>
                 <DropdownMenuLabel className="font-normal">
                   <div className="flex flex-col space-y-1">
                     <p className="text-sm font-medium leading-none text-white">{profile?.display_name || 'User'}</p>
                     <p className="text-xs leading-none text-slate-400">{user.email}</p>
                   </div>
                 </DropdownMenuLabel>
                 <DropdownMenuSeparator className="bg-slate-800" />
                 <DropdownMenuItem asChild>
                    <Link to="/dashboard/profile" className="cursor-pointer hover:bg-slate-800 focus:bg-slate-800 focus:text-[#BFFF00]">
                       <User className="mr-2 h-4 w-4" />
                       Profile
                    </Link>
                 </DropdownMenuItem>
                 {isAdmin && (
                   <>
                     <DropdownMenuItem asChild>
                        <Link to="/dashboard/analytics" className="cursor-pointer hover:bg-slate-800 focus:bg-slate-800 focus:text-[#BFFF00]">
                           <BarChart3 className="mr-2 h-4 w-4" />
                           Analytics
                        </Link>
                     </DropdownMenuItem>
                     <DropdownMenuItem asChild>
                        <Link to="/dashboard/compliance" className="cursor-pointer hover:bg-slate-800 focus:bg-slate-800 focus:text-[#BFFF00]">
                           <ShieldCheck className="mr-2 h-4 w-4" />
                           Compliance
                        </Link>
                     </DropdownMenuItem>
                     <DropdownMenuItem asChild>
                        <Link to="/dashboard/reports" className="cursor-pointer hover:bg-slate-800 focus:bg-slate-800 focus:text-[#BFFF00]">
                           <FileText className="mr-2 h-4 w-4" />
                           Reports
                        </Link>
                     </DropdownMenuItem>
                   </>
                 )}
                 <DropdownMenuItem asChild>
                    <Link to="/dashboard/settings" className="cursor-pointer hover:bg-slate-800 focus:bg-slate-800 focus:text-[#BFFF00]">
                       <Settings className="mr-2 h-4 w-4" />
                       Settings
                    </Link>
                 </DropdownMenuItem>
                 <DropdownMenuSeparator className="bg-slate-800" />
                 <DropdownMenuItem onClick={signOut} className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-900/20 focus:bg-red-900/20">
                   <LogOut className="mr-2 h-4 w-4" />
                   Log out
                 </DropdownMenuItem>
               </DropdownMenuContent>
             </DropdownMenu>
          ) : (
             <div className="flex gap-2">
                <Link to="/login">
                   <Button variant="ghost" className="text-white hover:text-[#BFFF00]">Log in</Button>
                </Link>
                <Link to="/university-onboarding">
                   <Button className="bg-[#BFFF00] text-black hover:bg-[#a3d900] font-bold">Get Started</Button>
                </Link>
             </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;