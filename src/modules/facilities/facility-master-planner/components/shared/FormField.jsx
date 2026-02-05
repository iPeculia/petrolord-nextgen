import React from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import FormTooltip from './FormTooltip';

const FormField = ({ label, required, error, children, className, tooltip, icon }) => {
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center gap-2">
        {icon && <span className="text-slate-500">{icon}</span>}
        <Label className={cn("text-xs font-semibold uppercase tracking-wider text-slate-400", error && "text-red-400")}>
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
        {tooltip && <FormTooltip content={tooltip} />}
      </div>
      {children}
      {error && <span className="text-xs text-red-400 font-medium animate-in fade-in slide-in-from-top-1">{error}</span>}
    </div>
  );
};

export default FormField;