import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const WorkflowCreationModal = ({ isOpen, onClose, onCreate }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('Data Processing');

    const handleCreate = () => {
        const newWorkflow = {
            name,
            description,
            type,
            steps: [],
            updatedAt: new Date().toISOString()
        };
        onCreate(newWorkflow);
        onClose();
        // Reset
        setName('');
        setDescription('');
        setType('Data Processing');
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-slate-900 border-slate-800 text-white sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Workflow</DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Initialize a new workflow. You can add steps in the builder later.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right text-slate-300">Name</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3 bg-slate-950 border-slate-700" placeholder="e.g. Log Calibration" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="desc" className="text-right text-slate-300">Description</Label>
                        <Input id="desc" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3 bg-slate-950 border-slate-700" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-right text-slate-300">Type</Label>
                        <Select value={type} onValueChange={setType}>
                            <SelectTrigger className="col-span-3 bg-slate-950 border-slate-700">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Data Processing">Data Processing</SelectItem>
                                <SelectItem value="Analysis">Analysis</SelectItem>
                                <SelectItem value="Reporting">Reporting</SelectItem>
                                <SelectItem value="Automation">Automation</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} className="border-slate-700 text-slate-300">Cancel</Button>
                    <Button onClick={handleCreate} className="bg-emerald-600 hover:bg-emerald-500 text-white">Create & Open Builder</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default WorkflowCreationModal;