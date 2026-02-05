import React from 'react';
import { useFormContext } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Building2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

const UniversityInfoStep = () => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="bg-[#1E293B] border-slate-700 shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4 border-b border-slate-700 flex items-center gap-3">
          <Building2 className="w-5 h-5 text-[#BFFF00]" />
          <h2 className="text-lg font-bold text-white">University Information</h2>
        </div>
        <CardContent className="p-6 grid gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <Label htmlFor="university_name" className="text-slate-300">University Name</Label>
            <Input 
              id="university_name" 
              className="mt-2 bg-slate-950 border-slate-700 text-white focus:ring-[#BFFF00]"
              placeholder="University of Technology"
              {...register("university_name", { required: "University Name is required" })}
            />
            {errors.university_name && <span className="text-red-400 text-sm mt-1">{errors.university_name.message}</span>}
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="address" className="text-slate-300">Official Address</Label>
            <Input 
              id="address" 
              className="mt-2 bg-slate-950 border-slate-700 text-white focus:ring-[#BFFF00]"
              placeholder="123 Education Ave, City, Country"
              {...register("address", { required: "Address is required" })}
            />
            {errors.address && <span className="text-red-400 text-sm mt-1">{errors.address.message}</span>}
          </div>

          <div>
            <Label htmlFor="phone" className="text-slate-300">Contact Phone</Label>
            <Input 
              id="phone" 
              className="mt-2 bg-slate-950 border-slate-700 text-white focus:ring-[#BFFF00]"
              placeholder="+1 (555) 000-0000"
              {...register("phone", { required: "Phone number is required" })}
            />
            {errors.phone && <span className="text-red-400 text-sm mt-1">{errors.phone.message}</span>}
          </div>

          <div>
            <Label htmlFor="website" className="text-slate-300">Website (Optional)</Label>
            <Input 
              id="website" 
              className="mt-2 bg-slate-950 border-slate-700 text-white focus:ring-[#BFFF00]"
              placeholder="https://www.university.edu"
              {...register("website")}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default UniversityInfoStep;