import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Search, Database, Layers } from 'lucide-react';
import { useDeclineCurve } from '@/context/DeclineCurveContext';
import { searchWells, searchScenarios } from '@/utils/declineCurve/SearchEngine';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

const SearchPanel = () => {
    const { currentProject, selectWell, setActiveScenarioId } = useDeclineCurve();
    const [query, setQuery] = useState("");
    
    const wells = currentProject?.wells || [];
    const scenarios = currentProject?.scenarios || [];

    const filteredWells = searchWells(wells, query);
    const filteredScenarios = searchScenarios(scenarios, query);

    return (
        <Card className="bg-slate-900 border-slate-800 h-full flex flex-col">
            <CardHeader className="py-3 px-4 border-b border-slate-800">
                <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <Search className="w-4 h-4 text-blue-400" /> Advanced Search
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex-1 flex flex-col gap-4 min-h-0">
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                    <Input 
                        placeholder="Search wells, scenarios..." 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="pl-9 bg-slate-950 border-slate-700"
                    />
                </div>

                <Tabs defaultValue="wells" className="flex-1 flex flex-col min-h-0">
                    <TabsList className="bg-slate-950 border border-slate-800 h-8 w-full justify-start">
                        <TabsTrigger value="wells" className="text-xs h-6">Wells ({filteredWells.length})</TabsTrigger>
                        <TabsTrigger value="scenarios" className="text-xs h-6">Scenarios ({filteredScenarios.length})</TabsTrigger>
                    </TabsList>
                    
                    <div className="flex-1 mt-2 min-h-0 border border-slate-800 rounded bg-slate-950">
                        <TabsContent value="wells" className="h-full m-0">
                            <ScrollArea className="h-full">
                                <div className="divide-y divide-slate-800">
                                    {filteredWells.map(w => (
                                        <div key={w.id} className="p-3 flex items-center justify-between hover:bg-slate-900">
                                            <div className="flex items-center gap-3">
                                                <Database className="w-4 h-4 text-slate-500" />
                                                <div>
                                                    <div className="text-sm text-slate-200">{w.name}</div>
                                                    <div className="text-[10px] text-slate-500">{w.metadata?.formation || 'No Formation'}</div>
                                                </div>
                                            </div>
                                            <Button size="sm" variant="ghost" className="h-6 text-xs" onClick={() => selectWell(w.id)}>
                                                Select
                                            </Button>
                                        </div>
                                    ))}
                                    {filteredWells.length === 0 && <div className="p-4 text-center text-slate-500 text-xs">No wells found.</div>}
                                </div>
                            </ScrollArea>
                        </TabsContent>
                        <TabsContent value="scenarios" className="h-full m-0">
                            <ScrollArea className="h-full">
                                <div className="divide-y divide-slate-800">
                                    {filteredScenarios.map((s, idx) => (
                                        <div key={idx} className="p-3 flex items-center justify-between hover:bg-slate-900">
                                            <div className="flex items-center gap-3">
                                                <Layers className="w-4 h-4 text-slate-500" />
                                                <div>
                                                    <div className="text-sm text-slate-200">{s.name}</div>
                                                    <div className="text-[10px] text-slate-500">{s.results?.modelType || 'No Model'}</div>
                                                </div>
                                            </div>
                                            <Button size="sm" variant="ghost" className="h-6 text-xs" onClick={() => setActiveScenarioId(idx)}>
                                                Load
                                            </Button>
                                        </div>
                                    ))}
                                    {filteredScenarios.length === 0 && <div className="p-4 text-center text-slate-500 text-xs">No scenarios found.</div>}
                                </div>
                            </ScrollArea>
                        </TabsContent>
                    </div>
                </Tabs>
            </CardContent>
        </Card>
    );
};

export default SearchPanel;