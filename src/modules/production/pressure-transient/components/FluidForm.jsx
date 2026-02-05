import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wand2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const FluidForm = ({ initialData, onSave, onCancel }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    type: 'Oil',
    viscosity: '',
    compressibility: '',
    fvf: '',
    density: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        viscosity: initialData.viscosity?.toString() || '',
        compressibility: initialData.compressibility?.toString() || '',
        fvf: initialData.fvf?.toString() || '',
        density: initialData.density?.toString() || ''
      });
    }
  }, [initialData]);

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.viscosity) newErrors.viscosity = "Required";
    if (!formData.compressibility) newErrors.compressibility = "Required";
    if (!formData.fvf) newErrors.fvf = "Required";
    if (!formData.density) newErrors.density = "Required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave({
        ...formData,
        viscosity: parseFloat(formData.viscosity),
        compressibility: parseFloat(formData.compressibility),
        fvf: parseFloat(formData.fvf),
        density: parseFloat(formData.density)
      });
    } else {
      toast({ title: "Validation Error", variant: "destructive" });
    }
  };

  const loadDemoData = () => {
    setFormData({
      type: 'Oil',
      viscosity: '1.2',
      compressibility: '0.000015',
      fvf: '1.25',
      density: '42'
    });
    setErrors({});
  };

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <div className="flex justify-between">
          <div>
            <CardTitle className="text-white">Fluid Properties</CardTitle>
            <CardDescription>PVT data for the reservoir fluid</CardDescription>
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
              <Label>Fluid Type</Label>
              <Select value={formData.type} onValueChange={(val) => handleChange('type', val)}>
                <SelectTrigger className="bg-slate-950 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800 text-white">
                  <SelectItem value="Oil">Oil</SelectItem>
                  <SelectItem value="Gas">Gas</SelectItem>
                  <SelectItem value="Water">Water</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Viscosity (cP)</Label>
              <Input 
                type="number"
                step="0.01"
                value={formData.viscosity} 
                onChange={(e) => handleChange('viscosity', e.target.value)} 
                className={errors.viscosity ? "border-red-500" : ""}
              />
            </div>

            <div className="space-y-2">
              <Label>Compressibility (1/psi)</Label>
              <Input 
                type="number"
                step="0.000001"
                value={formData.compressibility} 
                onChange={(e) => handleChange('compressibility', e.target.value)} 
                className={errors.compressibility ? "border-red-500" : ""}
              />
            </div>

             <div className="space-y-2">
              <Label>Formation Volume Factor (RB/STB)</Label>
              <Input 
                type="number"
                step="0.01"
                value={formData.fvf} 
                onChange={(e) => handleChange('fvf', e.target.value)} 
                className={errors.fvf ? "border-red-500" : ""}
              />
            </div>

             <div className="space-y-2">
              <Label>Density (lb/ft³)</Label>
              <Input 
                type="number"
                step="0.1"
                value={formData.density} 
                onChange={(e) => handleChange('density', e.target.value)} 
                className={errors.density ? "border-red-500" : ""}
              />
            </div>

          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-800">
            <Button type="button" variant="ghost" onClick={onCancel} className="text-slate-400">Cancel</Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Save Fluids</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default FluidForm;