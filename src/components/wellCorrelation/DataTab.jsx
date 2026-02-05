import React, { useState } from 'react';
import { useWellCorrelation } from '@/contexts/WellCorrelationContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Database, FileText, Layers, Trash2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import WellImportDialog from './WellImportDialog';
import { cn } from '@/lib/utils';

const DataTab = () => {
    const { state, actions } = useWellCorrelation();
    const [importOpen, setImportOpen] = useState(false);
    const [filter, setFilter] = useState('');

    const wells = state?.wells || [];
    
    // CRITICAL FIX: Filter logic safety check
    const filteredWells = wells.filter(w => {
        if (!w || typeof w.name !== 'string') return false;
        if (!filter) return true;
        return w.name.toLowerCase().includes(filter.toLowerCase());
    });

    return (
        <div className="h-full w-full p-6 bg-[#0F172A] overflow-y-auto">
            <div className="max-w-7xl mx-auto space-y-6">
                
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-1">Project Data Management</h2>
                        <p className="text-slate-400 text-sm">Manage wells, logs, and imported datasets</p>
                    </div>
                    <div className="flex items-center gap-3">
                         <div className="relative w-64">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                            <Input 
                                placeholder="Search wells..." 
                                className="pl-9 bg-[#1E293B] border-slate-700 text-slate-200 focus:border-[#CCFF00] focus:ring-0"
                                value={filter}
                                onChange={e => setFilter(e.target.value)}
                            />
                        </div>
                        <Button 
                            className="bg-[#CCFF00] text-black hover:bg-[#B3E600] font-bold"
                            onClick={() => setImportOpen(true)}
                        >
                            <Plus className="mr-2 h-4 w-4" /> Import Data
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Wells List */}
                    <Card className="lg:col-span-2 bg-[#1E293B] border-slate-800 shadow-lg">
                        <CardHeader className="border-b border-slate-800 py-4 bg-[#1E293B]">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-white flex items-center gap-2 text-lg">
                                    <Database size={18} className="text-[#CCFF00]" />
                                    Loaded Wells
                                </CardTitle>
                                <span className="text-xs bg-slate-900 text-slate-300 px-2 py-1 rounded-full border border-slate-700">
                                    {wells.length} Wells
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 bg-[#1E293B]">
                            {filteredWells.length === 0 ? (
                                <div className="p-12 text-center text-slate-500">
                                    {wells.length === 0 
                                        ? "No wells loaded. Import data to get started." 
                                        : "No wells match your filter."}
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-800">
                                    {filteredWells.map((well) => (
                                        <div key={well.id} className="p-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors group">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-[#CCFF00] font-bold text-sm">
                                                    {well.name ? well.name.substring(0, 2).toUpperCase() : 'UN'}
                                                </div>
                                                <div>
                                                    <h4 className="text-white font-medium flex items-center gap-2">
                                                        {well.name || "Unnamed Well"}
                                                        <span className="text-[10px] bg-slate-900 px-1.5 py-0.5 rounded text-slate-400 border border-slate-700">
                                                            {well.field || 'Unknown Field'}
                                                        </span>
                                                    </h4>
                                                    <div className="text-xs text-slate-500 mt-1 flex gap-4 font-mono">
                                                        <span>UWI: {well.uwi || 'N/A'}</span>
                                                        <span>Depth: {well.depthRange?.start ?? '-'} - {well.depthRange?.stop ?? '-'} {well.depthRange?.unit || 'M'}</span>
                                                        <span>Curves: {well.curves?.length || 0}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white hover:bg-slate-700">View Logs</Button>
                                                <Button 
                                                    size="icon" 
                                                    variant="ghost" 
                                                    className="text-slate-500 hover:text-red-400 hover:bg-red-900/20"
                                                    onClick={() => actions.removeWell(well.id)}
                                                >
                                                    <Trash2 size={14} />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Project Stats Side Cards */}
                    <div className="space-y-6">
                        <Card className="bg-[#1E293B] border-slate-800">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Project Summary</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-[#020617] p-4 rounded-lg border border-slate-800">
                                        <div className="text-3xl font-bold text-white mb-1">{wells.length}</div>
                                        <div className="text-xs text-slate-500">Total Wells</div>
                                    </div>
                                    <div className="bg-[#020617] p-4 rounded-lg border border-slate-800">
                                        <div className="text-3xl font-bold text-white mb-1">{state.markers?.length || 0}</div>
                                        <div className="text-xs text-slate-500">Total Markers</div>
                                    </div>
                                    <div className="bg-[#020617] p-4 rounded-lg border border-slate-800">
                                        <div className="text-3xl font-bold text-[#CCFF00] mb-1">{state.horizons?.length || 0}</div>
                                        <div className="text-xs text-slate-500">Horizons</div>
                                    </div>
                                    <div className="bg-[#020617] p-4 rounded-lg border border-slate-800">
                                        <div className="text-3xl font-bold text-[#CCFF00] mb-1">{state.comments?.length || 0}</div>
                                        <div className="text-xs text-slate-500">Comments</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-[#1E293B] border-slate-800">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Data Integrity</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="h-2 flex-1 bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-[#CCFF00] w-[85%]" />
                                    </div>
                                    <span className="text-xs font-bold text-[#CCFF00]">85%</span>
                                </div>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    Most wells have consistent depth sampling. 2 wells are missing 'NPHI' curves.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
            <WellImportDialog open={importOpen} onOpenChange={setImportOpen} />
        </div>
    );
};

export default DataTab;