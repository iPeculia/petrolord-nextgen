import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle, Save, X, RotateCcw, Wand2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ReservoirForm = ({ initialData, onSave, onCancel }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    porosity: '',
    thickness: '',
    permeability: '',
    initial_pressure: '',
    temperature: '',
    boundary_type: 'Infinite'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        porosity: initialData.porosity?.toString() || '',
        thickness: initialData.thickness?.toString() || '',
        permeability: initialData.permeability?.toString() || '',
        initial_pressure: initialData.initial_pressure?.toString() || '',
        temperature: initialData.temperature?.toString() || '',
        boundary_type: initialData.boundary_type || 'Infinite'
      });
    }
  }, [initialData]);

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.porosity) newErrors.porosity = "Required";
    else if (parseFloat(formData.porosity) < 0 || parseFloat(formData.porosity) > 100) newErrors.porosity = "0-100%";
    
    if (!formData.thickness) newErrors.thickness = "Required";
    if (!formData.permeability) newErrors.permeability = "Required";
    else if (parseFloat(formData.permeability) <= 0) newErrors.permeability = "> 0";
    
    if (!formData.initial_pressure) newErrors.initial_pressure = "Required";
    if (!formData.temperature) newErrors.temperature = "Required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave({
        ...formData,
        porosity: parseFloat(formData.porosity),
        thickness: parseFloat(formData.thickness),
        permeability: parseFloat(formData.permeability),
        initial_pressure: parseFloat(formData.initial_pressure),
        temperature: parseFloat(formData.temperature)
      });
    } else {
      toast({ title: "Validation Error", description: "Please check form fields.", variant: "destructive" });
    }
  };

  const loadDemoData = () => {
    setFormData({
      porosity: '18',
      thickness: '45',
      permeability: '120',
      initial_pressure: '3500',
      temperature: '180',
      boundary_type: 'Infinite'
    });
    setErrors({});
  };

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <div className="flex justify-between">
          <div>
            <CardTitle className="text-white">Reservoir Properties</CardTitle>
            <CardDescription>Rock and system properties</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={loadDemoData} className="border-slate-700 text-slate-300">
            <Wand2 className="w-3 h-3 mr-2" /> Demo Data
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-2">
              <Label>Porosity (%)</Label>
              <Input 
                type="number"
                value={formData.porosity} 
                onChange={(e) => handleChange('porosity', e.target.value)} 
                className={errors.porosity ? "border-red-500" : ""}
              />
              {errors.porosity && <span className="text-xs text-red-500">{errors.porosity}</span>}
            </div>

            <div className="space-y-2">
              <Label>Net Thickness (ft)</Label>
              <Input 
                type="number"
                value={formData.thickness} 
                onChange={(e) => handleChange('thickness', e.target.value)} 
                className={errors.thickness ? "border-red-500" : ""}
              />
              {errors.thickness && <span className="text-xs text-red-500">{errors.thickness}</span>}
            </div>

            <div className="space-y-2">
              <Label>Permeability (mD)</Label>
              <Input 
                type="number"
                value={formData.permeability} 
                onChange={(e) => handleChange('permeability', e.target.value)} 
                className={errors.permeability ? "border-red-500" : ""}
              />
              {errors.permeability && <span className="text-xs text-red-500">{errors.permeability}</span>}
            </div>

             <div className="space-y-2">
              <Label>Initial Pressure (psi)</Label>
              <Input 
                type="number"
                value={formData.initial_pressure} 
                onChange={(e) => handleChange('initial_pressure', e.target.value)} 
                className={errors.initial_pressure ? "border-red-500" : ""}
              />
              {errors.initial_pressure && <span className="text-xs text-red-500">{errors.initial_pressure}</span>}
            </div>

             <div className="space-y-2">
              <Label>Temperature (°F)</Label>
              <Input 
                type="number"
                value={formData.temperature} 
                onChange={(e) => handleChange('temperature', e.target.value)} 
                className={errors.temperature ? "border-red-500" : ""}
              />
              {errors.temperature && <span className="text-xs text-red-500">{errors.temperature}</span>}
            </div>

             <div className="space-y-2">
              <Label>Boundary Type</Label>
              <Select value={formData.boundary_type} onValueChange={(val) => handleChange('boundary_type', val)}>
                <SelectTrigger className="bg-slate-950 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800 text-white">
                  <SelectItem value="Infinite">Infinite Acting</SelectItem>
                  <SelectItem value="Closed">Closed / Sealed</SelectItem>
                  <SelectItem value="Constant Pressure">Constant Pressure</SelectItem>
                </SelectContent>
              </Select>
            </div>

          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-800">
            <Button type="button" variant="ghost" onClick={onCancel} className="text-slate-400">Cancel</Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Save Properties</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReservoirForm;