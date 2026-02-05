import React from 'react';
import { usePorosityStore } from '@/modules/geoscience/petrophysical-analysis/store/porosityStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Copy, Edit, FileSpreadsheet } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';

const ModelLibrary = () => {
    const { models, deleteModel, duplicateModel } = usePorosityStore();
    const { toast } = useToast();

    const handleDelete = (id) => {
        deleteModel(id);
        toast({ title: "Model Deleted", description: "Model removed from library." });
    };

    const handleDuplicate = (id) => {
        duplicateModel(id);
        toast({ title: "Model Duplicated", description: "Copy created in library." });
    };

    if (models.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-slate-500">
                <FileSpreadsheet className="w-12 h-12 mb-4 opacity-20" />
                <p>Your model library is empty.</p>
                <p className="text-xs">Saved models will appear here.</p>
            </div>
        );
    }

    return (
        <ScrollArea className="h-full p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {models.map((model) => (
                    <Card key={model.id} className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-white text-base mb-1">{model.name}</CardTitle>
                                    <div className="flex gap-2">
                                        <Badge variant="secondary" className="bg-slate-800 text-slate-300 text-[10px] uppercase">
                                            {model.type}
                                        </Badge>
                                        <Badge variant="outline" className="text-slate-500 border-slate-700 text-[10px]">
                                            {model.created}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-mono text-emerald-400">R²: {model.metrics?.r2 || '-'}</div>
                                    <div className="text-xs font-mono text-slate-500">RMSE: {model.metrics?.rmse || '-'}</div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xs text-slate-400 mb-4 space-y-1 bg-slate-950 p-2 rounded border border-slate-800">
                                <div className="flex justify-between">
                                    <span>Well ID:</span> <span className="text-slate-300">{model.wellId}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Input Curve:</span> <span className="text-slate-300">{model.curve}</span>
                                </div>
                                <div className="pt-1 border-t border-slate-800 mt-1">
                                    <span className="font-semibold text-[10px] uppercase block mb-1">Parameters</span>
                                    {Object.entries(model.params || {}).map(([k, v]) => (
                                        <div key={k} className="flex justify-between">
                                            <span>{k}:</span> <span className="text-slate-300">{v}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="sm" onClick={() => handleDuplicate(model.id)} title="Duplicate">
                                    <Copy className="w-4 h-4 text-slate-400 hover:text-white" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleDelete(model.id)} title="Delete">
                                    <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-400" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </ScrollArea>
    );
};

export default ModelLibrary;