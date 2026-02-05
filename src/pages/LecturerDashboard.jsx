import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  Search,
  Filter,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { dashboardService } from '@/services/dashboardService';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';

const LecturerDashboard = () => {
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
      const dashboardData = await dashboardService.getLecturerDashboardData(user.id);
      setData(dashboardData);
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard data. Please ensure you are assigned to a university module.");
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = data?.students?.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.email.toLowerCase().includes(search.toLowerCase())
  ) || [];

  if (loading) return <div className="h-screen flex items-center justify-center bg-[#0F172A]"><Loader2 className="w-10 h-10 text-[#BFFF00] animate-spin" /></div>;
  if (error) return <div className="h-screen flex flex-col items-center justify-center bg-[#0F172A] text-white gap-4"><AlertCircle className="w-12 h-12 text-red-500"/><p>{error}</p></div>;

  return (
    <div className="min-h-screen bg-[#0F172A] p-6 text-slate-100">
      <Helmet><title>Lecturer Dashboard | Petrolord</title></Helmet>
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Lecturer Portal</h1>
        <div className="flex flex-wrap gap-4 text-sm text-slate-400">
            <span className="flex items-center gap-2 bg-slate-800 px-3 py-1 rounded-full"><GraduationCap className="w-4 h-4 text-[#BFFF00]"/> {data?.universityName || 'University'}</span>
            <span className="flex items-center gap-2 bg-slate-800 px-3 py-1 rounded-full"><BookOpen className="w-4 h-4 text-blue-400"/> {data?.moduleName || 'Modules'}</span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-[#1E293B] border-slate-800">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-400">Total Students</CardTitle></CardHeader>
            <CardContent><div className="text-3xl font-bold text-white">{data?.stats.totalStudents}</div></CardContent>
        </Card>
        <Card className="bg-[#1E293B] border-slate-800">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-400">Avg Performance</CardTitle></CardHeader>
            <CardContent><div className="text-3xl font-bold text-[#BFFF00]">{data?.stats.avgScore}%</div></CardContent>
        </Card>
        <Card className="bg-[#1E293B] border-slate-800">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-400">Active Module</CardTitle></CardHeader>
            <CardContent><div className="text-lg font-bold text-white truncate">{data?.moduleName}</div></CardContent>
        </Card>
      </div>

      {/* Main Table */}
      <Card className="bg-[#1E293B] border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Student Progress</CardTitle>
            <div className="flex gap-2">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input 
                        placeholder="Search students..." 
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
                        <TableHead className="text-slate-400">Student Name</TableHead>
                        <TableHead className="text-slate-400">Email</TableHead>
                        <TableHead className="text-slate-400">Status</TableHead>
                        <TableHead className="text-slate-400">Progress</TableHead>
                        <TableHead className="text-slate-400">Score</TableHead>
                        <TableHead className="text-right text-slate-400">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredStudents.length > 0 ? filteredStudents.map((student) => (
                        <TableRow key={student.id} className="border-slate-800 hover:bg-slate-800/50 cursor-pointer" onClick={() => setSelectedStudent(student)}>
                            <TableCell className="font-medium text-white">{student.name}</TableCell>
                            <TableCell className="text-slate-400">{student.email}</TableCell>
                            <TableCell><Badge variant="outline" className="border-emerald-500 text-emerald-400 bg-emerald-500/10">Active</Badge></TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Progress value={(student.progress / 10) * 100} className="h-2 w-20 bg-slate-700" />
                                    <span className="text-xs">{student.progress} Courses</span>
                                </div>
                            </TableCell>
                            <TableCell><span className="font-bold text-yellow-400">{student.score}%</span></TableCell>
                            <TableCell className="text-right"><Button size="sm" variant="ghost" className="text-[#BFFF00]">View</Button></TableCell>
                        </TableRow>
                    )) : (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-slate-500">No students found matching your criteria.</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </CardContent>
      </Card>

      {/* Student Detail Modal */}
      <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
        <DialogContent className="bg-[#1E293B] border-slate-800 text-white max-w-2xl">
            <DialogHeader>
                <DialogTitle className="text-xl font-bold flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#BFFF00]" /> {selectedStudent?.name}
                </DialogTitle>
                <DialogDescription className="text-slate-400">{selectedStudent?.email}</DialogDescription>
            </DialogHeader>
            <div className="space-y-6 mt-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-[#0F172A] rounded-lg border border-slate-700">
                        <p className="text-xs text-slate-500 uppercase">Courses Completed</p>
                        <p className="text-2xl font-bold text-white">{selectedStudent?.progress}</p>
                    </div>
                    <div className="p-4 bg-[#0F172A] rounded-lg border border-slate-700">
                        <p className="text-xs text-slate-500 uppercase">Average Score</p>
                        <p className="text-2xl font-bold text-[#BFFF00]">{selectedStudent?.score}%</p>
                    </div>
                </div>
                <div>
                    <h4 className="font-semibold mb-2 text-slate-300">Detailed Breakdown</h4>
                    <p className="text-sm text-slate-500">
                        Detailed course-by-course breakdown is available in the full report. 
                        This student is currently performing {selectedStudent?.score >= 80 ? 'excellently' : 'averagely'} in your module.
                    </p>
                </div>
            </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LecturerDashboard;