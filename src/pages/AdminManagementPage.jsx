import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, ShieldCheck, UserPlus, Users, Search, RefreshCw, BarChart2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/SupabaseAuthContext';

// Import our new/updated widgets
import { KPICard, AreaChartWidget, BarChartWidget, PieChartWidget } from '@/components/charts/DashboardWidgets';
import { analyticsService } from '@/services/analyticsService';

const AdminManagementPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('analytics'); // Default to Analytics for Super Admin

  // Analytics State
  const [systemMetrics, setSystemMetrics] = useState(null);
  const [loadingMetrics, setLoadingMetrics] = useState(false);

  // Admin Management State
  const [admins, setAdmins] = useState([]);
  const [loadingAdmins, setLoadingAdmins] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  
  useEffect(() => {
    if (activeTab === 'analytics') {
        fetchSystemMetrics();
    } else if (activeTab === 'admins') {
        fetchAdmins();
    }
  }, [activeTab]);

  const fetchSystemMetrics = async () => {
    setLoadingMetrics(true);
    try {
        const metrics = await analyticsService.getSystemMetrics();
        setSystemMetrics(metrics);
    } catch (error) {
        console.error("Error fetching system metrics:", error);
    } finally {
        setLoadingMetrics(false);
    }
  };

  const fetchAdmins = async () => {
    try {
      setLoadingAdmins(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'admin')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAdmins(data || []);
    } catch (error) {
      console.error('Error fetching admins:', error);
      toast({
        title: "Error",
        description: "Failed to load admin list.",
        variant: "destructive"
      });
    } finally {
      setLoadingAdmins(false);
    }
  };

  const handleInviteAdmin = async (e) => {
    e.preventDefault();
    if (!newAdminEmail || !newAdminName) {
      toast({ title: "Validation Error", description: "Email and Name are required.", variant: "destructive" });
      return;
    }

    setInviteLoading(true);
    try {
      // 1. Create Profile first (assuming user might sign up later, or use edge function for proper invite flow)
      // Note: In a real app, this should use supabase.auth.admin.inviteUserByEmail() which requires service role key
      // accessible only via Edge Function. For this demo, we'll simulate by checking if user exists or calling edge function.
      
      const { data, error } = await supabase.functions.invoke('create-admin', {
        body: { email: newAdminEmail, name: newAdminName }
      });

      if (error) throw error;

      toast({
        title: "Invitation Sent",
        description: `Admin invitation sent to ${newAdminEmail}`,
        variant: "default"
      });
      
      setIsInviteDialogOpen(false);
      setNewAdminEmail('');
      setNewAdminName('');
      fetchAdmins();

    } catch (error) {
      console.error('Error inviting admin:', error);
      toast({
        title: "Invitation Failed",
        description: error.message || "Could not send invitation.",
        variant: "destructive"
      });
    } finally {
      setInviteLoading(false);
    }
  };

  const filteredAdmins = admins.filter(admin => 
    admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (admin.display_name && admin.display_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <>
      <Helmet>
        <title>Admin Management - Petrolord</title>
      </Helmet>
      
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
             <ShieldCheck className="w-8 h-8 text-[#BFFF00]" /> Super Admin Console
          </h1>
          <p className="text-slate-400">Manage platform administrators and view system-wide analytics.</p>
        </div>

        <Tabs defaultValue="analytics" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-[#1E293B] border-slate-800 p-1">
            <TabsTrigger value="analytics" className="data-[state=active]:bg-[#BFFF00] data-[state=active]:text-black">
                <BarChart2 className="w-4 h-4 mr-2" /> System Analytics
            </TabsTrigger>
            <TabsTrigger value="admins" className="data-[state=active]:bg-[#BFFF00] data-[state=active]:text-black">
                <Users className="w-4 h-4 mr-2" /> Admin Users
            </TabsTrigger>
          </TabsList>

          {/* ANALYTICS TAB */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">System Overview</h2>
                <Button variant="outline" size="sm" onClick={fetchSystemMetrics} className="border-slate-700">
                    <RefreshCw className={`w-4 h-4 mr-2 ${loadingMetrics ? 'animate-spin' : ''}`} /> Refresh
                </Button>
            </div>

            {loadingMetrics && !systemMetrics ? (
                <div className="h-64 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-[#BFFF00]" />
                </div>
            ) : (
                <>
                    {/* Top Level KPIs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <KPICard title="Total Universities" value={systemMetrics?.universityCount || 0} icon={Users} color="text-purple-400 bg-purple-500/10" trend={12} />
                        <KPICard title="Total Users" value={systemMetrics?.userCount || 0} icon={Users} color="text-blue-400 bg-blue-500/10" trend={8.5} />
                        <KPICard title="Active Today" value={systemMetrics?.activeUsers || 0} icon={RefreshCw} color="text-emerald-400 bg-emerald-500/10" trend={5.2} />
                        <KPICard title="Total Courses" value={systemMetrics?.courseCount || 0} icon={BarChart2} color="text-orange-400 bg-orange-500/10" />
                    </div>

                    {/* Charts Row 1 */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                         <div className="lg:col-span-2 h-80">
                             <AreaChartWidget 
                                title="System Growth (New Users)"
                                data={[
                                    { name: 'Jan', value: 400 }, { name: 'Feb', value: 300 },
                                    { name: 'Mar', value: 550 }, { name: 'Apr', value: 800 },
                                    { name: 'May', value: 950 }, { name: 'Jun', value: 1245 }
                                ]}
                                dataKey="value"
                             />
                         </div>
                         <div className="h-80">
                             <PieChartWidget 
                                title="User Distribution"
                                data={[
                                    { name: 'Students', value: systemMetrics?.studentCount || 800 },
                                    { name: 'Lecturers', value: (systemMetrics?.userCount - systemMetrics?.studentCount) || 150 },
                                    { name: 'Admins', value: 50 }
                                ]}
                             />
                         </div>
                    </div>

                    {/* Charts Row 2 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="h-80">
                            <BarChartWidget 
                                title="Course Enrollments by Month"
                                data={[
                                    { name: 'Jan', value: 120 }, { name: 'Feb', value: 200 },
                                    { name: 'Mar', value: 150 }, { name: 'Apr', value: 300 },
                                    { name: 'May', value: 450 }, { name: 'Jun', value: 600 }
                                ]}
                                dataKey="value"
                                color="#38BDF8"
                            />
                        </div>
                        <div className="h-80">
                            <Card className="bg-[#1E293B] border-slate-800 h-full">
                                <CardHeader><CardTitle className="text-white">System Health</CardTitle></CardHeader>
                                <CardContent>
                                    <div className="flex flex-col items-center justify-center h-full space-y-4">
                                        <div className="relative w-40 h-40 flex items-center justify-center rounded-full border-8 border-slate-700">
                                            <div className="absolute inset-0 rounded-full border-8 border-[#BFFF00] border-t-transparent animate-spin" style={{ animationDuration: '3s' }}></div>
                                            <div className="text-center">
                                                <div className="text-3xl font-bold text-white">99.9%</div>
                                                <div className="text-xs text-slate-400">Uptime</div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 w-full mt-4">
                                            <div className="bg-slate-800 p-3 rounded text-center">
                                                <div className="text-emerald-400 font-bold">Normal</div>
                                                <div className="text-xs text-slate-500">Latency</div>
                                            </div>
                                            <div className="bg-slate-800 p-3 rounded text-center">
                                                <div className="text-emerald-400 font-bold">Stable</div>
                                                <div className="text-xs text-slate-500">Error Rate</div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </>
            )}
          </TabsContent>

          {/* ADMINS LIST TAB */}
          <TabsContent value="admins">
            <Card className="bg-[#1E293B] border-slate-800">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-white">Petrolord Administrators</CardTitle>
                  <CardDescription>Users with global administrative privileges.</CardDescription>
                </div>
                <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-[#BFFF00] text-black hover:bg-[#a3d900]">
                      <UserPlus className="w-4 h-4 mr-2" /> Invite Admin
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-[#1E293B] border-slate-700 text-white">
                    <DialogHeader>
                      <DialogTitle>Invite New Administrator</DialogTitle>
                      <DialogDescription>
                        Send an invitation to a new system administrator. They will receive an email to set up their account.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleInviteAdmin} className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                          id="name" 
                          placeholder="John Doe" 
                          value={newAdminName}
                          onChange={(e) => setNewAdminName(e.target.value)}
                          className="bg-slate-800 border-slate-600 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="admin@petrolord.com" 
                          value={newAdminEmail}
                          onChange={(e) => setNewAdminEmail(e.target.value)}
                          className="bg-slate-800 border-slate-600 text-white"
                        />
                      </div>
                      <DialogFooter>
                        <Button type="submit" disabled={inviteLoading} className="bg-[#BFFF00] text-black hover:bg-[#a3d900]">
                          {inviteLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                          Send Invitation
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input 
                      placeholder="Search admins..." 
                      className="pl-9 bg-[#0F172A] border-slate-700 text-white"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                {loadingAdmins ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-[#BFFF00]" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredAdmins.length === 0 ? (
                      <div className="text-center py-8 text-slate-500">
                        No administrators found matching your search.
                      </div>
                    ) : (
                      filteredAdmins.map((admin) => (
                        <div key={admin.id} className="flex items-center justify-between p-4 rounded-lg bg-[#0F172A] border border-slate-800">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-bold">
                              {admin.display_name?.charAt(0) || admin.email.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-medium text-white">{admin.display_name || 'Unnamed Admin'}</div>
                              <div className="text-sm text-slate-400">{admin.email}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <Badge className="bg-purple-900/50 text-purple-300 border-purple-700">
                              {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                            </Badge>
                            <div className="text-xs text-slate-500">
                              Added {new Date(admin.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default AdminManagementPage;