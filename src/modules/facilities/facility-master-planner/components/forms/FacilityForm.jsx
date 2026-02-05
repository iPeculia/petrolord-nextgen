import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Building2, AlertCircle, Calendar, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFacilityMasterPlanner } from '../../context/FacilityMasterPlannerContext';
import FormField from '../shared/FormField';

const FacilityForm = ({ onClose, editFacility = null }) => {
  const { currentProject, addFacility, updateFacility } = useFacilityMasterPlanner();
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState(editFacility || {
    facility_id: uuidv4(),
    project_id: currentProject?.project_id || '',
    name: '',
    facility_type: 'FPSO',
    location: '',
    design_capacity_oil_bpd: 0,
    design_capacity_gas_mmscfd: 0,
    design_capacity_water_bpd: 0,
    current_capacity_oil_bpd: 0,
    current_capacity_gas_mmscfd: 0,
    current_capacity_water_bpd: 0,
    installation_date: new Date().toISOString().split('T')[0],
    decommissioning_date: '',
    status: 'Operational',
    created_date: new Date().toISOString()
  });

  const loadDemoData = () => {
    setFormData({
      ...formData,
      name: "Central Processing Facility A",
      facility_type: "FPSO",
      location: "Offshore Platform Alpha",
      design_capacity_oil_bpd: 180000,
      design_capacity_gas_mmscfd: 250,
      design_capacity_water_bpd: 120000,
      current_capacity_oil_bpd: 145000,
      current_capacity_gas_mmscfd: 200,
      current_capacity_water_bpd: 60000,
      installation_date: "2019-03-15",
      status: "Operational"
    });
    setErrors({});
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name || formData.name.length < 3) newErrors.name = "Facility name must be at least 3 characters";
    if (!formData.location || formData.location.length < 3) newErrors.location = "Location is required";
    if (formData.design_capacity_oil_bpd <= 0) newErrors.design_capacity_oil_bpd = "Design oil capacity must be greater than 0";
    if (formData.current_capacity_oil_bpd > formData.design_capacity_oil_bpd) {
      newErrors.current_capacity_oil_bpd = "Current capacity cannot exceed design capacity";
    }
    if (formData.current_capacity_gas_mmscfd > formData.design_capacity_gas_mmscfd) {
      newErrors.current_capacity_gas_mmscfd = "Current gas capacity cannot exceed design capacity";
    }
    if (formData.current_capacity_water_bpd > formData.design_capacity_water_bpd) {
      newErrors.current_capacity_water_bpd = "Current water capacity cannot exceed design capacity";
    }
    if (formData.decommissioning_date && new Date(formData.decommissioning_date) < new Date(formData.installation_date)) {
      newErrors.decommissioning_date = "Decommissioning date must be after installation date";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    if (editFacility) {
      updateFacility(formData.facility_id, formData);
    } else {
      addFacility(formData);
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-[#1a1a1a] rounded-lg max-h-[80vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-6 sticky top-0 bg-[#1a1a1a] z-10 pb-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <Building2 className="w-6 h-6 text-[#00cc66]" />
          {editFacility ? 'Edit Facility' : 'Create New Facility'}
        </h2>
        <Button type="button" onClick={loadDemoData} variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-800">
          Load Demo Data
        </Button>
      </div>

      <FormField label="Facility Name" required error={errors.name} tooltip="Unique facility identifier">
        <Input
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="e.g., Central Processing Facility A"
          className={`bg-slate-900 border-slate-700 text-white ${errors.name ? 'border-red-500' : ''}`}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Facility Type" required tooltip="Classification of processing facility">
          <Select value={formData.facility_type} onValueChange={(val) => handleChange('facility_type', val)}>
            <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-700 text-white">
              <SelectItem value="CPF">Central Processing Facility</SelectItem>
              <SelectItem value="FPSO">FPSO</SelectItem>
              <SelectItem value="Refinery">Refinery</SelectItem>
              <SelectItem value="Processing Plant">Processing Plant</SelectItem>
            </SelectContent>
          </Select>
        </FormField>

        <FormField label="Location" required error={errors.location} tooltip="Physical or offshore location">
          <Input
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="e.g., Offshore Platform Alpha"
            className={`bg-slate-900 border-slate-700 text-white ${errors.location ? 'border-red-500' : ''}`}
          />
        </FormField>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
          <Activity className="w-5 h-5 text-[#0066cc]" />
          Design Capacities
        </h3>
        
        <div className="grid grid-cols-3 gap-4">
          <FormField label="Oil (bpd)" required error={errors.design_capacity_oil_bpd} tooltip="Design oil throughput capacity">
            <Input type="number" step="1" min="0" value={formData.design_capacity_oil_bpd}
              onChange={(e) => handleChange('design_capacity_oil_bpd', parseFloat(e.target.value) || 0)}
              className={`bg-slate-900 border-slate-700 text-white ${errors.design_capacity_oil_bpd ? 'border-red-500' : ''}`}
            />
          </FormField>

          <FormField label="Gas (mmscfd)" tooltip="Design gas processing capacity">
            <Input type="number" step="0.1" min="0" value={formData.design_capacity_gas_mmscfd}
              onChange={(e) => handleChange('design_capacity_gas_mmscfd', parseFloat(e.target.value) || 0)}
              className="bg-slate-900 border-slate-700 text-white"
            />
          </FormField>

          <FormField label="Water (bpd)" tooltip="Design water handling capacity">
            <Input type="number" step="1" min="0" value={formData.design_capacity_water_bpd}
              onChange={(e) => handleChange('design_capacity_water_bpd', parseFloat(e.target.value) || 0)}
              className="bg-slate-900 border-slate-700 text-white"
            />
          </FormField>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
          <Activity className="w-5 h-5 text-[#00cc66]" />
          Current Throughput
        </h3>
        
        <div className="grid grid-cols-3 gap-4">
          <FormField label="Oil (bpd)" error={errors.current_capacity_oil_bpd} tooltip="Current oil processing rate">
            <Input type="number" step="1" min="0" value={formData.current_capacity_oil_bpd}
              onChange={(e) => handleChange('current_capacity_oil_bpd', parseFloat(e.target.value) || 0)}
              className={`bg-slate-900 border-slate-700 text-white ${errors.current_capacity_oil_bpd ? 'border-red-500' : ''}`}
            />
          </FormField>

          <FormField label="Gas (mmscfd)" error={errors.current_capacity_gas_mmscfd} tooltip="Current gas processing rate">
            <Input type="number" step="0.1" min="0" value={formData.current_capacity_gas_mmscfd}
              onChange={(e) => handleChange('current_capacity_gas_mmscfd', parseFloat(e.target.value) || 0)}
              className={`bg-slate-900 border-slate-700 text-white ${errors.current_capacity_gas_mmscfd ? 'border-red-500' : ''}`}
            />
          </FormField>

          <FormField label="Water (bpd)" error={errors.current_capacity_water_bpd} tooltip="Current water handling rate">
            <Input type="number" step="1" min="0" value={formData.current_capacity_water_bpd}
              onChange={(e) => handleChange('current_capacity_water_bpd', parseFloat(e.target.value) || 0)}
              className={`bg-slate-900 border-slate-700 text-white ${errors.current_capacity_water_bpd ? 'border-red-500' : ''}`}
            />
          </FormField>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Installation Date" required icon={<Calendar className="w-4 h-4 text-slate-500" />} tooltip="Facility commissioning date">
          <Input type="date" value={formData.installation_date}
            onChange={(e) => handleChange('installation_date', e.target.value)}
            className="bg-slate-900 border-slate-700 text-white"
          />
        </FormField>

        <FormField label="Decommissioning Date (Optional)" error={errors.decommissioning_date} tooltip="Planned end-of-life date">
          <Input type="date" value={formData.decommissioning_date}
            onChange={(e) => handleChange('decommissioning_date', e.target.value)}
            className={`bg-slate-900 border-slate-700 text-white ${errors.decommissioning_date ? 'border-red-500' : ''}`}
          />
        </FormField>
      </div>

      <FormField label="Status" required tooltip="Current operational status">
        <Select value={formData.status} onValueChange={(val) => handleChange('status', val)}>
          <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-700 text-white">
            <SelectItem value="Operational">Operational</SelectItem>
            <SelectItem value="Planned">Planned</SelectItem>
            <SelectItem value="Decommissioned">Decommissioned</SelectItem>
          </SelectContent>
        </Select>
      </FormField>

      {Object.keys(errors).length > 0 && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
          <div>
            <h4 className="text-red-500 font-semibold mb-1">Validation Errors</h4>
            <ul className="text-sm text-red-400 space-y-1">
              {Object.values(errors).map((err, i) => <li key={i}>• {err}</li>)}
            </ul>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-800 sticky bottom-0 bg-[#1a1a1a]">
        <Button type="button" onClick={onClose} variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
          Cancel
        </Button>
        <Button type="submit" className="bg-[#00cc66] hover:bg-[#00a352] text-white">
          {editFacility ? 'Update Facility' : 'Create Facility'}
        </Button>
      </div>
    </form>
  );
};

export default FacilityForm;