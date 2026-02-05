import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import useProjectStore from '@/store/projectStore';
import { Settings, Loader2, Plus, Trash2, Save } from 'lucide-react';

const ProjectDetailsModal = ({ project, open, onOpenChange }) => {
  const { members, metadata, updateProject, addMember, removeMember, setMetadata, deleteMetadata, fetchProjectDetails } = useProjectStore();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMetaKey, setNewMetaKey] = useState('');
  const [newMetaValue, setNewMetaValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  const [editForm, setEditForm] = useState({
      name: '',
      description: '',
      client_name: '',
      location: ''
  });

  useEffect(() => {
      if (project && open) {
          setEditForm({
              name: project.name || '',
              description: project.description || '',
              client_name: project.client_name || '',
              location: project.location || ''
          });
          fetchProjectDetails(project.id);
      }
  }, [project, open, fetchProjectDetails]);

  const handleSaveOverview = async () => {
      setIsSaving(true);
      await updateProject(project.id, editForm);
      setIsSaving(false);
  };

  const handleAddMember = async () => {
      if (!newMemberEmail) return;
      await addMember(project.id, newMemberEmail);
      setNewMemberEmail('');
  };

  const handleAddMetadata = async () => {
      if (!newMetaKey || !newMetaValue) return;
      await setMetadata(project.id, newMetaKey, newMetaValue);
      setNewMetaKey('');
      setNewMetaValue('');
  };

  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] bg-slate-950 border-slate-800 text-slate-100 max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-400" />
              Project Settings: {project.name}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Manage project details, team members, and metadata.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="bg-slate-900 border border-slate-800 w-full justify-start">
                <TabsTrigger value="overview" className="data-[state=active]:bg-slate-800">Overview</TabsTrigger>
                <TabsTrigger value="members" className="data-[state=active]:bg-slate-800">Team Members</TabsTrigger>
                <TabsTrigger value="metadata" className="data-[state=active]:bg-slate-800">Metadata</TabsTrigger>
            </TabsList>
            
            <div className="flex-1 overflow-hidden pt-4">
                <TabsContent value="overview" className="space-y-4 h-full overflow-auto pr-2">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 space-y-2">
                            <Label>Project Name</Label>
                            <Input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="bg-slate-900 border-slate-700" />
                        </div>
                        <div className="space-y-2">
                            <Label>Client</Label>
                            <Input value={editForm.client_name} onChange={e => setEditForm({...editForm, client_name: e.target.value})} className="bg-slate-900 border-slate-700" />
                        </div>
                        <div className="space-y-2">
                            <Label>Location</Label>
                            <Input value={editForm.location} onChange={e => setEditForm({...editForm, location: e.target.value})} className="bg-slate-900 border-slate-700" />
                        </div>
                        <div className="col-span-2 space-y-2">
                            <Label>Description</Label>
                            <Input value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} className="bg-slate-900 border-slate-700" />
                        </div>
                    </div>
                    <div className="flex justify-end pt-4">
                        <Button onClick={handleSaveOverview} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700">
                            {isSaving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                            <Save className="w-4 h-4 mr-2" /> Save Changes
                        </Button>
                    </div>
                </TabsContent>

                <TabsContent value="members" className="h-full flex flex-col space-y-4">
                    <div className="flex gap-2">
                        <Input 
                            placeholder="User email address" 
                            value={newMemberEmail}
                            onChange={e => setNewMemberEmail(e.target.value)}
                            className="bg-slate-900 border-slate-700"
                        />
                        <Button onClick={handleAddMember} className="bg-slate-800 hover:bg-slate-700 border border-slate-600">
                            <Plus className="w-4 h-4 mr-2" /> Add
                        </Button>
                    </div>

                    <ScrollArea className="flex-1 border border-slate-800 rounded-md bg-slate-900/30 p-4">
                        <div className="space-y-3">
                            {members.map((member) => (
                                <div key={member.id} className="flex items-center justify-between bg-slate-900 p-3 rounded border border-slate-800">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                                            {member.user?.display_name?.[0] || member.user?.email?.[0] || 'U'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-200">{member.user?.display_name || 'Unknown User'}</p>
                                            <p className="text-xs text-slate-500">{member.user?.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Badge variant="outline" className="capitalize border-slate-700 text-slate-400">{member.role}</Badge>
                                        <Button size="icon" variant="ghost" className="h-7 w-7 text-red-400 hover:bg-red-900/20" onClick={() => removeMember(project.id, member.user_id)}>
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            {members.length === 0 && <div className="text-center text-slate-500 py-4">No members found</div>}
                        </div>
                    </ScrollArea>
                </TabsContent>

                <TabsContent value="metadata" className="h-full flex flex-col space-y-4">
                     <div className="flex gap-2">
                        <Input placeholder="Key" value={newMetaKey} onChange={e => setNewMetaKey(e.target.value)} className="bg-slate-900 border-slate-700 flex-1" />
                        <Input placeholder="Value" value={newMetaValue} onChange={e => setNewMetaValue(e.target.value)} className="bg-slate-900 border-slate-700 flex-1" />
                        <Button onClick={handleAddMetadata} className="bg-slate-800 hover:bg-slate-700 border border-slate-600">
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>

                    <ScrollArea className="flex-1 border border-slate-800 rounded-md bg-slate-900/30 p-4">
                        <div className="space-y-2">
                            {metadata.map((meta) => (
                                <div key={meta.id} className="flex items-center justify-between bg-slate-900 p-2 px-3 rounded border border-slate-800 group">
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="font-mono text-slate-400">{meta.key}:</span>
                                        <span className="text-slate-200">{meta.value}</span>
                                    </div>
                                    <Button size="icon" variant="ghost" className="h-6 w-6 opacity-0 group-hover:opacity-100 text-red-400 hover:bg-red-900/20" onClick={() => deleteMetadata(project.id, meta.key)}>
                                        <Trash2 className="w-3 h-3" />
                                    </Button>
                                </div>
                            ))}
                             {metadata.length === 0 && <div className="text-center text-slate-500 py-4">No custom metadata</div>}
                        </div>
                    </ScrollArea>
                </TabsContent>
            </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDetailsModal;