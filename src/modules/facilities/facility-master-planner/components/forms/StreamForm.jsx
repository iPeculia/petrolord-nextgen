import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ArrowRight, AlertCircle, Droplets } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFacilityMasterPlanner } from '../../context/FacilityMasterPlannerContext';
import FormField from '../shared/FormField';

const StreamForm = ({ onClose }) => {
  const { currentFacility, processUnits, addStream } = useFacilityMasterPlanner();
  const [errors, setErrors] = useState({});
  
  // Filter units for current facility
  const facilityUnits = processUnits.filter(u => u.facility_id === currentFacility?.facility_id);

  const [formData, setFormData] = useState({
    stream_id: uuidv4(),
    facility_id: currentFacility?.facility_id || '',
    source_unit_id: '',
    target_unit_id: '',
    stream_name: '',
    fluid_type: 'Oil',
    design_flow_rate: 0,
    design_flow_unit: 'bpd',
    design_pressure_psi: 0,
    design_temperature_f: 60,
    created_date: new Date().toISOString()
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.stream_name) newErrors.stream_name = "Name required";
    if (!formData.source_unit_id) newErrors.source_unit_id = "Source unit required";
    if (!formData.target_unit_id) newErrors.target_unit_id = "Target unit required";
    if (formData.source_unit_id === formData.target_unit_id) newErrors.target_unit_id = "Source and Target cannot be same";
    if (formData.design_flow_rate <= 0) newErrors.design_flow_rate = "Must be > 0";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    addStream(formData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-[#1a1a1a] rounded-lg border border-slate-800">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-800">
        <h2 className="text-xl font-bold text-white flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 rounded-lg">
            <Droplets className="w-5 h-5 text-cyan-500" />
          </div>
          Add Process Stream
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-6 items-center bg-slate-900/50 p-4 rounded-lg border border-slate-800">
         <FormField label="Source Unit" required error={errors.source_unit_id}>
             <Select value={formData.source_unit_id} onValueChange={(val) => handleChange('source_unit_id', val)}>
                <SelectTrigger className="bg-slate-900 border-slate-700 text-white"><SelectValue placeholder="Select Source" /></SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700 text-white">
                    {facilityUnits.map(u => <SelectItem key={u.unit_id} value={u.unit_id}>{u.name}</SelectItem>)}
                </SelectContent>
            </Select>
        </FormField>

        <div className="flex flex-col items-center justify-center pt-6">
             <ArrowRight className="w-6 h-6 text-slate-500" />
        </div>

        <FormField label="Target Unit" required error={errors.target_unit_id}>
             <Select value={formData.target_unit_id} onValueChange={(val) => handleChange('target_unit_id', val)}>
                <SelectTrigger className="bg-slate-900 border-slate-700 text-white"><SelectValue placeholder="Select Target" /></SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700 text-white">
                    {facilityUnits.map(u => <SelectItem key={u.unit_id} value={u.unit_id}>{u.name}</SelectItem>)}
                </SelectContent>
            </Select>
        </FormField>
      </div>

      <FormField label="Stream Name" required error={errors.stream_name} tooltip="Descriptive name (e.g., HP Gas Export)">
        <Input value={formData.stream_name} onChange={e => handleChange('stream_name', e.target.value)} className="bg-slate-900 border-slate-700 text-white" placeholder="e.g. Separator A Oil Outlet"/>
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Fluid Type" required>
             <Select value={formData.fluid_type} onValueChange={(val) => handleChange('fluid_type', val)}>
                <SelectTrigger className="bg-slate-900 border-slate-700 text-white"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700 text-white">
                    {['Oil', 'Gas', 'Water', 'Condensate', 'Multiphase'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
            </Select>
        </FormField>

         <FormField label={`Flow Rate (${formData.design_flow_unit})`} required error={errors.design_flow_rate}>
            <div className="flex gap-2">
                 <Input type="number" className="flex-1 bg-slate-900 border-slate-700 text-white" value={formData.design_flow_rate} onChange={e => handleChange('design_flow_rate', parseFloat(e.target.value) || 0)} />
                 <Select value={formData.design_flow_unit} onValueChange={v => handleChange('design_flow_unit', v)}>
                    <SelectTrigger className="w-[80px] bg-slate-900 border-slate-700 text-white"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700 text-white">
                        <SelectItem value="bpd">bpd</SelectItem>
                        <SelectItem value="mmscfd">mmscfd</SelectItem>
                    </SelectContent>
                 </Select>
            </div>
        </FormField>

        <FormField label="Pressure (psi)">
             <Input type="number" className="bg-slate-900 border-slate-700 text-white" value={formData.design_pressure_psi} onChange={e => handleChange('design_pressure_psi', parseFloat(e.target.value) || 0)} />
        </FormField>
        
        <FormField label="Temperature (°F)">
             <Input type="number" className="bg-slate-900 border-slate-700 text-white" value={formData.design_temperature_f} onChange={e => handleChange('design_temperature_f', parseFloat(e.target.value) || 0)} />
        </FormField>
      </div>

      {Object.keys(errors).length > 0 && <div className="text-red-400 text-sm">Please correct validation errors.</div>}

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
        <Button type="button" onClick={onClose} variant="ghost" className="text-slate-400 hover:text-white">Cancel</Button>
        <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700 text-white min-w-[120px]">Create Stream</Button>
      </div>
    </form>
  );
};

export default StreamForm;