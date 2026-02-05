import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { 
  BookOpen, 
  Search, 
  Plus, 
  MoreHorizontal, 
  Users, 
  FileText, 
  Settings,
  Eye
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const LecturerCourseManagement = () => {
  // Mock Data for UI demonstration
  const [courses] = useState([
      { id: 1, title: 'Introduction to Geoscience', students: 45, status: 'Active', progress: 68 },
      { id: 2, title: 'Reservoir Simulation Basics', students: 32, status: 'Active', progress: 42 },
      { id: 3, title: 'Advanced Petrophysics', students: 18, status: 'Draft', progress: 0 },
  ]);

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      <Helmet>
        <title>Course Management | Lecturer Portal</title>
      </Helmet>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
               <BookOpen className="h-8 w-8 text-[#BFFF00]" /> Course Management
           </h1>
           <p className="text-slate-400 mt-1">Manage curriculum, assignments, and visibility.</p>
        </div>
        <Button className="bg-[#BFFF00] text-black hover:bg-[#a3d900]">
            <Plus className="w-4 h-4 mr-2" /> Create New Course
        </Button>
      </div>

      <div className="grid gap-6">
          {courses.map(course => (
              <Card key={course.id} className="bg-[#1E293B] border-slate-800">
                  <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                          <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                  <h3 className="text-xl font-bold text-white">{course.title}</h3>
                                  <Badge variant={course.status === 'Active' ? 'default' : 'secondary'} className={course.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-slate-700 text-slate-300'}>
                                      {course.status}
                                  </Badge>
                              </div>
                              <div className="flex items-center gap-6 text-sm text-slate-400">
                                  <span className="flex items-center gap-1"><Users className="w-4 h-4"/> {course.students} Students Enrolled</span>
                                  <span className="flex items-center gap-1"><FileText className="w-4 h-4"/> 12 Modules</span>
                              </div>
                          </div>
                          
                          <div className="w-full md:w-64">
                              <div className="flex justify-between text-xs text-slate-400 mb-1">
                                  <span>Avg. Completion</span>
                                  <span>{course.progress}%</span>
                              </div>
                              <Progress value={course.progress} className="h-2" />
                          </div>

                          <div className="flex gap-2 w-full md:w-auto">
                              <Button variant="outline" className="border-slate-700 text-slate-300 flex-1 md:flex-none">
                                  <Eye className="w-4 h-4 mr-2" /> Preview
                              </Button>
                              <Button variant="outline" className="border-slate-700 text-slate-300 flex-1 md:flex-none">
                                  <Settings className="w-4 h-4 mr-2" /> Settings
                              </Button>
                          </div>
                      </div>
                  </CardContent>
              </Card>
          ))}
      </div>
    </div>
  );
};

export default LecturerCourseManagement;