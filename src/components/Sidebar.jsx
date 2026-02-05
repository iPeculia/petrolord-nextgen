import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  Settings, 
  GraduationCap, 
  BookOpen, 
  LayoutDashboard, 
  Users, 
  Shield, 
  FileText, 
  PieChart, 
  ClipboardCheck, 
  Building2, 
  BadgeInfo,
  Activity, 
  Database, 
  Hammer, 
  Factory, 
  Compass, 
  Landmark, 
  BrainCircuit, 
  BarChart, 
  HardHat, 
  Droplets, 
  Construction,
  UserPlus,
  History,
  CalendarClock,
  Award,
  Trophy,
  Medal
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { useRole } from '@/contexts/RoleContext';
import { useApplicationLayout } from '@/contexts/ApplicationLayoutContext';

const SidebarItem = ({ to, icon: Icon, label, exact = false }) => {
  const location = useLocation();
  const isActive = exact 
    ? location.pathname === to 
    : location.pathname.startsWith(to);

  return (
    <NavLink
      to={to}
      className={({ isActive: linkActive }) => cn(
        "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 group text-sm font-medium",
        (exact ? linkActive : isActive)
          ? "bg-[#BFFF00] text-black shadow-[0_0_15px_rgba(191,255,0,0.3)]"
          : "text-slate-400 hover:text-white hover:bg-white/5"
      )}
    >
      <Icon className={cn("w-5 h-5", isActive ? "text-black" : "group-hover:text-[#BFFF00]")} />
      <span className="truncate">{label}</span>
    </NavLink>
  );
};

const FacilitiesSidebarItem = ({ to, icon: Icon, label, exact = false }) => {
  const location = useLocation();
  const isActive = exact 
    ? location.pathname === to 
    : location.pathname.startsWith(to);

  return (
    <NavLink
      to={to}
      className={({ isActive: linkActive }) => cn(
        "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 group text-sm font-medium",
        (exact ? linkActive : isActive)
          ? "bg-[#BFFF00] text-black shadow-[0_0_15px_rgba(191,255,0,0.3)]"
          : "text-slate-400 hover:text-white hover:bg-white/5"
      )}
    >
      <Icon className={cn("w-5 h-5", isActive ? "text-black" : "text-[#0066cc] group-hover:text-[#BFFF00]")} />
      <span className="truncate">{label}</span>
    </NavLink>
  );
};

const SidebarGroup = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
      {title}
    </h3>
    <div className="space-y-1">
      {children}
    </div>
  </div>
);

const Sidebar = () => {
  const { isFullScreen } = useApplicationLayout();
  const { 
    isViewAsSuperAdmin, 
    isViewAsAdmin, 
    isViewAsUniversityAdmin, 
    isViewAsLecturer, 
    isViewAsStudent 
  } = useRole();

  return (
    <aside className={cn(
        "hidden md:flex flex-col bg-[#0F172A] border-r border-slate-800 h-screen overflow-y-auto whitespace-nowrap",
        isFullScreen ? "invisible" : "visible w-64"
    )}>
      {/* Brand */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#BFFF00] flex items-center justify-center shadow-[0_0_15px_rgba(191,255,0,0.4)]">
          <Activity className="w-5 h-5 text-black" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">Petrolord</h1>
          <p className="text-[10px] text-slate-400 font-mono tracking-widest">NEXTGEN SUITE</p>
        </div>
      </div>

      <div className="flex-1 px-3 py-2 space-y-1">
        {/* === SHARED / COMMON === */}
        <SidebarGroup title="Overview">
          <SidebarItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" exact />
        </SidebarGroup>

        {/* === STUDENT VIEW === */}
        {isViewAsStudent && (
          <>
            <SidebarGroup title="My Learning">
              <SidebarItem to="/dashboard/my-learning" icon={BookOpen} label="My Courses" />
              <SidebarItem to="/dashboard/certificates" icon={Award} label="Certificates" />
              <SidebarItem to="/dashboard/achievements" icon={Medal} label="Achievements" />
              <SidebarItem to="/dashboard/leaderboard" icon={Trophy} label="Leaderboard" />
            </SidebarGroup>
            
            <SidebarGroup title="Tools">
               <SidebarItem to="/dashboard/modules/geoscience" icon={Activity} label="Geoscience" />
               <SidebarItem to="/dashboard/modules/reservoir" icon={Database} label="Reservoir" />
               <SidebarItem to="/dashboard/modules/drilling" icon={HardHat} label="Drilling" />
               <SidebarItem to="/dashboard/modules/production" icon={Factory} label="Production" />
               <FacilitiesSidebarItem to="/dashboard/modules/facilities" icon={Building2} label="Facilities" />
            </SidebarGroup>
          </>
        )}

        {/* === LECTURER VIEW === */}
        {isViewAsLecturer && (
          <>
            <SidebarGroup title="Academic">
              <SidebarItem to="/dashboard/my-learning" icon={GraduationCap} label="My Classes" />
              <SidebarItem to="/dashboard/courses" icon={BookOpen} label="Course Library" />
              <SidebarItem to="/dashboard/assignments" icon={ClipboardCheck} label="Assignments" />
            </SidebarGroup>

            <SidebarGroup title="Department Tools">
               <SidebarItem to="/dashboard/modules/geoscience" icon={Activity} label="Geoscience Lab" />
               <SidebarItem to="/dashboard/modules/reservoir" icon={Database} label="Reservoir Lab" />
               <FacilitiesSidebarItem to="/dashboard/modules/facilities" icon={Building2} label="Facilities Lab" />
            </SidebarGroup>
          </>
        )}

        {/* === UNIVERSITY ADMIN VIEW === */}
        {isViewAsUniversityAdmin && (
          <>
            <SidebarGroup title="Institution Mgmt">
              <SidebarItem to="/dashboard/admin/users" icon={Users} label="Students & Staff" />
              <SidebarItem to="/dashboard/admin/departments" icon={Building2} label="Departments" />
            </SidebarGroup>
            
            <SidebarGroup title="Reports">
              <SidebarItem to="/dashboard/admin/analytics" icon={BarChart} label="Usage Analytics" />
              <SidebarItem to="/dashboard/admin/audit-logs" icon={FileText} label="Access Logs" />
            </SidebarGroup>
          </>
        )}

        {/* === PETROLORD ADMIN VIEW === */}
        {isViewAsAdmin && (
          <>
            <SidebarGroup title="Platform Mgmt">
              <SidebarItem to="/dashboard/admin/approvals" icon={ClipboardCheck} label="Uni Approvals" />
              <SidebarItem to="/dashboard/admin/add-users" icon={UserPlus} label="Add Users" />
              <SidebarItem to="/dashboard/admin/import-history" icon={History} label="Import History" />
              <SidebarItem to="/dashboard/admin/scheduled-imports" icon={CalendarClock} label="Scheduled Imports" />
              <SidebarItem to="/dashboard/admin/users" icon={Users} label="User Directory" />
              <SidebarItem to="/dashboard/admin/courses" icon={BookOpen} label="Course Catalog" />
            </SidebarGroup>

            <SidebarGroup title="System">
              <SidebarItem to="/dashboard/admin/audit-logs" icon={FileText} label="Audit Logs" />
              <SidebarItem to="/dashboard/admin/analytics" icon={PieChart} label="System Analytics" />
            </SidebarGroup>
          </>
        )}

        {/* === SUPER ADMIN VIEW === */}
        {isViewAsSuperAdmin && (
          <>
            <SidebarGroup title="Platform Superuser">
              <SidebarItem to="/dashboard/admin/approvals" icon={ClipboardCheck} label="Approvals" />
              <SidebarItem to="/dashboard/admin/add-users" icon={UserPlus} label="Add Users" />
              <SidebarItem to="/dashboard/admin/import-history" icon={History} label="Import History" />
              <SidebarItem to="/dashboard/admin/scheduled-imports" icon={CalendarClock} label="Scheduled Imports" />
              <SidebarItem to="/dashboard/admin/users" icon={Users} label="User Management" />
              <SidebarItem to="/dashboard/admin/admin-mgmt" icon={Shield} label="Admin Roles" />
              <SidebarItem to="/dashboard/admin/courses" icon={BookOpen} label="Course Manager" />
              <SidebarItem to="/dashboard/admin/super-admins" icon={Shield} label="Super Admins" />
            </SidebarGroup>

            <SidebarGroup title="Monitoring">
              <SidebarItem to="/dashboard/admin/analytics" icon={PieChart} label="Analytics" />
              <SidebarItem to="/dashboard/admin/audit-logs" icon={FileText} label="Audit Logs" />
              <SidebarItem to="/dashboard/admin/notifications" icon={Activity} label="System Alerts" />
            </SidebarGroup>

            <SidebarGroup title="Core Modules">
              <SidebarItem to="/dashboard/modules/geoscience" icon={Activity} label="Geoscience" />
              <SidebarItem to="/dashboard/modules/reservoir" icon={Database} label="Reservoir" />
              <SidebarItem to="/dashboard/modules/production" icon={Factory} label="Production" />
              <SidebarItem to="/dashboard/modules/drilling" icon={HardHat} label="Drilling" />
              <SidebarItem to="/dashboard/modules/economics" icon={Landmark} label="Economics" />
              <FacilitiesSidebarItem to="/dashboard/modules/facilities" icon={Building2} label="Facilities" />
            </SidebarGroup>
            
            <SidebarGroup title="Enterprise">
              <SidebarItem to="/dashboard/enterprise/ai" icon={BrainCircuit} label="AI Insights" />
              <SidebarItem to="/dashboard/enterprise/analytics" icon={BarChart} label="Adv. Analytics" />
            </SidebarGroup>
          </>
        )}
      </div>

      <div className="p-4 border-t border-slate-800">
        <SidebarItem to="/dashboard/settings" icon={Settings} label="Settings" />
      </div>
    </aside>
  );
};

export default Sidebar;