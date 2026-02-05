import React, { memo } from 'react';
import { useReservoirSimulation } from '@/context/ReservoirSimulationContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Info, Droplets, ArrowUpCircle } from 'lucide-react';

const RSLRightPanel = memo(() => {
    const { state } = useReservoirSimulation();
    const { selectedModel } = state || {};

    if (!selectedModel) return <div className="w-72 border-l border-slate-800 bg-slate-950" />;

    return (
        <div className="w-72 border-l border-slate-800 bg-slate-950 p-4 overflow-y-auto flex flex-col gap-4">
            <div className="mb-2">
                <h3 className="text-sm font-bold text-slate-200 mb-1">{selectedModel.name}</h3>
                <Badge variant="outline" className="border-emerald-500/30 text-emerald-400">
                    {selectedModel.type}
                </Badge>
            </div>

            <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader className="p-3 pb-2">
                    <CardTitle className="text-xs text-slate-400 flex items-center">
                        <Info className="w-3 h-3 mr-1.5" /> Model Specs
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0 grid grid-cols-2 gap-2 text-xs">
                    <div>
                        <div className="text-slate-500">Grid Size</div>
                        <div className="font-mono text-slate-300">
                            {selectedModel.grid?.nx}x{selectedModel.grid?.ny}x{selectedModel.grid?.nz}
                        </div>
                    </div>
                    <div>
                        <div className="text-slate-500">Active Cells</div>
                        <div className="font-mono text-slate-300">~{selectedModel.grid?.nx * selectedModel.grid?.ny * selectedModel.grid?.nz}</div>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader className="p-3 pb-2">
                    <CardTitle className="text-xs text-slate-400 flex items-center">
                        <Droplets className="w-3 h-3 mr-1.5" /> Fluid Contacts
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0 space-y-2 text-xs">
                    <div className="flex justify-between">
                        <span className="text-slate-500">GOC</span>
                        <span className="font-mono text-amber-400">{selectedModel.metadata?.GOC || 'N/A'} m</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500">OWC</span>
                        <span className="font-mono text-blue-400">{selectedModel.metadata?.OWC || 'N/A'} m</span>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800">
                 <CardHeader className="p-3 pb-2">
                    <CardTitle className="text-xs text-slate-400 flex items-center">
                        <ArrowUpCircle className="w-3 h-3 mr-1.5" /> Wells
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                    <div className="space-y-1">
                        {selectedModel.wells?.map((w) => (
                            <div key={w.id} className="flex justify-between text-xs items-center p-1 hover:bg-slate-800 rounded">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${w.type === 'Injector' ? 'bg-blue-500' : 'bg-red-500'}`} />
                                    <span className="text-slate-300 font-mono">{w.id}</span>
                                </div>
                                <span className="text-slate-500">{w.type}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
});

export default RSLRightPanel;