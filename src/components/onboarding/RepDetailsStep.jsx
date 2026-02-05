import React from 'react';
import { useFormContext } from 'react-hook-form';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

const RepDetailsStep = () => {
  const { register, formState: { errors } } = useFormContext();

  // Common free email providers to block
  const BLOCKED_DOMAINS = [
    'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 
    'icloud.com', 'protonmail.com', 'live.com', 'msn.com', 'mail.com'
  ];

  const validateEmail = (email) => {
    if (!email) return true;
    const domain = email.split('@')[1];
    if (domain && BLOCKED_DOMAINS.includes(domain.toLowerCase())) {
      return "Please use an official university email address (no gmail, yahoo, etc.)";
    }
    return true;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card className="bg-[#1E293B] border-slate-700 shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4 border-b border-slate-700 flex items-center gap-3">
          <User className="w-5 h-5 text-[#BFFF00]" />
          <h2 className="text-lg font-bold text-white">Representative Details</h2>
        </div>
        <CardContent className="p-6 grid gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <Label htmlFor="rep_name" className="text-slate-300">Full Name</Label>
            <Input 
              id="rep_name" 
              className="mt-2 bg-slate-950 border-slate-700 text-white focus:ring-[#BFFF00]"
              placeholder="Dr. Jane Doe"
              {...register("rep_name", { required: "Full Name is required" })}
            />
            {errors.rep_name && <span className="text-red-400 text-sm mt-1">{errors.rep_name.message}</span>}
          </div>
          
          <div>
            <Label htmlFor="rep_position" className="text-slate-300">Position / Title</Label>
            <Input 
              id="rep_position" 
              className="mt-2 bg-slate-950 border-slate-700 text-white focus:ring-[#BFFF00]"
              placeholder="e.g. Head of Department, Dean"
              {...register("rep_position", { required: "Position is required" })}
            />
            {errors.rep_position && <span className="text-red-400 text-sm mt-1">{errors.rep_position.message}</span>}
          </div>

          <div>
            <Label htmlFor="rep_email" className="text-slate-300">Institutional Email</Label>
            <Input 
              id="rep_email" 
              type="email"
              className="mt-2 bg-slate-950 border-slate-700 text-white focus:ring-[#BFFF00]"
              placeholder="jane.doe@university.edu"
              {...register("rep_email", { 
                required: "Email is required",
                validate: validateEmail
              })}
            />
            {errors.rep_email && <span className="text-red-400 text-sm mt-1">{errors.rep_email.message}</span>}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RepDetailsStep;