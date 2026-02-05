import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbSeparator, 
  BreadcrumbPage,
  BreadcrumbList 
} from '@/components/ui/breadcrumb';
import { 
    Save, 
    ArrowLeft
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useMaterialBalance } from '@/hooks/useMaterialBalance';

const MBHeader = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  // Safe extraction - no UI state needed here anymore if toggles are moved
  const { 
      currentProject, 
  } = useMaterialBalance();

  const handleAction = (actionName) => {
    toast({
      title: "Feature Pending",
      description: `"${actionName}" will be available in Phase 5.`,
    });
  };

  return (
    <header className="bg-slate-950 border-b border-slate-800 h-14 flex items-center justify-between px-4 z-20 shadow-md shrink-0">
      {/* Left Section: Back & Title */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/modules/reservoir-engineering')}
          className="text-slate-400 hover:text-[#BFFF00] hover:bg-slate-900"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <div className="flex flex-col justify-center">
          <h1 className="text-lg font-bold text-white leading-tight">Material Balance</h1>
          <Breadcrumb>
            <BreadcrumbList className="text-xs text-slate-500">
              <BreadcrumbItem>
                <BreadcrumbLink onClick={() => navigate('/dashboard')} className="hover:text-slate-300 cursor-pointer">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-[#BFFF00] font-medium">
                    {currentProject ? currentProject.name : 'New Project'}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Right Section: Actions */}
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm"
          className="bg-slate-900 text-white hover:bg-slate-800 hover:text-[#BFFF00] border-slate-700 h-8"
          onClick={() => handleAction("Save Project")}
        >
          <Save className="mr-2 h-3.5 w-3.5" /> Save
        </Button>
      </div>
    </header>
  );
};

export default MBHeader;