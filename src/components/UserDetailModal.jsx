import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, User, Mail, Shield, AlertTriangle, Check, X, Calendar, LogIn, BookOpen, GraduationCap, Box } from 'lucide-react';
import { getUserStats } from '@/lib/userUtils';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

const DetailItem = ({ icon, label, value }) => (
    <div className="flex items-start py-3">
        <div className="w-1/3 text-gray-400 font-medium flex items-center">
            {React.createElement(icon, { className: "w-4 h-4 mr-2" })}
            {label}
        </div>
        <div className="w-2/3 text-white">{value}</div>
    </div>
);

const UserDetailModal = ({ user, isOpen, onClose, onEdit }) => {
    const [stats, setStats] = useState({ enrolled: 0, completed: 0 });
    const [moduleName, setModuleName] = useState('Loading...');
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        if (isOpen && user) {
            setLoading(true);
            
            // Parallel fetch: Stats + Module Name
            const fetchDetails = async () => {
                try {
                    const userStats = await getUserStats(user.id);
                    setStats(userStats);
                    
                    // Fetch assigned module name
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('modules(name)')
                        .eq('id', user.id)
                        .single();
                        
                    setModuleName(profile?.modules?.name || 'No Module Assigned');
                } catch (err) {
                    toast({ variant: 'destructive', title: 'Error', description: err.message });
                    setModuleName('Error loading module');
                } finally {
                    setLoading(false);
                }
            };

            fetchDetails();
        }
    }, [user, isOpen, toast]);

    if (!user) return null;

    // Helper for role color
    const getRoleColor = (role) => {
        switch(role) {
            case 'super_admin': return 'text-purple-400';
            case 'admin': return 'text-blue-400';
            case 'university_admin': return 'text-orange-400';
            case 'lecturer': return 'text-yellow-400';
            default: return 'text-slate-400';
        }
    };

    const roleColor = getRoleColor(user.role);
    const statusColor = user.status === 'active' ? 'text-green-400' : 'text-gray-400';

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl bg-[#1E293B] border-slate-800 text-slate-200">
                <DialogHeader>
                    <DialogTitle className="text-2xl text-white">User Details</DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Viewing full details for {user.display_name}.
                    </DialogDescription>
                </DialogHeader>
                {loading ? (
                    <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-[#BFFF00]" /></div>
                ) : (
                    <div className="mt-4 divide-y divide-slate-800">
                        <DetailItem icon={User} label="Display Name" value={user.display_name} />
                        <DetailItem icon={Mail} label="Email" value={user.email} />
                        <DetailItem icon={Shield} label="Role" value={<span className={`font-semibold capitalize ${roleColor}`}>{user.role.replace('_', ' ')}</span>} />
                        <DetailItem icon={Box} label="Assigned Module" value={moduleName} />
                        <DetailItem icon={AlertTriangle} label="Status" value={<span className={`font-semibold capitalize ${statusColor}`}>{user.status}</span>} />
                        <DetailItem icon={Calendar} label="Join Date" value={new Date(user.created_at).toLocaleString()} />
                        <DetailItem icon={LogIn} label="Last Login" value={user.last_login ? new Date(user.last_login).toLocaleString() : 'Never'} />
                        <DetailItem icon={BookOpen} label="Courses Enrolled" value={stats.enrolled} />
                        <DetailItem icon={GraduationCap} label="Courses Completed" value={stats.completed} />
                        {user.user_metadata?.university_name && (
                            <DetailItem icon={User} label="University" value={user.user_metadata.university_name} />
                        )}
                    </div>
                )}
                <div className="mt-6 flex justify-end space-x-2">
                    <Button variant="ghost" onClick={onClose} className="hover:bg-slate-800 hover:text-white">Close</Button>
                    <Button onClick={() => onEdit(user)} className="bg-[#BFFF00] text-[#0F172A] hover:bg-[#A8E600]">Edit User</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default UserDetailModal;