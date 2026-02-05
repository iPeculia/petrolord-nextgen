import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle, Save, X, RotateCcw, Wand2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const WellForm = ({ initialData, onSave, onCancel }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    type: 'Vertical',
    depth_tvd: '',
    depth_md: '',
    wellbore_radius: '',
    skin_factor: '0',
    wellbore_storage: '0'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        // Ensure numbers are strings for inputs
        depth_tvd: initialData.depth_tvd?.toString() || '',
        depth_md: initialData.depth_md?.toString() || '',
        wellbore_radius: initialData.wellbore_radius?.toString() || '',
        skin_factor: initialData.skin_factor?.toString() || '0',
        wellbore_storage: initialData.wellbore_storage?.toString() || '0'
      });
    }
  }, [initialData]);

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Well name is required";
    if (!formData.location) newErrors.location = "Location is required";
    if (!formData.depth_tvd) newErrors.depth_tvd = "TVD is required";
    if (!formData.depth_md) newErrors.depth_md = "Measured Depth is required";
    if (!formData.wellbore_radius) newErrors.wellbore_radius = "Radius is required";
    
    // Numeric validation
    if (parseFloat(formData.depth_tvd) > parseFloat(formData.depth_md)) {
      newErrors.depth_tvd = "TVD cannot be greater than Measured Depth";
    }
    if (parseFloat(formData.wellbore_radius) <= 0) {
      newErrors.wellbore_radius = "Radius must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave({
        ...formData,
        depth_tvd: parseFloat(formData.depth_tvd),
        depth_md: parseFloat(formData.depth_md),
        wellbore_radius: parseFloat(formData.wellbore_radius),
        skin_factor: parseFloat(formData.skin_factor),
        wellbore_storage: parseFloat(formData.wellbore_storage)
      });
    } else {
      toast({ title: "Form Error", description: "Please fix the highlighted errors.", variant: "destructive" });
    }
  };

  const loadDemoData = () => {
    setFormData({
      name: 'Well A-01',
      location: 'Permian Basin',
      type: 'Vertical',
      depth_tvd: '8500',
      depth_md: '8500',
      wellbore_radius: '0.354',
      skin_factor: '2',
      wellbore_storage: '0.01'
    });
    setErrors({});
    toast({ title: "Demo Data Loaded", description: "Example well data populated." });
  };

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-white">Well Configuration</CardTitle>
            <CardDescription>Define basic well geometry and parameters</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={loadDemoData} className="border-slate-700 text-slate-300">
            <Wand2 className="w-3 h-3 mr-2" /> Use Demo Data
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Name */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="name">Well Name *</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger><HelpCircle className="w-4 h-4 text-slate-500" /></TooltipTrigger>
                    <TooltipContent>Unique identifier for the well</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input 
                id="name" 
                value={formData.name} 
                onChange={(e) => handleChange('name', e.target.value)} 
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <span className="text-xs text-red-500">{errors.name}</span>}
            </div>

            {/* Location */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="location">Location *</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger><HelpCircle className="w-4 h-4 text-slate-500" /></TooltipTrigger>
                    <TooltipContent>Field, block, or geographic location</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input 
                id="location" 
                value={formData.location} 
                onChange={(e) => handleChange('location', e.target.value)}
                className={errors.location ? "border-red-500" : ""}
              />
              {errors.location && <span className="text-xs text-red-500">{errors.location}</span>}
            </div>

            {/* Well Type */}
            <div className="space-y-2">
               <div className="flex items-center gap-2">
                <Label htmlFor="type">Well Type</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger><HelpCircle className="w-4 h-4 text-slate-500" /></TooltipTrigger>
                    <TooltipContent>Trajectory profile of the well</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Select value={formData.type} onValueChange={(val) => handleChange('type', val)}>
                <SelectTrigger className="bg-slate-950 border-slate-700 text-white">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800 text-white">
                  <SelectItem value="Vertical">Vertical</SelectItem>
                  <SelectItem value="Deviated">Deviated</SelectItem>
                  <SelectItem value="Horizontal">Horizontal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Radius */}
             <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="wellbore_radius">Wellbore Radius (ft) *</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger><HelpCircle className="w-4 h-4 text-slate-500" /></TooltipTrigger>
                    <TooltipContent>Radius of the wellbore (rw)</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input 
                id="wellbore_radius" 
                type="number" 
                step="0.001"
                value={formData.wellbore_radius} 
                onChange={(e) => handleChange('wellbore_radius', e.target.value)}
                className={errors.wellbore_radius ? "border-red-500" : ""}
              />
              {errors.wellbore_radius && <span className="text-xs text-red-500">{errors.wellbore_radius}</span>}
            </div>

            {/* TVD */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="depth_tvd">True Vertical Depth (ft) *</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger><HelpCircle className="w-4 h-4 text-slate-500" /></TooltipTrigger>
                    <TooltipContent>Vertical distance from surface to bottom hole</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input 
                id="depth_tvd" 
                type="number" 
                value={formData.depth_tvd} 
                onChange={(e) => handleChange('depth_tvd', e.target.value)}
                className={errors.depth_tvd ? "border-red-500" : ""}
              />
              {errors.depth_tvd && <span className="text-xs text-red-500">{errors.depth_tvd}</span>}
            </div>

            {/* MD */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="depth_md">Measured Depth (ft) *</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger><HelpCircle className="w-4 h-4 text-slate-500" /></TooltipTrigger>
                    <TooltipContent>Total length of the wellbore</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input 
                id="depth_md" 
                type="number" 
                value={formData.depth_md} 
                onChange={(e) => handleChange('depth_md', e.target.value)}
                className={errors.depth_md ? "border-red-500" : ""}
              />
              {errors.depth_md && <span className="text-xs text-red-500">{errors.depth_md}</span>}
            </div>

             {/* Skin */}
             <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="skin_factor">Skin Factor</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger><HelpCircle className="w-4 h-4 text-slate-500" /></TooltipTrigger>
                    <TooltipContent>Dimensionless factor representing near-wellbore damage or stimulation</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input 
                id="skin_factor" 
                type="number" 
                step="0.1"
                value={formData.skin_factor} 
                onChange={(e) => handleChange('skin_factor', e.target.value)}
              />
            </div>

             {/* Storage */}
             <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="wellbore_storage">Wellbore Storage (bbl/psi)</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger><HelpCircle className="w-4 h-4 text-slate-500" /></TooltipTrigger>
                    <TooltipContent>Volume of fluid stored in wellbore per unit pressure change</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input 
                id="wellbore_storage" 
                type="number" 
                step="0.001"
                value={formData.wellbore_storage} 
                onChange={(e) => handleChange('wellbore_storage', e.target.value)}
              />
            </div>

          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-800">
            <Button type="button" variant="ghost" onClick={onCancel} className="text-slate-400">
              <X className="w-4 h-4 mr-2" /> Cancel
            </Button>
            <Button type="button" variant="outline" onClick={() => setFormData({})} className="border-slate-700 text-slate-300">
              <RotateCcw className="w-4 h-4 mr-2" /> Reset
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" /> Save Well
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default WellForm;