import React, { useState, useEffect } from 'react';
import { useSecurityStore } from '@/modules/geoscience/petrophysical-analysis/store/securityStore';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { 
    Shield, Users, Lock, Activity, Search, 
    Plus, Trash2, Edit2, Save, CheckCircle, XCircle, FileDown
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const UserManagement = () => {
    const { users, roles, addUser, updateUser, deleteUser } = useSecurityStore();
    const { toast } = useToast();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', role: 'Viewer', department: '', status: 'Active' });
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredUsers = users.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSubmit = () => {
        if (!formData.name || !formData.email) {
            toast({ title: "Error", description: "Name and Email are required", variant: "destructive" });
            return;
        }
        if (editingUser) {
            updateUser(editingUser.id, formData);
            toast({ title: "Success", description: "User updated successfully." });
        } else {
            addUser(formData);
            toast({ title: "Success", description: "User created successfully." });
        }
        setIsModalOpen(false);
        setEditingUser(null);
        setFormData({ name: '', email: '', role: 'Viewer', department: '', status: 'Active' });
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div className="relative w-72">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                    <Input placeholder="Search users..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9 bg-slate-950 border-slate-800" />
                </div>
                <Button onClick={() => { setEditingUser(null); setFormData({ name: '', email: '', role: 'Viewer', department: '', status: 'Active' }); setIsModalOpen(true); }} className="bg-emerald-600 text-white hover:bg-emerald-500">
                    <Plus className="w-4 h-4 mr-2" /> Add User
                </Button>
            </div>

            <Card className="bg-slate-900 border-slate-800">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-slate-950">
                            <TableRow className="border-slate-800">
                                <TableHead className="text-slate-400">User</TableHead>
                                <TableHead className="text-slate-400">Role</TableHead>
                                <TableHead className="text-slate-400">Department</TableHead>
                                <TableHead className="text-slate-400">Status</TableHead>
                                <TableHead className="text-right text-slate-400">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.length === 0 && <TableRow><TableCell colSpan={5} className="text-center py-8 text-slate-500">No users found.</TableCell></TableRow>}
                            {filteredUsers.map(user => (
                                <TableRow key={user.id} className="border-slate-800 hover:bg-slate-800/50">
                                    <TableCell>
                                        <div><div className="font-medium text-white">{user.name}</div><div className="text-xs text-slate-500">{user.email}</div></div>
                                    </TableCell>
                                    <TableCell><Badge variant="outline" className="text-slate-300 border-slate-600">{user.role}</Badge></TableCell>
                                    <TableCell className="text-slate-300">{user.department}</TableCell>
                                    <TableCell><Badge className={user.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'}>{user.status}</Badge></TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => { setEditingUser(user); setFormData(user); setIsModalOpen(true); }}><Edit2 className="w-4 h-4 text-slate-400" /></Button>
                                        <Button variant="ghost" size="icon" onClick={() => { setUserToDelete(user); setDeleteConfirmOpen(true); }}><Trash2 className="w-4 h-4 text-slate-400 hover:text-red-400" /></Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="bg-slate-900 border-slate-800 text-white">
                    <DialogHeader><DialogTitle>{editingUser ? 'Edit User' : 'Add User'}</DialogTitle></DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2"><Label>Name</Label><Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-slate-950 border-slate-700"/></div>
                        <div className="space-y-2"><Label>Email</Label><Input value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="bg-slate-950 border-slate-700"/></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>Role</Label>
                                <Select value={formData.role} onValueChange={v => setFormData({...formData, role: v})}>
                                    <SelectTrigger className="bg-slate-950 border-slate-700"><SelectValue /></SelectTrigger>
                                    <SelectContent className="bg-slate-900 border-slate-800">{roles.map(r => <SelectItem key={r.id} value={r.name}>{r.name}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2"><Label>Department</Label><Input value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="bg-slate-950 border-slate-700"/></div>
                        </div>
                    </div>
                    <DialogFooter><Button onClick={handleSubmit} className="bg-emerald-600 text-white">Save</Button></DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
                <AlertDialogContent className="bg-slate-900 border-slate-800 text-white">
                    <AlertDialogHeader><AlertDialogTitle>Delete User?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                    <div className="flex justify-end gap-2"><AlertDialogCancel className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700">Cancel</AlertDialogCancel><AlertDialogAction onClick={() => { deleteUser(userToDelete.id); setDeleteConfirmOpen(false); }} className="bg-red-600 text-white hover:bg-red-500">Delete</AlertDialogAction></div>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

const AccessControl = () => {
    const { roles, addRole, updateRole, deleteRole } = useSecurityStore();
    const { toast } = useToast();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '', permissions: [] });

    const handleSubmit = () => {
        if (!formData.name) return;
        if (editingRole) { updateRole(editingRole.id, formData); toast({ title: "Role Updated" }); }
        else { addRole(formData); toast({ title: "Role Created" }); }
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-end"><Button onClick={() => { setEditingRole(null); setFormData({ name: '', description: '', permissions: [] }); setIsModalOpen(true); }} className="bg-indigo-600 text-white hover:bg-indigo-500"><Plus className="w-4 h-4 mr-2"/> Create Role</Button></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {roles.length === 0 && <div className="text-slate-500 col-span-full text-center py-8">No roles defined.</div>}
                {roles.map(role => (
                    <Card key={role.id} className="bg-slate-900 border-slate-800">
                        <CardHeader className="pb-2"><div className="flex justify-between"><CardTitle className="text-white text-lg">{role.name}</CardTitle><Button variant="ghost" size="sm" onClick={() => deleteRole(role.id)}><Trash2 className="w-4 h-4 text-slate-500 hover:text-red-400"/></Button></div><CardDescription>{role.description}</CardDescription></CardHeader>
                        <CardContent><div className="flex flex-wrap gap-1">{role.permissions.map(p => <Badge key={p} variant="secondary" className="bg-slate-800 text-slate-400 text-[10px]">{p}</Badge>)}</div></CardContent>
                        <CardFooter><Button variant="outline" size="sm" className="w-full border-slate-700 text-slate-300 hover:bg-slate-800" onClick={() => { setEditingRole(role); setFormData(role); setIsModalOpen(true); }}>Edit Permissions</Button></CardFooter>
                    </Card>
                ))}
            </div>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="bg-slate-900 border-slate-800 text-white">
                    <DialogHeader><DialogTitle>{editingRole ? 'Edit Role' : 'New Role'}</DialogTitle></DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2"><Label>Role Name</Label><Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-slate-950 border-slate-700"/></div>
                        <div className="space-y-2"><Label>Description</Label><Input value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="bg-slate-950 border-slate-700"/></div>
                        <div className="space-y-2"><Label>Permissions (comma separated)</Label><Input value={formData.permissions.join(', ')} onChange={e => setFormData({...formData, permissions: e.target.value.split(',').map(s => s.trim())})} className="bg-slate-950 border-slate-700" placeholder="read, write, delete"/></div>
                    </div>
                    <DialogFooter><Button onClick={handleSubmit} className="bg-indigo-600 text-white">Save Role</Button></DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

const AuditLogs = () => {
    const { auditLogs } = useSecurityStore();
    return (
        <Card className="bg-slate-900 border-slate-800 h-full">
            <CardHeader><CardTitle className="text-white">System Audit Trail</CardTitle><CardDescription>All security events and actions.</CardDescription></CardHeader>
            <CardContent>
                <Table>
                    <TableHeader className="bg-slate-950"><TableRow className="border-slate-800"><TableHead className="text-slate-400">Time</TableHead><TableHead className="text-slate-400">User</TableHead><TableHead className="text-slate-400">Action</TableHead><TableHead className="text-slate-400">Resource</TableHead><TableHead className="text-slate-400">Details</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {auditLogs.length === 0 && <TableRow><TableCell colSpan={5} className="text-center py-8 text-slate-500">No logs recorded yet.</TableCell></TableRow>}
                        {auditLogs.map(log => (
                            <TableRow key={log.id} className="border-slate-800 hover:bg-slate-800/50">
                                <TableCell className="text-slate-400 text-xs font-mono">{log.timestamp}</TableCell>
                                <TableCell className="text-slate-300">{log.user}</TableCell>
                                <TableCell><Badge variant="outline" className="text-slate-400 border-slate-700">{log.action}</Badge></TableCell>
                                <TableCell className="text-slate-300">{log.resource}</TableCell>
                                <TableCell className="text-slate-500 text-sm">{log.details}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

const SecuritySettings = () => {
    const { settings, updateSettings } = useSecurityStore();
    const { toast } = useToast();
    const [localSettings, setLocalSettings] = useState(settings);

    const handleSave = () => {
        updateSettings(localSettings);
        toast({ title: "Settings Saved", description: "Security configuration updated." });
    };

    return (
        <Card className="bg-slate-900 border-slate-800 max-w-2xl">
            <CardHeader><CardTitle className="text-white">Security Configuration</CardTitle></CardHeader>
            <CardContent className="space-y-6">
                <div className="flex justify-between items-center"><div><Label className="text-white">Two-Factor Authentication</Label><p className="text-xs text-slate-500">Require 2FA for all users</p></div><Switch checked={localSettings.twoFactor} onCheckedChange={c => setLocalSettings({...localSettings, twoFactor: c})} /></div>
                <div className="flex justify-between items-center"><div><Label className="text-white">Password Complexity</Label><p className="text-xs text-slate-500">Enforce strong passwords</p></div><Switch checked={localSettings.passwordComplexity} onCheckedChange={c => setLocalSettings({...localSettings, passwordComplexity: c})} /></div>
                <div className="space-y-2"><Label className="text-white">Session Timeout (min)</Label><Input type="number" value={localSettings.sessionTimeout} onChange={e => setLocalSettings({...localSettings, sessionTimeout: parseInt(e.target.value)})} className="bg-slate-950 border-slate-700"/></div>
                <Button onClick={handleSave} className="w-full bg-emerald-600 text-white hover:bg-emerald-500">Save Settings</Button>
            </CardContent>
        </Card>
    );
};

const SecurityTab = () => {
    const [activeTab, setActiveTab] = useState('users');
    const { user } = useAuth();
    const { initializeStore } = useSecurityStore();

    useEffect(() => { if (user) initializeStore(user); }, [user, initializeStore]);

    return (
        <div className="h-full flex flex-col bg-[#0B101B]">
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-950 flex justify-between items-center">
                <div className="flex items-center gap-3"><div className="p-2 bg-red-500/10 rounded-lg"><Shield className="w-6 h-6 text-red-400"/></div><div><h2 className="text-lg font-semibold text-white">Security Center</h2><p className="text-xs text-slate-400">Access & Compliance</p></div></div>
            </div>
            <div className="flex-1 p-6 overflow-hidden">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                    <TabsList className="bg-slate-900 border-slate-800 w-fit mb-6">
                        <TabsTrigger value="users" className="gap-2"><Users className="w-4 h-4"/> Users</TabsTrigger>
                        <TabsTrigger value="roles" className="gap-2"><Lock className="w-4 h-4"/> Roles</TabsTrigger>
                        <TabsTrigger value="audit" className="gap-2"><Activity className="w-4 h-4"/> Audit</TabsTrigger>
                        <TabsTrigger value="settings" className="gap-2"><Shield className="w-4 h-4"/> Settings</TabsTrigger>
                    </TabsList>
                    <div className="flex-1 overflow-y-auto">
                        <TabsContent value="users"><UserManagement/></TabsContent>
                        <TabsContent value="roles"><AccessControl/></TabsContent>
                        <TabsContent value="audit" className="h-full"><AuditLogs/></TabsContent>
                        <TabsContent value="settings"><SecuritySettings/></TabsContent>
                    </div>
                </Tabs>
            </div>
        </div>
    );
};

export default SecurityTab;