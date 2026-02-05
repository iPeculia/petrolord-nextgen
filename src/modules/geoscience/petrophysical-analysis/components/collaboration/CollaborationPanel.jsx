import React, { useState, useEffect } from 'react';
import { useCollaborationStore } from '@/store/collaborationStore';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
    Users, Folder, FileText, MessageSquare, Plus, Search, Trash2, Send, 
    Briefcase, Bell, Activity, Clock
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const TeamMembers = () => {
    const { members, addMember, deleteMember } = useCollaborationStore();
    const { toast } = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', role: 'Geologist', department: 'Geoscience', status: 'offline' });

    const handleAdd = () => {
        if(!form.name) return;
        addMember(form);
        setIsOpen(false);
        setForm({ name: '', email: '', role: 'Geologist', department: 'Geoscience', status: 'offline' });
        toast({ title: "Member Added" });
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-end"><Button onClick={() => setIsOpen(true)} className="bg-emerald-600 text-white"><Plus className="w-4 h-4 mr-2"/> Add Member</Button></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {members.length === 0 && <div className="col-span-full text-center py-12 text-slate-500">No team members found.</div>}
                {members.map(m => (
                    <Card key={m.id} className="bg-slate-900 border-slate-800">
                        <CardContent className="p-4 flex items-center gap-4">
                            <Avatar className="h-10 w-10 border border-slate-700"><AvatarFallback className="text-slate-300 bg-slate-800">{m.avatar}</AvatarFallback></Avatar>
                            <div className="flex-1">
                                <div className="font-semibold text-white">{m.name}</div>
                                <div className="text-xs text-slate-400">{m.role}</div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => deleteMember(m.id)}><Trash2 className="w-4 h-4 text-slate-500 hover:text-red-400"/></Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="bg-slate-900 border-slate-800 text-white">
                    <DialogHeader><DialogTitle>Add Member</DialogTitle></DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2"><Label>Name</Label><Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="bg-slate-950 border-slate-700"/></div>
                        <div className="space-y-2"><Label>Email</Label><Input value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="bg-slate-950 border-slate-700"/></div>
                        <div className="space-y-2"><Label>Role</Label><Input value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="bg-slate-950 border-slate-700"/></div>
                    </div>
                    <DialogFooter><Button onClick={handleAdd} className="bg-emerald-600 text-white">Add</Button></DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

const ProjectsList = () => {
    const { projects, addProject, deleteProject } = useCollaborationStore();
    const { toast } = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const [form, setForm] = useState({ name: '', description: '', status: 'planning' });

    const handleAdd = () => {
        if(!form.name) return;
        addProject(form);
        setIsOpen(false);
        toast({ title: "Project Created" });
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-end"><Button onClick={() => setIsOpen(true)} className="bg-indigo-600 text-white"><Plus className="w-4 h-4 mr-2"/> New Project</Button></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {projects.length === 0 && <div className="col-span-full text-center py-12 text-slate-500">No projects started.</div>}
                {projects.map(p => (
                    <Card key={p.id} className="bg-slate-900 border-slate-800">
                        <CardHeader className="pb-2"><div className="flex justify-between"><Badge variant="outline" className="text-slate-400 border-slate-700">{p.status}</Badge><Button variant="ghost" size="icon" onClick={() => deleteProject(p.id)}><Trash2 className="w-4 h-4 text-slate-500 hover:text-red-400"/></Button></div><CardTitle className="text-white mt-2">{p.name}</CardTitle><CardDescription>{p.description}</CardDescription></CardHeader>
                    </Card>
                ))}
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="bg-slate-900 border-slate-800 text-white">
                    <DialogHeader><DialogTitle>New Project</DialogTitle></DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2"><Label>Name</Label><Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="bg-slate-950 border-slate-700"/></div>
                        <div className="space-y-2"><Label>Description</Label><Input value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="bg-slate-950 border-slate-700"/></div>
                    </div>
                    <DialogFooter><Button onClick={handleAdd} className="bg-indigo-600 text-white">Create</Button></DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

const SharedResources = () => {
    const { resources, addResource, deleteResource } = useCollaborationStore();
    const [isOpen, setIsOpen] = useState(false);
    const [form, setForm] = useState({ name: '', type: 'file' });

    const handleUpload = () => {
        if(!form.name) return;
        addResource(form);
        setIsOpen(false);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-end"><Button onClick={() => setIsOpen(true)} className="bg-blue-600 text-white"><Plus className="w-4 h-4 mr-2"/> Share Resource</Button></div>
            <Card className="bg-slate-900 border-slate-800">
                <CardContent className="p-0">
                    <table className="w-full text-sm text-left text-slate-400">
                        <thead className="bg-slate-950 text-slate-300 uppercase text-xs"><tr><th className="p-4">Name</th><th className="p-4">Type</th><th className="p-4">Date</th><th className="p-4 text-right">Action</th></tr></thead>
                        <tbody>
                            {resources.length === 0 && <tr><td colSpan={4} className="p-8 text-center">No resources shared.</td></tr>}
                            {resources.map(r => (
                                <tr key={r.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                                    <td className="p-4 font-medium text-white flex items-center gap-2"><FileText className="w-4 h-4"/> {r.name}</td>
                                    <td className="p-4">{r.type}</td>
                                    <td className="p-4">{r.date}</td>
                                    <td className="p-4 text-right"><Button variant="ghost" size="icon" onClick={() => deleteResource(r.id)}><Trash2 className="w-4 h-4 text-slate-500 hover:text-red-400"/></Button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="bg-slate-900 border-slate-800 text-white">
                    <DialogHeader><DialogTitle>Share Resource</DialogTitle></DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2"><Label>Name</Label><Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="bg-slate-950 border-slate-700"/></div>
                        <div className="space-y-2"><Label>Type</Label><Select value={form.type} onValueChange={v => setForm({...form, type: v})}><SelectTrigger className="bg-slate-950 border-slate-700"><SelectValue/></SelectTrigger><SelectContent className="bg-slate-900 border-slate-800"><SelectItem value="file">File</SelectItem><SelectItem value="folder">Folder</SelectItem></SelectContent></Select></div>
                    </div>
                    <DialogFooter><Button onClick={handleUpload} className="bg-blue-600 text-white">Share</Button></DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

const Messages = () => {
    const { messages, sendMessage } = useCollaborationStore();
    const [input, setInput] = useState('');
    const handleSend = () => { if(input.trim()) { sendMessage(input); setInput(''); }};

    return (
        <Card className="bg-slate-900 border-slate-800 h-[600px] flex flex-col">
            <CardHeader className="border-b border-slate-800"><CardTitle className="text-white">Team Chat</CardTitle></CardHeader>
            <CardContent className="flex-1 p-0 relative">
                <ScrollArea className="h-[450px] p-4">
                    <div className="space-y-4">
                        {messages.length === 0 && <div className="text-center text-slate-500 mt-10">No messages yet.</div>}
                        {messages.map(m => (
                            <div key={m.id} className={`flex flex-col ${m.sender === 'Me' ? 'items-end' : 'items-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-lg ${m.sender === 'Me' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-200'}`}>
                                    <div className="text-xs opacity-70 mb-1 flex justify-between gap-2"><span>{m.sender}</span><span>{new Date(m.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span></div>
                                    <div>{m.content}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-slate-900 border-t border-slate-800 flex gap-2">
                    <Input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="Type a message..." className="bg-slate-950 border-slate-700 text-white"/>
                    <Button onClick={handleSend} className="bg-indigo-600"><Send className="w-4 h-4"/></Button>
                </div>
            </CardContent>
        </Card>
    );
};

const ActivityFeed = () => {
    const { activity } = useCollaborationStore();
    return (
        <Card className="bg-slate-900 border-slate-800 h-full">
            <CardHeader><CardTitle className="text-white">Recent Activity</CardTitle></CardHeader>
            <CardContent>
                <div className="space-y-6 border-l border-slate-800 ml-2 pl-6 relative">
                    {activity.length === 0 && <div className="text-slate-500 italic">No recent activity.</div>}
                    {activity.map(a => (
                        <div key={a.id} className="relative">
                            <div className="absolute -left-[29px] top-0 w-2.5 h-2.5 rounded-full bg-indigo-500 border-2 border-slate-950"></div>
                            <div className="text-sm text-white"><span className="font-semibold">{a.user}</span> {a.details} <span className="text-indigo-400">{a.resource}</span></div>
                            <div className="text-xs text-slate-500 mt-1">{new Date(a.timestamp).toLocaleString()}</div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

const CollaborationPanel = () => {
    const [activeTab, setActiveTab] = useState('members');
    const { user } = useAuth();
    const { initializeStore } = useCollaborationStore();

    useEffect(() => { if(user) initializeStore(user); }, [user, initializeStore]);

    return (
        <div className="h-full flex flex-col bg-[#0B101B]">
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-950 flex justify-between items-center">
                <div className="flex items-center gap-3"><div className="p-2 bg-blue-500/10 rounded-lg"><Briefcase className="w-6 h-6 text-blue-400"/></div><div><h2 className="text-lg font-semibold text-white">Team Collaboration</h2><p className="text-xs text-slate-400">Projects & Communication</p></div></div>
            </div>
            <div className="flex-1 p-6 overflow-hidden">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                    <TabsList className="bg-slate-900 border-slate-800 w-fit mb-6">
                        <TabsTrigger value="members" className="gap-2"><Users className="w-4 h-4"/> Members</TabsTrigger>
                        <TabsTrigger value="projects" className="gap-2"><Folder className="w-4 h-4"/> Projects</TabsTrigger>
                        <TabsTrigger value="resources" className="gap-2"><FileText className="w-4 h-4"/> Shared</TabsTrigger>
                        <TabsTrigger value="messages" className="gap-2"><MessageSquare className="w-4 h-4"/> Chat</TabsTrigger>
                        <TabsTrigger value="activity" className="gap-2"><Activity className="w-4 h-4"/> Activity</TabsTrigger>
                    </TabsList>
                    <div className="flex-1 overflow-y-auto">
                        <TabsContent value="members"><TeamMembers/></TabsContent>
                        <TabsContent value="projects"><ProjectsList/></TabsContent>
                        <TabsContent value="resources"><SharedResources/></TabsContent>
                        <TabsContent value="messages"><Messages/></TabsContent>
                        <TabsContent value="activity"><ActivityFeed/></TabsContent>
                    </div>
                </Tabs>
            </div>
        </div>
    );
};

export default CollaborationPanel;