import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus, FolderKanban } from 'lucide-react';
import ProjectList from './ProjectList';
import ProjectCreationModal from './ProjectCreationModal';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const ProjectManager = ({ trigger }) => {
  const { user } = useAuth();
  const [isCreationOpen, setIsCreationOpen] = useState(false);
  const [isManagerOpen, setIsManagerOpen] = useState(false);

  if (!user) return null;

  return (
    <>
        <Dialog open={isManagerOpen} onOpenChange={setIsManagerOpen}>
        <DialogTrigger asChild>
            {trigger || (
                <Button variant="outline" size="sm" className="bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800">
                    <FolderKanban className="w-4 h-4 mr-2" />
                    Projects
                </Button>
            )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] bg-slate-950 border-slate-800 text-slate-100">
            <DialogHeader className="flex flex-row items-center justify-between pr-8 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                    <FolderKanban className="w-5 h-5 text-[#BFFF00]" />
                    <DialogTitle>Project Manager</DialogTitle>
                </div>
                <Button 
                    size="sm" 
                    className="bg-[#BFFF00] text-slate-900 hover:bg-[#a3d900] h-8"
                    onClick={() => setIsCreationOpen(true)}
                >
                    <Plus className="w-4 h-4 mr-2" />
                    New Project
                </Button>
            </DialogHeader>
            
            <div className="mt-4">
                <ProjectList />
            </div>
        </DialogContent>
        </Dialog>

        <ProjectCreationModal 
            open={isCreationOpen} 
            onOpenChange={setIsCreationOpen} 
        />
    </>
  );
};

export default ProjectManager;