import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Cog, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFacilityMasterPlanner } from '../../context/FacilityMasterPlannerContext';
import FormField from '../shared/FormField';

const EquipmentForm = ({ onClose, editEquipment = null }) => {
  const { currentUnit, addEquipment, updateEquipment } = useFacilityMasterPlanner();
  
  const [formData, setFormData] = useState(editEquipment || {
    equipment_id: uuidv4(),
    unit_id: currentUnit?.unit_id || '',
    tag_number: '',
    equipment_type: 'Vessel',
    design_capacity: 0,
    design_capacity_unit: 'bpd',
    current_capacity: 0,
    manufacturer: '',
    model: '',
    status: 'Operational',
    condition: 'Good',
    installation_date: new Date().toISOString().split('T')[0],
    created_date: new Date().toISOString()
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.tag_number) newErrors.tag_number = "Tag number required";
    if (formData.design_capacity <= 0) newErrors.design_capacity = "Capacity must be > 0";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (editEquipment) {
      updateEquipment(formData.equipment_id, formData);
    } else {
      addEquipment(formData);
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-[#1a1a1a]">
      <h2 className="text-xl font-bold text-white flex items-center gap-2">
        <Cog className="w-5 h-5 text-orange-500" />
        {editEquipment ? 'Edit Equipment' : 'Add New Equipment'}
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Tag Number" required error={errors.tag_number}>
          <Input 
            value={formData.tag_number} 
            onChange={e => setFormData({...formData, tag_number: e.target.value})}
            className="bg-slate-900 border-slate-700 text-white"
            placeholder="e.g. V-1001"
          />
        </FormField>

        <FormField label="Type" required>
          <Select value={formData.equipment_type} onValueChange={v => setFormData({...formData, equipment_type: v})}>
            <SelectTrigger className="bg-slate-900 border-slate-700 text-white"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-700 text-white">
              {['Vessel', 'Pump', 'Compressor', 'Heater', 'Cooler', 'Motor', 'Turbine'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Design Capacity" required error={errors.design_capacity}>
          <div className="flex gap-2">
            <Input type="number" value={formData.design_capacity} onChange={e => setFormData({...formData, design_capacity: parseFloat(e.target.value)})} className="bg-slate-900 border-slate-700 text-white" />
            <Select value={formData.design_capacity_unit} onValueChange={v => setFormData({...formData, design_capacity_unit: v})}>
                <SelectTrigger className="w-[100px] bg-slate-900 border-slate-700 text-white"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700 text-white">
                    {['bpd', 'mmscfd', 'hp', 'mw', 'm3/h'].map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                </SelectContent>
            </Select>
          </div>
        </FormField>

        <FormField label="Current Load">
           <Input type="number" value={formData.current_capacity} onChange={e => setFormData({...formData, current_capacity: parseFloat(e.target.value)})} className="bg-slate-900 border-slate-700 text-white" />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Manufacturer">
          <Input value={formData.manufacturer} onChange={e => setFormData({...formData, manufacturer: e.target.value})} className="bg-slate-900 border-slate-700 text-white" />
        </FormField>
        <FormField label="Model">
          <Input value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} className="bg-slate-900 border-slate-700 text-white" />
        </FormField>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
        <Button type="button" onClick={onClose} variant="ghost" className="text-slate-400">Cancel</Button>
        <Button type="submit" className="bg-blue-600 text-white">Save Equipment</Button>
      </div>
    </form>
  );
};

export default EquipmentForm;