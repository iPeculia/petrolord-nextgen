import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useWorkflowStore } from '@/store/workflowStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GitBranch, Play, Clock, Plus, MoreHorizontal, Search, Filter, LayoutTemplate, History, Calendar, Trash2, Copy, FileText } from 'lucide-react';
import WorkflowBuilder from './WorkflowBuilder';
import WorkflowExecution from './WorkflowExecution';
import WorkflowCreationModal from './WorkflowCreationModal';
import TemplatesView from './views/TemplatesView';
import HistoryView from './views/HistoryView';
import SchedulingView from './views/SchedulingView';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const WorkflowsTab = () => {
  const [activeTab, setActiveTab] = useState('my-workflows');
  const [viewMode, setViewMode] = useState('list'); // list, builder, execution
  const { workflows, setActiveWorkflow, activeWorkflowId, deleteWorkflow, runWorkflow, addWorkflow } = useWorkflowStore();
  const [filter, setFilter] = useState('');
  const [isCreationModalOpen, setIsCreationModalOpen] = useState(false);

  const handleCreateNew = () => {
      setIsCreationModalOpen(true);
  };

  const handleWorkflowCreated = (newWorkflow) => {
      // Add to store, get ID (mocked here, usually addWorkflow returns ID or we gen it before)
      const id = crypto.randomUUID();
      addWorkflow({ ...newWorkflow, id });
      setActiveWorkflow(id);
      setViewMode('builder');
  };

  const handleEdit = (id) => {
      setActiveWorkflow(id);
      setViewMode('builder');
  };

  const handleRun = (id) => {
      setActiveWorkflow(id);
      setViewMode('execution');
  };

  const handleCreateFromTemplate = (template) => {
      const newWorkflow = {
          name: `Copy of ${template.name}`,
          description: template.description,
          steps: template.steps || [],
          type: template.category,
          updatedAt: new Date().toISOString()
      };
      const id = crypto.randomUUID();
      addWorkflow({ ...newWorkflow, id });
      setActiveWorkflow(id);
      setViewMode('builder'); // Jump straight to editing the template-based workflow
  };

  const filteredWorkflows = workflows.filter(w => w.name.toLowerCase().includes(filter.toLowerCase()));

  if (viewMode === 'builder') {
      return <WorkflowBuilder onBack={() => setViewMode('list')} />;
  }

  if (viewMode === 'execution') {
      return <WorkflowExecution onBack={() => setViewMode('list')} />;
  }

  return (
    <div className="flex flex-col h-full bg-[#0B101B] text-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div>
              <h2 className="text-lg font-semibold text-white">Workflow Manager</h2>
              <p className="text-xs text-slate-400">Automate data processing and interpretation tasks</p>
          </div>
          <div className="flex gap-3">
             <Button onClick={handleCreateNew} className="bg-emerald-600 hover:bg-emerald-500 text-white">
                 <Plus className="w-4 h-4 mr-2" /> Create Workflow
             </Button>
          </div>
      </div>

      {/* Creation Modal */}
      <WorkflowCreationModal 
          isOpen={isCreationModalOpen} 
          onClose={() => setIsCreationModalOpen(false)} 
          onCreate={handleWorkflowCreated} 
      />

      {/* Tabs & Content */}
      <div className="flex-1 overflow-hidden flex flex-col p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col">
             <TabsList className="bg-slate-900 border border-slate-800 w-fit mb-6">
                 <TabsTrigger value="my-workflows" className="flex items-center gap-2"><GitBranch className="w-4 h-4" /> My Workflows</TabsTrigger>
                 <TabsTrigger value="templates" className="flex items-center gap-2"><LayoutTemplate className="w-4 h-4" /> Templates</TabsTrigger>
                 <TabsTrigger value="history" className="flex items-center gap-2"><History className="w-4 h-4" /> History</TabsTrigger>
                 <TabsTrigger value="scheduling" className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Scheduling</TabsTrigger>
             </TabsList>

             <TabsContent value="my-workflows" className="flex-1 mt-0 overflow-hidden flex flex-col">
                 <div className="flex justify-between mb-4">
                     <div className="relative w-64">
                        <Search className="absolute left-2 top-2.5 w-4 h-4 text-slate-500" />
                        <Input 
                            placeholder="Search workflows..." 
                            className="pl-8 bg-slate-900 border-slate-700"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        />
                     </div>
                     <Button variant="outline" className="bg-slate-900 border-slate-700 text-slate-300">
                        <Filter className="w-4 h-4 mr-2" /> Filter
                     </Button>
                 </div>

                 <ScrollArea className="flex-1">
                     <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 pb-20">
                         {filteredWorkflows.map(wf => (
                             <Card key={wf.id} className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-all group">
                                 <CardHeader className="pb-3">
                                     <div className="flex justify-between items-start">
                                         <div className="p-2 bg-blue-500/10 rounded-lg">
                                             <GitBranch className="w-5 h-5 text-blue-400" />
                                         </div>
                                         <DropdownMenu>
                                             <DropdownMenuTrigger asChild>
                                                 <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-white">
                                                     <MoreHorizontal className="w-4 h-4" />
                                                 </Button>
                                             </DropdownMenuTrigger>
                                             <DropdownMenuContent className="bg-slate-900 border-slate-800 text-slate-200">
                                                 <DropdownMenuItem onClick={() => handleEdit(wf.id)}><FileText className="w-4 h-4 mr-2" /> Edit</DropdownMenuItem>
                                                 <DropdownMenuItem><Copy className="w-4 h-4 mr-2" /> Clone</DropdownMenuItem>
                                                 <DropdownMenuItem className="text-red-400" onClick={() => deleteWorkflow(wf.id)}><Trash2 className="w-4 h-4 mr-2" /> Delete</DropdownMenuItem>
                                             </DropdownMenuContent>
                                         </DropdownMenu>
                                     </div>
                                     <CardTitle className="text-base text-white mt-3">{wf.name}</CardTitle>
                                     <CardDescription className="line-clamp-2 h-10">{wf.description}</CardDescription>
                                 </CardHeader>
                                 <CardContent>
                                     <div className="flex items-center gap-2 mb-4">
                                         <Badge variant="outline" className="bg-slate-800 border-slate-700 text-slate-400">{wf.type}</Badge>
                                         <span className="text-xs text-slate-500 flex items-center gap-1">
                                             <Clock className="w-3 h-3" /> {wf.runCount} runs
                                         </span>
                                     </div>
                                     <div className="flex gap-2">
                                         <Button className="w-full bg-slate-800 hover:bg-slate-700" onClick={() => handleEdit(wf.id)}>Edit</Button>
                                         <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white" onClick={() => handleRun(wf.id)}>
                                             <Play className="w-4 h-4 mr-2" /> Run
                                         </Button>
                                     </div>
                                 </CardContent>
                             </Card>
                         ))}
                     </div>
                 </ScrollArea>
             </TabsContent>

             <TabsContent value="templates" className="flex-1 mt-0 overflow-hidden">
                 <ScrollArea className="h-full">
                     <TemplatesView onCreateFromTemplate={handleCreateFromTemplate} />
                 </ScrollArea>
             </TabsContent>
             
             <TabsContent value="history" className="flex-1 mt-0 overflow-hidden">
                 <ScrollArea className="h-full">
                    <HistoryView />
                 </ScrollArea>
             </TabsContent>

             <TabsContent value="scheduling" className="flex-1 mt-0 overflow-hidden">
                 <ScrollArea className="h-full">
                    <SchedulingView />
                 </ScrollArea>
             </TabsContent>
          </Tabs>
      </div>
    </div>
  );
};

export default WorkflowsTab;