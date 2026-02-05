import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { UniversityAdminService } from '@/services/universityAdminService';
import StudentActivityTimeline from './StudentActivityTimeline';
import { User, Shield, GraduationCap, Box } from 'lucide-react';
import { format } from 'date-fns';

const StudentDetailModal = ({ studentId, open, onOpenChange }) => {
  const [student, setStudent] = useState(null);
  const [courses, setCourses] = useState([]);
  const [access, setAccess] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (studentId && open) {
      loadStudentData();
    }
  }, [studentId, open]);

  const loadStudentData = async () => {
    setLoading(true);
    try {
      const [details, courseData, accessData, activityData] = await Promise.all([
        UniversityAdminService.getStudentDetails(studentId),
        UniversityAdminService.getStudentCourses(studentId),
        UniversityAdminService.getStudentApplicationAccess(studentId),
        UniversityAdminService.getStudentActivityTimeline(studentId)
      ]);
      
      setStudent(details);
      setCourses(courseData);
      setAccess(accessData);
      setTimeline(activityData);
    } catch (error) {
      console.error("Failed to load student details", error);
    } finally {
      setLoading(false);
    }
  };

  if (!student) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0F172A] border-slate-800 text-slate-200">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[#BFFF00] flex items-center justify-center text-black">
               <User className="h-5 w-5" />
            </div>
            {student.name}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
             {student.id} • {student.email}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="bg-[#1E293B] border-slate-700">
                <CardContent className="pt-6">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-400 text-sm">Overall GPA</span>
                        <GraduationCap className="h-4 w-4 text-[#BFFF00]" />
                    </div>
                    <div className="font-semibold text-lg text-white">{student.gpa || '-'}</div>
                </CardContent>
            </Card>
            <Card className="bg-[#1E293B] border-slate-700">
                <CardContent className="pt-6">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-400 text-sm">Status</span>
                        <Shield className="h-4 w-4 text-emerald-400" />
                    </div>
                    <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
                        {student.status || 'Active'}
                    </Badge>
                </CardContent>
            </Card>
             <Card className="bg-[#1E293B] border-slate-700">
                <CardContent className="pt-6">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-400 text-sm">Module</span>
                        <Box className="h-4 w-4 text-blue-400" />
                    </div>
                    {/* Assuming student object has module name joined or fetched. If not present, show Placeholder */}
                    <div className="font-semibold text-lg text-white truncate">
                        {student.modules?.name || 'Assigned Module'}
                    </div>
                </CardContent>
            </Card>
        </div>

        <Tabs defaultValue="courses" className="space-y-4">
            <TabsList className="bg-[#1E293B] border border-slate-700">
                <TabsTrigger value="courses">Courses</TabsTrigger>
                <TabsTrigger value="access">App Access</TabsTrigger>
                <TabsTrigger value="activity">Activity Timeline</TabsTrigger>
            </TabsList>

            <TabsContent value="courses">
                <Card className="bg-[#1E293B] border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-lg">Enrolled Courses</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow className="border-slate-700">
                                    <TableHead>Code</TableHead>
                                    <TableHead>Course Name</TableHead>
                                    <TableHead>Progress</TableHead>
                                    <TableHead>Grade</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {courses.map((course) => (
                                    <TableRow key={course.id} className="border-slate-800">
                                        <TableCell className="font-mono text-slate-400 text-xs">{course.code}</TableCell>
                                        <TableCell className="font-medium">{course.name}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Progress value={course.progress} className="h-1.5 w-16 bg-slate-700" />
                                                <span className="text-xs text-slate-400">{course.progress}%</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`font-bold ${course.grade >= 80 ? 'text-[#BFFF00]' : course.grade >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                                                {course.grade}%
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="bg-slate-800 text-slate-300">
                                                {course.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {courses.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-4 text-slate-500">No courses found.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="access">
                <Card className="bg-[#1E293B] border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-lg">Application Permissions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow className="border-slate-700">
                                    <TableHead>Application</TableHead>
                                    <TableHead>Granted Date</TableHead>
                                    <TableHead>Expires</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {access.map((item) => (
                                    <TableRow key={item.id} className="border-slate-800">
                                        <TableCell className="font-medium text-white">{item.applications?.name}</TableCell>
                                        <TableCell className="text-slate-400 text-xs">
                                            {format(new Date(item.access_granted_date), 'MMM d, yyyy')}
                                        </TableCell>
                                        <TableCell className="text-slate-400 text-xs">
                                            {item.access_expires_date ? format(new Date(item.access_expires_date), 'MMM d, yyyy') : 'Never'}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={item.is_active ? 'border-emerald-500 text-emerald-400' : 'border-slate-600 text-slate-500'}>
                                                {item.is_active ? 'Active' : 'Revoked'}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {access.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-4 text-slate-500">No application access records.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="activity">
                 <Card className="bg-[#1E293B] border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-lg">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <StudentActivityTimeline activities={timeline} />
                    </CardContent>
                 </Card>
            </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default StudentDetailModal;