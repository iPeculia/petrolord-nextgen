import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useVolumetrics } from '@/hooks/useVolumetrics';
import { InputValidator } from '@/services/volumetrics/InputValidator';
import { Info, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';

const InputField = ({ id, label, value, onChange, unit, error, warning, tooltip, placeholder }) => (
    <div className="space-y-1.5">
        <div className="flex items-center justify-between">
            <Label htmlFor={id} className="text-xs text-slate-400 flex items-center gap-1">
                {label}
                {tooltip && (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger><Info size={12} className="text-slate-600 hover:text-slate-400 cursor-help" /></TooltipTrigger>
                            <TooltipContent className="bg-slate-800 text-slate-200 text-xs max-w-[200px] border-slate-700">
                                {tooltip}
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}
            </Label>
            {unit && <span className="text-[10px] text-slate-600 font-mono">{unit}</span>}
        </div>
        <div className="relative">
            <Input
                id={id}
                type="number"
                step="any"
                value={value || ''}
                onChange={(e) => onChange(id, e.target.value)}
                className={cn(
                    "h-8 bg-slate-900 border-slate-800 text-sm focus-visible:ring-1 focus-visible:ring-[#BFFF00]",
                    error && "border-red-500/50 focus-visible:ring-red-500",
                    warning && "border-yellow-500/50 focus-visible:ring-yellow-500"
                )}
                placeholder={placeholder}
            />
            {error && <AlertCircle className="absolute right-2 top-2 text-red-500 w-4 h-4" />}
            {!error && value && <CheckCircle2 className="absolute right-2 top-2 text-green-500/50 w-4 h-4" />}
        </div>
        {error && <p className="text-[10px] text-red-400">{error}</p>}
        {warning && <p className="text-[10px] text-yellow-400">{warning}</p>}
    </div>
);

const SimpleInput = () => {
    const { state, actions } = useVolumetrics();
    const [formData, setFormData] = useState(state.data.parameters || {});
    const [errors, setErrors] = useState({});
    const [warnings, setWarnings] = useState({});

    // Sync with context on mount or when parameters update
    useEffect(() => {
        if (state.data.parameters) {
            setFormData(prev => ({ ...prev, ...state.data.parameters }));
        }
    }, []);

    const handleChange = (field, value) => {
        const newData = { ...formData, [field]: value };
        setFormData(newData);
        actions.updateData({ parameters: newData });
        
        // Real-time validation for the field
        const validation = InputValidator.validateSimpleInput(newData);
        setErrors(validation.errors);
        setWarnings(validation.warnings);
    };

    const loadDemoData = () => {
        const demo = {
            area: 500,
            thickness: 85,
            porosity: 0.22,
            water_saturation: 0.35,
            formation_volume_factor: 1.25,
            recovery_factor: 0.30,
            permeability: 150,
            initial_pressure: 3500,
            temperature: 180,
            oil_gravity: 32,
            gas_oil_ratio: 400
        };
        setFormData(demo);
        actions.updateData({ parameters: demo });
        setErrors({});
        actions.addLog("Loaded demo data for Simple Input method", "info");
    };

    const unitSystem = formData.unit_system || 'Imperial'; // Default
    const units = unitSystem === 'Imperial' 
        ? { area: 'acres', thickness: 'ft', perm: 'mD', press: 'psi', temp: '°F' }
        : { area: 'hectares', thickness: 'm', perm: 'mD', press: 'bar', temp: '°C' };

    return (
        <div className="p-4 h-full overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-slate-200">Reservoir Parameters</h3>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={loadDemoData} className="text-xs h-7 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800">
                        Load Demo Data
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Geometry */}
                <Card className="bg-slate-950 border-slate-800">
                    <CardContent className="p-4 space-y-4">
                        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-900">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            <span className="text-sm font-medium text-slate-300">Geometry</span>
                        </div>
                        <InputField 
                            id="area" label="Area" value={formData.area} onChange={handleChange} 
                            unit={units.area} error={errors.area} 
                            tooltip="Total reservoir area defined by fluid contacts or structural limits."
                            placeholder="e.g. 500"
                        />
                        <InputField 
                            id="thickness" label="Net Thickness" value={formData.thickness} onChange={handleChange} 
                            unit={units.thickness} error={errors.thickness}
                            tooltip="Average net pay thickness across the reservoir."
                            placeholder="e.g. 85"
                        />
                    </CardContent>
                </Card>

                {/* Petrophysics */}
                <Card className="bg-slate-950 border-slate-800">
                    <CardContent className="p-4 space-y-4">
                        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-900">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span className="text-sm font-medium text-slate-300">Petrophysics</span>
                        </div>
                        <InputField 
                            id="porosity" label="Porosity (ϕ)" value={formData.porosity} onChange={handleChange} 
                            unit="frac" error={errors.porosity} warning={warnings.porosity}
                            tooltip="Effective porosity fraction (0-1)."
                            placeholder="0.22"
                        />
                        <InputField 
                            id="water_saturation" label="Water Saturation (Sw)" value={formData.water_saturation} onChange={handleChange} 
                            unit="frac" error={errors.water_saturation}
                            tooltip="Average initial water saturation fraction (0-1)."
                            placeholder="0.35"
                        />
                        <InputField 
                            id="permeability" label="Permeability (k)" value={formData.permeability} onChange={handleChange} 
                            unit={units.perm}
                            tooltip="Average reservoir permeability."
                            placeholder="150"
                        />
                    </CardContent>
                </Card>

                {/* Fluids */}
                <Card className="bg-slate-950 border-slate-800">
                    <CardContent className="p-4 space-y-4">
                        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-900">
                            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                            <span className="text-sm font-medium text-slate-300">Fluids & Recovery</span>
                        </div>
                        <InputField 
                            id="formation_volume_factor" label="FVF (Bo/Bg)" value={formData.formation_volume_factor} onChange={handleChange} 
                            unit="rb/stb" error={errors.formation_volume_factor} warning={warnings.formation_volume_factor}
                            tooltip="Formation Volume Factor - converts reservoir to stock tank volumes."
                            placeholder="1.25"
                        />
                        <InputField 
                            id="recovery_factor" label="Recovery Factor" value={formData.recovery_factor} onChange={handleChange} 
                            unit="frac" error={errors.recovery_factor}
                            tooltip="Estimated recovery factor fraction (0-1)."
                            placeholder="0.30"
                        />
                        <div className="grid grid-cols-2 gap-2">
                             <InputField 
                                id="oil_gravity" label="API Gravity" value={formData.oil_gravity} onChange={handleChange} 
                                unit="°API"
                                placeholder="32"
                            />
                             <InputField 
                                id="initial_pressure" label="Init Pressure" value={formData.initial_pressure} onChange={handleChange} 
                                unit={units.press}
                                placeholder="3500"
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-8 p-4 bg-slate-900/30 border border-dashed border-slate-800 rounded-lg">
                <h4 className="text-xs font-semibold text-slate-500 mb-2 uppercase">Equation Preview</h4>
                <div className="font-mono text-sm text-slate-300 flex flex-wrap gap-2 items-center justify-center">
                    <span className="text-blue-400">STOIIP</span> = 
                    <span className="text-slate-500">(</span>
                    <span className="text-slate-200">7758</span> × 
                    <span className="text-blue-400">Area</span> × 
                    <span className="text-blue-400">h</span> × 
                    <span className="text-green-400">ϕ</span> × 
                    <span className="text-slate-500">(</span>1 - <span className="text-green-400">Sw</span><span className="text-slate-500">)</span>
                    <span className="text-slate-500">)</span> / <span className="text-purple-400">Boi</span>
                </div>
            </div>
        </div>
    );
};

export default SimpleInput;