import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const AddLineModal = ({ isOpen, onClose, onSave, layoutId, equipmentList }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        line_id: '',
        size: '',
        spec: '',
        fluid: 'Process',
        from_tag: '',
        to_tag: '',
        material: 'CS',
        status: 'Proposed'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Find coords for from/to tags to create initial points
        const fromEq = equipmentList.find(e => e.tag === formData.from_tag);
        const toEq = equipmentList.find(e => e.tag === formData.to_tag);

        const points = [];
        if (fromEq) points.push({ lat: fromEq.lat, lng: fromEq.lng });
        if (toEq) points.push({ lat: toEq.lat, lng: toEq.lng });

        // If no coords found (manual entry of non-existent tag), default to center
        if (points.length === 0) {
            points.push({ lat: 29.7604, lng: -95.3698 });
            points.push({ lat: 29.7606, lng: -95.3698 });
        } else if (points.length === 1) {
             points.push({ lat: points[0].lat + 0.0002, lng: points[0].lng });
        }

        const newLine = {
            id: uuidv4(),
            line_id: formData.line_id,
            from_tag: formData.from_tag,
            to_tag: formData.to_tag,
            points: points,
            properties: {
                size: formData.size,
                spec: formData.spec,
                fluid: formData.fluid,
                material: formData.material
            },
            status: formData.status,
            flow_direction: 'forward'
        };

        await onSave(newLine);
        setLoading(false);
        onClose();
        setFormData({
            line_id: '', size: '', spec: '', fluid: 'Process', from_tag: '', to_tag: '', material: 'CS', status: 'Proposed'
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-[#1a1a1a] border-slate-700 text-white sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Add New Line</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Line ID <span className="text-red-500">*</span></Label>
                            <Input 
                                required 
                                value={formData.line_id}
                                onChange={(e) => setFormData({...formData, line_id: e.target.value})}
                                placeholder="e.g. L-1001"
                                className="bg-slate-900 border-slate-700"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Status</Label>
                            <Select 
                                value={formData.status} 
                                onValueChange={(val) => setFormData({...formData, status: val})}
                            >
                                <SelectTrigger className="bg-slate-900 border-slate-700">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                                    <SelectItem value="Proposed">Proposed</SelectItem>
                                    <SelectItem value="Existing">Existing</SelectItem>
                                    <SelectItem value="Demolish">Demolish</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label>Size</Label>
                            <Input 
                                value={formData.size}
                                onChange={(e) => setFormData({...formData, size: e.target.value})}
                                placeholder='4"'
                                className="bg-slate-900 border-slate-700"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Spec</Label>
                            <Input 
                                value={formData.spec}
                                onChange={(e) => setFormData({...formData, spec: e.target.value})}
                                placeholder="150#"
                                className="bg-slate-900 border-slate-700"
                            />
                        </div>
                         <div className="space-y-2">
                            <Label>Material</Label>
                            <Input 
                                value={formData.material}
                                onChange={(e) => setFormData({...formData, material: e.target.value})}
                                placeholder="CS"
                                className="bg-slate-900 border-slate-700"
                            />
                        </div>
                    </div>

                     <div className="space-y-2">
                        <Label>Fluid Service</Label>
                        <Select 
                            value={formData.fluid} 
                            onValueChange={(val) => setFormData({...formData, fluid: val})}
                        >
                            <SelectTrigger className="bg-slate-900 border-slate-700">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-700 text-white">
                                <SelectItem value="Process">Process (Oil/Gas)</SelectItem>
                                <SelectItem value="Water">Produced Water</SelectItem>
                                <SelectItem value="Gas">Gas Injection</SelectItem>
                                <SelectItem value="Chemical">Chemical</SelectItem>
                                <SelectItem value="Utility">Utility Air/Water</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>From Tag</Label>
                            <Select 
                                value={formData.from_tag} 
                                onValueChange={(val) => setFormData({...formData, from_tag: val})}
                            >
                                <SelectTrigger className="bg-slate-900 border-slate-700">
                                    <SelectValue placeholder="Select Equipment" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-800 border-slate-700 text-white h-60">
                                    {equipmentList.map(eq => (
                                        <SelectItem key={eq.id} value={eq.tag}>{eq.tag} ({eq.type})</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>To Tag</Label>
                            <Select 
                                value={formData.to_tag} 
                                onValueChange={(val) => setFormData({...formData, to_tag: val})}
                            >
                                <SelectTrigger className="bg-slate-900 border-slate-700">
                                    <SelectValue placeholder="Select Equipment" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-800 border-slate-700 text-white h-60">
                                    {equipmentList.map(eq => (
                                        <SelectItem key={eq.id} value={eq.tag}>{eq.tag} ({eq.type})</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                        <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Add Line
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddLineModal;