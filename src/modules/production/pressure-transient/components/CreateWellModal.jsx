import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usePressureTransient } from '@/context/PressureTransientContext';
import { useToast } from '@/components/ui/use-toast';

const CreateWellModal = ({ isOpen, onClose }) => {
  const { addWell } = usePressureTransient();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    type: 'Vertical',
    depth_tvd: '',
    depth_md: '',
    wellbore_radius: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.depth_tvd) {
      toast({ title: "Validation Error", description: "Name and TVD are required", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      await addWell({
        ...formData,
        depth_tvd: parseFloat(formData.depth_tvd),
        depth_md: parseFloat(formData.depth_md || formData.depth_tvd),
        wellbore_radius: parseFloat(formData.wellbore_radius || 0.354)
      });
      onClose();
      // Reset form
      setFormData({
        name: '',
        location: '',
        type: 'Vertical',
        depth_tvd: '',
        depth_md: '',
        wellbore_radius: ''
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-800 text-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Well</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Well Name *</Label>
            <Input 
              id="name" 
              name="name" 
              value={formData.name} 
              onChange={handleChange}
              placeholder="e.g. Well A-01" 
              className="bg-slate-950 border-slate-700"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>
            <Input 
              id="location" 
              name="location" 
              value={formData.location} 
              onChange={handleChange}
              placeholder="Field / Block" 
              className="bg-slate-950 border-slate-700"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="depth_tvd">TVD (ft) *</Label>
              <Input 
                id="depth_tvd" 
                name="depth_tvd" 
                type="number"
                value={formData.depth_tvd} 
                onChange={handleChange}
                className="bg-slate-950 border-slate-700"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="depth_md">MD (ft)</Label>
              <Input 
                id="depth_md" 
                name="depth_md" 
                type="number"
                value={formData.depth_md} 
                onChange={handleChange}
                className="bg-slate-950 border-slate-700"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="type">Well Type</Label>
            <select 
              id="type" 
              name="type" 
              value={formData.type} 
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              <option value="Vertical">Vertical</option>
              <option value="Deviated">Deviated</option>
              <option value="Horizontal">Horizontal</option>
            </select>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="ghost" onClick={onClose} className="text-slate-400 hover:text-white">Cancel</Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? 'Creating...' : 'Create Well'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateWellModal;