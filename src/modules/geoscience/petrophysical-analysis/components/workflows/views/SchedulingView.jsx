import React, { useState, useEffect } from 'react';
import { useWorkflowStore } from '@/store/workflowStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Calendar, Clock, Trash2, Edit2, Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const SchedulingView = () => {
    const { scheduledWorkflows, workflows, addSchedule, updateSchedule, toggleSchedule, deleteSchedule } = useWorkflowStore();
    const { toast } = useToast();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState(null);

    // Form State
    const [workflowId, setWorkflowId] = useState('');
    const [frequency, setFrequency] = useState('Daily');
    const [time, setTime] = useState('00:00');

    // Reset form when modal opens/closes or when editing
    useEffect(() => {
        if (!isModalOpen) {
            setEditingSchedule(null);
            setWorkflowId('');
            setFrequency('Daily');
            setTime('00:00');
        }
    }, [isModalOpen]);

    const handleOpenCreate = () => {
        setIsModalOpen(true);
    };

    const handleOpenEdit = (schedule) => {
        setEditingSchedule(schedule);
        setWorkflowId(schedule.workflowId);
        setFrequency(schedule.frequency);
        // Parse time from nextRun if available, otherwise default
        if (schedule.nextRun) {
            const date = new Date(schedule.nextRun);
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            setTime(`${hours}:${minutes}`);
        }
        setIsModalOpen(true);
    };

    const handleSave = () => {
        if (!workflowId) {
            toast({ title: "Validation Error", description: "Please select a workflow.", variant: "destructive" });
            return;
        }
        if (!time) {
            toast({ title: "Validation Error", description: "Please select a time.", variant: "destructive" });
            return;
        }

        const selectedWorkflow = workflows.find(w => w.id === workflowId);
        if (!selectedWorkflow) return;

        // Calculate next run
        const now = new Date();
        const [hours, minutes] = time.split(':').map(Number);
        let nextRunDate = new Date();
        nextRunDate.setHours(hours, minutes, 0, 0);

        // If the time has passed for today, set for tomorrow (basic logic)
        if (nextRunDate <= now) {
            nextRunDate.setDate(nextRunDate.getDate() + 1);
        }

        const scheduleData = {
            workflowId,
            workflowName: selectedWorkflow.name,
            frequency,
            nextRun: nextRunDate.toISOString(),
            status: editingSchedule ? editingSchedule.status : 'active' // Preserve status on edit
        };

        if (editingSchedule) {
            updateSchedule(editingSchedule.id, scheduleData);
            toast({ title: "Schedule Updated", description: `${selectedWorkflow.name} schedule updated.` });
        } else {
            addSchedule({ ...scheduleData, lastRun: null });
            toast({ title: "Schedule Created", description: `${selectedWorkflow.name} will run ${frequency}.` });
        }
        setIsModalOpen(false);
    };

    const handleToggle = (id, currentStatus) => {
        toggleSchedule(id);
        toast({ 
            title: currentStatus === 'active' ? "Schedule Paused" : "Schedule Resumed", 
            description: `Workflow schedule has been updated.` 
        });
    };

    return (
        <div className="grid grid-cols-1 gap-4 pb-20">
            <div className="flex justify-end mb-2">
                <Button onClick={handleOpenCreate} className="bg-emerald-600 hover:bg-emerald-500 text-white">
                    <Plus className="w-4 h-4 mr-2" /> Create Schedule
                </Button>
            </div>

            {scheduledWorkflows.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-xl bg-slate-900/30">
                    <Clock className="w-12 h-12 mx-auto text-slate-600 mb-4" />
                    <h3 className="text-lg font-medium text-slate-300">No Scheduled Workflows</h3>
                    <p className="text-slate-500">Create a schedule to run workflows automatically.</p>
                </div>
            ) : (
                scheduledWorkflows.map(schedule => (
                    <Card key={schedule.id} className="bg-slate-900 border-slate-800">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-purple-500/10 rounded-lg">
                                    <Clock className="w-6 h-6 text-purple-400" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="font-semibold text-white text-lg">{schedule.workflowName}</h3>
                                        <Badge variant="outline" className="bg-slate-950 border-slate-700 text-slate-400">
                                            {schedule.frequency}
                                        </Badge>
                                        <Badge className={schedule.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}>
                                            {schedule.status}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-6 text-sm text-slate-400 mt-2">
                                        <span>Next Run: <span className="text-white font-mono ml-1">{new Date(schedule.nextRun).toLocaleString()}</span></span>
                                        {schedule.lastRun && <span>Last Run: <span className="text-slate-500 font-mono ml-1">{new Date(schedule.lastRun).toLocaleString()}</span></span>}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-slate-500">{schedule.status === 'active' ? 'Enabled' : 'Paused'}</span>
                                    <Switch 
                                        checked={schedule.status === 'active'}
                                        onCheckedChange={() => handleToggle(schedule.id, schedule.status)}
                                    />
                                </div>
                                <div className="h-8 w-px bg-slate-800"></div>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(schedule)} className="text-slate-400 hover:text-white">
                                        <Edit2 className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-400 hover:bg-red-950/30" onClick={() => deleteSchedule(schedule.id)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))
            )}

            {/* Schedule Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="bg-slate-900 border-slate-800 text-white">
                    <DialogHeader>
                        <DialogTitle>{editingSchedule ? 'Edit Schedule' : 'Create Schedule'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Workflow</Label>
                            <Select value={workflowId} onValueChange={setWorkflowId} disabled={!!editingSchedule}>
                                <SelectTrigger className="bg-slate-950 border-slate-700">
                                    <SelectValue placeholder="Select workflow" />
                                </SelectTrigger>
                                <SelectContent>
                                    {workflows.map(w => (
                                        <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Frequency</Label>
                                <Select value={frequency} onValueChange={setFrequency}>
                                    <SelectTrigger className="bg-slate-950 border-slate-700">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Hourly">Hourly</SelectItem>
                                        <SelectItem value="Daily">Daily</SelectItem>
                                        <SelectItem value="Weekly">Weekly</SelectItem>
                                        <SelectItem value="Monthly">Monthly</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Time (Local)</Label>
                                <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="bg-slate-950 border-slate-700" />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsModalOpen(false)} className="border-slate-700 text-slate-300">Cancel</Button>
                        <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-500 text-white">Save Schedule</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default SchedulingView;