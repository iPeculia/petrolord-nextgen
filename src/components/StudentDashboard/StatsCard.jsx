import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const StatsCard = ({ title, value, icon: Icon, trend, className, gradient = "from-blue-600 to-blue-400" }) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className={cn(
        "relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-lg p-6 shadow-lg",
        className
      )}
    >
      <div className={cn(
        "absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-20 blur-xl bg-gradient-to-br",
        gradient
      )} />
      
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <h3 className="mt-2 text-3xl font-bold text-white tracking-tight">{value}</h3>
          {trend && (
            <p className={cn(
              "mt-2 text-xs font-medium",
              trend > 0 ? "text-emerald-400" : "text-red-400"
            )}>
              {trend > 0 ? "+" : ""}{trend}% from last month
            </p>
          )}
        </div>
        <div className={cn(
          "flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br shadow-inner",
          gradient
        )}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;