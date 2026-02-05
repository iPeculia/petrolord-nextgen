import React from 'react';

const Footer = () => {
  return (
    <div className="h-[40px] bg-[#1a1a1a] border-t border-slate-800 flex items-center justify-between px-4 text-xs text-slate-500">
      <div>
        <span>Petrolord Suite v2.4.0</span>
        <span className="mx-2">|</span>
        <span>Torque & Drag Module</span>
      </div>
      <div>
        <span>© 2026 Petrolord Inc. All rights reserved.</span>
      </div>
    </div>
  );
};

export default Footer;