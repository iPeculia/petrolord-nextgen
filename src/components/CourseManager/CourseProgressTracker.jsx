import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Download, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/customSupabaseClient';

const CourseProgressTracker = ({ courseId }) => {
    const [progressData, setProgressData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (courseId) {
            fetchProgress();
        }
    }, [courseId]);

    const fetchProgress = async () => {
        setLoading(true);
        try {
            // Using student_lesson_progress joined with profiles
            // Since we need aggregated data, we might need a more complex query or edge function
            // For now, let's fetch course enrollments and calc progress
            const { data, error } = await supabase
                .from('course_enrollments')
                .select(`
                    id,
                    student:student_id(display_name, email),
                    progress_percentage,
                    enrolled_at,
                    completed_at,
                    status
                `)
                .eq('course_id', courseId);
            
            if (error) throw error;
            setProgressData(data || []);
        } catch (error) {
            console.error("Error fetching progress:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredData = progressData.filter(item => 
        item.student?.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.student?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleExport = () => {
        // Simple CSV export logic stub
        console.log("Exporting data...", filteredData);
    };

    if (loading) return <div className="p-8 text-center text-slate-400">Loading progress data...</div>;

    return (
        <Card className="bg-[#1E293B] border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white">Student Progress</CardTitle>
                <Button variant="outline" size="sm" onClick={handleExport} className="border-slate-600 text-slate-300">
                    <Download className="w-4 h-4 mr-2" /> Export CSV
                </Button>
            </CardHeader>
            <CardContent>
                <div className="mb-4 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input 
                        placeholder="Search student..." 
                        className="pl-9 bg-[#0F172A] border-slate-600 text-white w-full max-w-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <Table>
                    <TableHeader>
                        <TableRow className="border-slate-700 hover:bg-slate-800/50">
                            <TableHead className="text-slate-400">Student</TableHead>
                            <TableHead className="text-slate-400">Enrolled Date</TableHead>
                            <TableHead className="text-slate-400">Status</TableHead>
                            <TableHead className="text-slate-400 w-[200px]">Progress</TableHead>
                            <TableHead className="text-slate-400 text-right">Completion</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-slate-500 py-8">
                                    No students enrolled yet.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredData.map((record) => (
                                <TableRow key={record.id} className="border-slate-700 hover:bg-slate-800/50">
                                    <TableCell>
                                        <div className="font-medium text-white">{record.student?.display_name || 'Unknown'}</div>
                                        <div className="text-xs text-slate-500">{record.student?.email}</div>
                                    </TableCell>
                                    <TableCell className="text-slate-300">
                                        {new Date(record.enrolled_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <Badge 
                                            variant="outline" 
                                            className={cn(
                                                "capitalize border-0",
                                                record.status === 'completed' ? "bg-emerald-500/10 text-emerald-500" :
                                                record.status === 'in_progress' ? "bg-blue-500/10 text-blue-500" :
                                                "bg-slate-700 text-slate-400"
                                            )}
                                        >
                                            {record.status?.replace('_', ' ')}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Progress value={record.progress_percentage || 0} className="h-2 bg-slate-700" indicatorClassName="bg-[#BFFF00]" />
                                            <span className="text-xs text-slate-400 w-8">{record.progress_percentage}%</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right text-slate-300">
                                        {record.completed_at ? new Date(record.completed_at).toLocaleDateString() : '-'}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

export default CourseProgressTracker;