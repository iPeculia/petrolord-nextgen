import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, User, Mail, GraduationCap } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useRole } from '@/contexts/RoleContext';
import { UserManagementService } from '@/services/userManagementService';
import UniversitySelect from './UniversitySelect';
import ModuleSelect from './ModuleSelect';

const SingleUserForm = () => {
  const { isViewAsSuperAdmin } = useRole();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    userType: 'student',
    universityId: '',
    moduleId: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
     setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.email || !formData.firstName || !formData.lastName || !formData.moduleId) {
        toast({ title: "Missing Fields", description: "Please fill in all required fields, including the module.", variant: "destructive" });
        setLoading(false);
        return;
    }
    
    if (isViewAsSuperAdmin && !formData.universityId) {
         toast({ title: "University Required", description: "Please select a university.", variant: "destructive" });
         setLoading(false);
         return;
    }

    try {
      await UserManagementService.createSingleUser(formData);
      toast({
        title: "User Created",
        description: `Successfully added ${formData.firstName} ${formData.lastName}.`,
        className: "bg-emerald-600 text-white border-none"
      });
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        userType: 'student',
        universityId: isViewAsSuperAdmin ? '' : formData.universityId,
        moduleId: ''
      });
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create user. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
      <form onSubmit={handleSubmit} className="space-y-6 bg-[#1E293B]/30 p-6 rounded-xl border border-slate-800 max-w-2xl mx-auto">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label htmlFor="firstName" className="text-slate-300">First Name <span className="text-red-400">*</span></Label>
                <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <Input 
                        id="firstName" 
                        name="firstName" 
                        placeholder="John" 
                        value={formData.firstName} 
                        onChange={handleChange}
                        className="pl-9 bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 focus:border-[#BFFF00] focus:ring-[#BFFF00]/20"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="lastName" className="text-slate-300">Last Name <span className="text-red-400">*</span></Label>
                <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <Input 
                        id="lastName" 
                        name="lastName" 
                        placeholder="Doe" 
                        value={formData.lastName} 
                        onChange={handleChange}
                        className="pl-9 bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 focus:border-[#BFFF00] focus:ring-[#BFFF00]/20"
                    />
                </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-300">Email Address <span className="text-red-400">*</span></Label>
            <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <Input 
                    id="email" 
                    name="email" 
                    type="email"
                    placeholder="john.doe@university.edu" 
                    value={formData.email} 
                    onChange={handleChange}
                    className="pl-9 bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 focus:border-[#BFFF00] focus:ring-[#BFFF00]/20"
                />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
                <Label htmlFor="userType" className="text-slate-300">Role <span className="text-red-400">*</span></Label>
                <Select 
                    value={formData.userType} 
                    onValueChange={(val) => handleSelectChange('userType', val)}
                >
                    <SelectTrigger className="bg-slate-950 border-slate-800 text-white">
                        <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800 text-white">
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="lecturer">Lecturer</SelectItem>
                    </SelectContent>
                </Select>
             </div>

             <div className="space-y-2">
                 <ModuleSelect 
                     value={formData.moduleId}
                     onChange={(val) => handleSelectChange('moduleId', val)}
                     error={!formData.moduleId ? "Module is required" : null}
                 />
             </div>
          </div>

          {isViewAsSuperAdmin && (
             <div className="space-y-2">
                 <Label className="text-slate-300">University <span className="text-red-400">*</span></Label>
                 <UniversitySelect 
                     value={formData.universityId} 
                     onChange={(val) => handleSelectChange('universityId', val)}
                     error={!formData.universityId ? "University is required" : null}
                 />
                 <div className="flex items-start gap-2 mt-2 text-xs text-amber-500/80 bg-amber-500/10 p-2 rounded">
                    <GraduationCap className="w-4 h-4 mt-0.5" />
                    <span>As Super Admin, you must specify which university this user belongs to.</span>
                 </div>
             </div>
          )}

          <div className="pt-4 flex justify-end">
             <Button 
                type="submit" 
                disabled={loading}
                className="bg-[#BFFF00] text-black hover:bg-[#a3d900] font-bold px-8 min-w-[150px]"
             >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create User"}
             </Button>
          </div>
      </form>
  )
}

export default SingleUserForm;