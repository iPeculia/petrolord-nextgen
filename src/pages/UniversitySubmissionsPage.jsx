import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import Layout from '@/components/Layout';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Loader2, 
  CheckCircle, 
  XCircle, 
  MoreHorizontal, 
  Search, 
  School,
  Calendar,
  Mail,
  AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';

const UniversitySubmissionsPage = () => {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Modal States
  const [selectedApp, setSelectedApp] = useState(null);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const { toast } = useToast();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('university_applications')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        variant: "destructive",
        title: "Error fetching data",
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveClick = (app) => {
    setSelectedApp(app);
    setIsApproveModalOpen(true);
  };

  const handleRejectClick = (app) => {
    setSelectedApp(app);
    setRejectionReason('');
    setIsRejectModalOpen(true);
  };

  const validateRequest = (app) => {
    if (!app?.id) return "Missing Application ID";
    if (!app?.rep_email || !app.rep_email.includes('@')) return "Invalid Representative Email";
    if (!app?.university_name) return "Missing University Name";
    return null;
  };

  const confirmApproval = async () => {
    const validationError = validateRequest(selectedApp);
    if (validationError) {
      toast({
        variant: "destructive",
        title: "Validation Failed",
        description: validationError
      });
      return;
    }

    try {
      setIsProcessing(true);

      // 1. Prepare Payload
      const payload = {
        applicationId: selectedApp.id,
        status: 'approved',
        universityName: selectedApp.university_name,
        adminEmail: selectedApp.rep_email,
        timestamp: new Date().toISOString()
      };

      // 2. Call Edge Function
      const { data, error } = await supabase.functions.invoke('university-application-review', {
        body: payload
      });

      if (error) throw error;
      
      // Check for non-200 responses that might come back as data if structured that way, 
      // but usually invoke throws on 4xx/5xx if not handled. 
      // Assuming standard supabase function behavior.

      // 3. Update UI
      toast({
        title: "Approval Successful",
        description: `${selectedApp.university_name} has been approved. Admin invite sent.`,
        className: "bg-[#BFFF00] text-black border-none"
      });

      setIsApproveModalOpen(false);
      fetchApplications(); // Refresh list

    } catch (error) {
      console.error('Approval failed:', error);
      toast({
        variant: "destructive",
        title: "Action Failed",
        description: error.message || "Edge Function returned a non-2xx status code"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmRejection = async () => {
    if (!rejectionReason.trim()) {
      toast({
        variant: "destructive",
        title: "Reason Required",
        description: "Please provide a reason for rejection."
      });
      return;
    }

    try {
      setIsProcessing(true);

      const payload = {
        applicationId: selectedApp.id,
        status: 'rejected',
        universityName: selectedApp.university_name,
        adminEmail: selectedApp.rep_email,
        reason: rejectionReason,
        timestamp: new Date().toISOString()
      };

      const { error } = await supabase.functions.invoke('university-application-review', {
        body: payload
      });

      if (error) throw error;

      toast({
        title: "Application Rejected",
        description: "The university has been notified.",
      });

      setIsRejectModalOpen(false);
      fetchApplications();

    } catch (error) {
      console.error('Rejection failed:', error);
      toast({
        variant: "destructive",
        title: "Action Failed",
        description: error.message
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.university_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.rep_email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch(status) {
      case 'approved': 
        return <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/50 hover:bg-emerald-500/20">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/10 text-red-400 border-red-500/50 hover:bg-red-500/20">Rejected</Badge>;
      default:
        return <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/50 hover:bg-amber-500/20">Pending</Badge>;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">University Submissions</h1>
            <p className="text-slate-400 mt-1">Review and manage institutional access requests.</p>
          </div>
          <Button 
            onClick={fetchApplications} 
            variant="outline" 
            size="sm"
            className="border-slate-700 hover:bg-slate-800 text-slate-300"
          >
            Refresh List
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 bg-[#1E293B]/50 p-4 rounded-lg border border-slate-800">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input 
              placeholder="Search universities or emails..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-slate-950 border-slate-700 text-white placeholder:text-slate-500"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'pending', 'approved', 'rejected'].map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? 'default' : 'ghost'}
                onClick={() => setStatusFilter(status)}
                className={`capitalize ${
                  statusFilter === status 
                    ? 'bg-[#BFFF00] text-black hover:bg-[#a3d900]' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {status}
              </Button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#1E293B] rounded-lg border border-slate-800 overflow-hidden shadow-xl">
          <Table>
            <TableHeader className="bg-slate-900/50">
              <TableRow className="border-slate-800 hover:bg-transparent">
                <TableHead className="text-slate-400">University</TableHead>
                <TableHead className="text-slate-400">Representative</TableHead>
                <TableHead className="text-slate-400">Date</TableHead>
                <TableHead className="text-slate-400">Status</TableHead>
                <TableHead className="text-right text-slate-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center">
                    <div className="flex items-center justify-center gap-2 text-slate-400">
                      <Loader2 className="h-5 w-5 animate-spin text-[#BFFF00]" />
                      Loading submissions...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredApplications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-slate-500">
                    No applications found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredApplications.map((app) => (
                  <TableRow key={app.id} className="border-slate-800 hover:bg-slate-800/50 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-800 rounded-lg text-[#BFFF00]">
                          <School className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-medium text-white">{app.university_name}</div>
                          <div className="text-xs text-slate-500">{app.address}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-slate-300">{app.rep_name}</span>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Mail className="h-3 w-3" /> {app.rep_email}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <Calendar className="h-3 w-3" />
                        {app.submitted_at ? format(new Date(app.submitted_at), 'MMM dd, yyyy') : 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(app.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      {app.status === 'pending' ? (
                        <div className="flex justify-end gap-2">
                           <Button 
                             size="sm" 
                             onClick={() => handleApproveClick(app)}
                             className="bg-[#BFFF00] text-black hover:bg-[#a3d900] h-8 px-3"
                           >
                             <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> Approve
                           </Button>
                           <Button 
                             size="sm" 
                             variant="outline"
                             onClick={() => handleRejectClick(app)}
                             className="border-red-900/50 text-red-400 hover:bg-red-950 hover:text-red-300 h-8 px-3"
                           >
                             <XCircle className="w-3.5 h-3.5 mr-1.5" /> Reject
                           </Button>
                        </div>
                      ) : (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-white">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-[#1E293B] border-slate-700 text-white">
                            <DropdownMenuItem className="focus:bg-slate-800 cursor-pointer">
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="focus:bg-slate-800 cursor-pointer text-slate-400">
                              Archive
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Approve Modal */}
      <Dialog open={isApproveModalOpen} onOpenChange={setIsApproveModalOpen}>
        <DialogContent className="bg-[#0F172A] border-slate-800 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-emerald-400 text-xl">
              <CheckCircle className="w-5 h-5" /> Confirm Approval
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-base pt-2">
              You are about to approve <strong className="text-white">{selectedApp?.university_name}</strong>.
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-slate-900/50 rounded-lg p-4 space-y-3 border border-slate-800">
             <div className="flex items-start gap-3 text-sm">
                <CheckCircle className="w-4 h-4 text-[#BFFF00] mt-0.5 shrink-0" />
                <span className="text-slate-300">A University Admin account will be created.</span>
             </div>
             <div className="flex items-start gap-3 text-sm">
                <CheckCircle className="w-4 h-4 text-[#BFFF00] mt-0.5 shrink-0" />
                <div className="flex flex-col">
                    <span className="text-slate-300">Login credentials will be emailed to:</span>
                    <span className="text-white font-mono mt-0.5">{selectedApp?.rep_email}</span>
                </div>
             </div>
             <div className="flex items-start gap-3 text-sm">
                <CheckCircle className="w-4 h-4 text-[#BFFF00] mt-0.5 shrink-0" />
                <span className="text-slate-300">Status will change to "Approved".</span>
             </div>
          </div>

          <DialogFooter className="mt-4 gap-2 sm:gap-0">
            <Button 
              variant="ghost" 
              onClick={() => setIsApproveModalOpen(false)}
              className="text-slate-400 hover:text-white hover:bg-slate-800"
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button 
              onClick={confirmApproval}
              disabled={isProcessing}
              className="bg-[#BFFF00] text-black hover:bg-[#a3d900] min-w-[140px]"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...
                </>
              ) : (
                "Confirm & Grant Access"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Modal */}
      <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
        <DialogContent className="bg-[#0F172A] border-slate-800 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-400 text-xl">
              <AlertTriangle className="w-5 h-5" /> Reject Application
            </DialogTitle>
            <DialogDescription className="text-slate-400 pt-2">
              This action will reject the application from <strong className="text-white">{selectedApp?.university_name}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Reason for Rejection</label>
              <Input
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g., Incomplete documentation, Invalid credentials..."
                className="bg-slate-900 border-slate-700 text-white"
              />
            </div>
            <div className="bg-red-950/20 border border-red-900/30 p-3 rounded text-xs text-red-300 flex gap-2 items-start">
               <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
               <p>The applicant will receive an email notification with this reason. This action cannot be easily undone.</p>
            </div>
          </div>

          <DialogFooter className="mt-2">
            <Button 
              variant="ghost" 
              onClick={() => setIsRejectModalOpen(false)}
              className="text-slate-400 hover:text-white"
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button 
              onClick={confirmRejection}
              disabled={isProcessing}
              variant="destructive"
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...
                </>
              ) : (
                "Confirm Rejection"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default UniversitySubmissionsPage;