import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Plus, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

const DepartmentsStep = ({ departments, setDepartments }) => {
  const [deptInput, setDeptInput] = useState('');
  const { toast } = useToast();

  const addDepartment = () => {
    if (deptInput.trim()) {
      if (!departments.includes(deptInput.trim())) {
        setDepartments([...departments, deptInput.trim()]);
        setDeptInput('');
      } else {
        toast({
          title: "Duplicate Department",
          description: "This department has already been added.",
          variant: "destructive"
        });
      }
    }
  };

  const removeDepartment = (dept) => {
    setDepartments(departments.filter(d => d !== dept));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="bg-[#1E293B] border-slate-700 shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4 border-b border-slate-700 flex items-center gap-3">
          <GraduationCap className="w-5 h-5 text-[#BFFF00]" />
          <h2 className="text-lg font-bold text-white">Departments</h2>
        </div>
        <CardContent className="p-6">
          <Label className="text-slate-300 mb-2 block">Add Participating Departments</Label>
          <p className="text-slate-500 text-sm mb-4">Enter the names of the departments that will be using the software (e.g., Petroleum Engineering, Geology).</p>
          
          <div className="flex gap-2 mb-4">
            <Input 
              value={deptInput}
              onChange={(e) => setDeptInput(e.target.value)}
              className="bg-slate-950 border-slate-700 text-white focus:ring-[#BFFF00]"
              placeholder="Type department name..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addDepartment();
                }
              }}
            />
            <Button 
              type="button" 
              onClick={addDepartment}
              className="bg-slate-700 hover:bg-slate-600 text-white"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>

          {/* Department Tags */}
          <div className="flex flex-wrap gap-2 min-h-[50px] p-4 rounded-lg bg-slate-950/50 border border-slate-800 border-dashed">
            {departments.length === 0 && (
              <span className="text-slate-600 text-sm italic py-1">No departments added yet.</span>
            )}
            {departments.map((dept, idx) => (
              <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#BFFF00]/10 text-[#BFFF00] text-sm border border-[#BFFF00]/20">
                {dept}
                <button 
                  type="button" 
                  onClick={() => removeDepartment(dept)}
                  className="hover:text-white transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DepartmentsStep;