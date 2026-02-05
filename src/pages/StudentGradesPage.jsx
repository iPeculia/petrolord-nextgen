import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  Award, 
  BookOpen, 
  Download, 
  Filter, 
  TrendingUp,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { calculateGPA, getGradeColor } from '@/utils/gradingUtils';
import { useToast } from '@/components/ui/use-toast';
import StudentProgressWidget from '@/components/dashboard/StudentProgressWidget';

const StudentGradesPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [enrollments, setEnrollments] = useState([]);
  const [grades, setGrades] = useState([]);
  const [overallGPA, setOverallGPA] = useState(0.0);
  const [filter, setFilter] = useState('all'); // all, completed, in_progress

  useEffect(() => {
    if (user) {
      fetchStudentData();
    }
  }, [user]);

  const fetchStudentData = async () => {
    try {
      setLoading(true);

      // 1. Fetch Enrollments
      const { data: enrollmentData, error: enrollError } = await supabase
        .from('student_course_enrollments')
        .select(`
            *,
            courses (
                id,
                title,
                code
            )
        `)
        .eq('student_id', user.id);

      if (enrollError) throw enrollError;

      // 2. Fetch Quiz Grades to calculate course averages if final grade isn't set
      const { data: quizData, error: quizError } = await supabase
        .from('student_quiz_grades')
        .select('*')
        .eq('student_id', user.id);

      if (quizError) throw quizError;
      
      setGrades(quizData || []);

      // Process enrollments to attach calculated grades
      const processedEnrollments = enrollmentData.map(enrollment => {
          // Find quizzes for this course (assuming we have a course_id link in quizzes, but for now we mock the link via ID)
          // In real implementation, we join quiz -> course.
          // Here, we'll calculate a mock grade if 'final_grade' is missing, or use stored.
          
          let finalGrade = enrollment.status === 'completed' ? 'A' : 'N/A';
          let percentage = enrollment.progress_percentage || 0;
          
          // Mock logic for demo if no real quiz data linked to specific courses
          if(enrollment.status === 'completed' && !enrollment.final_grade) {
             const mockScore = 85 + Math.floor(Math.random() * 15);
             percentage = 100;
             finalGrade = mockScore >= 90 ? 'A' : 'B';
          } else if (enrollment.final_grade) {
             // If numeric
             if (!isNaN(enrollment.final_grade)) {
                percentage = enrollment.final_grade;
                finalGrade = percentage >= 90 ? 'A' : percentage >= 80 ? 'B' : percentage >= 70 ? 'C' : percentage >= 60 ? 'D' : 'F';
             }
          }

          return {
              ...enrollment,
              title: enrollment.courses?.title,
              code: enrollment.courses?.code || 'CRS-101',
              calculatedGrade: finalGrade,
              calculatedPercentage: percentage,
              nextLesson: 'Module 3: Advanced Concepts', // Mock next lesson
              estCompletion: '3 Days'
          };
      });

      setEnrollments(processedEnrollments);

      // Calculate GPA from completed courses
      const completedCourses = processedEnrollments.filter(e => e.status === 'completed' || e.calculatedPercentage >= 100);
      const gradeList = completedCourses.map(c => ({ letter_grade: c.calculatedGrade }));
      setOverallGPA(calculateGPA(gradeList));

    } catch (error) {
      console.error("Error fetching grades:", error);
      toast({ title: "Error", description: "Could not load grades.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const filteredEnrollments = enrollments.filter(e => {
      if (filter === 'all') return true;
      if (filter === 'completed') return e.status === 'completed' || e.calculatedPercentage >= 100;
      if (filter === 'in_progress') return e.status !== 'completed' && e.calculatedPercentage < 100;
      return true;
  });

  const exportResults = () => {
    toast({
        title: "Exporting Results",
        description: "Your academic transcript is being generated as a PDF...",
    });
    // In a real app, implement PDF generation here using jsPDF
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      <Helmet>
        <title>My Grades & Progress | Petrolord</title>
      </Helmet>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Academic Results</h1>
          <p className="text-slate-400 mt-1">Track your course performance and GPA.</p>
        </div>
        <Button onClick={exportResults} className="bg-[#BFFF00] text-black hover:bg-[#a3d900] font-bold">
            <Download className="w-4 h-4 mr-2" /> Download Transcript
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-[#1E293B] border-slate-800">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">Overall GPA</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold text-white flex items-baseline gap-2">
                    {overallGPA}
                    <span className="text-sm font-normal text-slate-500">/ 4.0</span>
                </div>
            </CardContent>
        </Card>
        
        <Card className="bg-[#1E293B] border-slate-800">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">Credits Earned</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold text-white flex items-baseline gap-2">
                    {enrollments.filter(e => e.status === 'completed').length * 3}
                    <span className="text-sm font-normal text-slate-500">Units</span>
                </div>
            </CardContent>
        </Card>

        <Card className="bg-[#1E293B] border-slate-800">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">Completion Rate</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold text-[#BFFF00]">
                    {Math.round((enrollments.filter(e => e.status === 'completed').length / (enrollments.length || 1)) * 100)}%
                </div>
            </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
         {/* Main Grade Table */}
         <Card className="md:col-span-2 bg-[#1E293B] border-slate-800">
             <CardHeader>
                 <div className="flex justify-between items-center">
                    <CardTitle className="text-white">Course Grades</CardTitle>
                    <div className="flex gap-2">
                        <Button 
                            variant={filter === 'all' ? 'default' : 'ghost'} 
                            size="sm"
                            onClick={() => setFilter('all')}
                            className={filter === 'all' ? 'bg-slate-700 text-white' : 'text-slate-400'}
                        >All</Button>
                        <Button 
                            variant={filter === 'completed' ? 'default' : 'ghost'} 
                            size="sm"
                            onClick={() => setFilter('completed')}
                            className={filter === 'completed' ? 'bg-slate-700 text-white' : 'text-slate-400'}
                        >Completed</Button>
                        <Button 
                            variant={filter === 'in_progress' ? 'default' : 'ghost'} 
                            size="sm"
                            onClick={() => setFilter('in_progress')}
                            className={filter === 'in_progress' ? 'bg-slate-700 text-white' : 'text-slate-400'}
                        >In Progress</Button>
                    </div>
                 </div>
             </CardHeader>
             <CardContent>
                 <Table>
                     <TableHeader className="bg-[#0F172A]">
                         <TableRow className="border-slate-700 hover:bg-transparent">
                             <TableHead className="text-slate-300">Course</TableHead>
                             <TableHead className="text-slate-300">Completion Date</TableHead>
                             <TableHead className="text-slate-300">Score</TableHead>
                             <TableHead className="text-slate-300">Grade</TableHead>
                             <TableHead className="text-slate-300 text-right">Status</TableHead>
                         </TableRow>
                     </TableHeader>
                     <TableBody>
                         {filteredEnrollments.map((enrollment) => (
                             <TableRow key={enrollment.id} className="border-slate-800 hover:bg-slate-800/50">
                                 <TableCell>
                                     <div>
                                         <p className="font-medium text-white">{enrollment.title}</p>
                                         <p className="text-xs text-slate-500">{enrollment.code}</p>
                                     </div>
                                 </TableCell>
                                 <TableCell className="text-slate-400">
                                     {enrollment.completed_at ? new Date(enrollment.completed_at).toLocaleDateString() : '-'}
                                 </TableCell>
                                 <TableCell className="text-white font-mono">
                                     {enrollment.calculatedPercentage}%
                                 </TableCell>
                                 <TableCell>
                                    {enrollment.calculatedGrade !== 'N/A' && (
                                        <Badge variant="outline" className={getGradeColor(enrollment.calculatedGrade)}>
                                            {enrollment.calculatedGrade}
                                        </Badge>
                                    )}
                                 </TableCell>
                                 <TableCell className="text-right">
                                     {enrollment.status === 'completed' ? (
                                         <span className="flex items-center justify-end text-emerald-400 text-xs gap-1">
                                             <CheckCircle2 className="w-3 h-3" /> Completed
                                         </span>
                                     ) : (
                                         <span className="flex items-center justify-end text-blue-400 text-xs gap-1">
                                             <TrendingUp className="w-3 h-3" /> In Progress
                                         </span>
                                     )}
                                 </TableCell>
                             </TableRow>
                         ))}
                         {filteredEnrollments.length === 0 && (
                             <TableRow>
                                 <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                                     No records found for this filter.
                                 </TableCell>
                             </TableRow>
                         )}
                     </TableBody>
                 </Table>
             </CardContent>
         </Card>

         {/* Side Widgets */}
         <div className="space-y-6">
             {/* Use the new reusable Progress Widget */}
             <StudentProgressWidget courses={enrollments.filter(e => e.status !== 'completed').map(e => ({
                 id: e.course_id,
                 title: e.title,
                 progress: e.calculatedPercentage,
                 nextLesson: e.nextLesson,
                 estCompletion: e.estCompletion,
                 status: e.status
             }))} />

             {/* Recent Quiz Activity Widget */}
             <Card className="bg-[#1E293B] border-slate-800">
                 <CardHeader>
                     <CardTitle className="text-white text-lg flex items-center gap-2">
                         <Award className="h-5 w-5 text-orange-400" /> Recent Quizzes
                     </CardTitle>
                 </CardHeader>
                 <CardContent>
                     <div className="space-y-4">
                         {grades.slice(0, 3).map((grade, i) => (
                             <div key={i} className="flex justify-between items-center pb-3 border-b border-slate-800 last:border-0 last:pb-0">
                                 <div>
                                     <p className="text-sm text-slate-200">Quiz #{i + 1}</p>
                                     <p className="text-xs text-slate-500">{new Date(grade.completed_date || Date.now()).toLocaleDateString()}</p>
                                 </div>
                                 <Badge variant="outline" className={getGradeColor(calculateGPA([{letter_grade: grade.letter_grade}]) > 3 ? 'A' : 'C')}>
                                     {grade.score}/{grade.total || 100}
                                 </Badge>
                             </div>
                         ))}
                         {grades.length === 0 && (
                             <p className="text-sm text-slate-500 text-center py-2">No quiz attempts yet.</p>
                         )}
                     </div>
                 </CardContent>
             </Card>
         </div>
      </div>
    </div>
  );
};

export default StudentGradesPage;