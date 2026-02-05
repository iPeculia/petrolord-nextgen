import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, ShieldAlert, Clock, Calendar } from 'lucide-react';
import useLicenseStatus from '@/hooks/useLicenseStatus';
import { cn } from '@/lib/utils';

/**
 * Component to display current license status for a user.
 * 
 * Usage:
 * <LicenseStatus userId={currentUser.id} />
 */
const LicenseStatus = ({ userId, className }) => {
  const { status, isValid, isLoading } = useLicenseStatus(userId);

  if (isLoading) {
    return (
      <Card className={cn("animate-pulse", className)}>
        <CardHeader className="h-16 bg-gray-100 dark:bg-gray-800" />
        <CardContent className="h-24" />
      </Card>
    );
  }

  if (!status) return null;

  const getStatusColor = (s) => {
    switch(s) {
      case 'active': return 'bg-emerald-500 hover:bg-emerald-600';
      case 'grace_period': return 'bg-amber-500 hover:bg-amber-600';
      case 'expired': return 'bg-red-500 hover:bg-red-600';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (s) => {
    switch(s) {
      case 'active': return <ShieldCheck className="w-5 h-5" />;
      case 'grace_period': return <Clock className="w-5 h-5" />;
      case 'expired': return <ShieldAlert className="w-5 h-5" />;
      default: return <ShieldAlert className="w-5 h-5" />;
    }
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            License Information
          </CardTitle>
          <Badge className={cn("text-white capitalize flex items-center gap-1.5", getStatusColor(status.status))}>
            {getStatusIcon(status.status)}
            {status.status.replace('_', ' ')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-xs text-gray-500 uppercase font-semibold">Type</span>
            <div className="font-medium text-gray-900 dark:text-gray-100">
              {status.type || 'Standard Academic'}
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-gray-500 uppercase font-semibold">Status</span>
            <div className={cn("font-medium", isValid ? "text-green-600" : "text-red-600")}>
              {isValid ? 'Valid' : 'Invalid / Expired'}
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-gray-800">
           {status.licenseEnd && (
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center text-gray-500">
                <Calendar className="w-4 h-4 mr-2" />
                Expires
              </span>
              <span className="font-medium">
                {new Date(status.licenseEnd).toLocaleDateString()}
              </span>
            </div>
           )}

           {status.daysRemaining > 0 && status.daysRemaining < 30 && (
             <div className="flex items-center justify-between text-sm text-amber-600 font-medium bg-amber-50 dark:bg-amber-900/10 p-2 rounded-md">
               <span className="flex items-center">
                 <Clock className="w-4 h-4 mr-2" />
                 Time Remaining
               </span>
               <span>{status.daysRemaining} days</span>
             </div>
           )}

           {status.status === 'grace_period' && status.gracePeriodEnd && (
             <div className="text-xs text-amber-600 text-center mt-2">
               Grace period ends: {new Date(status.gracePeriodEnd).toLocaleDateString()}
             </div>
           )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LicenseStatus;