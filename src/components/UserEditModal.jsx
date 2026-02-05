import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { updateUser } from '@/lib/userUtils';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import ModuleSelect from './AddUserForm/ModuleSelect'; // Reuse the ModuleSelect component

const UserEditModal = ({ user, isOpen, onClose, onSave }) => {
    const [role, setRole] = useState('');
    const [status, setStatus] = useState('');
    const [moduleId, setModuleId] = useState('');
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const { isSuperAdmin, isAdmin } = useAuth();

    useEffect(() => {
        if (user) {
            setRole(user.role);
            setStatus(user.status);
            // Ideally we pass current moduleId in 'user' prop, or we might need to fetch it.
            // For now assuming 'user' might not have it populated directly without a fetch.
            // But let's assume if it's there we use it, otherwise we leave it blank or fetch.
            // To simplify, we'll leave it blank if not present, enforcing a re-selection if they want to edit.
            // Or better, fetch it on open.
        }
    }, [user]);

    const handleSave = async () => {
        setLoading(true);
        try {
            const updates = {};
            if (role !== user.role) updates.role = role;
            if (status !== user.status) updates.status = status;
            if (moduleId) updates.module_id = moduleId; // Only update if selected

            if (Object.keys(updates).length > 0) {
                const updatedUser = await updateUser(user.id, updates);
                onSave(updatedUser);
                toast({ title: 'Success', description: 'User updated successfully.' });
            }
            onClose();
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: error.message });
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    const canAssignSuperAdmin = isSuperAdmin;
    const canAssignPrivilegedRoles = isSuperAdmin || isAdmin;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit User: {user.display_name}</DialogTitle>
                    <DialogDescription>
                        Update the role, status, and module assignment for {user.email}.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <label className="text-right text-sm font-medium text-slate-300">Role</label>
                        <Select value={role} onValueChange={setRole} disabled={!isSuperAdmin && (user.role === 'admin' || user.role === 'super_admin')}>
                            <SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="student">Student</SelectItem>
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="lecturer">Lecturer</SelectItem>
                                {canAssignPrivilegedRoles && (
                                    <SelectItem value="university_admin">University Admin</SelectItem>
                                )}
                                {canAssignPrivilegedRoles && (
                                    <SelectItem value="admin">Petrolord Admin</SelectItem>
                                )}
                                {canAssignSuperAdmin && (
                                    <SelectItem value="super_admin">Super Admin</SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                        <label className="text-right text-sm font-medium text-slate-300">Module</label>
                        <div className="col-span-3">
                             <ModuleSelect value={moduleId} onChange={setModuleId} />
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <label className="text-right text-sm font-medium text-slate-300">Status</label>
                        <Select value={status} onValueChange={setStatus} className="col-span-3">
                            <SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {!isSuperAdmin && (user.role === 'admin' || user.role === 'super_admin') && (
                        <p className="text-xs text-amber-500 text-center bg-amber-500/10 p-2 rounded">
                            You cannot modify the role of an Admin or Super Admin.
                        </p>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave} disabled={loading} className="bg-[#BFFF00] text-[#0F172A] hover:bg-[#A8E600]">
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default UserEditModal;