import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { UniversityAdminService } from '@/services/universityAdminService';
import CourseProgressTab from './CourseProgressTab';
import ApplicationAccessTab from './ApplicationAccessTab';
import { BarChart2, BookOpen, Lock } from 'lucide-react';

const UniversityPerformanceTab = ({ universityId }) => {
  const [data, setData] = useState({
      gpaByDepartment: [],
      completionRate: [],
      progressDistribution: []
  });

  useEffect(() => {
    if (universityId) {
        UniversityAdminService.getPerformanceMetrics(universityId).then(setData);
    }
  }, [universityId]);

  const COLORS = ['#BFFF00', '#3B82F6', '#8B5CF6', '#F59E0B', '#10B981'];

  return (
    <div className="space-y-6">
       <Tabs defaultValue="overview" className="w-full">
           <TabsList className="bg-[#1E293B] border border-slate-800">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                    <BarChart2 className="w-4 h-4" /> Overview
                </TabsTrigger>
                <TabsTrigger value="courses" className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" /> Course Analytics
                </TabsTrigger>
                <TabsTrigger value="access" className="flex items-center gap-2">
                    <Lock className="w-4 h-4" /> App Access
                </TabsTrigger>
           </TabsList>

           <TabsContent value="overview" className="space-y-6 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card className="bg-[#1E293B] border-slate-800 shadow-lg flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-white">Average GPA by Department</CardTitle>
                        <CardDescription>Academic performance overview.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.gpaByDepartment} layout="vertical" margin={{ left: 40 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                            <XAxis type="number" domain={[0, 4]} stroke="#94a3b8" />
                            <YAxis dataKey="name" type="category" stroke="#94a3b8" width={100} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #334155', color: '#fff' }}
                                itemStyle={{ color: '#BFFF00' }}
                                cursor={{ fill: 'transparent' }}
                            />
                            <Bar dataKey="value" fill="#BFFF00" radius={[0, 4, 4, 0]} barSize={20} />
                        </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                    </Card>

                    <Card className="bg-[#1E293B] border-slate-800 shadow-lg flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-white">Course Completion Status</CardTitle>
                        <CardDescription>Overall student progress.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                            data={data.completionRate}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            >
                            {data.completionRate.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                            </Pie>
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #334155', color: '#fff' }}
                            />
                        </PieChart>
                        </ResponsiveContainer>
                        <div className="flex justify-center gap-4 text-xs text-slate-400 mt-4">
                            {data.completionRate.map((entry, index) => (
                                <div key={index} className="flex items-center gap-1">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                    {entry.name}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                    </Card>

                    <Card className="bg-[#1E293B] border-slate-800 shadow-lg flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-white">Progress Distribution</CardTitle>
                        <CardDescription>Student completion ranges.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data.progressDistribution}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                            <XAxis dataKey="range" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #334155', color: '#fff' }}
                            />
                            <Line type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={2} dot={{ fill: '#3B82F6' }} />
                        </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                    </Card>
                </div>
           </TabsContent>

           <TabsContent value="courses" className="mt-4">
               <CourseProgressTab universityId={universityId} />
           </TabsContent>

           <TabsContent value="access" className="mt-4">
               <ApplicationAccessTab universityId={universityId} />
           </TabsContent>
       </Tabs>
    </div>
  );
};

export default UniversityPerformanceTab;