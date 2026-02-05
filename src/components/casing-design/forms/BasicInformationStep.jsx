import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { STRING_TYPES, FORM_CONSTRAINTS } from '../utils/constants';

const BasicInformationStep = ({ formData, updateFormData, wells, isEditMode }) => {
  return (
    <div className="space-y-6 max-w-2xl mx-auto py-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
                <Label htmlFor="name" className="text-slate-300">
                    Design Name <span className="text-red-400">*</span>
                </Label>
                <Input 
                    id="name" 
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                    maxLength={FORM_CONSTRAINTS.MAX_NAME_LENGTH}
                    placeholder="e.g. Production Casing - Run 1"
                    className="bg-slate-900 border-slate-700 focus:ring-orange-500"
                />
                <div className="text-xs text-slate-500 text-right">
                    {formData.name.length}/{FORM_CONSTRAINTS.MAX_NAME_LENGTH}
                </div>
            </div>

            <div className="space-y-3">
                <Label htmlFor="well" className="text-slate-300">
                    Well Assignment <span className="text-red-400">*</span>
                </Label>
                <Select 
                    value={formData.well_id} 
                    onValueChange={(val) => updateFormData('well_id', val)}
                    disabled={isEditMode}
                >
                    <SelectTrigger className="bg-slate-900 border-slate-700 focus:ring-orange-500">
                        <SelectValue placeholder="Select Well" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700 text-white z-[100]">
                        {wells.map(w => <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>)}
                        {wells.length === 0 && <div className="p-2 text-sm text-slate-500">No wells available</div>}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-3">
                <Label className="text-slate-300">String Type</Label>
                <RadioGroup 
                    value={formData.type} 
                    onValueChange={(val) => updateFormData('type', val)}
                    className="flex flex-wrap gap-4 pt-1"
                >
                    {STRING_TYPES.map(type => (
                        <div key={type} className="flex items-center space-x-2">
                            <RadioGroupItem value={type} id={`r-${type}`} className="border-slate-500 text-[#BFFF00]" />
                            <Label htmlFor={`r-${type}`} className="cursor-pointer">{type}</Label>
                        </div>
                    ))}
                </RadioGroup>
            </div>

            <div className="space-y-3">
                <Label htmlFor="od" className="text-slate-300">
                    Top OD (inches) <span className="text-red-400">*</span>
                </Label>
                <Input 
                    id="od" 
                    type="number"
                    step="0.125"
                    min={FORM_CONSTRAINTS.MIN_OD}
                    max={FORM_CONSTRAINTS.MAX_OD}
                    value={formData.od}
                    onChange={(e) => updateFormData('od', e.target.value)}
                    placeholder="e.g. 9.625"
                    className="bg-slate-900 border-slate-700 focus:ring-orange-500"
                />
            </div>

            <div className="col-span-1 md:col-span-2 space-y-3">
                <Label htmlFor="desc" className="text-slate-300">Description</Label>
                <Textarea 
                    id="desc"
                    value={formData.description}
                    onChange={(e) => updateFormData('description', e.target.value)}
                    maxLength={FORM_CONSTRAINTS.MAX_DESC_LENGTH}
                    placeholder="Optional details about load cases, mud weight, or operations..."
                    className="bg-slate-900 border-slate-700 min-h-[100px] focus:ring-orange-500"
                />
                <div className="text-xs text-slate-500 text-right">
                    {formData.description?.length || 0}/{FORM_CONSTRAINTS.MAX_DESC_LENGTH}
                </div>
            </div>
        </div>
    </div>
  );
};

export default BasicInformationStep;