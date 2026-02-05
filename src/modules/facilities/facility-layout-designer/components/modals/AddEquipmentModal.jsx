import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, AlertCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";

const EQUIPMENT_TYPES = [
    'Separator (Horizontal)', 'Separator (Vertical)', 'Storage Tank', 'Scrubber', 
    'Manifold', 'Wellhead', 'Centrifugal Pump', 'Reciprocating Compressor', 
    'Gas Turbine', 'Diesel Generator', 'Shell & Tube Exchanger', 'Air Cooler', 
    'Heater Treater', 'Flare Stack', 'PSV'
];

const AddEquipmentModal = ({ isOpen, onClose, onSave, layoutId }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        tag: '',
        type: 'Separator (Horizontal)',
        service: '',
        capacity: '',
        pressure_rating: '',
        lat: 29.7604,
        lng: -95.3698,
        notes: ''
    });

    const resetForm = () => {
         setFormData({
            tag: '',
            type: 'Separator (Horizontal)',
            service: '',
            capacity: '',
            pressure_rating: '',
            lat: 29.7604,
            lng: -95.3698,
            notes: ''
        });
        setError(null);
    };

    const handleClose = () => {
        if (!loading) {
            resetForm();
            onClose();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        // Client-side Validation
        if (!formData.tag.trim()) {
            setError("Tag Number is required.");
            setLoading(false);
            return;
        }
        
        if (!layoutId) {
             setError("Internal System Error: Missing Layout ID. Please refresh the page.");
             setLoading(false);
             return;
        }

        const latVal = parseFloat(formData.lat);
        const lngVal = parseFloat(formData.lng);

        if (isNaN(latVal) || isNaN(lngVal)) {
            setError("Invalid Latitude or Longitude values.");
            setLoading(false);
            return;
        }

        // Construct object for persistence
        // Optional fields like service, capacity etc are placed in properties by persistence layer
        const newItem = {
            id: uuidv4(),
            tag: formData.tag.trim(),
            type: formData.type,
            lat: latVal,
            lng: lngVal,
            rotation: 0,
            scale_x: 1,
            scale_y: 1,
            category: 'equipment',
            properties: {
                service: formData.service || '',
                capacity: formData.capacity || '',
                pressure_rating: formData.pressure_rating || '',
                notes: formData.notes || '',
                status: 'Proposed'
            }
        };

        try {
            console.log("Modal submitting item:", newItem);
            const result = await onSave(newItem);
            
            // Check if result is truthy (meaning save succeeded and returned the object)
            if (result) {
                // Success: Close modal and reset
                setLoading(false);
                handleClose();
                // We rely on the parent or persistence layer for the success toast to avoid duplication,
                // but we ensure the modal closes cleanly.
            } else {
                // Failure: Keep modal open, show error
                setLoading(false);
                setError("Failed to save equipment. Please check the console for details.");
            }
        } catch (err) {
            console.error("Modal Submit Error:", err);
            setLoading(false);
            setError("An unexpected error occurred during save.");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-[#1a1a1a] border-slate-700 text-white sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add New Equipment</DialogTitle>
                </DialogHeader>
                
                {error && (
                    <Alert variant="destructive" className="bg-red-900/20 border-red-900/50 text-red-200">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Tag Number <span className="text-red-500">*</span></Label>
                            <Input 
                                required 
                                value={formData.tag}
                                onChange={(e) => setFormData({...formData, tag: e.target.value})}
                                placeholder="e.g. SEP-101"
                                className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Equipment Type</Label>
                            <Select 
                                value={formData.type} 
                                onValueChange={(val) => setFormData({...formData, type: val})}
                            >
                                <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-800 border-slate-700 text-white h-60">
                                    {EQUIPMENT_TYPES.map(t => (
                                        <SelectItem key={t} value={t}>{t}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Service Description</Label>
                        <Input 
                            value={formData.service}
                            onChange={(e) => setFormData({...formData, service: e.target.value})}
                            placeholder="e.g. 1st Stage Separation"
                            className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Capacity</Label>
                            <Input 
                                value={formData.capacity}
                                onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                                placeholder="e.g. 5000 bpd"
                                className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Pressure Rating</Label>
                            <Input 
                                value={formData.pressure_rating}
                                onChange={(e) => setFormData({...formData, pressure_rating: e.target.value})}
                                placeholder="e.g. 150#"
                                className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Latitude</Label>
                            <Input 
                                type="number" step="any"
                                value={formData.lat}
                                onChange={(e) => setFormData({...formData, lat: e.target.value})}
                                className="bg-slate-900 border-slate-700 text-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Longitude</Label>
                            <Input 
                                type="number" step="any"
                                value={formData.lng}
                                onChange={(e) => setFormData({...formData, lng: e.target.value})}
                                className="bg-slate-900 border-slate-700 text-white"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Notes</Label>
                        <Textarea 
                            value={formData.notes}
                            onChange={(e) => setFormData({...formData, notes: e.target.value})}
                            className="bg-slate-900 border-slate-700 min-h-[80px] text-white"
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={handleClose} disabled={loading}>Cancel</Button>
                        <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {loading ? 'Saving...' : 'Add Equipment'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddEquipmentModal;