import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import useProjectStore from '@/store/projectStore';
import { Loader2, FolderPlus } from 'lucide-react';

const ProjectCreationModal = ({ open, onOpenChange }) => {
  const createProject = useProjectStore(state => state.createProject);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    client_name: '',
    location: '',
    type: 'analysis',
    is_public: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) return;

    setIsLoading(true);
    try {
      await createProject(formData);
      setFormData({ 
          name: '', 
          description: '', 
          client_name: '', 
          location: '', 
          type: 'analysis', 
          is_public: false 
      });
      onOpenChange(false);
    } catch (error) {
      // Error handled in store
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-slate-950 border-slate-800 text-slate-100">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
              <FolderPlus className="w-5 h-5 text-[#BFFF00]" />
              Create New Project
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Initialize a new project workspace for your analysis.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2 col-span-2">
                <Label htmlFor="name" className="text-slate-200">Project Name *</Label>
                <Input
                id="name"
                placeholder="e.g. North Sea Exploration - Block 24"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-slate-900 border-slate-700 focus:border-[#BFFF00]"
                required
                />
            </div>
            
            <div className="grid gap-2">
                <Label htmlFor="client" className="text-slate-200">Client Name</Label>
                <Input
                id="client"
                placeholder="e.g. Shell, BP"
                value={formData.client_name}
                onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                className="bg-slate-900 border-slate-700"
                />
            </div>
            
             <div className="grid gap-2">
                <Label htmlFor="location" className="text-slate-200">Location/Field</Label>
                <Input
                id="location"
                placeholder="e.g. Gulf of Mexico"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="bg-slate-900 border-slate-700"
                />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="type" className="text-slate-200">Project Type</Label>
            <Select 
              value={formData.type} 
              onValueChange={(val) => setFormData({ ...formData, type: val })}
            >
                <SelectTrigger className="bg-slate-900 border-slate-700">
                    <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700 text-slate-200">
                    <SelectItem value="analysis">Petrophysical Analysis</SelectItem>
                    <SelectItem value="exploration">Exploration</SelectItem>
                    <SelectItem value="reservoir">Reservoir Modeling</SelectItem>
                    <SelectItem value="drilling">Drilling Campaign</SelectItem>
                </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description" className="text-slate-200">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of project goals..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-slate-900 border-slate-700 min-h-[80px]"
            />
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox 
                id="public" 
                checked={formData.is_public}
                onCheckedChange={(c) => setFormData({...formData, is_public: c})}
                className="border-slate-600 data-[state=checked]:bg-[#BFFF00] data-[state=checked]:text-slate-900"
            />
            <div className="grid gap-1.5 leading-none">
                <Label htmlFor="public" className="text-sm font-medium text-slate-200 cursor-pointer">
                    Make Public?
                </Label>
                <p className="text-xs text-slate-500">
                    Public projects are visible to all users in the organization.
                </p>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="text-slate-400 hover:text-white hover:bg-slate-800">Cancel</Button>
            <Button type="submit" className="bg-[#BFFF00] text-slate-900 hover:bg-[#a3d900] font-medium" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FolderPlus className="mr-2 h-4 w-4" />}
              Create Project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectCreationModal;