import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Search, BookOpen, BarChart2 } from 'lucide-react';
import { UniversityAdminService } from '@/services/universityAdminService';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const CourseProgressTab = ({ universityId }) => {
    const [courses, setCourses] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (universityId) {
            setLoading(true);
            UniversityAdminService.getCourseAnalytics(universityId)
                .then(setCourses)
                .finally(() => setLoading(false));
        }
    }, [universityId]);

    const filteredCourses = courses.filter(c => 
        c.name.toLowerCase().includes(search.toLowerCase()) || 
        c.code.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center bg-[#1E293B] p-4 rounded-lg border border-slate-800">
                <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <Input 
                        placeholder="Search courses..." 
                        className="pl-9 bg-[#0F172A] border-slate-700 text-white"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="text-sm text-slate-400 flex items-center gap-2">
                    <BarChart2 className="w-4 h-4" />
                    Viewing analytics for {filteredCourses.length} courses
                </div>
            </div>

            <Card className="bg-[#1E293B] border-slate-800">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-[#BFFF00]" /> Course Performance Analytics
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader className="bg-[#0F172A]">
                            <TableRow className="border-slate-800 hover:bg-transparent">
                                <TableHead>Code</TableHead>
                                <TableHead>Course Name</TableHead>
                                <TableHead>Enrollments</TableHead>
                                <TableHead>Avg. Grade</TableHead>
                                <TableHead>Completion Rate</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredCourses.map(course => (
                                <TableRow key={course.id} className="border-slate-800 hover:bg-slate-800/50">
                                    <TableCell className="font-mono text-xs text-slate-400">{course.code}</TableCell>
                                    <TableCell className="font-medium text-slate-200">{course.name}</TableCell>
                                    <TableCell className="text-slate-300">{course.enrollmentCount}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="bg-slate-900 border-slate-700 text-yellow-400">
                                            {course.averageGrade}%
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Progress value={course.completionRate} className="h-2 w-24 bg-slate-700" />
                                            <span className="text-xs text-slate-400">{course.completionRate}%</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={course.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'}>
                                            {course.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default CourseProgressTab;