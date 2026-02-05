import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const Notification = ({ notification, onClose, onRead }) => {
  const { type, message, timestamp, read } = notification;

  const icons = {
    info: <Info className="w-5 h-5 text-blue-400" />,
    success: <CheckCircle className="w-5 h-5 text-emerald-400" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400" />,
    error: <AlertCircle className="w-5 h-5 text-red-400" />
  };

  const bgs = {
    info: 'bg-blue-900/10 border-blue-500/20',
    success: 'bg-emerald-900/10 border-emerald-500/20',
    warning: 'bg-amber-900/10 border-amber-500/20',
    error: 'bg-red-900/10 border-red-500/20'
  };

  return (
    <div 
      className={cn(
        "relative flex gap-3 p-4 rounded-lg border transition-all hover:bg-slate-800/50 mb-3",
        bgs[type] || bgs.info,
        !read && "border-l-4 border-l-blue-500"
      )}
      onClick={onRead}
    >
      <div className="shrink-0 mt-0.5">{icons[type] || icons.info}</div>
      <div className="flex-1">
        <p className={cn("text-sm text-slate-200", !read && "font-medium")}>{message}</p>
        <span className="text-xs text-slate-500 mt-1 block">
          {new Date(timestamp).toLocaleTimeString()}
        </span>
      </div>
      <button 
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className="shrink-0 text-slate-500 hover:text-white p-1"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Notification;