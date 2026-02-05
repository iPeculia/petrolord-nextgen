import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Layers, Plus, Eye, Trash2 } from 'lucide-react';
import { useDeclineCurve } from '@/context/DeclineCurveContext';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { calculateGroupForecast } from '@/utils/declineCurve/ForecastingEngine';

const GroupManager = () => {
    const { currentProject, addGroup, removeGroup, activeStream } = useDeclineCurve();
    const { toast } = useToast();
    
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const [selectedWells, setSelectedWells] = useState([]);

    const wells = currentProject?.wells || [];
    const groups = currentProject?.groups || [];

    const handleToggleWell = (wellId) => {
        setSelectedWells(prev => 
            prev.includes(wellId) ? prev.filter(id => id !== wellId) : [...prev, wellId]
        );
    };

    const handleCreateGroup = () => {
        if (!newGroupName.trim() || selectedWells.length === 0) {
            toast({ title: "Invalid Group", description: "Name and at least one well required.", variant: "destructive" });
            return;
        }

        // Logic to build the group object
        const groupWells = wells.filter(w => selectedWells.includes(w.id));
        
        // Calculate basic rollup (history)
        const aggregatedData = calculateGroupForecast(groupWells, activeStream);

        addGroup(currentProject.id, {
            name: newGroupName,
            wellIds: selectedWells,
            aggregatedData,
            stream: activeStream,
            timestamp: new Date().toISOString()
        });

        setNewGroupName('');
        setSelectedWells([]);
        setIsCreateOpen(false);
        toast({ title: "Group Created", description: `${newGroupName} with ${selectedWells.length} wells.` });
    };

    return (
        <Card className="bg-slate-900 border-slate-800 h-full flex flex-col">
            <CardHeader className="py-3 px-4 border-b border-slate-800 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-medium text-slate-400 uppercase tracking-wider">Group Roll-up</CardTitle>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button size="icon" variant="ghost" className="h-6 w-6 text-slate-400 hover:text-white">
                            <Plus className="h-4 w-4" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#020617] border-slate-800 text-white">
                        <DialogHeader>
                            <DialogTitle>Create Well Group</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                            <div>
                                <label className="text-xs text-slate-400 mb-1 block">Group Name</label>
                                <Input 
                                    value={newGroupName} 
                                    onChange={(e) => setNewGroupName(e.target.value)}
                                    className="bg-slate-950 border-slate-700"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 mb-2 block">Select Wells ({selectedWells.length})</label>
                                <ScrollArea className="h-[200px] border border-slate-800 rounded p-2">
                                    <div className="space-y-2">
                                        {wells.map(well => (
                                            <div key={well.id} className="flex items-center space-x-2">
                                                <Checkbox 
                                                    id={`w-${well.id}`} 
                                                    checked={selectedWells.includes(well.id)}
                                                    onCheckedChange={() => handleToggleWell(well.id)}
                                                />
                                                <label htmlFor={`w-${well.id}`} className="text-sm text-slate-300 cursor-pointer">
                                                    {well.name}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </div>
                            <Button className="w-full bg-blue-600 hover:bg-blue-500" onClick={handleCreateGroup}>
                                Create Group
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent className="p-0 flex-1 flex flex-col min-h-0">
                <ScrollArea className="flex-1">
                    <div className="p-2 space-y-2">
                        {groups.length === 0 ? (
                            <div className="text-center py-8 text-slate-500 text-xs">
                                No groups created.
                            </div>
                        ) : (
                            groups.map((group, idx) => (
                                <div key={idx} className="group bg-slate-950 border border-slate-800 rounded p-2 hover:border-slate-600 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="font-semibold text-sm text-slate-200">{group.name}</div>
                                            <div className="text-[10px] text-slate-500">{group.wellIds.length} Wells • {group.stream}</div>
                                        </div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {/* Future: View Button to load group data into plot */}
                                            <Button variant="ghost" size="icon" className="h-5 w-5 hover:bg-slate-800" title="Delete">
                                                <Trash2 className="h-3 w-3 text-red-400" onClick={() => removeGroup(currentProject.id, idx)} />
                                            </Button>
                                        </div>
                                    </div>
                                    {/* Placeholder metrics */}
                                    <div className="mt-2 text-[10px] text-slate-400">
                                        Roll-up production ready.
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
};

export default GroupManager;