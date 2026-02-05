import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Download, Clock, Wifi } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

const StudentActivityTab = ({ universityId }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (universityId) {
      fetchLogs();
    }
  }, [universityId]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      // Fetch logs joined with profile data
      // Note: Supabase join syntax requires foreign key relationship
      const { data, error } = await supabase
        .from('student_login_logs')
        .select(`
            *,
            profiles:student_id (
                display_name,
                email
            )
        `)
        .eq('university_id', universityId)
        .order('login_time', { ascending: false })
        .limit(50); // Limit for performance

      if (error) throw error;
      setLogs(data);
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => 
    log.profiles?.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isOnline = (lastLogin, lastLogout) => {
     if (!lastLogin) return false;
     const loginTime = new Date(lastLogin).getTime();
     const logoutTime = lastLogout ? new Date(lastLogout).getTime() : 0;
     // If logout is missing or before login, and login was recent (< 2 hours), assume online
     const twoHours = 2 * 60 * 60 * 1000;
     return (!lastLogout || logoutTime < loginTime) && (Date.now() - loginTime < twoHours);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-[#1E293B] p-4 rounded-lg border border-slate-800">
         <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input 
              placeholder="Search logs..." 
              className="pl-9 bg-[#0F172A] border-slate-700 text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
         <Button variant="outline" className="border-slate-700 text-slate-300">
            <Download className="w-4 h-4 mr-2" /> Export CSV
         </Button>
      </div>

      <Card className="bg-[#1E293B] border-slate-800">
          <CardHeader>
              <CardTitle className="text-white">Recent Login Activity</CardTitle>
              <CardDescription className="text-slate-400">Monitor student access and session durations.</CardDescription>
          </CardHeader>
          <CardContent>
              <Table>
                  <TableHeader className="bg-[#0F172A]">
                      <TableRow className="border-slate-700 hover:bg-transparent">
                          <TableHead className="text-slate-300">Student</TableHead>
                          <TableHead className="text-slate-300">Status</TableHead>
                          <TableHead className="text-slate-300">Login Time</TableHead>
                          <TableHead className="text-slate-300">Duration</TableHead>
                          <TableHead className="text-slate-300 text-right">Device</TableHead>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                      {filteredLogs.map((log) => {
                          const online = isOnline(log.login_time, log.logout_time);
                          let duration = '-';
                          if (log.logout_time && log.login_time) {
                              const diff = new Date(log.logout_time) - new Date(log.login_time);
                              const mins = Math.floor(diff / 60000);
                              duration = `${mins} mins`;
                          } else if (online) {
                              duration = 'Active';
                          }

                          return (
                              <TableRow key={log.id} className="border-slate-800 hover:bg-slate-800/50">
                                  <TableCell>
                                      <div>
                                          <p className="font-medium text-white">{log.profiles?.display_name || 'Unknown'}</p>
                                          <p className="text-xs text-slate-500">{log.profiles?.email}</p>
                                      </div>
                                  </TableCell>
                                  <TableCell>
                                      {online ? (
                                          <Badge className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border-emerald-500/30">
                                              <Wifi className="w-3 h-3 mr-1" /> Online
                                          </Badge>
                                      ) : (
                                          <Badge variant="outline" className="text-slate-500 border-slate-700">
                                              Offline
                                          </Badge>
                                      )}
                                  </TableCell>
                                  <TableCell className="text-slate-300">
                                      <div className="flex flex-col">
                                          <span>{format(new Date(log.login_time), 'MMM d, h:mm a')}</span>
                                          <span className="text-xs text-slate-500">{formatDistanceToNow(new Date(log.login_time))} ago</span>
                                      </div>
                                  </TableCell>
                                  <TableCell className="text-slate-300 font-mono text-xs">
                                      {duration}
                                  </TableCell>
                                  <TableCell className="text-right text-slate-500 text-xs truncate max-w-[150px]" title={log.device_info}>
                                      {log.device_info?.split('(')[0] || 'Web Client'}
                                  </TableCell>
                              </TableRow>
                          );
                      })}
                      {filteredLogs.length === 0 && (
                          <TableRow>
                              <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                                  No activity logs found.
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

export default StudentActivityTab;