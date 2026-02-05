import React from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle2, BookOpen, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

const getActivityIcon = (type) => {
  switch (type) {
    case 'completion': return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
    case 'achievement': return <Trophy className="h-4 w-4 text-yellow-400" />;
    default: return <BookOpen className="h-4 w-4 text-blue-400" />;
  }
};

const RecentActivity = ({ activities }) => {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/50 backdrop-blur-lg p-6 shadow-xl">
      <h3 className="mb-4 text-lg font-bold text-white flex items-center gap-2">
        <Clock className="h-5 w-5 text-slate-400" />
        Recent Activity
      </h3>
      
      <ScrollArea className="h-[300px] pr-4">
        <div className="space-y-4">
          {activities?.length > 0 ? (
            activities.map((activity, index) => (
              <motion.div
                key={activity.id || index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group flex items-start gap-4 rounded-lg border border-transparent bg-white/5 p-3 transition-colors hover:border-white/10 hover:bg-white/10"
              >
                <div className={cn(
                  "mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-800 ring-1 ring-white/10",
                )}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white group-hover:text-blue-200 transition-colors">
                    {activity.title}
                  </p>
                  <p className="text-xs text-slate-400">
                    {activity.description}
                  </p>
                  <span className="mt-1 block text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="flex h-full flex-col items-center justify-center py-8 text-center text-slate-500">
              <Clock className="mb-2 h-8 w-8 opacity-20" />
              <p>No recent activity</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default RecentActivity;