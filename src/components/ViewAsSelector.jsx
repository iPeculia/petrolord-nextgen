import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Eye, ShieldAlert } from 'lucide-react';
import { useRole, ROLES, ROLE_LABELS } from '@/contexts/RoleContext';

const ViewAsSelector = () => {
  const { viewRole, changeViewRole, canImpersonate, actualRole } = useRole();

  if (!canImpersonate) return null;

  const isImpersonating = viewRole !== actualRole;

  return (
    <div className="flex items-center gap-2 bg-slate-900/50 p-2 rounded-lg border border-slate-800">
      <div className="flex items-center gap-2 text-xs font-medium text-slate-400 uppercase tracking-wider pl-2">
        {isImpersonating ? <Eye className="w-3 h-3 text-[#BFFF00]" /> : <ShieldAlert className="w-3 h-3" />}
        <span>View As:</span>
      </div>
      <Select value={viewRole} onValueChange={changeViewRole}>
        <SelectTrigger className="w-[180px] h-8 bg-slate-950 border-slate-700 text-slate-200 text-xs focus:ring-[#BFFF00]/20">
          <SelectValue placeholder="Select Role" />
        </SelectTrigger>
        <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
          {Object.values(ROLES).map((role) => (
            <SelectItem 
              key={role} 
              value={role}
              className="text-xs hover:bg-slate-800 focus:bg-slate-800 cursor-pointer"
            >
              {ROLE_LABELS[role]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {isImpersonating && (
        <Badge variant="outline" className="text-[10px] h-5 border-[#BFFF00] text-[#BFFF00] bg-[#BFFF00]/10 ml-1">
          Preview Mode
        </Badge>
      )}
    </div>
  );
};

export default ViewAsSelector;