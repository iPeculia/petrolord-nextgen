import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Calendar, DollarSign, MapPin, Building2, User, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFacilityMasterPlanner } from '../../context/FacilityMasterPlannerContext';
import FormField from '../shared/FormField';
import FormTooltip from '../shared/FormTooltip';

const ProjectForm = ({ onClose, editProject = null }) => {
  const { addProject, updateProject } = useFacilityMasterPlanner();
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState(editProject || {
    project_id: uuidv4(),
    name: '',
    description: '',
    location: '',
    facility_type: 'FPSO',
    currency: 'USD',
    discount_rate_percent: 10,
    owner: uuidv4(),
    created_date: new Date().toISOString(),
    status: 'Draft'
  });

  const loadDemoData = () => {
    setFormData({
      project_id: uuidv4(),
      name: "North Sea Development Project",
      description: "Offshore oil and gas development with subsea tie-backs to existing FPSO infrastructure.",
      location: "North Sea Block 15/23",
      facility_type: "FPSO",
      currency: "USD",
      discount_rate_percent: 12,
      owner: uuidv4(),
      created_date: new Date().toISOString(),
      status: "Active"
    });
    setErrors({});
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name || formData.name.length < 3) {
      newErrors.name = "Project name must be at least 3 characters";
    }
    if (formData.name && formData.name.length > 200) {
      newErrors.name = "Project name cannot exceed 200 characters";
    }
    if (formData.description && formData.description.length > 1000) {
      newErrors.description = "Description cannot exceed 1000 characters";
    }
    if (!formData.location || formData.location.length < 3) {
      newErrors.location = "Location must be at least 3 characters";
    }
    if (!formData.facility_type) {
      newErrors.facility_type = "Facility type is required";
    }
    if (!formData.currency) {
      newErrors.currency = "Currency is required";
    }
    if (formData.discount_rate_percent < 0 || formData.discount_rate_percent > 50) {
      newErrors.discount_rate_percent = "Discount rate must be between 0% and 50%";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    if (editProject) {
      updateProject(formData.project_id, formData);
    } else {
      addProject(formData);
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-[#1a1a1a] rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <Building2 className="w-6 h-6 text-[#0066cc]" />
          {editProject ? 'Edit Project' : 'Create New Project'}
        </h2>
        <Button type="button" onClick={loadDemoData} variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-800">
          Load Demo Data
        </Button>
      </div>

      {/* Project Name */}
      <FormField
        label="Project Name"
        required
        error={errors.name}
        tooltip="Unique identifier for this facility master planning project"
      >
        <Input
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="e.g., North Sea Development Project"
          className={`bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 ${errors.name ? 'border-red-500' : ''}`}
        />
      </FormField>

      {/* Description */}
      <FormField
        label="Description"
        error={errors.description}
        tooltip="Detailed project overview and objectives"
      >
        <Textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Project scope, objectives, and strategic context..."
          rows={4}
          className={`bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 ${errors.description ? 'border-red-500' : ''}`}
        />
      </FormField>

      {/* Location */}
      <FormField
        label="Location"
        required
        error={errors.location}
        tooltip="Geographic location or basin area"
        icon={<MapPin className="w-4 h-4 text-slate-500" />}
      >
        <Input
          value={formData.location}
          onChange={(e) => handleChange('location', e.target.value)}
          placeholder="e.g., Gulf of Mexico, North Sea Block 15/23"
          className={`bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 ${errors.location ? 'border-red-500' : ''}`}
        />
      </FormField>

      {/* Facility Type */}
      <FormField
        label="Facility Type"
        required
        error={errors.facility_type}
        tooltip="Primary processing facility classification"
      >
        <Select value={formData.facility_type} onValueChange={(val) => handleChange('facility_type', val)}>
          <SelectTrigger className={`bg-slate-900 border-slate-700 text-white ${errors.facility_type ? 'border-red-500' : ''}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-700 text-white">
            <SelectItem value="CPF">Central Processing Facility (CPF)</SelectItem>
            <SelectItem value="FPSO">Floating Production Storage Offloading (FPSO)</SelectItem>
            <SelectItem value="Refinery">Refinery</SelectItem>
            <SelectItem value="Processing Plant">Processing Plant</SelectItem>
          </SelectContent>
        </Select>
      </FormField>

      {/* Currency & Discount Rate */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Currency"
          required
          error={errors.currency}
          tooltip="Currency for all economic calculations"
          icon={<DollarSign className="w-4 h-4 text-slate-500" />}
        >
          <Select value={formData.currency} onValueChange={(val) => handleChange('currency', val)}>
            <SelectTrigger className={`bg-slate-900 border-slate-700 text-white ${errors.currency ? 'border-red-500' : ''}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-700 text-white">
              <SelectItem value="USD">USD - US Dollar</SelectItem>
              <SelectItem value="EUR">EUR - Euro</SelectItem>
              <SelectItem value="GBP">GBP - British Pound</SelectItem>
              <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
              <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
            </SelectContent>
          </Select>
        </FormField>

        <FormField
          label="Discount Rate (%)"
          required
          error={errors.discount_rate_percent}
          tooltip="Economic discount rate for NPV calculations (0-50%)"
        >
          <Input
            type="number"
            step="0.1"
            min="0"
            max="50"
            value={formData.discount_rate_percent}
            onChange={(e) => handleChange('discount_rate_percent', parseFloat(e.target.value) || 0)}
            className={`bg-slate-900 border-slate-700 text-white ${errors.discount_rate_percent ? 'border-red-500' : ''}`}
          />
        </FormField>
      </div>

      {/* Status */}
      <FormField
        label="Project Status"
        required
        tooltip="Current project lifecycle stage"
      >
        <Select value={formData.status} onValueChange={(val) => handleChange('status', val)}>
          <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-700 text-white">
            <SelectItem value="Draft">Draft</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </FormField>

      {/* Error Summary */}
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

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
        <Button type="button" onClick={onClose} variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
          Cancel
        </Button>
        <Button type="submit" className="bg-[#0066cc] hover:bg-[#0052a3] text-white">
          {editProject ? 'Update Project' : 'Create Project'}
        </Button>
      </div>
    </form>
  );
};

export default ProjectForm;