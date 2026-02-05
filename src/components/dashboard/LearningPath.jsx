import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle, Lock } from 'lucide-react';

const MODULES = [
  { id: 1, title: 'Rock Properties Fundamentals', status: 'completed', progress: 100 },
  { id: 2, title: 'Fluid Properties (PVT)', status: 'in-progress', progress: 45 },
  { id: 3, title: 'Flow in Porous Media', status: 'locked', progress: 0 },
  { id: 4, title: 'Material Balance Calculations', status: 'locked', progress: 0 },
];

const LearningPath = () => {
  return (
    <Card className="bg-slate-900/40 border-slate-800 h-full">
      <CardHeader>
        <CardTitle className="text-lg text-slate-100 flex justify-between items-center">
          Learning Path
          <span className="text-xs font-normal text-slate-500 px-2 py-1 bg-slate-900 rounded border border-slate-800">
            35% Complete
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {MODULES.map((module, index) => (
          <div key={module.id} className="relative pl-6 pb-2 last:pb-0">
            {/* Timeline Line */}
            {index !== MODULES.length - 1 && (
              <div className={`absolute left-[9px] top-6 bottom-0 w-px ${module.status === 'completed' ? 'bg-emerald-500/30' : 'bg-slate-800'}`} />
            )}
            
            {/* Status Icon */}
            <div className={`absolute left-0 top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center bg-slate-950 z-10 
              ${module.status === 'completed' ? 'border-emerald-500 text-emerald-500' : 
                module.status === 'in-progress' ? 'border-blue-500 text-blue-500' : 'border-slate-700 text-slate-700'}`}>
              {module.status === 'completed' ? <CheckCircle2 className="w-3 h-3" /> : 
               module.status === 'locked' ? <Lock className="w-3 h-3" /> : 
               <Circle className="w-2 h-2 fill-current" />}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className={`text-sm font-medium ${module.status === 'locked' ? 'text-slate-500' : 'text-slate-200'}`}>
                  {module.title}
                </span>
                {module.status === 'in-progress' && (
                  <span className="text-xs text-blue-400 font-mono">{module.progress}%</span>
                )}
              </div>
              
              {module.status === 'in-progress' && (
                <Progress value={module.progress} className="h-1.5 bg-slate-800" indicatorClassName="bg-blue-500" />
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default LearningPath;