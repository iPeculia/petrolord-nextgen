import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { GraduationCap, BookOpen } from 'lucide-react';

const UserTypeSelector = ({ value, onChange, error }) => {
  return (
    <div className="space-y-3">
      <Label className="text-slate-300">User Role <span className="text-red-400">*</span></Label>
      <RadioGroup value={value} onValueChange={onChange} className="grid grid-cols-2 gap-4">
        <div>
          <RadioGroupItem value="student" id="student" className="peer sr-only" />
          <Label
            htmlFor="student"
            className="flex flex-col items-center justify-between rounded-md border-2 border-slate-700 bg-[#0F172A] p-4 hover:bg-slate-800 hover:text-white peer-data-[state=checked]:border-[#BFFF00] peer-data-[state=checked]:bg-[#BFFF00]/10 peer-data-[state=checked]:text-[#BFFF00] cursor-pointer transition-all"
          >
            <GraduationCap className="mb-3 h-6 w-6" />
            Student
          </Label>
        </div>
        <div>
          <RadioGroupItem value="lecturer" id="lecturer" className="peer sr-only" />
          <Label
            htmlFor="lecturer"
            className="flex flex-col items-center justify-between rounded-md border-2 border-slate-700 bg-[#0F172A] p-4 hover:bg-slate-800 hover:text-white peer-data-[state=checked]:border-[#BFFF00] peer-data-[state=checked]:bg-[#BFFF00]/10 peer-data-[state=checked]:text-[#BFFF00] cursor-pointer transition-all"
          >
            <BookOpen className="mb-3 h-6 w-6" />
            Lecturer
          </Label>
        </div>
      </RadioGroup>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default UserTypeSelector;