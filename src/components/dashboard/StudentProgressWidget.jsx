import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BookOpen, CheckCircle, Clock, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const StudentProgressWidget = ({ courses = [] }) => {
  // Filter active courses
  const activeCourses = courses.filter(c => c.status === 'in_progress' || c.progress < 100);
  
  if (activeCourses.length === 0) {
      return (
        <Card className="bg-[#1E293B] border-slate-800 h-full">
            <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-[#BFFF00]" /> Current Progress
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center mb-3">
                    <CheckCircle className="h-6 w-6 text-slate-500" />
                </div>
                <p className="text-slate-400 mb-4">No courses currently in progress.</p>
                <Button variant="outline" className="border-slate-700 text-[#BFFF00] hover:text-black hover:bg-[#BFFF00]" asChild>
                    <Link to="/courses">Browse Courses</Link>
                </Button>
            </CardContent>
        </Card>
      );
  }

  return (
    <Card className="bg-[#1E293B] border-slate-800 h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-white flex items-center gap-2 text-lg">
          <BookOpen className="h-5 w-5 text-[#BFFF00]" /> Learning Progress
        </CardTitle>
        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white" asChild>
            <Link to="/dashboard/grades">View All</Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {activeCourses.slice(0, 3).map((course, i) => (
            <div key={i} className="space-y-2">
                <div className="flex justify-between items-start">
                    <div>
                        <h4 className="font-medium text-slate-200 text-sm line-clamp-1" title={course.title}>
                            {course.title}
                        </h4>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" /> Est. completion: {course.estCompletion || '2 weeks'}
                        </p>
                    </div>
                    <Badge variant="outline" className="text-xs border-slate-700 text-slate-400 bg-slate-800/50">
                        {course.progress}%
                    </Badge>
                </div>
                <Progress value={course.progress} className="h-2 bg-slate-800" indicatorClassName="bg-[#BFFF00]" />
                <div className="flex justify-between items-center pt-1">
                     <span className="text-[10px] text-slate-500 uppercase tracking-wider">Next: {course.nextLesson || 'Module Quiz'}</span>
                     <Button variant="link" size="sm" className="h-auto p-0 text-[#BFFF00] text-xs hover:text-white" asChild>
                         <Link to={`/courses/${course.id}`}>Resume <ChevronRight className="w-3 h-3 ml-0.5" /></Link>
                     </Button>
                </div>
            </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default StudentProgressWidget;