import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BookOpen, User, Layers, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

const MobileNavItem = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      cn(
        "flex flex-col items-center justify-center w-full h-full space-y-1",
        isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
      )
    }
  >
    <Icon className="w-5 h-5" />
    <span className="text-[10px] font-medium">{label}</span>
  </NavLink>
);

const MobileNavigation = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-card border-t border-border md:hidden safe-area-pb">
      <div className="grid grid-cols-5 h-full">
        <MobileNavItem to="/dashboard" icon={Home} label="Home" />
        <MobileNavItem to="/courses" icon={BookOpen} label="Learn" />
        <MobileNavItem to="/modules/geoscience" icon={Layers} label="Apps" />
        <MobileNavItem to="/admin/notifications" icon={Bell} label="Alerts" />
        <MobileNavItem to="/profile" icon={User} label="Profile" />
      </div>
    </div>
  );
};

export default MobileNavigation;