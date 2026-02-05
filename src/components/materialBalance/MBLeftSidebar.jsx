import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, LayoutDashboard, Database, ChevronRight, PanelLeftClose } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMaterialBalance } from '@/hooks/useMaterialBalance';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';

const MBLeftSidebar = () => {
  const { 
      ui,
      toggleLeftSidebar,
      createProject, 
      loadProject, 
      setCurrentTank, 
      createTank,
      projects = [], 
      tanks = [], 
      currentProjectId,
      currentTankId
  } = useMaterialBalance();
  
  const { toast } = useToast();
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [newTankName, setNewTankName] = useState('');
  const [newTankType, setNewTankType] = useState('Oil');
  const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false);
  const [isNewTankDialogOpen, setIsNewTankDialogOpen] = useState(false);

  const handleCreateProject = () => {
    if (!newProjectName) {
      toast({ title: "Project Name Required", variant: "destructive" });
      return;
    }
    const project = createProject(newProjectName, newProjectDescription);
    toast({ title: "Project Created", description: `Project "${project.name}" created.` });
    setNewProjectName('');
    setIsNewProjectDialogOpen(false);
  };

  const handleCreateTank = () => {
    if (!newTankName) {
      toast({ title: "Tank Name Required", variant: "destructive" });
      return;
    }
    const tank = createTank(newTankName, newTankType);
    toast({ title: "Tank Created", description: `Tank "${tank.name}" added.` });
    setNewTankName('');
    setIsNewTankDialogOpen(false);
  };

  const projectTanks = tanks.filter(t => t.projectId === currentProjectId);

  // Safe UI Access
  const isOpen = ui?.leftSidebarOpen ?? true;
  const sidebarWidth = isOpen ? 'w-64' : 'w-0';
  const sidebarOpacity = isOpen ? 'opacity-100' : 'opacity-0';

  return (
    <div className={`${sidebarWidth} bg-slate-950 border-r border-slate-800 flex flex-col transition-all duration-300 ease-in-out overflow-hidden h-full flex-shrink-0 relative`}>
      {/* Collapse Toggle - Positioned Absolute */}
      <div className={`absolute top-2 right-2 z-10 ${!isOpen ? 'hidden' : ''}`}>
           <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0 text-slate-500 hover:text-white hover:bg-slate-800"
            onClick={toggleLeftSidebar}
            title="Collapse Sidebar"
          >
              <PanelLeftClose className="h-4 w-4" />
          </Button>
      </div>

      <div className={`${sidebarOpacity} transition-opacity duration-300 flex flex-col h-full w-64 pt-8`}>
        
        {/* Project Section */}
        <div className="p-4 border-b border-slate-800">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center">
            <LayoutDashboard className="mr-2 h-3.5 w-3.5" /> Projects
          </h2>
          <Select onValueChange={(val) => loadProject({ id: val })} value={currentProjectId || ""}>
            <SelectTrigger className="w-full bg-slate-900 border-slate-800 text-white h-9 text-xs">
              <SelectValue placeholder="Select Project" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-700 text-white">
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id} className="text-xs">
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Dialog open={isNewProjectDialogOpen} onOpenChange={setIsNewProjectDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="w-full mt-2 bg-slate-900 text-[#BFFF00] border-slate-800 hover:bg-slate-800 h-8 text-xs">
                <PlusCircle className="mr-2 h-3.5 w-3.5" /> New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-950 text-white border-slate-800">
              <DialogHeader>
                <DialogTitle>New Project</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                  <Input 
                    placeholder="Project Name"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    className="bg-slate-900 border-slate-800"
                  />
                  <Textarea 
                    placeholder="Description"
                    value={newProjectDescription}
                    onChange={(e) => setNewProjectDescription(e.target.value)}
                    className="bg-slate-900 border-slate-800"
                  />
              </div>
              <DialogFooter>
                <Button onClick={handleCreateProject} className="bg-[#BFFF00] text-slate-950">Create Project</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tank Tree View */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="p-4 pb-2">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center"><Database className="mr-2 h-3.5 w-3.5" /> Tanks</span>
                <Dialog open={isNewTankDialogOpen} onOpenChange={setIsNewTankDialogOpen}>
                    <DialogTrigger asChild>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-5 w-5 text-[#BFFF00] hover:text-white hover:bg-slate-800"
                            disabled={!currentProjectId}
                        >
                            <PlusCircle className="h-3.5 w-3.5" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-950 text-white border-slate-800">
                        <DialogHeader>
                            <DialogTitle>Add Tank</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <Input
                                placeholder="Tank Name"
                                value={newTankName}
                                onChange={(e) => setNewTankName(e.target.value)}
                                className="bg-slate-900 border-slate-800"
                            />
                            <Select onValueChange={setNewTankType} value={newTankType}>
                                <SelectTrigger className="bg-slate-900 border-slate-800 text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-slate-700 text-white">
                                    <SelectItem value="Oil">Oil Reservoir</SelectItem>
                                    <SelectItem value="Gas">Gas Reservoir</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleCreateTank} className="bg-[#BFFF00] text-slate-950">Add Tank</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
              </h3>
          </div>
          
          <ScrollArea className="flex-1 px-2">
              <div className="space-y-1">
                  {projectTanks.length === 0 ? (
                      <div className="p-4 text-center border-2 border-dashed border-slate-800 rounded-md m-2">
                          <p className="text-xs text-slate-500">No tanks found.</p>
                      </div>
                  ) : (
                      projectTanks.map((tank) => (
                          <button
                              key={tank.id}
                              onClick={() => setCurrentTank(tank.id)}
                              className={`w-full text-left px-3 py-2 rounded-md flex items-center text-sm transition-colors ${
                                  currentTankId === tank.id 
                                  ? 'bg-slate-800 text-[#BFFF00] font-medium' 
                                  : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                              }`}
                          >
                              <ChevronRight className={`h-3.5 w-3.5 mr-2 transition-transform ${currentTankId === tank.id ? 'rotate-90' : ''}`} />
                              <span className="truncate">{tank.name}</span>
                          </button>
                      ))
                  )}
              </div>
          </ScrollArea>
        </div>

      </div>
    </div>
  );
};

export default MBLeftSidebar;