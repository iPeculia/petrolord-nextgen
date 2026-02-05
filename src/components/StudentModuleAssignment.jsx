import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useStudentModules } from '@/hooks/useStudentModules';
import { Loader2, BookOpen, CheckCircle2, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const StudentModuleAssignment = () => {
  const { 
    departmentName, 
    primaryModules, 
    optionalModules, 
    assignedModules, 
    loading, 
    toggleModule 
  } = useStudentModules();
  
  const { toast } = useToast();
  const [toggling, setToggling] = React.useState(null);

  const handleToggle = async (moduleId, currentState) => {
    setToggling(moduleId);
    try {
      await toggleModule(moduleId, !currentState);
      toast({
        title: !currentState ? "Module Added" : "Module Removed",
        description: `Successfully ${!currentState ? 'added' : 'removed'} module from your dashboard.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update module assignment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setToggling(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 bg-white/5 rounded-xl border border-white/10">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!departmentName) {
    // Should typically not happen for a valid student, but good fallback
    return null; 
  }

  return (
    <Card className="border-0 shadow-lg bg-white/5 backdrop-blur-sm ring-1 ring-white/10 rounded-xl overflow-hidden">
      <CardHeader className="pb-4 border-b border-white/10">
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-400" />
                My Modules
                </CardTitle>
                <CardDescription className="text-slate-400 mt-1">
                Managed by your department: <span className="text-blue-300 font-medium">{departmentName}</span>
                </CardDescription>
            </div>
            <Badge variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-500/10">
                {assignedModules.length} Active
            </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {/* Primary Modules Section */}
        <div className="p-6 space-y-4">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            Required Modules <Badge className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 border-0 text-[10px]">Core</Badge>
          </h3>
          
          {primaryModules.length === 0 ? (
            <p className="text-sm text-slate-500 italic">No core modules assigned yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {primaryModules.map(module => (
                <div key={module.id} className="flex items-start gap-3 p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <div className="p-2 rounded bg-blue-500/10 text-blue-400">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{module.name}</h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">{module.description || 'Core academic module'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Optional Modules Section */}
        {optionalModules.length > 0 && (
          <div className="p-6 pt-2 space-y-4 border-t border-white/5">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              Optional Electives <Badge variant="outline" className="border-slate-600 text-slate-400 text-[10px]">Selectable</Badge>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {optionalModules.map(module => {
                const isAssigned = assignedModules.includes(module.id);
                const isLoading = toggling === module.id;
                
                return (
                  <div 
                    key={module.id} 
                    className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${
                        isAssigned 
                        ? 'bg-blue-900/10 border-blue-500/30' 
                        : 'bg-slate-800/30 border-slate-700/50 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                        {/* Status Dot */}
                        <div className={`w-2 h-2 rounded-full ${isAssigned ? 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.5)]' : 'bg-slate-600'}`} />
                        <div>
                            <h4 className={`font-medium ${isAssigned ? 'text-blue-100' : 'text-slate-300'}`}>{module.name}</h4>
                            <p className="text-xs text-slate-500 mt-0.5">Elective Module</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        {isLoading && <Loader2 className="w-4 h-4 animate-spin text-slate-400" />}
                        <Switch 
                            checked={isAssigned}
                            onCheckedChange={() => handleToggle(module.id, isAssigned)}
                            disabled={isLoading}
                        />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-white/5 border-t border-white/10 py-3 px-6 text-xs text-slate-400 flex gap-2">
        <AlertCircle className="w-3.5 h-3.5" />
        Modules are assigned based on your department curriculum. Contact your administrator for changes.
      </CardFooter>
    </Card>
  );
};

export default StudentModuleAssignment;