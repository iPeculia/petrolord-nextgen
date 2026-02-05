import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDeclineCurve } from '@/context/DeclineCurveContext';
import { clusterWells } from '@/utils/declineCurve/MachineLearningEngine';
import { Network, Users, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

const WellClustering = () => {
    const { currentProject } = useDeclineCurve();
    const [clusters, setClusters] = useState(null);

    const handleCluster = () => {
        if (!currentProject || !currentProject.wells) return;
        const results = clusterWells(currentProject.wells, 3); // Default k=3
        setClusters(results);
    };

    return (
        <div className="h-full flex flex-col space-y-4">
             <Card className="bg-slate-900 border-slate-800 h-full flex flex-col">
                <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b border-slate-800">
                    <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                        <Network className="w-4 h-4 text-blue-400" /> Well Portfolio Clustering
                    </CardTitle>
                    <Button size="sm" variant="outline" className="h-8 border-slate-700 bg-slate-900" onClick={handleCluster}>
                        Run K-Means
                    </Button>
                </CardHeader>
                <CardContent className="p-0 flex-1 min-h-0 flex flex-col">
                    {!clusters ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-8">
                            <Users className="w-12 h-12 mb-4 opacity-20" />
                            <p className="text-center text-sm">Group wells by production characteristics automatically.</p>
                        </div>
                    ) : (
                         <div className="flex-1 flex flex-col">
                            <div className="grid grid-cols-3 gap-4 p-4 bg-slate-950 border-b border-slate-800">
                                {clusters.map(cluster => (
                                    <div key={cluster.id} className="text-center p-3 rounded bg-slate-900 border border-slate-800">
                                        <div className="text-2xl font-bold text-white mb-1">{cluster.stats.count}</div>
                                        <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">{cluster.name}</div>
                                        <Badge variant="secondary" className="text-[10px]">Avg: {cluster.stats.avgRate.toFixed(0)} bbl/d</Badge>
                                    </div>
                                ))}
                            </div>
                            
                            <ScrollArea className="flex-1 p-4">
                                <div className="space-y-6">
                                    {clusters.map(cluster => (
                                        <div key={cluster.id} className="space-y-2">
                                            <h4 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-blue-500"/>
                                                {cluster.name} Members
                                            </h4>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                                {cluster.members.map(m => (
                                                    <div key={m.id} className="text-xs bg-slate-900 border border-slate-800 p-2 rounded text-slate-400 flex items-center justify-between">
                                                        <span className="truncate">{m.name}</span>
                                                        <ArrowRight className="w-3 h-3 opacity-50" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                         </div>
                    )}
                </CardContent>
             </Card>
        </div>
    );
};

export default WellClustering;