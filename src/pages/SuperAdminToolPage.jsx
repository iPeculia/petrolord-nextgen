import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { ShieldCheck, Plus, Mail, UserX, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const SuperAdminToolPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [deactivateLoading, setDeactivateLoading] = useState(null);
  const [superAdmins, setSuperAdmins] = useState([]);
  const [selectedAdminForDeactivation, setSelectedAdminForDeactivation] = useState(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Strictly use production URL or VITE_APP_URL to ensure no localhost in emails
  const appUrl = import.meta.env.VITE_APP_URL || 'https://nextgen.petrolord.com';

  const fetchSuperAdmins = useCallback(async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, display_name, email, status')
      .eq('role', 'super_admin')
      .neq('status', 'inactive');
    
    if (error) {
      toast({ variant: 'destructive', title: 'Error fetching admins', description: error.message });
    } else {
      setSuperAdmins(data || []);
    }
  }, [toast]);

  useEffect(() => {
    fetchSuperAdmins();
  }, [fetchSuperAdmins]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData.session) throw new Error("Authentication check failed. Please log in again.");

      // Redirect URL for the user to set their password
      const redirectUrl = `${appUrl}/reset-password`;

      const { data, error } = await supabase.functions.invoke('create-super-admin', {
        body: { email, redirectUrl },
        headers: { Authorization: `Bearer ${sessionData.session.access_token}` },
      });

      if (error) {
        throw new Error(error.message || 'Failed to send invitation');
      }
      
      toast({
        title: 'Invitation Sent',
        description: `Invitation sent to ${email}.`,
        variant: "default",
        className: "bg-[#BFFF00] text-[#0F172A]"
      });
      setEmail('');
      fetchSuperAdmins();

    } catch (error) {
      console.error("Create super admin error:", error);
      toast({
        variant: "destructive",
        title: "Invitation Failed",
        description: error.message || "An unknown error occurred. Check logs for details.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async () => {
    if (!selectedAdminForDeactivation) return;
    const targetId = selectedAdminForDeactivation.id;
    
    setDeactivateLoading(targetId);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      
      const { error } = await supabase.functions.invoke('deactivate-user', {
        body: { 
          userId: targetId,
          reason: 'Deactivated by Super Admin via Dashboard'
        },
        headers: { Authorization: `Bearer ${sessionData.session.access_token}` },
      });

      if (error) throw new Error(error.message || 'Failed to deactivate user');

      toast({
        title: 'User Deactivated',
        description: `${selectedAdminForDeactivation.email} has been deactivated and can no longer log in.`,
      });
      
      setSuperAdmins(prev => prev.filter(admin => admin.id !== targetId));
      fetchSuperAdmins();

    } catch (error) {
      console.error("Deactivation error:", error);
      toast({
        variant: "destructive",
        title: "Deactivation Failed",
        description: error.message
      });
    } finally {
      setDeactivateLoading(null);
      setSelectedAdminForDeactivation(null);
    }
  };

  return (
    <>
      <Helmet>
        <title>Super Admin Tool - Petrolord NextGen Suite</title>
        <meta name="description" content="Manage Super Admin accounts." />
      </Helmet>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl font-bold text-white mb-2">Super Admin Management</h1>
        <p className="text-xl text-gray-400 mb-8">Create and manage Super Admin accounts.</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Invitation Card */}
          <div className="lg:col-span-1">
            <div className="bg-[#1E293B] rounded-lg p-8 border border-gray-800 shadow-lg">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-[#BFFF00]/10 rounded-lg">
                   <ShieldCheck className="w-6 h-6 text-[#BFFF00]" />
                </div>
                <h2 className="text-2xl font-bold text-white">Create New Admin</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Admin Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-[#0F172A] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#BFFF00] transition-colors"
                      placeholder="new.admin@petrolord.com"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Invitation link redirects to: <br/>
                    <span className="text-[#BFFF00] font-mono">{appUrl}/reset-password</span>
                  </p>
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#BFFF00] text-[#0F172A] hover:bg-[#A8E600] font-semibold py-3 text-lg shadow-[0_0_15px_rgba(191,255,0,0.3)]"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  {loading ? 'Sending Invitation...' : 'Invite Super Admin'}
                </Button>
              </form>
            </div>
          </div>
          
          {/* List Card */}
          <div className="lg:col-span-2">
            <div className="bg-[#1E293B] rounded-lg border border-gray-800 shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Active Super Admins</h2>
                <span className="px-3 py-1 bg-[#0F172A] rounded-full text-xs text-gray-400 border border-gray-700">
                  {superAdmins.length} Active
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#0F172A]">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Display Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Email</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {superAdmins.length > 0 ? (
                      superAdmins.map((admin) => (
                        <tr key={admin.id} className="hover:bg-[#0F172A]/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-3 text-xs font-bold text-white">
                                    {admin.display_name ? admin.display_name.charAt(0).toUpperCase() : 'A'}
                                </div>
                                <span className="text-white font-medium">{admin.display_name || 'N/A'}</span>
                                {admin.id === user?.id && (
                                    <span className="ml-2 text-[10px] bg-[#BFFF00]/20 text-[#BFFF00] px-2 py-0.5 rounded border border-[#BFFF00]/30">YOU</span>
                                )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-400 font-mono text-sm">{admin.email}</td>
                          <td className="px-6 py-4 text-right">
                             {admin.id !== user?.id ? (
                               <AlertDialog>
                                 <AlertDialogTrigger asChild>
                                    <Button 
                                      variant="destructive" 
                                      size="sm" 
                                      disabled={deactivateLoading === admin.id}
                                      onClick={() => setSelectedAdminForDeactivation(admin)}
                                      className="hover:bg-red-600/90 border border-red-900/50"
                                    >
                                      {deactivateLoading === admin.id ? (
                                        <span className="animate-pulse">Deactivating...</span>
                                      ) : (
                                        <>
                                            <UserX className="w-4 h-4 mr-2" />
                                            Deactivate
                                        </>
                                      )}
                                    </Button>
                                 </AlertDialogTrigger>
                                 <AlertDialogContent className="bg-[#1E293B] border-gray-800 text-white">
                                   <AlertDialogHeader>
                                     <AlertDialogTitle className="flex items-center text-red-500">
                                       <AlertTriangle className="w-5 h-5 mr-2" />
                                       Confirm Deactivation
                                     </AlertDialogTitle>
                                     <AlertDialogDescription className="text-gray-400">
                                       Are you sure you want to deactivate <strong>{admin.email}</strong>? 
                                       <br/><br/>
                                       This action will immediately prevent the user from logging in and revoke all access tokens. You can reactivate them later via direct database access if needed.
                                     </AlertDialogDescription>
                                   </AlertDialogHeader>
                                   <AlertDialogFooter>
                                     <AlertDialogCancel className="bg-transparent border-gray-700 text-white hover:bg-gray-800 hover:text-white">Cancel</AlertDialogCancel>
                                     <AlertDialogAction 
                                       onClick={handleDeactivate}
                                       className="bg-red-600 hover:bg-red-700 text-white"
                                     >
                                       Yes, Deactivate User
                                     </AlertDialogAction>
                                   </AlertDialogFooter>
                                 </AlertDialogContent>
                               </AlertDialog>
                             ) : (
                                <span className="text-xs text-gray-600 italic">Current User</span>
                             )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="px-6 py-12 text-center text-gray-500">
                          <div className="flex flex-col items-center justify-center">
                            <ShieldCheck className="w-12 h-12 text-gray-700 mb-4" />
                            <p>No other super admins found.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default SuperAdminToolPage;