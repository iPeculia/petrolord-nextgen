import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { 
  Building2, 
  Users, 
  Award, 
  BookOpen, 
  Search, 
  Filter, 
  Download,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { dashboardService } from '@/services/dashboardService';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const UniversityAdminDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      const adminData = await dashboardService.getUniversityAdminData(user.id);
      setData(adminData);
    } catch (err) {
      console.error(err);
      setError("Failed to load university data. Ensure you are a registered university administrator.");
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = data?.students?.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    s.module.toLowerCase().includes(search.toLowerCase())
  ) || [];

  if (loading) return <div className="h-screen flex items-center justify-center bg-[#0F172A]"><Loader2 className="w-10 h-10 text-[#BFFF00] animate-spin" /></div>;
  if (error) return <div className="h-screen flex flex-col items-center justify-center bg-[#0F172A] text-white gap-4"><AlertCircle className="w-12 h-12 text-red-500"/><p>{error}</p></div>;

  return (
    <div className="min-h-screen bg-[#0F172A] p-6 text-slate-100">
      <Helmet><title>University Admin | Petrolord</title></Helmet>

      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                <Building2 className="w-8 h-8 text-[#BFFF00]" />
                {data?.universityName || 'University'} Administration
            </h1>
            <p className="text-slate-400">Comprehensive overview of student performance across all modules.</p>
        </div>
        <Button variant="outline" className="border-slate-700 text-slate-300 hover:text-white">
            <Download className="w-4 h-4 mr-2" /> Export Report
        </Button>
      </div>

      {/* High-level Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-[#1E293B] border-slate-800">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-400">Total Enrollment</CardTitle></CardHeader>
            <CardContent className="flex items-end justify-between">
                <div className="text-3xl font-bold text-white">{data?.overview.totalStudents}</div>
                <Users className="w-6 h-6 text-blue-400 mb-1" />
            </CardContent>
        </Card>
        <Card className="bg-[#1E293B] border-slate-800">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-400">Certificates Issued</CardTitle></CardHeader>
            <CardContent className="flex items-end justify-between">
                <div className="text-3xl font-bold text-[#BFFF00]">{data?.overview.totalCertificates}</div>
                <Award className="w-6 h-6 text-[#BFFF00] mb-1" />
            </CardContent>
        </Card>
        <Card className="bg-[#1E293B] border-slate-800">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-400">Avg. Completion</CardTitle></CardHeader>
            <CardContent className="flex items-end justify-between">
                <div className="text-3xl font-bold text-emerald-400">{data?.overview.avgPerformance}%</div>
                <BookOpen className="w-6 h-6 text-emerald-400 mb-1" />
            </CardContent>
        </Card>
      </div>

      {/* Module Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
         <Card className="bg-[#1E293B] border-slate-800">
            <CardHeader><CardTitle className="text-white text-lg">Module Performance</CardTitle></CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {data?.moduleStats.map((stat, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-[#0F172A] rounded-lg border border-slate-700">
                            <div>
                                <p className="font-semibold text-white">{stat.name}</p>
                                <p className="text-xs text-slate-500">{stat.studentCount} Students</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-[#BFFF00]">{stat.avgScore}%</p>
                                <p className="text-xs text-slate-500">Avg Score</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
         </Card>
         
         <Card className="bg-[#1E293B] border-slate-800">
            <CardHeader><CardTitle className="text-white text-lg">Certification Distribution</CardTitle></CardHeader>
            <CardContent className="flex items-center justify-center h-64">
                <div className="text-slate-500 text-center">
                    <p>Chart Visualization Placeholder</p>
                    <p className="text-xs mt-2">Integrate Recharts here for visual distribution.</p>
                </div>
            </CardContent>
         </Card>
      </div>

      {/* Main Student List */}
      <Card className="bg-[#1E293B] border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Student Directory</CardTitle>
            <div className="flex gap-2">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input 
                        placeholder="Search..." 
                        className="pl-9 bg-[#0F172A] border-slate-700 text-white w-64"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Button variant="outline" className="border-slate-700 text-slate-300"><Filter className="w-4 h-4 mr-2"/> Filter</Button>
            </div>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader className="bg-[#0F172A]">
                    <TableRow className="border-slate-700">
                        <TableHead className="text-slate-400">Name</TableHead>
                        <TableHead className="text-slate-400">Module</TableHead>
                        <TableHead className="text-slate-400">Status</TableHead>
                        <TableHead className="text-slate-400">Courses Completed</TableHead>
                        <TableHead className="text-slate-400">Certificates</TableHead>
                        <TableHead className="text-right text-slate-400">Avg Score</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredStudents.map((s) => (
                        <TableRow key={s.id} className="border-slate-800 hover:bg-slate-800/50 cursor-pointer" onClick={() => setSelectedStudent(s)}>
                            <TableCell>
                                <div className="font-medium text-white">{s.name}</div>
                                <div className="text-xs text-slate-500">{s.email}</div>
                            </TableCell>
                            <TableCell className="text-slate-300">{s.module}</TableCell>
                            <TableCell><Badge variant="outline" className="border-blue-500 text-blue-400 bg-blue-500/10">Enrolled</Badge></TableCell>
                            <TableCell className="text-white">{s.progress}</TableCell>
                            <TableCell className="text-white">{s.certificates}</TableCell>
                            <TableCell className="text-right font-bold text-[#BFFF00]">{s.avgScore}%</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
        <DialogContent className="bg-[#1E293B] border-slate-800 text-white">
            <DialogHeader>
                <DialogTitle className="text-xl font-bold">{selectedStudent?.name}</DialogTitle>
                <CardDescription className="text-slate-400">{selectedStudent?.email} • {selectedStudent?.module}</CardDescription>
            </DialogHeader>
            <div className="mt-4 p-4 bg-[#0F172A] rounded-lg border border-slate-700">
                <h4 className="font-semibold text-white mb-2">Performance Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                        <span className="text-slate-400">Certificates Earned:</span>
                        <span className="text-white">{selectedStudent?.certificates}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-400">Average Score:</span>
                        <span className="text-[#BFFF00] font-bold">{selectedStudent?.avgScore}%</span>
                    </div>
                </div>
            </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UniversityAdminDashboard;