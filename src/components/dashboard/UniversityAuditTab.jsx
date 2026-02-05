import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Download, Shield } from 'lucide-react';
import { format } from 'date-fns';
import { utils, writeFile } from 'xlsx';

const UniversityAuditTab = ({ universityId }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLogs();
  }, [universityId]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      // In a real scenario, RLS policies would enforce that this query only returns data for this university's members
      // For now, we query the table directly.
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('log_type', 'historical') // University admins mostly care about historical records
        .order('timestamp', { ascending: false })
        .limit(50);

      if (error) throw error;
      setLogs(data);
    } catch (error) {
      console.error('Error fetching university audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => 
    log.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.resource_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportLogs = () => {
    const ws = utils.json_to_sheet(filteredLogs);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "University Audit Logs");
    writeFile(wb, "University_Audit_Logs.xlsx");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-[#1E293B] p-4 rounded-lg border border-slate-800">
         <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input 
              placeholder="Search history..." 
              className="pl-9 bg-[#0F172A] border-slate-700 text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
         <Button variant="outline" onClick={exportLogs} className="border-slate-700 text-slate-300">
            <Download className="w-4 h-4 mr-2" /> Export History
         </Button>
      </div>

      <Card className="bg-[#1E293B] border-slate-800">
        <CardHeader>
           <CardTitle className="text-white text-lg flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-500" /> Historical Records
           </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
             <TableHeader className="bg-[#0F172A]">
               <TableRow className="border-slate-800 hover:bg-transparent">
                 <TableHead className="text-slate-400">Date</TableHead>
                 <TableHead className="text-slate-400">Action</TableHead>
                 <TableHead className="text-slate-400">User</TableHead>
                 <TableHead className="text-slate-400">Details</TableHead>
               </TableRow>
             </TableHeader>
             <TableBody>
               {filteredLogs.map((log) => (
                 <TableRow key={log.id} className="border-slate-800 hover:bg-slate-800/50">
                   <TableCell className="text-slate-400 font-mono text-xs">
                      {format(new Date(log.timestamp), 'MMM d, yyyy HH:mm')}
                   </TableCell>
                   <TableCell className="text-slate-300 font-medium">
                      {log.action}
                   </TableCell>
                   <TableCell className="text-slate-300">
                      {log.user_email}
                      <span className="block text-xs text-slate-500">{log.actor_role}</span>
                   </TableCell>
                   <TableCell className="text-slate-400 text-sm">
                      {log.resource_name || log.resource_id}
                   </TableCell>
                 </TableRow>
               ))}
               {filteredLogs.length === 0 && (
                 <TableRow>
                   <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                     No historical records found.
                   </TableCell>
                 </TableRow>
               )}
             </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UniversityAuditTab;