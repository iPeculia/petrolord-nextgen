import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Activity, Search, Filter, RefreshCw, Download, 
  Users, AlertTriangle, CheckCircle, XCircle, Clock,
  ShieldAlert, Database
} from 'lucide-react';
import { format } from 'date-fns';
import { utils, writeFile } from 'xlsx';
import { ACTIONS, LOG_TYPES } from '@/services/auditService';

const POLL_INTERVAL = 5000; // 5 seconds

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
  <Card className="bg-[#1E293B] border-slate-800">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <h3 className="text-2xl font-bold text-white mt-2">{value}</h3>
        </div>
        <div className={`p-3 rounded-full bg-${color}-500/10`}>
          <Icon className={`w-6 h-6 text-${color}-500`} />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center text-xs text-slate-500">
          <span className="text-emerald-400 font-medium mr-1">{trend}</span> since last hour
        </div>
      )}
    </CardContent>
  </Card>
);

const RealTimeMonitoringPage = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  
  // Stats
  const [stats, setStats] = useState({
    activeUsers: 0,
    errorsToday: 0,
    loginsToday: 0,
    actionsToday: 0
  });

  // Filters
  const [filterAction, setFilterAction] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const refreshInterval = useRef(null);

  useEffect(() => {
    fetchLogs();
    fetchStats();

    if (autoRefresh) {
      refreshInterval.current = setInterval(() => {
        fetchLogs(true); // Quiet refresh
        fetchStats();
      }, POLL_INTERVAL);
    }

    return () => {
      if (refreshInterval.current) clearInterval(refreshInterval.current);
    };
  }, [autoRefresh]);

  const fetchStats = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayStr = today.toISOString();

      // Get logins today
      const { count: logins } = await supabase
        .from('audit_logs')
        .select('*', { count: 'exact', head: true })
        .eq('action', 'LOGIN')
        .gte('timestamp', todayStr);

      // Get errors today
      const { count: errors } = await supabase
        .from('audit_logs')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'failure')
        .gte('timestamp', todayStr);

      // Get total actions today
      const { count: total } = await supabase
        .from('audit_logs')
        .select('*', { count: 'exact', head: true })
        .gte('timestamp', todayStr);

      // Estimate active users (unique actors in last hour)
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      const { data: activeData } = await supabase
        .from('audit_logs')
        .select('actor_id')
        .gte('timestamp', oneHourAgo);
      
      const uniqueActive = new Set(activeData?.map(l => l.actor_id)).size;

      setStats({
        loginsToday: logins || 0,
        errorsToday: errors || 0,
        actionsToday: total || 0,
        activeUsers: uniqueActive || 0
      });

    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchLogs = async (quiet = false) => {
    if (!quiet) setLoading(true);
    try {
      let query = supabase
        .from('audit_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100);

      // Apply basic filters if not 'all'
      // Note: Complex filtering usually done on client for small datasets or specialized RPC for large
      // Here we fetch latest 100 and filter client side for responsiveness on the "Live Feed" feel
      
      const { data, error } = await query;
      
      if (error) throw error;
      setLogs(data);
      setLastRefreshed(new Date());
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      if (!quiet) setLoading(false);
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'LOGIN': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'LOGOUT': return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
      case 'QUIZ_SUBMIT': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      case 'GRADE_CHANGE': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      case 'SYSTEM_ERROR': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'COURSE_COMPLETE': return 'text-[#BFFF00] bg-[#BFFF00]/10 border-[#BFFF00]/20';
      default: return 'text-slate-300 bg-slate-800 border-slate-700';
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesAction = filterAction === 'all' || log.action === filterAction;
    const matchesRole = filterRole === 'all' || log.actor_role === filterRole;
    const matchesSearch = searchTerm === '' || 
      log.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesAction && matchesRole && matchesSearch;
  });

  const exportLogs = () => {
    const dataToExport = filteredLogs.map(log => ({
      Timestamp: format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm:ss'),
      Action: log.action,
      Actor: log.user_email,
      Role: log.actor_role,
      Resource: log.resource_name,
      Type: log.resource_type,
      Status: log.status,
      Details: JSON.stringify(log.details)
    }));

    const ws = utils.json_to_sheet(dataToExport);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Audit Logs");
    writeFile(wb, `Audit_Logs_${format(new Date(), 'yyyy-MM-dd_HHmm')}.xlsx`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <Activity className="h-8 w-8 text-[#BFFF00]" /> Real-Time Monitoring
          </h1>
          <p className="text-slate-400 mt-1">
            Live system event feed. Last updated: {format(lastRefreshed, 'HH:mm:ss')}
          </p>
        </div>
        <div className="flex items-center gap-2">
           <Button 
            variant={autoRefresh ? "secondary" : "outline"}
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={autoRefresh ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50" : "border-slate-700"}
           >
             <RefreshCw className={`w-4 h-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
             {autoRefresh ? 'Live Updates On' : 'Live Updates Off'}
           </Button>
           <Button onClick={exportLogs} variant="outline" className="border-slate-700 hover:bg-slate-800 text-slate-200">
             <Download className="w-4 h-4 mr-2" /> Export
           </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Active Users (1h)" value={stats.activeUsers} icon={Users} color="blue" />
        <StatCard title="Events Today" value={stats.actionsToday} icon={Database} color="purple" />
        <StatCard title="Logins Today" value={stats.loginsToday} icon={CheckCircle} color="emerald" />
        <StatCard title="Errors Today" value={stats.errorsToday} icon={AlertTriangle} color="red" />
      </div>

      {/* Main Log Feed */}
      <Card className="bg-[#1E293B] border-slate-800">
        <CardHeader className="pb-3">
           <div className="flex flex-col md:flex-row justify-between gap-4">
             <CardTitle className="text-white text-lg font-medium">Event Stream</CardTitle>
             <div className="flex flex-wrap gap-2">
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input 
                      placeholder="Search actor, resource..." 
                      className="pl-9 bg-[#0F172A] border-slate-700 text-slate-200 h-9 text-sm"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Select value={filterAction} onValueChange={setFilterAction}>
                    <SelectTrigger className="w-[140px] h-9 bg-[#0F172A] border-slate-700 text-slate-200 text-sm">
                        <SelectValue placeholder="Action" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1E293B] border-slate-700 text-slate-200">
                        <SelectItem value="all">All Actions</SelectItem>
                        <SelectItem value="LOGIN">Login</SelectItem>
                        <SelectItem value="QUIZ_SUBMIT">Quiz Submit</SelectItem>
                        <SelectItem value="GRADE_CHANGE">Grade Change</SelectItem>
                        <SelectItem value="SYSTEM_ERROR">Errors</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={filterRole} onValueChange={setFilterRole}>
                    <SelectTrigger className="w-[140px] h-9 bg-[#0F172A] border-slate-700 text-slate-200 text-sm">
                        <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1E293B] border-slate-700 text-slate-200">
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="lecturer">Lecturer</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                </Select>
             </div>
           </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-slate-800 overflow-hidden">
             <Table>
                <TableHeader className="bg-[#0F172A]">
                  <TableRow className="border-slate-800 hover:bg-transparent">
                    <TableHead className="text-slate-400 w-[180px]">Timestamp</TableHead>
                    <TableHead className="text-slate-400">Action</TableHead>
                    <TableHead className="text-slate-400">Actor</TableHead>
                    <TableHead className="text-slate-400">Resource</TableHead>
                    <TableHead className="text-slate-400 text-center">Status</TableHead>
                    <TableHead className="text-slate-400 text-right">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.length > 0 ? (
                    filteredLogs.map((log) => (
                      <TableRow key={log.id} className="border-slate-800 hover:bg-slate-800/50">
                        <TableCell className="font-mono text-xs text-slate-400">
                          {format(new Date(log.timestamp), 'MMM d, HH:mm:ss')}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-xs ${getActionColor(log.action)}`}>
                            {log.action}
                          </Badge>
                        </TableCell>
                        <TableCell>
                           <div className="flex flex-col">
                              <span className="text-sm text-slate-200">{log.user_email || 'System'}</span>
                              <span className="text-xs text-slate-500 capitalize">{log.actor_role}</span>
                           </div>
                        </TableCell>
                        <TableCell>
                            <span className="text-sm text-slate-300">{log.resource_name || log.resource_id || '-'}</span>
                            {log.resource_type && <span className="text-xs text-slate-500 ml-1">({log.resource_type})</span>}
                        </TableCell>
                        <TableCell className="text-center">
                           {log.status === 'success' ? (
                             <CheckCircle className="w-4 h-4 text-emerald-500 mx-auto" />
                           ) : (
                             <XCircle className="w-4 h-4 text-red-500 mx-auto" />
                           )}
                        </TableCell>
                        <TableCell className="text-right">
                           <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-slate-400 hover:text-white">
                              <Search className="w-3 h-3" />
                           </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                        No events found matching current filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
             </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeMonitoringPage;