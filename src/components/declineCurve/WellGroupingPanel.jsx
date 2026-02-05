import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Layers, Plus, Trash2, Edit2, Users, Filter } from 'lucide-react';
import { useDeclineCurve } from '@/context/DeclineCurveContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { calculateGroupForecast } from '@/utils/declineCurve/ForecastingEngine';
import { toast } from '@/components/ui/use-toast';

const WellGroupingPanel = () => {
    const { currentProject, addGroup, removeGroup, activeStream, projects } = useDeclineCurve();
    
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const [groupMethod, setGroupMethod] = useState('custom'); // 'custom', 'formation', 'field'
    const [selectedWells, setSelectedWells] = useState([]);

    const wells = currentProject?.wells || [];
    const groups = currentProject?.groups || [];

    // Filtering logic for auto-grouping
    const getFilteredWells = () => {
        if (groupMethod === 'custom') return wells;
        // Example: if grouping by formation, logic would go here. For now, manual select.
        return wells;
    };

    const handleToggleWell = (wellId) => {
        setSelectedWells(prev => 
            prev.includes(wellId) ? prev.filter(id => id !== wellId) : [...prev, wellId]
        );
    };

    const handleCreateGroup = () => {
        if (!newGroupName.trim()) {
            toast({ title: "Name Required", description: "Please enter a group name.", variant: "destructive" });
            return;
        }
        if (selectedWells.length === 0) {
            toast({ title: "Wells Required", description: "Select at least one well.", variant: "destructive" });
            return;
        }

        const groupWells = wells.filter(w => selectedWells.includes(w.id));
        
        // Basic aggregation for initial state
        const aggregatedData = calculateGroupForecast(groupWells, activeStream);

        addGroup(currentProject.id, {
            name: newGroupName,
            wellIds: selectedWells,
            method: groupMethod,
            aggregatedData,
            stream: activeStream,
            timestamp: new Date().toISOString()
        });

        setNewGroupName('');
        setSelectedWells([]);
        setIsCreateOpen(false);
        toast({ title: "Group Created", description: `Group "${newGroupName}" added with ${selectedWells.length} wells.` });
    };

    return (
        <div className="h-full flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-white">Well Grouping & Aggregation</h2>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="mr-2 h-4 w-4" /> Create New Group
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-950 border-slate-800 text-white max-w-md">
                        <DialogHeader>
                            <DialogTitle>Create Well Group</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-xs text-slate-400">Group Name</label>
                                <Input 
                                    value={newGroupName}
                                    onChange={(e) => setNewGroupName(e.target.value)}
                                    placeholder="e.g. North Field - Wolfcamp A"
                                    className="bg-slate-900 border-slate-700"
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-xs text-slate-400">Grouping Method</label>
                                <Select value={groupMethod} onValueChange={setGroupMethod}>
                                    <SelectTrigger className="bg-slate-900 border-slate-700">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-900 border-slate-700 text-white">
                                        <SelectItem value="custom">Custom Selection</SelectItem>
                                        <SelectItem value="formation">By Formation</SelectItem>
                                        <SelectItem value="field">By Field</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs text-slate-400">Select Wells</label>
                                    <span className="text-xs text-slate-500">{selectedWells.length} selected</span>
                                </div>
                                <ScrollArea className="h-48 border border-slate-800 rounded-md p-2 bg-slate-900/50">
                                    <div className="space-y-2">
                                        {wells.map(well => (
                                            <div key={well.id} className="flex items-center space-x-2 p-1 hover:bg-slate-800 rounded">
                                                <Checkbox 
                                                    id={`grp-w-${well.id}`} 
                                                    checked={selectedWells.includes(well.id)}
                                                    onCheckedChange={() => handleToggleWell(well.id)}
                                                />
                                                <label htmlFor={`grp-w-${well.id}`} className="text-sm text-slate-300 cursor-pointer flex-1">
                                                    {well.name}
                                                </label>
                                                {well.metadata?.formation && (
                                                    <Badge variant="outline" className="text-[10px] text-slate-500 border-slate-700">
                                                        {well.metadata.formation}
                                                    </Badge>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleCreateGroup} className="w-full">Create Group</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groups.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center h-48 border-2 border-dashed border-slate-800 rounded-lg text-slate-500">
                        <Users className="h-10 w-10 mb-2 opacity-50" />
                        <p>No groups created yet.</p>
                        <p className="text-sm">Create a group to analyze aggregated production.</p>
                    </div>
                ) : (
                    groups.map((group, idx) => (
                        <Card key={idx} className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-slate-200">
                                    {group.name}
                                </CardTitle>
                                <Badge variant="secondary" className="bg-slate-800 text-slate-400">
                                    {group.wellIds.length} Wells
                                </Badge>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-xs text-slate-400">
                                        <span>Total Daily Rate:</span>
                                        <span className="text-slate-200 font-mono">
                                            {/* Access latest aggregated point */}
                                            {group.aggregatedData && group.aggregatedData.length > 0 
                                                ? Math.round(group.aggregatedData[group.aggregatedData.length-1].rate).toLocaleString()
                                                : 0
                                            } bbl/d
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-xs text-slate-400">
                                        <span>Method:</span>
                                        <span className="capitalize">{group.method || 'Custom'}</span>
                                    </div>
                                    
                                    <div className="pt-2 flex gap-2">
                                        <Button variant="outline" size="sm" className="flex-1 h-8 text-xs border-slate-700">
                                            <Edit2 className="w-3 h-3 mr-1" /> Edit
                                        </Button>
                                        <Button variant="outline" size="sm" className="h-8 w-8 px-0 border-slate-700 hover:bg-red-900/20 hover:text-red-400 hover:border-red-900/50" onClick={() => removeGroup(currentProject.id, idx)}>
                                            <Trash2 className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default WellGroupingPanel;