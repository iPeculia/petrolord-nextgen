import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Cog, AlertCircle, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFacilityMasterPlanner } from '../../context/FacilityMasterPlannerContext';
import FormField from '../shared/FormField';

const EquipmentForm = ({ onClose, editEquipment = null }) => {
  const { currentUnit, addEquipment, updateEquipment } = useFacilityMasterPlanner();
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState(editEquipment || {
    equipment_id: uuidv4(),
    unit_id: currentUnit?.unit_id || '',
    tag_number: '',
    equipment_type: 'Vessel',
    manufacturer: '',
    model: '',
    design_capacity: 0,
    design_capacity_unit: 'bpd',
    current_capacity: 0,
    bottleneck_capacity: 0,
    installation_date: new Date().toISOString().split('T')[0],
    status: 'Operational',
    condition: 'Good',
    maintenance_interval_months: 12,
    created_date: new Date().toISOString()
  });

  const loadDemoData = () => {
    setFormData({
      ...formData,
      tag_number: `EQ-${Math.floor(Math.random() * 1000)}`,
      equipment_type: "Compressor",
      manufacturer: "Solar Turbines",
      model: "Titan 130",
      design_capacity: 100,
      design_capacity_unit: "mmscfd",
      current_capacity: 85,
      bottleneck_capacity: 95,
      installation_date: "2020-01-15",
      status: "Operational",
      condition: "Good",
      maintenance_interval_months: 6
    });
    setErrors({});
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.tag_number || formData.tag_number.length < 3) newErrors.tag_number = "Tag Number is required";
    if (!formData.manufacturer) newErrors.manufacturer = "Manufacturer is required";
    if (!formData.model) newErrors.model = "Model is required";
    if (formData.design_capacity <= 0) newErrors.design_capacity = "Must be > 0";
    if (formData.current_capacity > formData.design_capacity) newErrors.current_capacity = "Cannot exceed design";
    
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
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-[#1a1a1a] rounded-lg border border-slate-800">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
        <h2 className="text-xl font-bold text-white flex items-center gap-3">
          <div className="p-2 bg-orange-500/10 rounded-lg">
            <Cog className="w-5 h-5 text-orange-500" />
          </div>
          {editEquipment ? 'Edit Equipment' : 'Add Equipment'}
        </h2>
        <Button type="button" onClick={loadDemoData} variant="ghost" size="sm" className="text-slate-400 hover:text-white">
          Load Demo
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Tag Number" required error={errors.tag_number} tooltip="Unique Equipment Tag (e.g. V-101)">
            <Input value={formData.tag_number} onChange={e => handleChange('tag_number', e.target.value)} className="bg-slate-900 border-slate-700 text-white" />
        </FormField>
        
        <FormField label="Type" required>
             <Select value={formData.equipment_type} onValueChange={(val) => handleChange('equipment_type', val)}>
                <SelectTrigger className="bg-slate-900 border-slate-700 text-white"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700 text-white">
                    {['Vessel', 'Pump', 'Compressor', 'Heater', 'Cooler', 'Motor', 'Turbine'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
            </Select>
        </FormField>

        <FormField label="Manufacturer" required error={errors.manufacturer}>
             <Input value={formData.manufacturer} onChange={e => handleChange('manufacturer', e.target.value)} className="bg-slate-900 border-slate-700 text-white" />
        </FormField>

        <FormField label="Model" required error={errors.model}>
             <Input value={formData.model} onChange={e => handleChange('model', e.target.value)} className="bg-slate-900 border-slate-700 text-white" />
        </FormField>
      </div>

      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Performance Metrics</h3>
            <Select value={formData.design_capacity_unit} onValueChange={(val) => handleChange('design_capacity_unit', val)}>
                <SelectTrigger className="w-[100px] h-8 bg-slate-900 border-slate-700 text-white text-xs"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700 text-white">
                    {['bpd', 'mmscfd', 'hp', 'mw'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
            </Select>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
             <FormField label="Design Cap." required error={errors.design_capacity}>
                <Input type="number" value={formData.design_capacity} onChange={(e) => handleChange('design_capacity', parseFloat(e.target.value) || 0)} className="bg-slate-900 border-slate-700 text-white" />
            </FormField>
            <FormField label="Current Cap." required error={errors.current_capacity}>
                <Input type="number" value={formData.current_capacity} onChange={(e) => handleChange('current_capacity', parseFloat(e.target.value) || 0)} className="bg-slate-900 border-slate-700 text-white" />
            </FormField>
            <FormField label="Bottleneck" required>
                <Input type="number" value={formData.bottleneck_capacity} onChange={(e) => handleChange('bottleneck_capacity', parseFloat(e.target.value) || 0)} className="bg-slate-900 border-slate-700 text-white" />
            </FormField>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
         <FormField label="Status" required>
             <Select value={formData.status} onValueChange={(val) => handleChange('status', val)}>
                <SelectTrigger className="bg-slate-900 border-slate-700 text-white"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700 text-white">
                    <SelectItem value="Operational">Operational</SelectItem>
                    <SelectItem value="Planned">Planned</SelectItem>
                    <SelectItem value="Decommissioned">Decommissioned</SelectItem>
                    <SelectItem value="Retired">Retired</SelectItem>
                </SelectContent>
            </Select>
        </FormField>
         <FormField label="Condition" required>
             <Select value={formData.condition} onValueChange={(val) => handleChange('condition', val)}>
                <SelectTrigger className="bg-slate-900 border-slate-700 text-white"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700 text-white">
                    {['Excellent', 'Good', 'Fair', 'Poor'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
            </Select>
        </FormField>

        <FormField label="Installation Date" required icon={<Calendar className="w-3 h-3 text-slate-500"/>}>
             <Input type="date" value={formData.installation_date} onChange={e => handleChange('installation_date', e.target.value)} className="bg-slate-900 border-slate-700 text-white" />
        </FormField>

        <FormField label="Maint. Interval (Months)" required>
             <Input type="number" value={formData.maintenance_interval_months} onChange={e => handleChange('maintenance_interval_months', parseInt(e.target.value) || 0)} className="bg-slate-900 border-slate-700 text-white" />
        </FormField>
      </div>

      {Object.keys(errors).length > 0 && (
        <div className="bg-red-500/10 border border-red-500/30 rounded p-3 text-red-400 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Fix validation errors to proceed.
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
        <Button type="button" onClick={onClose} variant="ghost" className="text-slate-400 hover:text-white">Cancel</Button>
        <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white min-w-[120px]">{editEquipment ? 'Update' : 'Add Equipment'}</Button>
      </div>
    </form>
  );
};

export default EquipmentForm;