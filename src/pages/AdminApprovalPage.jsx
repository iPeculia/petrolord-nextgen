import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink,
  ShieldCheck,
  UserCheck,
  Filter,
  MoreHorizontal,
  Eye,
  Loader2,
  CalendarDays
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from '@/lib/customSupabaseClient';

const AdminApprovalPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  
  // Dialog States
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [approveConfirmOpen, setApproveConfirmOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processingAction, setProcessingAction] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending');

  const { toast } = useToast();

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('university_applications')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      
      // Default null status to 'pending' for older records if any
      const processedData = data.map(app => ({
        ...app,
        status: app.status ? app.status.toLowerCase() : 'pending'
      }));
      
      setApplications(processedData);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: "Error",
        description: "Failed to load university applications.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.university_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.rep_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.rep_email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleAction = async (action) => {
    if (!selectedApp) return;

    // Validation Check
    if (action === 'approve') {
      if (!selectedApp.rep_email || !selectedApp.university_name) {
        toast({
          title: "Validation Error",
          description: "Cannot approve: Missing administrator email or university name.",
          variant: "destructive"
        });
        return;
      }
      
      // Basic Email Validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(selectedApp.rep_email)) {
        toast({
          title: "Invalid Email",
          description: "The representative's email address appears to be invalid.",
          variant: "destructive"
        });
        return;
      }
    }

    setProcessingAction(true);
    
    // Construct Payload
    const payload = {
      action: action,
      applicationId: selectedApp.id,
      universityName: selectedApp.university_name,
      adminEmail: selectedApp.rep_email,
      status: selectedApp.status,
      timestamp: new Date().toISOString(),
      reason: action === 'reject' ? rejectionReason : undefined
    };

    console.log('Sending approval request:', payload);

    try {
      const { data, error } = await supabase.functions.invoke('university-application-review', {
        body: payload
      });

      if (error) {
        console.error("Supabase Function Error:", error);
        // Sometimes the error object is nested or just a message
        const errMsg = error.message || (error.context && await error.context.json()) || "Failed to communicate with approval service.";
        throw new Error(typeof errMsg === 'object' ? JSON.stringify(errMsg) : errMsg);
      }

      console.log("Approval successful:", data);

      toast({
        title: action === 'approve' ? "Application Approved" : "Application Rejected",
        description: action === 'approve' 
          ? `Access granted for ${selectedApp.university_name}. User created & invitation sent.`
          : "Rejection notification sent to applicant.",
        variant: action === 'approve' ? "default" : "destructive",
        className: action === 'approve' ? "bg-emerald-600 border-none text-white" : ""
      });

      // Refresh list
      await fetchApplications();

      // Close dialogs
      setApproveConfirmOpen(false);
      setRejectOpen(false);
      setDetailsOpen(false);
      setRejectionReason('');

    } catch (error) {
      console.error(`Error ${action}ing application:`, error);
      toast({
        title: "Action Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setProcessingAction(false);
    }
  };

  const openDetails = (app) => {
    setSelectedApp(app);
    setDetailsOpen(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20"><CheckCircle2 className="w-3 h-3 mr-1" /> Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20"><XCircle className="w-3 h-3 mr-1" /> Rejected</Badge>;
      default:
        return <Badge className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <Helmet>
        <title>University Approvals | Admin Dashboard</title>
      </Helmet>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">University Approvals</h1>
          <p className="text-slate-400 mt-1">Review and manage institutional access requests.</p>
        </div>
        <div className="flex items-center gap-2 bg-[#1E293B] p-1 rounded-lg border border-slate-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search universities..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-64 bg-transparent border-none focus-visible:ring-0 text-white h-9"
            />
          </div>
        </div>
      </div>

      {/* Tabs / Filters */}
      <Tabs defaultValue="pending" value={statusFilter} onValueChange={setStatusFilter} className="w-full">
        <TabsList className="bg-[#1E293B] border border-slate-800">
          <TabsTrigger value="pending" className="data-[state=active]:bg-[#BFFF00] data-[state=active]:text-black">
            Pending <Badge variant="secondary" className="ml-2 bg-slate-800 text-slate-300 text-[10px]">{applications.filter(a => a.status === 'pending').length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="approved" className="data-[state=active]:bg-[#BFFF00] data-[state=active]:text-black">Approved</TabsTrigger>
          <TabsTrigger value="rejected" className="data-[state=active]:bg-[#BFFF00] data-[state=active]:text-black">Rejected</TabsTrigger>
          <TabsTrigger value="all" className="data-[state=active]:bg-[#BFFF00] data-[state=active]:text-black">All Applications</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Content Grid */}
      <div className="grid gap-4">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-[#BFFF00] animate-spin" />
          </div>
        ) : filteredApplications.length === 0 ? (
          <Card className="bg-[#1E293B] border-slate-800">
            <CardContent className="flex flex-col items-center justify-center py-16 text-slate-400">
              <Building2 className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-lg font-medium">No applications found</p>
              <p className="text-sm">Try adjusting your filters or search query.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <AnimatePresence>
              {filteredApplications.map((app) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  layout
                >
                  <Card className="bg-[#1E293B] border-slate-800 hover:border-slate-700 transition-colors group">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-white group-hover:text-[#BFFF00] transition-colors">{app.university_name}</h3>
                            {getStatusBadge(app.status)}
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-8 text-sm text-slate-400 mt-4">
                            <div className="flex items-center gap-2">
                              <UserCheck className="w-4 h-4 text-slate-500" />
                              <span className="text-slate-200">{app.rep_name}</span>
                              <span className="text-xs px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">{app.rep_position}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-slate-500" />
                              <a href={`mailto:${app.rep_email}`} className="hover:text-[#BFFF00]">{app.rep_email}</a>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-slate-500" />
                              <span className="truncate max-w-[200px]">{app.address}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CalendarDays className="w-4 h-4 text-slate-500" />
                              <span>Applied: {new Date(app.submitted_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800"
                            onClick={() => openDetails(app)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Review
                          </Button>
                          
                          {app.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                className="bg-[#BFFF00] text-black hover:bg-[#a3d900] font-bold flex-1"
                                onClick={() => { setSelectedApp(app); setApproveConfirmOpen(true); }}
                              >
                                Approve
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-white">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-[#0F172A] border-slate-800">
                                  <DropdownMenuItem 
                                    className="text-red-500 hover:text-red-400 hover:bg-red-500/10 cursor-pointer"
                                    onClick={() => { setSelectedApp(app); setRejectOpen(true); }}
                                  >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Reject Application
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Departments Tags */}
                      <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap gap-2">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider py-1">Departments:</span>
                        {app.departments && app.departments.length > 0 ? (
                          app.departments.map((dept, idx) => (
                            <span key={idx} className="px-2 py-1 rounded-md bg-slate-800 text-slate-300 text-xs border border-slate-700">
                              {dept}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-600 text-xs italic py-1">None listed</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Details Modal */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="bg-[#1E293B] border-slate-700 text-slate-100 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
              <Building2 className="w-6 h-6 text-[#BFFF00]" />
              {selectedApp?.university_name}
            </DialogTitle>
            <DialogDescription className="text-slate-400 flex items-center gap-2">
              Application ID: <span className="font-mono text-slate-500">{selectedApp?.id}</span>
              {selectedApp && getStatusBadge(selectedApp.status)}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-6 py-4">
              {/* Rep Section */}
              <div className="bg-[#0F172A] p-4 rounded-xl border border-slate-800">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <UserCheck className="w-4 h-4" /> Representative
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-500">Full Name</label>
                    <p className="font-medium text-white">{selectedApp?.rep_name}</p>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500">Position</label>
                    <p className="font-medium text-white">{selectedApp?.rep_position}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs text-slate-500">Institutional Email</label>
                    <p className="font-medium text-[#BFFF00]">{selectedApp?.rep_email}</p>
                  </div>
                </div>
              </div>

              {/* Contact Section */}
              <div className="bg-[#0F172A] p-4 rounded-xl border border-slate-800">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Contact Information
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-500">Address</label>
                    <p className="text-slate-200">{selectedApp?.address}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-slate-500">Phone</label>
                      <p className="text-slate-200">{selectedApp?.phone}</p>
                    </div>
                    <div>
                      <label className="text-xs text-slate-500">Website</label>
                      {selectedApp?.website ? (
                        <a href={selectedApp.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-blue-400 hover:text-blue-300">
                          {selectedApp.website} <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <p className="text-slate-600 italic">Not provided</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Departments Section */}
              <div>
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Participating Departments</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedApp?.departments?.map((dept, i) => (
                    <div key={i} className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-medium text-sm">
                      {dept}
                    </div>
                  ))}
                </div>
              </div>

              {selectedApp?.status === 'rejected' && (
                <div className="bg-red-950/20 border border-red-900/50 p-4 rounded-xl">
                  <h4 className="text-sm font-bold text-red-500 mb-2">Rejection Reason</h4>
                  <p className="text-red-200/80">{selectedApp.rejection_reason}</p>
                </div>
              )}
            </div>
          </ScrollArea>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setDetailsOpen(false)} className="text-slate-400 hover:text-white">Close</Button>
            {selectedApp?.status === 'pending' && (
              <>
                <Button 
                  variant="destructive" 
                  onClick={() => setRejectOpen(true)}
                  className="bg-red-900/50 hover:bg-red-900 text-red-200"
                >
                  Reject
                </Button>
                <Button 
                  className="bg-[#BFFF00] text-black hover:bg-[#a3d900] font-bold"
                  onClick={() => setApproveConfirmOpen(true)}
                >
                  Approve Application
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Confirmation Dialog */}
      <Dialog open={approveConfirmOpen} onOpenChange={setApproveConfirmOpen}>
        <DialogContent className="bg-[#1E293B] border-slate-700 text-slate-100">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-emerald-400">
              <ShieldCheck className="w-6 h-6" /> Confirm Approval
            </DialogTitle>
            <DialogDescription className="text-slate-400 pt-2">
              You are about to approve <strong>{selectedApp?.university_name}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-[#0F172A] p-4 rounded-lg text-sm text-slate-300 space-y-2 border border-slate-800">
            <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#BFFF00]" /> A University Admin account will be created.</p>
            <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#BFFF00]" /> Login credentials will be emailed to <strong>{selectedApp?.rep_email}</strong>.</p>
            <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#BFFF00]" /> Status will change to "Approved".</p>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setApproveConfirmOpen(false)} disabled={processingAction} className="text-slate-400">Cancel</Button>
            <Button 
              onClick={() => handleAction('approve')} 
              disabled={processingAction}
              className="bg-[#BFFF00] text-black hover:bg-[#a3d900] font-bold"
            >
              {processingAction ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Confirm & Grant Access
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent className="bg-[#1E293B] border-slate-700 text-slate-100">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-500">
              <XCircle className="w-6 h-6" /> Reject Application
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Please provide a reason for rejecting this application. This will be sent to the applicant.
            </DialogDescription>
          </DialogHeader>
          <Textarea 
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="e.g. Incomplete documentation, Not an accredited institution..."
            className="bg-[#0F172A] border-slate-700 text-white min-h-[120px] focus-visible:ring-red-500"
          />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setRejectOpen(false)} disabled={processingAction} className="text-slate-400">Cancel</Button>
            <Button 
              onClick={() => handleAction('reject')} 
              disabled={!rejectionReason.trim() || processingAction}
              variant="destructive"
            >
              {processingAction ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Reject Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default AdminApprovalPage;