import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Filter, Search, MapPin } from 'lucide-react';
import { useDeclineCurve } from '@/context/DeclineCurveContext';
import { Input } from '@/components/ui/input';

const WellSelector = () => {
    const { currentProject, activeWellId, selectWell } = useDeclineCurve();
    const [filter, setFilter] = React.useState("");

    if (!currentProject?.wells) {
        return (
            <Card className="bg-slate-900 border-slate-800 mb-4">
                <CardContent className="p-4 text-center text-slate-500 text-xs">
                    No wells loaded.
                </CardContent>
            </Card>
        );
    }

    const filteredWells = currentProject.wells.filter(w => 
        w.name.toLowerCase().includes(filter.toLowerCase()) || 
        w.id.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <Card className="bg-slate-900 border-slate-800 flex flex-col h-[300px]">
            <CardHeader className="py-3 px-4 border-b border-slate-800 space-y-2">
                <CardTitle className="text-sm font-medium text-slate-300 flex items-center justify-between">
                    <span>Well Selector</span>
                    <Badge variant="secondary" className="bg-slate-800 text-slate-400 text-[10px]">{filteredWells.length} / {currentProject.wells.length}</Badge>
                </CardTitle>
                <div className="relative">
                    <Search className="absolute left-2 top-2 h-3 w-3 text-slate-500" />
                    <Input 
                        placeholder="Filter wells..." 
                        className="h-8 pl-7 text-xs bg-slate-950 border-slate-700"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 min-h-0">
                <ScrollArea className="h-full">
                    <div className="divide-y divide-slate-800">
                        {filteredWells.map(well => (
                            <div 
                                key={well.id} 
                                onClick={() => selectWell(well.id)}
                                className={`p-3 cursor-pointer hover:bg-slate-800/50 transition-colors ${activeWellId === well.id ? 'bg-blue-900/20 border-l-2 border-blue-500' : 'border-l-2 border-transparent'}`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className={`text-sm font-medium ${activeWellId === well.id ? 'text-blue-400' : 'text-slate-300'}`}>
                                        {well.name}
                                    </span>
                                    {well.status === 'Active' && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5"></div>}
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-slate-500">
                                    <span className="bg-slate-800 px-1 rounded">{well.id}</span>
                                    <span>•</span>
                                    <span>{well.formation}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-0.5"><MapPin className="w-2 h-2" /> {well.field}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
};

export default WellSelector;