import React from 'react';
import { cn } from '@/lib/utils';

const BottomPanel = ({ children, className }) => {
  return (
    <div className={cn("h-48 shrink-0 border-t border-slate-800 bg-slate-950 flex flex-col", className)}>
      {children}
    </div>
  );
};

export default BottomPanel;