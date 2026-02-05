import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useAuditLog } from '@/hooks/useAuditLog';
import { User, Lock, Save, Download, Trash2, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
    const { user, profile, refreshProfile } = useAuth();
    const { toast } = useToast();
    const { logAction } = useAuditLog();
    
    const [displayName, setDisplayName] = useState(profile?.display_name || '');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loadingName, setLoadingName] = useState(false);
    const [loadingPassword, setLoadingPassword] = useState(false);

    const handleNameUpdate = async (e) => {
        e.preventDefault();
        setLoadingName(true);
        const oldProfileData = { display_name: profile?.display_name };
        const { data, error } = await supabase
            .from('profiles')
            .update({ display_name: displayName })
            .eq('id', user.id)
            .select()
            .single();

        if (error) {
            toast({ variant: 'destructive', title: 'Error updating profile', description: error.message });
        } else {
            toast({ title: 'Profile Updated', description: 'Your display name has been changed.' });
            await refreshProfile();
        }
        setLoadingName(false);
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast({ variant: 'destructive', title: 'Passwords do not match' });
            return;
        }
        if (newPassword.length < 8) {
            toast({ variant: 'destructive', title: 'Password too weak', description: 'Must be at least 8 characters.' });
            return;
        }

        setLoadingPassword(true);
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) {
            toast({ variant: 'destructive', title: 'Error updating password', description: error.message });
        } else {
            toast({ title: 'Password Updated', description: 'Your password has been changed successfully.' });
            setNewPassword('');
            setConfirmPassword('');
        }
        setLoadingPassword(false);
    };

    const unimplementedFeatureToast = () => {
        toast({ title: '🚧 This feature isn\'t implemented yet—but don\'t worry! You can request it in your next prompt! 🚀' });
    }

    return (
        <>
            <Helmet>
                <title>My Profile - Petrolord NextGen Suite</title>
            </Helmet>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-7xl mx-auto p-6 md:p-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">My Profile</h1>
                        <p className="text-xl text-gray-400">Manage your account details and preferences.</p>
                    </div>
                    <Link to="/dashboard">
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 h-12 px-6 text-lg shadow-lg shadow-emerald-900/20">
                            <LayoutDashboard className="w-5 h-5" />
                            View My Dashboard
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Column 1: Profile and Password */}
                    <div className="space-y-8">
                        {/* Update Display Name */}
                        <div className="bg-[#1E293B] rounded-lg p-8 border border-gray-800 shadow-xl">
                            <h2 className="text-2xl font-bold text-white mb-6">Account Information</h2>
                            <form onSubmit={handleNameUpdate} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Email Address (read-only)</label>
                                    <p className="w-full p-3 bg-[#0F172A] border border-gray-700 rounded-lg text-gray-400">{user?.email}</p>
                                </div>
                                <div>
                                    <label htmlFor="displayName" className="block text-sm font-medium text-gray-300 mb-2">Display Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                                        <input id="displayName" type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-[#0F172A] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#BFFF00] transition-colors"/>
                                    </div>
                                </div>
                                <Button type="submit" disabled={loadingName || !displayName} className="bg-[#BFFF00] text-[#0F172A] hover:bg-[#A8E600] font-semibold w-full">
                                    <Save className="w-4 h-4 mr-2" />
                                    {loadingName ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </form>
                        </div>

                        {/* Change Password */}
                        <div className="bg-[#1E293B] rounded-lg p-8 border border-gray-800 shadow-xl">
                            <h2 className="text-2xl font-bold text-white mb-6">Change Password</h2>
                            <form onSubmit={handlePasswordUpdate} className="space-y-6">
                                <div>
                                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                                    <div className="relative"><Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" /><input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-[#0F172A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#BFFF00] transition-colors"/></div>
                                </div>
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
                                    <div className="relative"><Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" /><input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-[#0F172A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#BFFF00] transition-colors"/></div>
                                </div>
                                <Button type="submit" disabled={loadingPassword || !newPassword} className="bg-[#BFFF00] text-[#0F172A] hover:bg-[#A8E600] font-semibold w-full">
                                    <Save className="w-4 h-4 mr-2" />
                                    {loadingPassword ? 'Saving...' : 'Update Password'}
                                </Button>
                            </form>
                        </div>
                    </div>
                    {/* Column 2: Account Actions */}
                    <div className="space-y-8">
                       <div className="bg-[#1E293B] rounded-lg p-8 border border-gray-800 shadow-xl">
                            <h2 className="text-2xl font-bold text-white mb-6">Account Details</h2>
                            <div className="space-y-4 text-gray-400">
                                <p><strong>Account created:</strong> {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</p>
                                <p><strong>Last sign in:</strong> {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'N/A'}</p>
                                <p><strong>User ID:</strong> <span className="font-mono text-xs">{user?.id}</span></p>
                            </div>
                        </div>
                        <div className="bg-[#1E293B] rounded-lg p-8 border border-gray-800 shadow-xl">
                             <h2 className="text-2xl font-bold text-white mb-6">Data & Privacy</h2>
                             <div className="space-y-4">
                                <Button onClick={unimplementedFeatureToast} variant="outline" className="w-full justify-start text-left border-gray-700 hover:border-[#BFFF00] hover:text-[#BFFF00] transition-colors">
                                    <Download className="w-4 h-4 mr-3"/> Download Personal Data
                                </Button>
                                <Button onClick={unimplementedFeatureToast} variant="destructive" className="w-full justify-start text-left bg-red-900/20 text-red-400 hover:bg-red-900/40 border border-red-900/50">
                                    <Trash2 className="w-4 h-4 mr-3"/> Delete Account
                                </Button>
                             </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </>
    );
};

export default ProfilePage;