import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, Shield, X, Users } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from '@/components/ui/badge';

const CollaboratorManager = ({ layoutId }) => {
    const [collaborators, setCollaborators] = useState([]);
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('Viewer');
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        if (layoutId) fetchCollaborators();
    }, [layoutId]);

    const fetchCollaborators = async () => {
        const { data, error } = await supabase
            .from('facility_layout_collaborators')
            .select('*, profiles(email, display_name)')
            .eq('layout_id', layoutId);
        
        if (!error) setCollaborators(data || []);
    };

    const handleAddCollaborator = async () => {
        if (!email) return;
        setLoading(true);

        // 1. Find user by email (in a real app, this might be an RPC call to avoid exposing all users)
        // For this demo, assuming we can find user profile by email if public or via specific logic
        const { data: profiles, error: profileError } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', email)
            .single();

        if (profileError || !profiles) {
            toast({ title: 'User not found', description: 'Could not find a user with that email.', variant: 'destructive' });
            setLoading(false);
            return;
        }

        // 2. Add collaborator
        const { error: addError } = await supabase
            .from('facility_layout_collaborators')
            .insert({
                layout_id: layoutId,
                user_id: profiles.id,
                role: role
            });

        if (addError) {
             toast({ title: 'Error adding user', description: addError.message, variant: 'destructive' });
        } else {
             toast({ title: 'Success', description: 'Collaborator added.' });
             setEmail('');
             fetchCollaborators();
             
             // Audit
             const { data: { user } } = await supabase.auth.getUser();
             await supabase.from('facility_layout_audit_log').insert({
                 layout_id: layoutId,
                 action: 'ADD_COLLABORATOR',
                 user_id: user.id,
                 details: { target_email: email, role }
             });
        }
        setLoading(false);
    };

    const removeCollaborator = async (id) => {
        await supabase.from('facility_layout_collaborators').delete().eq('id', id);
        fetchCollaborators();
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white" title="Collaborators">
                    <Users className="w-4 h-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-[#1a1a1a] border-slate-700 text-white p-0" align="end">
                <div className="p-3 border-b border-slate-700 font-semibold flex justify-between items-center">
                    <span>Collaborators</span>
                    <Badge variant="secondary" className="text-xs">{collaborators.length}</Badge>
                </div>
                
                <div className="p-3 space-y-3 bg-slate-900/50">
                    <div className="flex gap-2">
                        <Input 
                            placeholder="User email..." 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="h-8 bg-slate-800 border-slate-700 text-xs"
                        />
                        <Button size="icon" className="h-8 w-8 bg-blue-600 hover:bg-blue-700" onClick={handleAddCollaborator} disabled={loading}>
                            <UserPlus className="w-4 h-4" />
                        </Button>
                    </div>
                    <Select value={role} onValueChange={setRole}>
                        <SelectTrigger className="h-7 text-xs bg-slate-800 border-slate-700">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700 text-white">
                            <SelectItem value="Viewer">Viewer (Read-only)</SelectItem>
                            <SelectItem value="Editor">Editor (Can edit)</SelectItem>
                            <SelectItem value="Approver">Approver (Can change status)</SelectItem>
                            <SelectItem value="Owner">Owner (Full access)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <ScrollArea className="h-64">
                    <div className="p-2 space-y-1">
                        {collaborators.map(c => (
                            <div key={c.id} className="flex items-center justify-between p-2 hover:bg-slate-800 rounded group">
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-6 w-6">
                                        <AvatarFallback className="text-[9px] bg-blue-900 text-blue-200">
                                            {c.profiles?.display_name?.substring(0,2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-medium">{c.profiles?.display_name}</span>
                                        <span className="text-[10px] text-slate-500 flex items-center gap-1">
                                            <Shield className="w-3 h-3" /> {c.role}
                                        </span>
                                    </div>
                                </div>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-6 w-6 opacity-0 group-hover:opacity-100 text-red-400 hover:bg-red-900/30"
                                    onClick={() => removeCollaborator(c.id)}
                                >
                                    <X className="w-3 h-3" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
};

export default CollaboratorManager;