import React, { useState } from 'react';
import { Plus, Percent, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import FormField from '../shared/FormField';

const ScenarioCreationDialog = ({ open, onOpenChange, onCreate }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parameters: {
      discount_rate: 10,
      oil_price: 70,
      gas_price: 3.5,
      capex_multiplier: 1.0,
      opex_multiplier: 1.0
    }
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  const handleParamChange = (field, value) => {
    setFormData(prev => ({ 
        ...prev, 
        parameters: { ...prev.parameters, [field]: parseFloat(value) } 
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Scenario name is required";
    if (formData.parameters.discount_rate < 0) newErrors.discount_rate = "Rate cannot be negative";
    if (formData.parameters.oil_price < 0) newErrors.oil_price = "Price cannot be negative";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onCreate(formData);
      onOpenChange(false);
      // Reset form
      setFormData({
        name: '',
        description: '',
        parameters: { discount_rate: 10, oil_price: 70, gas_price: 3.5, capex_multiplier: 1.0, opex_multiplier: 1.0 }
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1a1a1a] border-slate-800 text-white max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-500" />
            Create New Scenario
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Define parameters for your new planning scenario. These will override base assumptions.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <FormField label="Scenario Name" required error={errors.name}>
              <Input 
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g. High Oil Price Case"
                className="bg-slate-900 border-slate-700 text-white"
              />
            </FormField>
            
            <FormField label="Description">
              <Textarea 
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Describe the key assumptions..."
                className="bg-slate-900 border-slate-700 text-white h-20"
              />
            </FormField>
          </div>

          <div className="border-t border-slate-800 pt-4">
            <h4 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" /> Economic Assumptions
            </h4>
            <div className="grid grid-cols-2 gap-4">
               <FormField label="Oil Price ($/bbl)" error={errors.oil_price}>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                    <Input 
                        type="number" 
                        value={formData.parameters.oil_price}
                        onChange={(e) => handleParamChange('oil_price', e.target.value)}
                        className="bg-slate-900 border-slate-700 text-white pl-9" 
                    />
                  </div>
               </FormField>
               <FormField label="Gas Price ($/mmbtu)">
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                    <Input 
                        type="number" 
                        value={formData.parameters.gas_price}
                        onChange={(e) => handleParamChange('gas_price', e.target.value)}
                        className="bg-slate-900 border-slate-700 text-white pl-9" 
                    />
                  </div>
               </FormField>
               <FormField label="Discount Rate (%)" error={errors.discount_rate}>
                  <div className="relative">
                    <Percent className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                    <Input 
                        type="number" 
                        value={formData.parameters.discount_rate}
                        onChange={(e) => handleParamChange('discount_rate', e.target.value)}
                        className="bg-slate-900 border-slate-700 text-white pl-9" 
                    />
                  </div>
               </FormField>
               <div className="grid grid-cols-2 gap-2">
                   <FormField label="CAPEX Factor">
                      <Input 
                          type="number" 
                          step="0.1"
                          value={formData.parameters.capex_multiplier}
                          onChange={(e) => handleParamChange('capex_multiplier', e.target.value)}
                          className="bg-slate-900 border-slate-700 text-white" 
                      />
                   </FormField>
                   <FormField label="OPEX Factor">
                      <Input 
                          type="number" 
                          step="0.1"
                          value={formData.parameters.opex_multiplier}
                          onChange={(e) => handleParamChange('opex_multiplier', e.target.value)}
                          className="bg-slate-900 border-slate-700 text-white" 
                      />
                   </FormField>
               </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-slate-400">Cancel</Button>
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white">Create Scenario</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ScenarioCreationDialog;