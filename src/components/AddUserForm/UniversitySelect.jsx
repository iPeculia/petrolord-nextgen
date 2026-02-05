import React, { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { UserManagementService } from '@/services/userManagementService';
import { Loader2 } from 'lucide-react';

const UniversitySelect = ({ value, onChange, error }) => {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUnis = async () => {
      setLoading(true);
      const data = await UserManagementService.getUniversities();
      setUniversities(data);
      setLoading(false);
    };
    fetchUnis();
  }, []);

  return (
    <div className="space-y-2">
      <Label htmlFor="university" className="text-slate-300">University <span className="text-red-400">*</span></Label>
      <Select value={value} onValueChange={onChange} disabled={loading}>
        <SelectTrigger id="university" className={`bg-[#0F172A] border-slate-700 text-white ${error ? 'border-red-500' : ''}`}>
          <SelectValue placeholder={loading ? "Loading universities..." : "Select University"} />
        </SelectTrigger>
        <SelectContent className="bg-[#1E293B] border-slate-700 text-white">
          {loading ? (
             <div className="flex items-center justify-center p-2 text-slate-400">
               <Loader2 className="w-4 h-4 animate-spin mr-2" /> Loading...
             </div>
          ) : universities.length > 0 ? (
            universities.map((uni) => (
              <SelectItem key={uni.id} value={uni.id}>{uni.university_name}</SelectItem>
            ))
          ) : (
            <div className="p-2 text-sm text-slate-400">No universities found</div>
          )}
        </SelectContent>
      </Select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default UniversitySelect;