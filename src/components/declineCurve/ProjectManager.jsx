import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FolderPlus, FolderOpen, Save, Settings, Database } from 'lucide-react';
import { useDeclineCurve } from '@/context/DeclineCurveContext';
import SampleDataManager from './SampleDataManager';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const ProjectManager = () => {
    const { currentProject, createProject, saveProject } = useDeclineCurve();
    const [newProjectName, setNewProjectName] = useState("");

    const handleCreate = () => {
        if (!newProjectName.trim()) return;
        createProject(newProjectName);
        setNewProjectName("");
    };

    return (
        <div className="h-full flex flex-col gap-4">
            <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="py-3 px-4 border-b border-slate-800">
                    <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                        <FolderOpen className="w-4 h-4 text-blue-400" /> Active Project
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                    {currentProject ? (
                        <div className="space-y-4">
                            <div>
                                <div className="text-lg font-bold text-white">{currentProject.name}</div>
                                <div className="text-xs text-slate-500 mt-1">
                                    {currentProject.description || "No description provided."}
                                </div>
                                <div className="text-[10px] text-slate-600 mt-2">
                                    ID: {currentProject.id}
                                </div>
                            </div>
                            
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" className="flex-1 h-8 text-xs border-slate-700 bg-slate-900" onClick={saveProject}>
                                    <Save className="w-3 h-3 mr-2" /> Save
                                </Button>
                                <Button size="sm" variant="outline" className="flex-1 h-8 text-xs border-slate-700 bg-slate-900">
                                    <Settings className="w-3 h-3 mr-2" /> Settings
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-slate-500 py-4 text-xs">
                            No active project. Create or load one below.
                        </div>
                    )}
                </CardContent>
            </Card>

            <Tabs defaultValue="create" className="flex-1 flex flex-col min-h-0">
                <TabsList className="bg-slate-950 border border-slate-800 w-full">
                    <TabsTrigger value="create" className="flex-1 text-xs">New Project</TabsTrigger>
                    <TabsTrigger value="samples" className="flex-1 text-xs">Samples</TabsTrigger>
                </TabsList>
                
                <div className="mt-2 flex-1 min-h-0 overflow-hidden">
                    <TabsContent value="create" className="m-0 h-full">
                        <Card className="bg-slate-900 border-slate-800 h-full">
                            <CardContent className="p-4 space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-400">Project Name</label>
                                    <Input 
                                        placeholder="My Analysis Project" 
                                        value={newProjectName}
                                        onChange={(e) => setNewProjectName(e.target.value)}
                                        className="bg-slate-950 border-slate-700"
                                    />
                                </div>
                                <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleCreate}>
                                    <FolderPlus className="w-4 h-4 mr-2" /> Create Project
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    
                    <TabsContent value="samples" className="m-0 h-full overflow-auto">
                        <SampleDataManager />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
};

export default ProjectManager;