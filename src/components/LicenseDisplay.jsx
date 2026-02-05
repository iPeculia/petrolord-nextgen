import React from 'react';
import { Clock, AlertTriangle, CheckCircle, XCircle, ChevronDown, Calendar, ShieldCheck, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Progress } from "@/components/ui/progress";

const LicenseDisplay = ({ licenseInfo }) => {
  if (!licenseInfo || licenseInfo.status === 'loading') return null;
  
  if (licenseInfo.daysRemaining === Infinity && !licenseInfo.isAlumni) {
      return (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Faculty License Active</span>
        </div>
      );
  }

  const { licenseEnd, daysRemaining, status, isAlumni } = licenseInfo;
  
  // Logic for visual progress
  let totalDuration = 180; // Default semester
  if (isAlumni) totalDuration = 60; // Grace period default
  
  const progressPercentage = Math.max(0, Math.min(100, (daysRemaining / totalDuration) * 100));
  
  const getStatusColor = () => {
    switch (status) {
      case 'active': return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20';
      case 'warning': return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10 hover:bg-yellow-500/20';
      case 'expired': return 'text-red-400 border-red-500/30 bg-red-500/10 hover:bg-red-500/20';
      case 'grace_period_active': return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10 hover:bg-yellow-500/20';
      case 'grace_period_expired': return 'text-red-400 border-red-500/30 bg-red-500/10 hover:bg-red-500/20';
      default: return 'text-slate-400 border-slate-700 bg-slate-800';
    }
  };

  const getIcon = () => {
    if (isAlumni) return <GraduationCap className="w-3.5 h-3.5 mr-1.5" />;
    
    switch (status) {
        case 'active': return <CheckCircle className="w-3.5 h-3.5 mr-1.5" />;
        case 'warning': return <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />;
        case 'expired': return <XCircle className="w-3.5 h-3.5 mr-1.5" />;
        default: return <Clock className="w-3.5 h-3.5 mr-1.5" />;
    }
  };

  const getLabel = () => {
      if (status === 'grace_period_active') return 'Grace Period';
      if (status === 'grace_period_expired') return 'Grace Period Ended';
      if (status === 'expired') return 'License Expired';
      return 'License Active';
  };

  return (
    <HoverCard openDelay={200}>
      <HoverCardTrigger asChild>
        <button className={cn("flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-all cursor-pointer", getStatusColor())}>
            {getIcon()}
            <div className="flex items-center gap-2">
                <span className="hidden sm:inline">
                    {getLabel()}
                </span>
                {status !== 'grace_period_expired' && status !== 'expired' && (
                    <span className={cn("font-bold ml-1", status === 'warning' || status === 'grace_period_active' ? "animate-pulse" : "")}>
                        {daysRemaining} Days Left
                    </span>
                )}
                <ChevronDown className="w-3 h-3 opacity-50" />
            </div>
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 bg-[#1E293B] border-slate-700 p-4 shadow-xl" align="end">
        <div className="space-y-4">
            <div className="flex justify-between items-start">
                <h4 className="text-sm font-semibold text-white">
                    {isAlumni ? 'Alumni Access Status' : 'Student License Status'}
                </h4>
                <span className={cn("text-xs px-2 py-0.5 rounded capitalize", 
                    status === 'active' ? "bg-emerald-500/20 text-emerald-400" : 
                    status === 'warning' || status === 'grace_period_active' ? "bg-yellow-500/20 text-yellow-400" : 
                    "bg-red-500/20 text-red-400")}>
                    {status.replace(/_/g, ' ')}
                </span>
            </div>
            
            <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-400">
                    <span>{isAlumni ? 'Access Remaining' : 'Validity Remaining'}</span>
                    <span>{Math.max(0, daysRemaining)} days</span>
                </div>
                <Progress 
                    value={progressPercentage} 
                    className="h-2 bg-slate-800" 
                    indicatorClassName={cn(
                        status === 'active' ? "bg-emerald-500" : 
                        status === 'warning' || status === 'grace_period_active' ? "bg-yellow-500" : "bg-red-500"
                    )} 
                />
            </div>

            <div className="grid gap-2 text-sm">
                <div className="flex items-center gap-2 text-slate-300">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-500">
                        {status === 'grace_period_expired' ? 'Expired on:' : 'Expires:'}
                    </span>
                    <span className="text-white font-medium ml-auto">
                        {licenseInfo.licenseEnd ? format(new Date(licenseInfo.licenseEnd), 'MMMM d, yyyy') : 'N/A'}
                    </span>
                </div>
            </div>

            {status === 'warning' && (
                <div className="p-2 rounded bg-yellow-500/10 border border-yellow-500/20 text-xs text-yellow-400">
                    ⚠️ Your license is expiring soon. Please contact your university administrator.
                </div>
            )}
            {status === 'grace_period_active' && (
                <div className="p-2 rounded bg-yellow-500/10 border border-yellow-500/20 text-xs text-yellow-400">
                    🎓 <strong>Alumni Grace Period:</strong> You have full access for a limited time after graduation. Download your materials soon!
                </div>
            )}
             {(status === 'expired' || status === 'grace_period_expired') && (
                <div className="p-2 rounded bg-red-500/10 border border-red-500/20 text-xs text-red-400">
                    ⛔ Access restricted. You can only view past grades and transcripts.
                </div>
            )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default LicenseDisplay;