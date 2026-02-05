import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const TopEditingDialog = ({ isOpen, onClose, onSave, topData, wellId, stratUnits, editMode }) => {
  const [formData, setFormData] = useState(topData);

  useEffect(() => {
    setFormData(topData);
  }, [topData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
     setFormData(prev => ({ ...prev, [name]: value }));
  }

  const handleSave = () => {
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editMode === 'add' ? 'Add Top' : 'Edit Top'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="top_name" className="text-right">Name</Label>
            <Input id="top_name" name="top_name" value={formData?.top_name || ''} onChange={handleChange} className="col-span-3" />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="depth_md" className="text-right">Depth (MD)</Label>
            <Input id="depth_md" name="depth_md" type="number" value={formData?.depth_md || ''} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="strat_unit_id" className="text-right">Strat Unit</Label>
            <Select onValueChange={(value) => handleSelectChange('strat_unit_id', value)} defaultValue={formData?.strat_unit_id}>
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a unit" />
                </SelectTrigger>
                <SelectContent>
                    {stratUnits.map(unit => (
                        <SelectItem key={unit.id} value={unit.id}>{unit.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="pick_quality" className="text-right">Pick Quality</Label>
            <Select onValueChange={(value) => handleSelectChange('pick_quality', value)} defaultValue={formData?.pick_quality}>
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select quality" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="interpreted">Interpreted</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">Cancel</Button>
          </DialogClose>
          <Button type="button" onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TopEditingDialog;