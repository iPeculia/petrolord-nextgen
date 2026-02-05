import React from 'react';

const Footer = () => {
  return (
    <div className="h-[40px] bg-[#1a1a1a] border-t border-slate-800 flex items-center justify-between px-4 text-xs text-slate-500 shrink-0 z-50">
      <div className="flex items-center gap-4">
        <span>v1.2.0-beta</span>
        <span className="hidden sm:inline">System Status: Online</span>
      </div>
      <div>
        © 2025 Petrolord Suite. All rights reserved.
      </div>
    </div>
  );
};

export default Footer;