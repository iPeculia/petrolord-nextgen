import React from 'react';

const IRRFooter = () => {
  return (
    <footer className="bg-[#1E293B] border-t border-slate-800 px-4 py-2 flex justify-between items-center text-xs text-slate-500 shrink-0">
      <div className="flex items-center gap-4">
        <span>IRR Analysis Studio v1.0.0</span>
        <span className="hidden sm:inline">|</span>
        <span className="hidden sm:inline">Last Updated: {new Date().toLocaleDateString()}</span>
      </div>
      <div className="flex items-center gap-4">
        <span>© 2024 Petrolord Suite</span>
      </div>
    </footer>
  );
};

export default IRRFooter;