import React, { useState } from 'react';
import { useWellCorrelation } from '@/contexts/WellCorrelationContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Edit2, Layers } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

const HorizonsMarkersTab = () => {
    const { state, actions } = useWellCorrelation();
    const { horizons } = state;
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [newHorizon, setNewHorizon] = useState({ name: '', color: '#FF0000' });

    const handleAddHorizon = () => {
        if (!newHorizon.name) return;
        actions.addHorizon({
            id: Date.now().toString(),
            ...newHorizon
        });
        setIsAddOpen(false);
        setNewHorizon({ name: '', color: '#FF0000' });
    };

    return (
        <div className="h-full flex gap-6 p-6 bg-slate-900/20">
            {/* Horizon Manager */}
            <div className="w-1/3 min-w-[300px] bg-slate-950 border border-slate-800 rounded-lg flex flex-col">
                <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                    <h3 className="font-semibold text-slate-200 flex items-center">
                        <Layers className="mr-2 h-4 w-4 text-purple-500" /> Horizons
                    </h3>
                    <Button size="sm" onClick={() => setIsAddOpen(true)} className="h-8 bg-purple-600 hover:bg-purple-700">
                        <Plus className="h-3 w-3 mr-1" /> New
                    </Button>
                </div>

                <ScrollArea className="flex-1">
                    <div className="divide-y divide-slate-900">
                        {horizons.length === 0 && (
                            <div className="p-8 text-center text-slate-600 text-sm">No horizons defined</div>
                        )}
                        {horizons.map((h) => (
                            <div key={h.id} className="p-3 flex items-center justify-between hover:bg-slate-900/50 group">
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 rounded shadow-sm border border-white/10" style={{ backgroundColor: h.color }} />
                                    <span className="text-sm text-slate-200 font-medium">{h.name}</span>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-500 hover:text-white">
                                        <Edit2 className="h-3 w-3" />
                                    </Button>
                                    {/* Assuming delete action exists or will exist */}
                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-500 hover:text-red-400">
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>

            {/* Stats / Info Area (Placeholder for Marker list) */}
            <div className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-8 flex flex-col items-center justify-center text-slate-500">
                <div className="text-center max-w-md">
                    <h3 className="text-lg font-medium text-slate-400 mb-2">Marker Management</h3>
                    <p className="mb-4 text-sm">Select a horizon on the left to view associated picks across all wells, or use the Correlation Panel to place new markers interactively.</p>
                </div>
            </div>

            {/* Add Horizon Dialog */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="bg-slate-900 border-slate-800 text-slate-100">
                    <DialogHeader>
                        <DialogTitle>Create New Horizon</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Horizon Name</Label>
                            <Input 
                                value={newHorizon.name} 
                                onChange={(e) => setNewHorizon({...newHorizon, name: e.target.value})}
                                placeholder="e.g. Top Reservoir"
                                className="bg-slate-950 border-slate-700"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Color</Label>
                            <div className="flex gap-2">
                                <Input 
                                    type="color" 
                                    value={newHorizon.color} 
                                    onChange={(e) => setNewHorizon({...newHorizon, color: e.target.value})}
                                    className="w-12 p-1 h-9 bg-slate-950 border-slate-700"
                                />
                                <Input 
                                    value={newHorizon.color} 
                                    readOnly
                                    className="flex-1 bg-slate-950 border-slate-700 font-mono text-xs"
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                        <Button onClick={handleAddHorizon} className="bg-purple-600 hover:bg-purple-700">Create Horizon</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default HorizonsMarkersTab;