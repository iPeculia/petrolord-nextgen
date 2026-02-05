import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Users, BookOpen, GraduationCap, Building2, BarChart2, TrendingUp, UserPlus, FileCheck } from 'lucide-react';
import { UniversityAdminService } from '@/services/universityAdminService';

const UniversityOverviewTab = ({ universityId }) => {
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalLecturers: 0,
        totalDepartments: 0,
        activeCourses: 0,
        avgPerformance: 0,
        courseCompletionRate: 0
    });

    useEffect(() => {
        if (universityId) {
            UniversityAdminService.getOverviewStats(universityId).then(setStats);
        }
    }, [universityId]);

    const StatCard = ({ title, value, icon: Icon, colorClass, subtext }) => (
        <Card className="bg-[#1E293B]/80 backdrop-blur-sm border-slate-800 shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">{title}</CardTitle>
                <div className={`p-2 rounded-lg ${colorClass} bg-opacity-10`}>
                    <Icon className={`h-4 w-4 ${colorClass.replace('bg-', 'text-')}`} />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-white">{value}</div>
                {subtext && <p className="text-xs text-slate-500 mt-1">{subtext}</p>}
            </CardContent>
        </Card>
    );

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard 
                    title="Total Students" 
                    value={stats.totalStudents} 
                    icon={Users} 
                    colorClass="text-[#BFFF00] bg-[#BFFF00]/10"
                    subtext="Currently enrolled"
                />
                <StatCard 
                    title="Faculty Members" 
                    value={stats.totalLecturers} 
                    icon={GraduationCap} 
                    colorClass="text-purple-400 bg-purple-400/10"
                    subtext="Active lecturers"
                />
                <StatCard 
                    title="Departments" 
                    value={stats.totalDepartments} 
                    icon={Building2} 
                    colorClass="text-blue-400 bg-blue-400/10"
                    subtext="Academic units"
                />
                <StatCard 
                    title="Avg Performance" 
                    value={`${stats.avgPerformance}%`} 
                    icon={BarChart2} 
                    colorClass="text-emerald-400 bg-emerald-400/10"
                    subtext="Across all courses"
                />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="bg-[#1E293B] border-slate-800 shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-[#BFFF00]" /> Recent Activity
                        </CardTitle>
                        <CardDescription>Latest updates and enrollments.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center gap-4 border-b border-slate-800/50 last:border-0 pb-4 last:pb-0">
                                    <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center">
                                        <UserPlus className="w-4 h-4 text-blue-400" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-white">New student enrollment</p>
                                        <p className="text-xs text-slate-500">A new student joined the Petroleum Engineering dept.</p>
                                    </div>
                                    <div className="text-xs text-slate-500">2h ago</div>
                                </div>
                            ))}
                            <div className="flex items-center gap-4 border-b border-slate-800/50 last:border-0 pb-4 last:pb-0">
                                <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center">
                                    <FileCheck className="w-4 h-4 text-emerald-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-white">Course Completed</p>
                                    <p className="text-xs text-slate-500">5 students completed "Intro to Reservoir Eng"</p>
                                </div>
                                <div className="text-xs text-slate-500">5h ago</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] border-slate-800 shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-white">Quick Insights</CardTitle>
                        <CardDescription>Key performance indicators.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-slate-300">Course Completion Rate</span>
                                <span className="text-sm font-bold text-[#BFFF00]">{stats.courseCompletionRate}%</span>
                            </div>
                            <div className="w-full bg-slate-800 rounded-full h-2">
                                <div className="bg-[#BFFF00] h-2 rounded-full transition-all duration-1000" style={{ width: `${stats.courseCompletionRate}%` }}></div>
                            </div>
                        </div>
                        
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-slate-300">License Utilization</span>
                                <span className="text-sm font-bold text-blue-400">
                                    {Math.round((stats.totalStudents / 1000) * 100)}%
                                </span>
                            </div>
                            <div className="w-full bg-slate-800 rounded-full h-2">
                                <div className="bg-blue-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${(stats.totalStudents / 1000) * 100}%` }}></div>
                            </div>
                            <p className="text-xs text-slate-500 mt-2 text-right">{stats.totalStudents} / 1000 seats used</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default UniversityOverviewTab;