import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, User, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

const AddCommentModal = ({ isOpen, onClose, onSave, initialLocation, layoutId }) => {
    const [content, setContent] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [assignedTo, setAssignedTo] = useState('unassigned');
    const [loading, setLoading] = useState(false);
    const [profiles, setProfiles] = useState([]);
    const { toast } = useToast();

    useEffect(() => {
        if (isOpen) {
            setContent('');
            setPriority('Medium');
            setAssignedTo('unassigned');
            fetchProfiles();
        }
    }, [isOpen]);

    const fetchProfiles = async () => {
        // Fetch users who are collaborators or project members. 
        // For simplicity, fetching generic profiles, but in real app should be scoped to project.
        const { data } = await supabase.from('profiles').select('id, display_name, email').limit(20);
        if (data) setProfiles(data);
    };

    const handleSave = async () => {
        if (!content.trim()) {
            toast({ title: "Error", description: "Comment text is required", variant: "destructive" });
            return;
        }

        setLoading(true);
        try {
            await onSave({
                content,
                priority,
                assigned_to: assignedTo === 'unassigned' ? null : assignedTo,
                lat: initialLocation?.lat,
                lng: initialLocation?.lng
            });
            onClose();
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Failed to save comment", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-[#1a1a1a] border-slate-700 text-slate-100 sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-blue-400" />
                        Add New Comment
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Comment</Label>
                        <Textarea 
                            placeholder="Describe the issue or observation..." 
                            className="bg-slate-900 border-slate-700 min-h-[100px]"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Priority</Label>
                            <Select value={priority} onValueChange={setPriority}>
                                <SelectTrigger className="bg-slate-900 border-slate-700">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                                    <SelectItem value="Low">Low</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="High">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div className="space-y-2">
                            <Label>Assign To</Label>
                            <Select value={assignedTo} onValueChange={setAssignedTo}>
                                <SelectTrigger className="bg-slate-900 border-slate-700">
                                    <SelectValue placeholder="Unassigned" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                                    <SelectItem value="unassigned">Unassigned</SelectItem>
                                    {profiles.map(p => (
                                        <SelectItem key={p.id} value={p.id}>{p.display_name || p.email}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 p-3 rounded bg-slate-900/50 border border-slate-800 text-sm">
                        <MapPin className={`w-4 h-4 ${initialLocation ? 'text-green-500' : 'text-slate-500'}`} />
                        {initialLocation ? (
                            <span className="text-green-400">Location pinned: {initialLocation.lat.toFixed(6)}, {initialLocation.lng.toFixed(6)}</span>
                        ) : (
                            <span className="text-slate-400">No location selected (General Comment)</span>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={onClose} className="hover:bg-slate-800 text-slate-400">Cancel</Button>
                    <Button onClick={handleSave} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Save Comment
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddCommentModal;