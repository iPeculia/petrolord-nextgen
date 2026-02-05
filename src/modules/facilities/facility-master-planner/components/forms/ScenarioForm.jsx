import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { GitBranch, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useFacilityMasterPlanner } from '../../context/FacilityMasterPlannerContext';
import FormField from '../shared/FormField';

const ScenarioForm = ({ onClose }) => {
  const { currentProject, scenarios, addScenario } = useFacilityMasterPlanner();
  const [errors, setErrors] = useState({});
  
  // Check if baseline exists
  const hasBaseline = scenarios.some(s => s.project_id === currentProject?.project_id && s.is_baseline);

  const [formData, setFormData] = useState({
    scenario_id: uuidv4(),
    project_id: currentProject?.project_id || '',
    name: 'Base Case',
    description: '',
    scenario_type: 'Base',
    is_baseline: !hasBaseline, // Auto-select if no baseline
    status: 'Draft',
    created_date: new Date().toISOString()
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Scenario name required";
    if (formData.is_baseline && hasBaseline && !scenarios.find(s => s.scenario_id === formData.scenario_id)) {
       // Only error if we are creating NEW scenario and setting it as baseline when one exists
       // For simplicity in this demo form, we won't strictly block it but warn, or just allow overwrite logic in backend
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    addScenario(formData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-[#1a1a1a] rounded-lg border border-slate-800">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-800">
        <h2 className="text-xl font-bold text-white flex items-center gap-3">
          <div className="p-2 bg-purple-500/10 rounded-lg">
            <GitBranch className="w-5 h-5 text-purple-500" />
          </div>
          Create Planning Scenario
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Scenario Name" required error={errors.name}>
             <Select value={formData.name} onValueChange={(val) => handleChange('name', val)}>
                <SelectTrigger className="bg-slate-900 border-slate-700 text-white"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700 text-white">
                    {['Base Case', 'Optimistic', 'Pessimistic', 'Custom'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
            </Select>
        </FormField>

        <FormField label="Type" required>
             <Select value={formData.scenario_type} onValueChange={(val) => handleChange('scenario_type', val)}>
                <SelectTrigger className="bg-slate-900 border-slate-700 text-white"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700 text-white">
                    {['Base', 'Low', 'High', 'Custom'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
            </Select>
        </FormField>
      </div>

      <FormField label="Description" tooltip="Assumptions and constraints for this scenario">
        <Textarea 
            value={formData.description} 
            onChange={e => handleChange('description', e.target.value)} 
            placeholder="e.g. High oil price case with Phase 2 expansion included..."
            className="bg-slate-900 border-slate-700 text-white"
            rows={3}
        />
      </FormField>

      <div className="flex items-center space-x-2 bg-slate-900/50 p-4 rounded-lg border border-slate-800">
        <Checkbox 
            id="baseline" 
            checked={formData.is_baseline} 
            onCheckedChange={(checked) => handleChange('is_baseline', checked)}
            className="border-slate-500 data-[state=checked]:bg-purple-600"
        />
        <div className="grid gap-1.5 leading-none">
            <Label htmlFor="baseline" className="text-sm font-medium leading-none text-white peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Set as Baseline Scenario
            </Label>
            <p className="text-xs text-slate-500">
                This scenario will be used as the reference for comparison calculations.
            </p>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
        <Button type="button" onClick={onClose} variant="ghost" className="text-slate-400 hover:text-white">Cancel</Button>
        <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white min-w-[120px]">Create Scenario</Button>
      </div>
    </form>
  );
};

export default ScenarioForm;