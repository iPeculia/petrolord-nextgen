import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Plus, Trash2, Building2, Layers } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const ModuleAssignmentAdmin = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Data State
  const [departments, setDepartments] = useState([]);
  const [modules, setModules] = useState([]);
  const [mappings, setMappings] = useState([]);

  // Form State
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedModule, setSelectedModule] = useState('');
  const [isPrimary, setIsPrimary] = useState(true);
  const [isOptional, setIsOptional] = useState(false);

  // Fetch initial data
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Parallel fetching
      const [deptRes, modRes, mapRes] = await Promise.all([
        supabase.from('university_departments').select('*').order('name'),
        supabase.from('modules').select('*').order('name'),
        supabase.from('department_module_mapping').select(`
            id,
            department_id,
            module_id,
            is_primary,
            is_optional,
            department:university_departments(name),
            module:modules(name)
        `).order('department_id')
      ]);

      if (deptRes.error) throw deptRes.error;
      if (modRes.error) throw modRes.error;
      if (mapRes.error) throw mapRes.error;

      setDepartments(deptRes.data);
      setModules(modRes.data);
      setMappings(mapRes.data);

    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error Loading Data",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddMapping = async () => {
    if (!selectedDept || !selectedModule) {
      toast({
        title: "Validation Error",
        description: "Please select both a department and a module.",
        variant: "destructive"
      });
      return;
    }

    if (!isPrimary && !isOptional) {
        toast({
            title: "Validation Error",
            description: "A mapping must be either Primary or Optional (or both).",
            variant: "destructive"
        });
        return;
    }

    try {
      setSubmitting(true);
      
      const { data, error } = await supabase
        .from('department_module_mapping')
        .insert({
          department_id: selectedDept,
          module_id: selectedModule,
          is_primary: isPrimary,
          is_optional: isOptional
        })
        .select()
        .single();

      if (error) {
         if (error.code === '23505') { // Unique violation
             toast({
                 title: "Duplicate Mapping",
                 description: "This department is already mapped to this module.",
                 variant: "destructive"
             });
             return;
         }
         throw error;
      }

      toast({
        title: "Mapping Added",
        description: "Successfully linked module to department.",
      });

      // Reset form (keep department for quick entry)
      setSelectedModule('');
      setIsPrimary(true);
      setIsOptional(false);
      
      // Refresh list
      fetchData();

    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase
        .from('department_module_mapping')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMappings(prev => prev.filter(m => m.id !== id));
      toast({
        title: "Mapping Removed",
        description: "The link has been deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete mapping.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-blue-500" /></div>;
  }

  return (
    <div className="space-y-8 py-8 animate-in fade-in duration-500">
      
      {/* Creation Card */}
      <Card className="border-0 shadow-lg bg-white dark:bg-slate-900 rounded-xl overflow-hidden">
        <CardHeader className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 pb-4">
          <CardTitle className="text-xl flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-500" />
            New Module Assignment
          </CardTitle>
          <CardDescription>Link platform modules to university departments to control student access.</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
            
            <div className="md:col-span-4 space-y-2">
              <Label className="text-xs font-semibold uppercase text-slate-500">Department</Label>
              <Select value={selectedDept} onValueChange={setSelectedDept}>
                <SelectTrigger className="bg-white dark:bg-slate-950">
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map(d => (
                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-4 space-y-2">
              <Label className="text-xs font-semibold uppercase text-slate-500">Module</Label>
              <Select value={selectedModule} onValueChange={setSelectedModule}>
                <SelectTrigger className="bg-white dark:bg-slate-950">
                  <SelectValue placeholder="Select Module" />
                </SelectTrigger>
                <SelectContent>
                  {modules.map(m => (
                    <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2 flex flex-col gap-3 pb-2">
                <div className="flex items-center gap-2">
                    <Checkbox id="primary" checked={isPrimary} onCheckedChange={setIsPrimary} />
                    <Label htmlFor="primary" className="cursor-pointer text-sm font-medium">Primary (Required)</Label>
                </div>
                <div className="flex items-center gap-2">
                    <Checkbox id="optional" checked={isOptional} onCheckedChange={setIsOptional} />
                    <Label htmlFor="optional" className="cursor-pointer text-sm font-medium">Optional</Label>
                </div>
            </div>

            <div className="md:col-span-2">
              <Button onClick={handleAddMapping} disabled={submitting} className="w-full bg-blue-600 hover:bg-blue-700">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                Add Mapping
              </Button>
            </div>

          </div>
        </CardContent>
      </Card>

      {/* List Card */}
      <Card className="border-0 shadow-lg bg-white dark:bg-slate-900 rounded-xl overflow-hidden">
        <CardHeader className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
          <CardTitle className="text-lg">Existing Mappings</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-[600px] overflow-auto">
            <Table>
                <TableHeader className="bg-slate-50 dark:bg-slate-950 sticky top-0">
                <TableRow>
                    <TableHead className="w-[35%]">Department</TableHead>
                    <TableHead className="w-[35%]">Module</TableHead>
                    <TableHead className="w-[20%]">Type</TableHead>
                    <TableHead className="w-[10%] text-right">Actions</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {mappings.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center text-slate-500">
                            No mappings configured yet.
                        </TableCell>
                    </TableRow>
                ) : (
                    mappings.map(map => (
                        <TableRow key={map.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                            <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-slate-400" />
                                    {map.department?.name || 'Unknown'}
                                </div>
                            </TableCell>
                            <TableCell>{map.module?.name || 'Unknown'}</TableCell>
                            <TableCell>
                                <div className="flex gap-2">
                                    {map.is_primary && <Badge className="bg-emerald-500/10 text-emerald-600 border-0 hover:bg-emerald-500/20">Primary</Badge>}
                                    {map.is_optional && <Badge variant="outline" className="text-slate-500">Optional</Badge>}
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => handleDelete(map.id)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))
                )}
                </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModuleAssignmentAdmin;