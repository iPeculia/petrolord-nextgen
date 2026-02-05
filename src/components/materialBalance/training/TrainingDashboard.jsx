import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PlayCircle, BookOpen, CheckCircle, Trophy } from 'lucide-react';
import { useHelp } from '@/contexts/HelpContext';
import { Button } from '@/components/ui/button';

const TrainingDashboard = () => {
  const { trainingProgress } = useHelp();
  
  // Calculate mock progress
  const totalModules = 5;
  const completedModules = trainingProgress.tutorials.length || 0;
  const percentage = Math.round((completedModules / totalModules) * 100);

  const modules = [
    { id: 'module-1', title: 'Fundamentals of MB', duration: '15 min', type: 'Video' },
    { id: 'module-2', title: 'Data Preparation', duration: '20 min', type: 'Interactive' },
    { id: 'module-3', title: 'Drive Mechanism Analysis', duration: '25 min', type: 'Tutorial' },
    { id: 'module-4', title: 'Advanced Forecasting', duration: '30 min', type: 'Case Study' },
    { id: 'module-5', title: 'Reporting Results', duration: '10 min', type: 'Video' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Training Center</h2>
          <p className="text-slate-400">Master reservoir engineering workflows.</p>
        </div>
        <Card className="bg-slate-900 border-slate-800 w-64">
           <CardContent className="p-4 flex items-center gap-4">
              <div className="bg-[#BFFF00]/20 p-3 rounded-full">
                <Trophy className="w-6 h-6 text-[#BFFF00]" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{percentage}%</div>
                <div className="text-xs text-slate-400">Course Completion</div>
              </div>
           </CardContent>
        </Card>
      </div>

      <Progress value={percentage} className="h-2 bg-slate-800" indicatorClassName="bg-[#BFFF00]" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {modules.map((mod) => (
           <Card key={mod.id} className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors group cursor-pointer">
             <CardHeader>
               <div className="flex justify-between items-start">
                 <div className="p-2 bg-slate-800 rounded text-blue-400 group-hover:bg-blue-500/20 group-hover:text-blue-300 transition-colors">
                   {mod.type === 'Video' ? <PlayCircle className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
                 </div>
                 {trainingProgress.tutorials.includes(mod.id) && <CheckCircle className="w-5 h-5 text-green-500" />}
               </div>
               <CardTitle className="text-white mt-4">{mod.title}</CardTitle>
               <CardDescription>{mod.duration} • {mod.type}</CardDescription>
             </CardHeader>
             <CardContent>
               <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white">Start Module</Button>
             </CardContent>
           </Card>
         ))}
      </div>
    </div>
  );
};

export default TrainingDashboard;