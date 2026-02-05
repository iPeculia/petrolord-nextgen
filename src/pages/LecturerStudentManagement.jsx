import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { 
  Users, 
  Search, 
  Filter, 
  ChevronRight, 
  Mail, 
  Clock, 
  Award,
  BookOpen,
  AlertTriangle 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from '@/components/ui/progress';
import { getGradeColor, calculateLetterGrade } from '@/utils/gradingUtils';

const LecturerStudentManagement = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState(false);

  useEffect(() => {
    if (user) {
      fetchStudents();
    }
  }, [user]);

  const fetchStudents = async () => {
    try {
      setLoading(true);

      // 1. Get lecturer's assigned departments
      const { data: assignments } = await supabase
        .from('lecturer_department_assignments')
        .select('department_id')
        .eq('lecturer_id', user.id)
        .eq('status', 'active');
      
      const deptIds = assignments?.map(a => a.department_id) || [];
      
      if (deptIds.length === 0) {
          setStudents([]);
          return;
      }

      // 2. Fetch students in these departments
      const { data: studentList, error } = await supabase
        .from('university_members')
        .select('*')
        .in('department_id', deptIds)
        .eq('role', 'student');

      if (error) throw error;
      
      // 3. Mock progress data/grades (simulating a join with student_course_enrollments/grades)
      // In a real app, this would be a more complex join query
      const studentsWithProgress = studentList.map(s => {
          const mockAvg = Math.floor(Math.random() * 40 + 55); // Random grade 55-95
          return {
            ...s,
            progress: Math.floor(Math.random() * 100),
            lastActive: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toLocaleDateString(),
            quizAvg: mockAvg,
            letterGrade: calculateLetterGrade(mockAvg),
            atRisk: mockAvg < 60
          };
      });

      setStudents(studentsWithProgress);

    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.email.toLowerCase().includes(searchTerm.toLowerCase());
      if (riskFilter) return matchesSearch && s.atRisk;
      return matchesSearch;
  });

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      <Helmet>
        <title>Student Management | Lecturer Portal</title>
      </Helmet>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
               <Users className="h-8 w-8 text-[#BFFF00]" /> Student Management
           </h1>
           <p className="text-slate-400 mt-1">Monitor progress and grades for your department.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center bg-[#1E293B] p-4 rounded-lg border border-slate-800">
         <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input 
              placeholder="Search students..." 
              className="pl-9 bg-[#0F172A] border-slate-700 text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
         <div className="flex gap-2 ml-auto">
             <Button 
                variant={riskFilter ? 'destructive' : 'outline'} 
                className={riskFilter ? 'bg-red-500/20 text-red-400 border-red-500/50 hover:bg-red-500/30' : 'border-slate-700 text-slate-300'}
                onClick={() => setRiskFilter(!riskFilter)}
             >
                 <AlertTriangle className="w-4 h-4 mr-2" /> 
                 {riskFilter ? 'Showing At Risk' : 'Show At Risk Only'}
             </Button>
             <Button variant="outline" className="border-slate-700 text-slate-300">
                 <Filter className="w-4 h-4 mr-2" /> More Filters
             </Button>
         </div>
      </div>

      <Card className="bg-[#1E293B] border-slate-800">
          <CardHeader>
              <CardTitle className="text-white">Enrolled Students ({filteredStudents.length})</CardTitle>
          </CardHeader>
          <CardContent>
              <Table>
                  <TableHeader className="bg-[#0F172A]">
                      <TableRow className="border-slate-700 hover:bg-transparent">
                          <TableHead className="text-slate-300">Student</TableHead>
                          <TableHead className="text-slate-300">Level</TableHead>
                          <TableHead className="text-slate-300">Overall Progress</TableHead>
                          <TableHead className="text-slate-300">Grade Avg</TableHead>
                          <TableHead className="text-slate-300">Last Active</TableHead>
                          <TableHead className="text-right text-slate-300">Actions</TableHead>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                      {filteredStudents.length === 0 ? (
                          <TableRow>
                              <TableCell colSpan={6} className="text-center text-slate-500 py-8">
                                  No students found matching your criteria.
                              </TableCell>
                          </TableRow>
                      ) : (
                          filteredStudents.map((student) => (
                              <TableRow key={student.id} className="border-slate-800 hover:bg-slate-800/50">
                                  <TableCell>
                                      <div className="flex items-center gap-3">
                                          <div>
                                              <p className="font-medium text-white flex items-center gap-2">
                                                  {student.name}
                                                  {student.atRisk && (
                                                      <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded flex items-center" title="At Risk (<60%)">
                                                          !
                                                      </span>
                                                  )}
                                              </p>
                                              <p className="text-xs text-slate-500">{student.email}</p>
                                          </div>
                                      </div>
                                  </TableCell>
                                  <TableCell className="text-slate-300">
                                      {student.level || 'N/A'}
                                  </TableCell>
                                  <TableCell className="w-48">
                                      <div className="flex items-center gap-2">
                                          <Progress value={student.progress} className="h-2" />
                                          <span className="text-xs text-slate-400 w-8">{student.progress}%</span>
                                      </div>
                                  </TableCell>
                                  <TableCell>
                                      <div className="flex items-center gap-2">
                                          <span className="text-sm font-bold text-white">{student.quizAvg}%</span>
                                          <Badge variant="outline" className={getGradeColor(student.letterGrade)}>
                                              {student.letterGrade}
                                          </Badge>
                                      </div>
                                  </TableCell>
                                  <TableCell className="text-slate-400 text-sm">
                                      {student.lastActive}
                                  </TableCell>
                                  <TableCell className="text-right">
                                      <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-white">
                                                  <span className="sr-only">Open menu</span>
                                                  <ChevronRight className="h-4 w-4" />
                                              </Button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent align="end" className="bg-[#0F172A] border-slate-700 text-white">
                                              <DropdownMenuItem className="cursor-pointer hover:bg-slate-800">
                                                  <BookOpen className="mr-2 h-4 w-4" /> View Gradebook
                                              </DropdownMenuItem>
                                              <DropdownMenuItem className="cursor-pointer hover:bg-slate-800">
                                                  <Award className="mr-2 h-4 w-4" /> Quiz History
                                              </DropdownMenuItem>
                                              <DropdownMenuItem className="cursor-pointer hover:bg-slate-800">
                                                  <Mail className="mr-2 h-4 w-4" /> Email Student
                                              </DropdownMenuItem>
                                          </DropdownMenuContent>
                                      </DropdownMenu>
                                  </TableCell>
                              </TableRow>
                          ))
                      )}
                  </TableBody>
              </Table>
          </CardContent>
      </Card>
    </div>
  );
};

export default LecturerStudentManagement;