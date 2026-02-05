import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Save, LayoutGrid } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const WellForm = ({ open, onOpenChange, initialData, onSubmit, isSubmitting, mode = 'create' }) => {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      operator: '',
      status: 'active',
      type: 'vertical',
      depth: '',
      latitude: '',
      longitude: '',
      field: '',
      country: '',
      state: '',
      county: '',
      spud_date: '',
      completion_date: '',
    }
  });

  // Watch values for Select components to control their state
  const status = watch('status');
  const type = watch('type');

  // Reset form when modal opens or data changes
  useEffect(() => {
    if (open) {
      if (mode === 'edit' && initialData) {
        // Pre-populate for edit mode
        reset({
          name: initialData.name || '',
          operator: initialData.metadata?.operator || initialData.operator || '',
          status: initialData.metadata?.status || initialData.status || 'active',
          type: initialData.metadata?.type || initialData.type || initialData.well_type || 'vertical',
          depth: initialData.depth || initialData.metadata?.depth || '',
          latitude: initialData.latitude || initialData.location?.latitude || '',
          longitude: initialData.longitude || initialData.location?.longitude || '',
          field: initialData.field || initialData.metadata?.field || initialData.location?.field || '',
          country: initialData.country || initialData.location?.country || '',
          state: initialData.state || initialData.location?.state || '',
          county: initialData.county || initialData.location?.county || '',
          spud_date: initialData.spud_date ? initialData.spud_date.split('T')[0] : '',
          completion_date: initialData.completion_date ? initialData.completion_date.split('T')[0] : '',
        });
      } else {
        // Reset for create mode
        reset({
          name: '',
          operator: '',
          status: 'active',
          type: 'vertical',
          depth: '',
          latitude: '',
          longitude: '',
          field: '',
          country: '',
          state: '',
          county: '',
          spud_date: '',
          completion_date: '',
        });
      }
    }
  }, [open, mode, initialData, reset]);

  const handleFormSubmit = (data) => {
    // Format numeric values and dates for API
    const formattedData = {
      ...data,
      depth: data.depth === '' ? null : parseFloat(data.depth),
      latitude: data.latitude === '' ? null : parseFloat(data.latitude),
      longitude: data.longitude === '' ? null : parseFloat(data.longitude),
      spud_date: data.spud_date || null,
      completion_date: data.completion_date || null,
      // Ensure metadata structure if needed by backend, though flat structure is often easier
      metadata: {
        operator: data.operator,
        field: data.field,
        status: data.status,
        type: data.type
      }
    };
    onSubmit(formattedData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col p-0 gap-0 shadow-2xl bg-slate-950 border-slate-800">
        <div className="p-6 border-b border-slate-800 bg-slate-900/30 shrink-0">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-[#BFFF00]/10 rounded-lg">
                    <LayoutGrid className="w-5 h-5 text-[#BFFF00]" />
                </div>
                <DialogTitle className="text-xl font-semibold text-slate-100">
                    {mode === 'create' ? 'New Well Record' : 'Edit Well Details'}
                </DialogTitle>
            </div>
            <DialogDescription className="text-slate-400">
                {mode === 'create' ? 'Enter technical details to initialize a new well.' : 'Update the technical specifications for this well.'}
            </DialogDescription>
        </div>
        
        <ScrollArea className="flex-1 w-full">
            <form id="well-form" onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-6">
                <div className="space-y-4">
                    {/* Basic Info */}
                    <div className="grid gap-2">
                        <Label htmlFor="name" className="text-slate-300 font-medium">Well Name <span className="text-red-500">*</span></Label>
                        <Input
                            id="name"
                            {...register("name", { required: "Well name is required" })}
                            className={`bg-slate-900 border-slate-700 focus-visible:ring-[#BFFF00] text-slate-100 ${errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                            placeholder="e.g. North Sea 24/7-A"
                            autoComplete="off"
                        />
                        {errors.name && <span className="text-xs text-red-400 font-medium">{errors.name.message}</span>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="operator" className="text-slate-300 font-medium">Operator</Label>
                            <Input
                                id="operator"
                                {...register("operator")}
                                className="bg-slate-900 border-slate-700 focus-visible:ring-[#BFFF00] text-slate-100"
                                placeholder="e.g. Shell"
                            />
                        </div>
                         <div className="grid gap-2">
                            <Label htmlFor="field" className="text-slate-300 font-medium">Field / Block</Label>
                            <Input
                                id="field"
                                {...register("field")}
                                className="bg-slate-900 border-slate-700 focus-visible:ring-[#BFFF00] text-slate-100"
                                placeholder="e.g. Block 24"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label className="text-slate-300 font-medium">Status</Label>
                            <Select value={status} onValueChange={(val) => setValue('status', val)}>
                                <SelectTrigger className="bg-slate-900 border-slate-700 focus:ring-[#BFFF00] text-slate-100">
                                <SelectValue placeholder="Select Status" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                                <SelectItem value="abandoned">Abandoned</SelectItem>
                                <SelectItem value="planned">Planned</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label className="text-slate-300 font-medium">Well Type</Label>
                            <Select value={type} onValueChange={(val) => setValue('type', val)}>
                                <SelectTrigger className="bg-slate-900 border-slate-700 focus:ring-[#BFFF00] text-slate-100">
                                <SelectValue placeholder="Select Type" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                                <SelectItem value="vertical">Vertical</SelectItem>
                                <SelectItem value="deviated">Deviated</SelectItem>
                                <SelectItem value="horizontal">Horizontal</SelectItem>
                                <SelectItem value="exploration">Exploration</SelectItem>
                                <SelectItem value="appraisal">Appraisal</SelectItem>
                                <SelectItem value="development">Development</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Location Data */}
                    <div className="grid gap-2 pt-2">
                        <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Location & Depth</Label>
                        <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800 space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="depth" className="text-slate-400 text-xs font-medium">Total Depth (MD)</Label>
                                <div className="relative">
                                    <Input
                                        id="depth"
                                        type="number"
                                        step="0.1"
                                        {...register("depth")}
                                        className="bg-slate-950 border-slate-700 pr-8 focus-visible:ring-[#BFFF00] text-slate-100"
                                        placeholder="0.0"
                                    />
                                    <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-mono">m</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="grid gap-2">
                                    <Label htmlFor="latitude" className="text-slate-400 text-xs font-medium">Latitude</Label>
                                    <Input
                                        id="latitude"
                                        type="number"
                                        step="any"
                                        {...register("latitude")}
                                        className="bg-slate-950 border-slate-700 focus-visible:ring-[#BFFF00] text-slate-100"
                                        placeholder="0.000000"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="longitude" className="text-slate-400 text-xs font-medium">Longitude</Label>
                                    <Input
                                        id="longitude"
                                        type="number"
                                        step="any"
                                        {...register("longitude")}
                                        className="bg-slate-950 border-slate-700 focus-visible:ring-[#BFFF00] text-slate-100"
                                        placeholder="0.000000"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="grid gap-2">
                                    <Label htmlFor="country" className="text-slate-400 text-xs font-medium">Country</Label>
                                    <Input
                                        id="country"
                                        {...register("country")}
                                        className="bg-slate-950 border-slate-700 focus-visible:ring-[#BFFF00] text-slate-100"
                                        placeholder="USA"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="state" className="text-slate-400 text-xs font-medium">State/Prov</Label>
                                    <Input
                                        id="state"
                                        {...register("state")}
                                        className="bg-slate-950 border-slate-700 focus-visible:ring-[#BFFF00] text-slate-100"
                                        placeholder="TX"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="county" className="text-slate-400 text-xs font-medium">County</Label>
                                    <Input
                                        id="county"
                                        {...register("county")}
                                        className="bg-slate-950 border-slate-700 focus-visible:ring-[#BFFF00] text-slate-100"
                                        placeholder="Midland"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="grid gap-2 pt-2">
                        <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Operational Dates</Label>
                        <div className="grid grid-cols-2 gap-4 bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                            <div className="grid gap-2">
                                <Label htmlFor="spud_date" className="text-slate-400 text-xs font-medium">Spud Date</Label>
                                <div className="relative">
                                    <Input
                                        id="spud_date"
                                        type="date"
                                        {...register("spud_date")}
                                        className="bg-slate-950 border-slate-700 focus-visible:ring-[#BFFF00] text-slate-100"
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="completion_date" className="text-slate-400 text-xs font-medium">Completion Date</Label>
                                <div className="relative">
                                    <Input
                                        id="completion_date"
                                        type="date"
                                        {...register("completion_date")}
                                        className="bg-slate-950 border-slate-700 focus-visible:ring-[#BFFF00] text-slate-100"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </ScrollArea>
        
        <div className="p-6 border-t border-slate-800 bg-slate-900/50 shrink-0">
            <DialogFooter className="gap-3 sm:gap-0">
                <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="hover:bg-slate-800 text-slate-400 hover:text-white">Cancel</Button>
                <Button 
                    type="submit" 
                    form="well-form"
                    className="bg-[#BFFF00] text-slate-900 hover:bg-[#a3d900] font-medium min-w-[120px]" 
                    disabled={isSubmitting}
                >
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                    {mode === 'create' ? 'Create Well' : 'Save Changes'}
                </Button>
            </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WellForm;