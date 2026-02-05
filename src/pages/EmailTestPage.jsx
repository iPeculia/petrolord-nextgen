import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { 
  Mail, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ShieldCheck,
  Server,
  Activity,
  History
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const EmailTestPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('test');
  const [isLoading, setIsLoading] = useState(false);
  const [smtpStatus, setSmtpStatus] = useState(null);
  const [emailLogs, setEmailLogs] = useState([]);
  const [applications, setApplications] = useState([]);

  const { register, handleSubmit, formState: { errors } } = useForm();

  // Load logs and applications on mount
  useEffect(() => {
    fetchLogs();
    fetchApplications();
  }, []);

  const fetchLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('email_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setEmailLogs(data || []);
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  const fetchApplications = async () => {
    try {
        // Only fetch if user is admin, otherwise this might fail due to RLS if not careful
        // Assuming this page is for admins or testing purposes
        const { data: { user } } = await supabase.auth.getUser();
        if(!user) return;

        const { data, error } = await supabase
            .from('university_applications')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10);
            
        if (!error && data) {
            setApplications(data);
        }
    } catch (error) {
        console.error("Error fetching applications:", error);
    }
  };

  const checkSmtpConnection = async () => {
    setIsLoading(true);
    setSmtpStatus(null);
    try {
      // Use the new test-smtp endpoint
      const { data, error } = await supabase.functions.invoke('test-smtp');
      
      if (error) throw error;
      
      setSmtpStatus({
        success: data.success,
        message: data.message,
        details: data.details
      });

      if (data.success) {
        toast({ title: "SMTP Connection Successful", description: "Your email configuration is valid." });
      } else {
        toast({ title: "SMTP Connection Failed", description: data.error || "Check logs for details", variant: "destructive" });
      }
    } catch (error) {
      setSmtpStatus({ success: false, message: error.message });
      toast({ title: "Connection Error", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const onSendTestEmail = async (data) => {
    setIsLoading(true);
    try {
      const { data: result, error } = await supabase.functions.invoke('send-email', {
        body: {
          to: data.recipient,
          subject: `Test Email: ${data.subject || 'System Verification'}`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; color: #333;">
              <h1 style="color: #0f172a;">Petrolord Email Test</h1>
              <p>This is a verification email sent from the Petrolord System.</p>
              <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
              <p><strong>Message:</strong> ${data.message}</p>
              <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
            </div>
          `,
          text: `Test Email from Petrolord.\n\nMessage: ${data.message}\nTimestamp: ${new Date().toLocaleString()}`
        }
      });

      if (error) throw error;

      if (result && !result.success) {
         throw new Error(result.error || "Failed to send email");
      }

      toast({
        title: "Email Sent Successfully",
        description: `Test email sent to ${data.recipient}`,
      });
      
      // Refresh logs
      setTimeout(fetchLogs, 2000);

    } catch (error) {
      console.error('Send Error:', error);
      toast({
        title: "Failed to Send",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Email System Diagnostics | Petrolord</title>
      </Helmet>
      
      <div className="min-h-screen bg-[#0F172A] text-slate-100 p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Server className="w-8 h-8 text-[#BFFF00]" />
                Email System Diagnostics
              </h1>
              <p className="text-slate-400 mt-2">Test SMTP connectivity, verify templates, and view delivery logs.</p>
            </div>
            <div className="flex gap-2">
               <Button onClick={checkSmtpConnection} variant="outline" className="border-slate-700 hover:bg-slate-800">
                  <Activity className="w-4 h-4 mr-2" />
                  Test Connection
               </Button>
               <Button onClick={() => window.location.reload()} variant="outline" className="border-slate-700 hover:bg-slate-800">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Data
               </Button>
            </div>
          </div>

          {smtpStatus && (
            <Card className={`border-l-4 ${smtpStatus.success ? 'border-l-emerald-500 bg-emerald-950/20' : 'border-l-red-500 bg-red-950/20'} border-y-0 border-r-0`}>
                <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                        {smtpStatus.success ? (
                            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                        ) : (
                            <AlertCircle className="w-6 h-6 text-red-500" />
                        )}
                        <div>
                            <h3 className="font-bold text-white">{smtpStatus.success ? 'SMTP Connection Active' : 'SMTP Connection Failed'}</h3>
                            <p className="text-sm text-slate-300">{smtpStatus.message}</p>
                            {smtpStatus.details && (
                                <pre className="mt-2 text-xs bg-black/30 p-2 rounded text-slate-400 overflow-auto max-w-xl">
                                    {JSON.stringify(smtpStatus.details, null, 2)}
                                </pre>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-[#1E293B] border-slate-700 p-1">
              <TabsTrigger value="test" className="data-[state=active]:bg-[#BFFF00] data-[state=active]:text-black">
                <Send className="w-4 h-4 mr-2" />
                Send Test
              </TabsTrigger>
              <TabsTrigger value="logs" className="data-[state=active]:bg-[#BFFF00] data-[state=active]:text-black">
                <History className="w-4 h-4 mr-2" />
                Delivery Logs
              </TabsTrigger>
              <TabsTrigger value="applications" className="data-[state=active]:bg-[#BFFF00] data-[state=active]:text-black">
                <ShieldCheck className="w-4 h-4 mr-2" />
                Applications Verification
              </TabsTrigger>
            </TabsList>

            <TabsContent value="test">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-[#1E293B] border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Manual Email Test</CardTitle>
                    <CardDescription>Send a custom email to verify delivery to specific inboxes.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit(onSendTestEmail)} className="space-y-4">
                      <div>
                        <Label className="text-slate-300">Recipient Email</Label>
                        <Input 
                           {...register('recipient', { required: true })}
                           placeholder="your.email@example.com"
                           className="bg-slate-950 border-slate-700 text-white mt-1.5" 
                        />
                      </div>
                      <div>
                        <Label className="text-slate-300">Subject</Label>
                        <Input 
                           {...register('subject')}
                           placeholder="Test Subject"
                           className="bg-slate-950 border-slate-700 text-white mt-1.5" 
                        />
                      </div>
                      <div>
                        <Label className="text-slate-300">Message</Label>
                        <Input 
                           {...register('message')}
                           placeholder="Hello world..."
                           className="bg-slate-950 border-slate-700 text-white mt-1.5" 
                        />
                      </div>
                      <Button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-[#BFFF00] text-black hover:bg-[#a3d900] font-bold"
                      >
                        {isLoading ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Mail className="w-4 h-4 mr-2" />}
                        Send Test Email
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                <Card className="bg-[#1E293B] border-slate-700">
                   <CardHeader>
                      <CardTitle className="text-white">Configuration Info</CardTitle>
                      <CardDescription>Current frontend detection of environment.</CardDescription>
                   </CardHeader>
                   <CardContent className="space-y-4">
                       <div className="p-3 bg-slate-950 rounded border border-slate-800">
                          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Supabase URL</h4>
                          <code className="text-sm text-emerald-400 break-all">{import.meta.env.VITE_SUPABASE_URL}</code>
                       </div>
                       <div className="p-3 bg-slate-950 rounded border border-slate-800">
                          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Edge Function URL</h4>
                          <code className="text-sm text-blue-400 break-all">{`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/`}</code>
                       </div>
                       <div className="flex items-start gap-2 text-sm text-amber-400 bg-amber-950/20 p-3 rounded">
                          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                          <p>SMTP Credentials (Host, User, Pass) are stored securely in Supabase Secrets and are not visible to the frontend.</p>
                       </div>
                   </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="logs">
               <Card className="bg-[#1E293B] border-slate-700">
                  <CardHeader>
                     <CardTitle className="text-white">Recent Email Logs</CardTitle>
                     <CardDescription>History of emails attempted by the system.</CardDescription>
                  </CardHeader>
                  <CardContent>
                     {emailLogs.length === 0 ? (
                        <div className="text-center py-8 text-slate-500">No logs found in email_logs table.</div>
                     ) : (
                        <Table>
                           <TableHeader>
                              <TableRow className="border-slate-800 hover:bg-transparent">
                                 <TableHead className="text-slate-400">Status</TableHead>
                                 <TableHead className="text-slate-400">Recipient</TableHead>
                                 <TableHead className="text-slate-400">Subject</TableHead>
                                 <TableHead className="text-slate-400">Time</TableHead>
                                 <TableHead className="text-slate-400">Details</TableHead>
                              </TableRow>
                           </TableHeader>
                           <TableBody>
                              {emailLogs.map((log) => (
                                 <TableRow key={log.id} className="border-slate-800 hover:bg-slate-800/50">
                                    <TableCell>
                                       {log.status === 'sent' || log.status === 'success' ? (
                                          <Badge className="bg-emerald-500 text-black">Sent</Badge>
                                       ) : (
                                          <Badge variant="destructive">Failed</Badge>
                                       )}
                                    </TableCell>
                                    <TableCell className="font-mono text-sm text-slate-300">{log.recipient_email || 'N/A'}</TableCell>
                                    <TableCell className="text-slate-300">{log.subject}</TableCell>
                                    <TableCell className="text-slate-400 text-sm">
                                       {new Date(log.created_at).toLocaleString()}
                                    </TableCell>
                                    <TableCell className="text-xs text-slate-500 max-w-[200px] truncate">
                                       {log.error_message || log.email_type}
                                    </TableCell>
                                 </TableRow>
                              ))}
                           </TableBody>
                        </Table>
                     )}
                  </CardContent>
               </Card>
            </TabsContent>

            <TabsContent value="applications">
               <Card className="bg-[#1E293B] border-slate-700">
                  <CardHeader>
                     <CardTitle className="text-white">Recent Applications</CardTitle>
                     <CardDescription>Verify if applications are being saved correctly.</CardDescription>
                  </CardHeader>
                  <CardContent>
                     <Table>
                        <TableHeader>
                           <TableRow className="border-slate-800 hover:bg-transparent">
                              <TableHead className="text-slate-400">University</TableHead>
                              <TableHead className="text-slate-400">Rep Name</TableHead>
                              <TableHead className="text-slate-400">Email</TableHead>
                              <TableHead className="text-slate-400">Status</TableHead>
                              <TableHead className="text-slate-400">Submitted</TableHead>
                           </TableRow>
                        </TableHeader>
                        <TableBody>
                           {applications.map((app) => (
                              <TableRow key={app.id} className="border-slate-800 hover:bg-slate-800/50">
                                 <TableCell className="font-medium text-white">{app.university_name}</TableCell>
                                 <TableCell className="text-slate-300">{app.rep_name}</TableCell>
                                 <TableCell className="text-slate-300 font-mono text-xs">{app.rep_email}</TableCell>
                                 <TableCell>
                                    <Badge variant="outline" className="border-slate-600 text-slate-300 capitalize">
                                       {app.status}
                                    </Badge>
                                 </TableCell>
                                 <TableCell className="text-slate-400 text-sm">
                                    {app.created_at ? new Date(app.created_at).toLocaleDateString() : 'N/A'}
                                 </TableCell>
                              </TableRow>
                           ))}
                        </TableBody>
                     </Table>
                  </CardContent>
               </Card>
            </TabsContent>

          </Tabs>
        </div>
      </div>
    </>
  );
};

export default EmailTestPage;