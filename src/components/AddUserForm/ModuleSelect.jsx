import React, { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { UserManagementService } from '@/services/userManagementService';
import { Loader2 } from 'lucide-react';

const ModuleSelect = ({ value, onChange, error }) => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModules = async () => {
      setLoading(true);
      const data = await UserManagementService.getModules();
      setModules(data);
      setLoading(false);
    };
    fetchModules();
  }, []);

  return (
    <div className="space-y-2">
      <Label htmlFor="module" className="text-slate-300">Assigned Module <span className="text-red-400">*</span></Label>
      <Select value={value} onValueChange={onChange} disabled={loading}>
        <SelectTrigger id="module" className={`bg-[#0F172A] border-slate-700 text-white ${error ? 'border-red-500' : ''}`}>
          <SelectValue placeholder={loading ? "Loading modules..." : "Select Module"} />
        </SelectTrigger>
        <SelectContent className="bg-[#1E293B] border-slate-700 text-white">
          {loading ? (
             <div className="flex items-center justify-center p-2 text-slate-400">
               <Loader2 className="w-4 h-4 animate-spin mr-2" /> Loading...
             </div>
          ) : modules.length > 0 ? (
            modules.map((mod) => (
              <SelectItem key={mod.id} value={mod.id}>{mod.name}</SelectItem>
            ))
          ) : (
            <div className="p-2 text-sm text-slate-400">No modules found</div>
          )}
        </SelectContent>
      </Select>
      {error && <p className="text-xs text-red-500">{error}</p>}
      <p className="text-[10px] text-slate-500">Each student or lecturer must be assigned to exactly one primary module.</p>
    </div>
  );
};

export default ModuleSelect;