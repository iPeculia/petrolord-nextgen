import React from 'react';
import { Lock, Unlock, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import useModuleAccess from '@/hooks/useModuleAccess';

/**
 * ModuleAccessControl
 * Blocks content if the user does not have access to the module.
 * Admin/Lecturers bypass this automatically.
 */
const ModuleAccessControl = ({ moduleId, children, title = "Module Content", fallbackUrl = "/dashboard" }) => {
  const { isLocked, lockReason, loading, canAccess } = useModuleAccess(moduleId);

  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-gray-50/50 rounded-xl border-2 border-dashed animate-pulse">
        <span className="text-gray-400 font-medium">Checking access permissions...</span>
      </div>
    );
  }

  // If unlocked or privileged role, render content
  if (canAccess) {
    return <>{children}</>;
  }

  // Otherwise, show lock screen
  return (
    <div className="w-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 rounded-2xl bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 shadow-inner">
      <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6 shadow-sm">
        <Lock className="w-10 h-10 text-red-600 dark:text-red-400" />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
        {title} is Locked
      </h2>
      
      <p className="text-gray-600 dark:text-gray-300 max-w-md mb-8 leading-relaxed">
        {lockReason || "You do not have permission to view this module yet. Please complete the prerequisite courses or contact your university administrator."}
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          variant="outline" 
          onClick={() => window.history.back()}
          className="min-w-[140px]"
        >
          Go Back
        </Button>
        <Button 
          className="min-w-[140px] bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg transition-all"
          onClick={() => window.location.href = '/courses'} // Or Link if router available
        >
          View Requirements
        </Button>
      </div>

      <div className="mt-10 flex items-center gap-2 text-xs text-gray-400 bg-white/50 dark:bg-black/20 px-4 py-2 rounded-full">
        <ShieldAlert className="w-3 h-3" />
        <span>Access Control ID: {moduleId?.slice(0, 8)}</span>
      </div>
    </div>
  );
};

export default ModuleAccessControl;