import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, LogIn, BookOpen, Key, Award, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const StudentActivityTimeline = ({ activities = [] }) => {
  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p>No activity recorded yet.</p>
      </div>
    );
  }

  const getIcon = (type) => {
    switch(type) {
      case 'login': return <LogIn className="w-4 h-4 text-blue-400" />;
      case 'course': return <BookOpen className="w-4 h-4 text-emerald-400" />;
      case 'access': return <Key className="w-4 h-4 text-purple-400" />;
      case 'award': return <Award className="w-4 h-4 text-yellow-400" />;
      default: return <AlertCircle className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <ScrollArea className="h-[400px] w-full pr-4">
      <div className="space-y-6">
        {activities.map((activity, index) => (
          <div key={index} className="relative pl-6 pb-2 last:pb-0">
             {/* Timeline Line */}
             {index !== activities.length - 1 && (
               <div className="absolute left-[9px] top-6 bottom-0 w-px bg-slate-800" />
             )}
             
             {/* Icon */}
             <div className="absolute left-0 top-1 w-5 h-5 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center z-10">
               {getIcon(activity.type)}
             </div>

             <div className="flex flex-col space-y-1">
               <div className="flex justify-between items-start">
                  <p className="text-sm font-medium text-slate-200">{activity.title}</p>
                  <span className="text-xs text-slate-500 font-mono whitespace-nowrap ml-2">
                     {activity.timestamp ? formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true }) : '-'}
                  </span>
               </div>
               <p className="text-xs text-slate-400">{activity.details}</p>
             </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default StudentActivityTimeline;