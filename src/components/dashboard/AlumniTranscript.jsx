import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Download, Building2, Calendar, FileText, ShieldCheck } from 'lucide-react';
import { format } from 'date-fns';
import { utils, writeFile } from 'xlsx';

const AlumniTranscript = ({ user, profile, licenseInfo, stats }) => {
    // Mock courses for transcript display (in real app, fetch from courses enrolled)
    const courses = [
        { id: 1, name: 'Advanced Reservoir Engineering', code: 'RES-401', grade: 'A', score: 92, credits: 4, status: 'Completed', date: '2025-05-15' },
        { id: 2, name: 'Petrophysical Analysis Fundamentals', code: 'GEO-302', grade: 'A-', score: 88, credits: 3, status: 'Completed', date: '2024-12-10' },
        { id: 3, name: 'Drilling Mechanics', code: 'DRL-205', grade: 'B+', score: 85, credits: 3, status: 'Completed', date: '2024-06-20' },
        { id: 4, name: 'Production Optimization', code: 'PRO-330', grade: 'A', score: 95, credits: 4, status: 'Completed', date: '2025-01-15' },
    ];

    const gpa = 3.85; // Mock GPA

    const handleDownload = () => {
        // Simple Excel download for MVP
        const data = courses.map(c => ({
            "Course Name": c.name,
            "Course Code": c.code,
            "Credits": c.credits,
            "Grade": c.grade,
            "Score": c.score,
            "Completion Date": c.date
        }));
        
        const ws = utils.json_to_sheet(data);
        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, "Transcript");
        writeFile(wb, `Transcript_${profile?.display_name || 'Student'}.xlsx`);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Building2 className="w-6 h-6 text-[#BFFF00]" /> Petrolord University
                    </h2>
                    <p className="text-slate-400 text-sm">Official Academic Transcript</p>
                </div>
                <Button onClick={handleDownload} className="bg-[#BFFF00] text-black hover:bg-[#a3d900]">
                    <Download className="w-4 h-4 mr-2" /> Download PDF/Excel
                </Button>
            </div>

            <Card className="bg-[#1E293B] border-slate-700">
                <CardContent className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                        <div>
                            <p className="text-xs text-slate-500 uppercase">Student Name</p>
                            <p className="text-lg font-medium text-white">{profile?.display_name}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase">Student ID</p>
                            <p className="text-lg font-medium text-white">{user?.id?.substring(0, 8).toUpperCase()}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase">Graduation Date</p>
                            <p className="text-lg font-medium text-emerald-400">
                                {licenseInfo?.graduationDate ? format(new Date(licenseInfo.graduationDate), 'MMM d, yyyy') : 'N/A'}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase">Cumulative GPA</p>
                            <p className="text-lg font-bold text-[#BFFF00]">{gpa}</p>
                        </div>
                    </div>

                    <div className="rounded-md border border-slate-700 overflow-hidden">
                        <Table>
                            <TableHeader className="bg-slate-800">
                                <TableRow className="border-slate-700">
                                    <TableHead className="text-slate-300">Course</TableHead>
                                    <TableHead className="text-slate-300">Code</TableHead>
                                    <TableHead className="text-slate-300 text-center">Credits</TableHead>
                                    <TableHead className="text-slate-300 text-center">Date</TableHead>
                                    <TableHead className="text-slate-300 text-right">Grade</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {courses.map((course) => (
                                    <TableRow key={course.id} className="border-slate-700 hover:bg-slate-800/50">
                                        <TableCell className="font-medium text-slate-200">{course.name}</TableCell>
                                        <TableCell className="text-slate-400 text-xs font-mono">{course.code}</TableCell>
                                        <TableCell className="text-center text-slate-400">{course.credits}</TableCell>
                                        <TableCell className="text-center text-slate-400 text-sm">{course.date}</TableCell>
                                        <TableCell className="text-right">
                                            <span className="font-bold text-white mr-2">{course.grade}</span>
                                            <span className="text-xs text-slate-500">({course.score}%)</span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="mt-8 flex justify-between items-center border-t border-slate-700 pt-6">
                        <div className="flex items-center gap-2 text-slate-500 text-xs">
                             <ShieldCheck className="w-4 h-4" />
                             Generated securely by Petrolord System
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-medium text-slate-300">Registrar Signature</p>
                            <p className="text-xs text-slate-500 italic mt-1">Digitally Signed</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AlumniTranscript;