import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Save, Bookmark } from 'lucide-react';

const MARKER_TYPES = [
    { id: 'formation', label: 'Formation Top' },
    { id: 'lithology', label: 'Lithology Change' },
    { id: 'fault', label: 'Fault' },
    { id: 'casing', label: 'Casing Shoe' },
    { id: 'generic', label: 'Generic Marker' }
];

const DEFAULT_COLORS = {
    formation: '#FF0000',
    lithology: '#00FF00',
    fault: '#0000FF',
    casing: '#FFFF00',
    generic: '#FFFFFF'
};

const MarkerForm = ({ open, onOpenChange, initialData, onSubmit, isSubmitting, mode = 'create' }) => {
    const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
        defaultValues: {
            name: '',
            depth: '',
            marker_type: 'formation',
            color: '#FF0000',
            description: ''
        }
    });

    const markerType = watch('marker_type');

    // Reset form on open/close or when initial data changes
    useEffect(() => {
        if (open) {
            if (mode === 'edit' && initialData) {
                reset({
                    name: initialData.name,
                    depth: initialData.depth,
                    marker_type: initialData.marker_type,
                    color: initialData.color,
                    description: initialData.description || ''
                });
            } else {
                reset({
                    name: '',
                    depth: '',
                    marker_type: 'formation',
                    color: DEFAULT_COLORS['formation'],
                    description: ''
                });
            }
        }
    }, [open, mode, initialData, reset]);

    // Auto-set default color when type changes (only if creating new)
    useEffect(() => {
        if (mode === 'create') {
            setValue('color', DEFAULT_COLORS[markerType] || '#FFFFFF');
        }
    }, [markerType, mode, setValue]);

    const onFormSubmit = (data) => {
        onSubmit({
            ...data,
            depth: parseFloat(data.depth)
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[450px] bg-slate-950 border-slate-800">
                <DialogHeader>
                    <div className="flex items-center gap-2 text-slate-100">
                        <div className="p-2 bg-[#BFFF00]/10 rounded-lg">
                            <Bookmark className="w-5 h-5 text-[#BFFF00]" />
                        </div>
                        <div>
                            <DialogTitle>{mode === 'create' ? 'New Marker' : 'Edit Marker'}</DialogTitle>
                            <DialogDescription className="text-slate-400 text-xs">
                                {mode === 'create' ? 'Define a new depth marker for the current well.' : 'Update marker properties.'}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 mt-2">
                    <div className="grid gap-2">
                        <Label htmlFor="name" className="text-slate-300">Name <span className="text-red-500">*</span></Label>
                        <Input
                            id="name"
                            {...register("name", { required: "Name is required" })}
                            className="bg-slate-900 border-slate-700 focus-visible:ring-[#BFFF00]"
                            placeholder="e.g. Top Reservoir"
                        />
                        {errors.name && <span className="text-xs text-red-400">{errors.name.message}</span>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="depth" className="text-slate-300">Depth (MD) <span className="text-red-500">*</span></Label>
                            <Input
                                id="depth"
                                type="number"
                                step="0.1"
                                {...register("depth", { required: "Depth is required", min: 0 })}
                                className="bg-slate-900 border-slate-700 focus-visible:ring-[#BFFF00]"
                                placeholder="0.0"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label className="text-slate-300">Type</Label>
                            <Select value={markerType} onValueChange={(val) => setValue('marker_type', val)}>
                                <SelectTrigger className="bg-slate-900 border-slate-700">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                                    {MARKER_TYPES.map(t => (
                                        <SelectItem key={t.id} value={t.id}>{t.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="color" className="text-slate-300">Color</Label>
                        <div className="flex gap-2">
                            <Input
                                id="color"
                                type="color"
                                {...register("color")}
                                className="w-12 h-10 p-1 bg-slate-900 border-slate-700 cursor-pointer"
                            />
                            <Input
                                value={watch('color')}
                                readOnly
                                className="flex-1 bg-slate-900 border-slate-700 text-slate-400 font-mono"
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description" className="text-slate-300">Description</Label>
                        <Textarea
                            id="description"
                            {...register("description")}
                            className="bg-slate-900 border-slate-700 focus-visible:ring-[#BFFF00] min-h-[80px]"
                            placeholder="Optional notes..."
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="text-slate-400 hover:text-white hover:bg-slate-800">Cancel</Button>
                        <Button 
                            type="submit" 
                            className="bg-[#BFFF00] text-slate-900 hover:bg-[#a3d900] font-medium"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                            {mode === 'create' ? 'Create Marker' : 'Update Marker'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default MarkerForm;