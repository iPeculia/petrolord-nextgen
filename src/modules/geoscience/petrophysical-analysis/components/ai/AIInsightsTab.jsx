import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BrainCircuit, Sparkles, Layers, Zap, ArrowUpRight, Lightbulb, Activity, TrendingUp, Box } from 'lucide-react';
import { useAIStore } from '@/store/aiInsightsStore';
import { useGlobalDataStore } from '@/store/globalDataStore';
import ModelTrainingView from './views/ModelTrainingView';
import PredictionsView from './views/PredictionsView';

const AIInsightsTab = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const { activeWell, wells } = useGlobalDataStore();
    const wellName = activeWell ? (wells[activeWell]?.name || 'Unknown Well') : 'No Well Selected';
    const { recommendations, models } = useAIStore();

    return (
        <div className="flex flex-col h-full bg-[#0B101B] text-slate-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                        <BrainCircuit className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-white">AI Insights Engine</h2>
                        <p className="text-xs text-slate-400">Machine learning predictions & recommendations for <span className="text-purple-400 font-mono">{wellName}</span></p>
                    </div>
                </div>
                <Button className="bg-purple-600 hover:bg-purple-500 text-white">
                    <Sparkles className="w-4 h-4 mr-2" /> Generate New Insights
                </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden flex flex-col p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col">
                    <TabsList className="bg-slate-900 border border-slate-800 w-fit mb-6">
                        <TabsTrigger value="dashboard" className="flex items-center gap-2"><Activity className="w-4 h-4" /> Dashboard</TabsTrigger>
                        <TabsTrigger value="predictions" className="flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Predictions</TabsTrigger>
                        <TabsTrigger value="models" className="flex items-center gap-2"><Box className="w-4 h-4" /> Models</TabsTrigger>
                        <TabsTrigger value="training" className="flex items-center gap-2"><Layers className="w-4 h-4" /> Training</TabsTrigger>
                    </TabsList>

                    <TabsContent value="dashboard" className="flex-1 mt-0 overflow-y-auto">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <Card className="bg-slate-900 border-slate-800 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-3 opacity-10"><Layers className="w-24 h-24 text-purple-500" /></div>
                                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-400 uppercase">Active Models</CardTitle></CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-white mb-1">{models.filter(m => m.status === 'active').length}</div>
                                    <p className="text-xs text-slate-500">Ready for inference</p>
                                </CardContent>
                            </Card>
                            <Card className="bg-slate-900 border-slate-800 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-3 opacity-10"><Lightbulb className="w-24 h-24 text-amber-500" /></div>
                                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-400 uppercase">Recommendations</CardTitle></CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-white mb-1">{recommendations.length}</div>
                                    <p className="text-xs text-slate-500">Pending review</p>
                                </CardContent>
                            </Card>
                            <Card className="bg-slate-900 border-slate-800 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-3 opacity-10"><Zap className="w-24 h-24 text-blue-500" /></div>
                                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-400 uppercase">Avg Confidence</CardTitle></CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-white mb-1">92.4%</div>
                                    <p className="text-xs text-slate-500">Across all predictions</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Recommendations List */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card className="bg-slate-900 border-slate-800 h-[400px] flex flex-col">
                                <CardHeader><CardTitle className="text-white flex items-center gap-2"><Sparkles className="w-4 h-4 text-purple-400" /> Top Recommendations</CardTitle></CardHeader>
                                <CardContent className="flex-1 overflow-y-auto space-y-4 p-4">
                                    {recommendations.map(rec => (
                                        <div key={rec.id} className="p-4 rounded-lg bg-slate-800/50 border border-slate-700 transition-colors hover:bg-slate-800">
                                            <div className="flex justify-between items-start mb-1">
                                                <Badge className={`border-0 ${rec.priority === 'High' ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'}`}>{rec.type}</Badge>
                                                <span className="text-[10px] text-slate-500">Priority: {rec.priority}</span>
                                            </div>
                                            <p className="text-sm text-slate-200 font-medium mb-1">{rec.title}</p>
                                            <p className="text-xs text-slate-400">{rec.description}</p>
                                            <div className="flex gap-2 mt-3">
                                                <Button size="sm" variant="secondary" className="h-7 text-xs bg-emerald-600/10 text-emerald-400 hover:bg-emerald-600/20 border-0">Accept</Button>
                                                <Button size="sm" variant="ghost" className="h-7 text-xs text-slate-400 hover:text-white">Dismiss</Button>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            <Card className="bg-slate-900 border-slate-800 h-[400px]">
                                <CardHeader><CardTitle className="text-white">Model Performance</CardTitle></CardHeader>
                                <CardContent className="flex items-center justify-center h-64 text-slate-500">
                                    <p>Performance charts integration pending...</p>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="predictions" className="flex-1 mt-0 overflow-hidden">
                        <PredictionsView />
                    </TabsContent>
                    
                    <TabsContent value="models" className="flex-1 mt-0 overflow-hidden">
                        <Card className="bg-slate-900 border-slate-800 h-full">
                             <CardHeader><CardTitle className="text-white">Model Registry</CardTitle></CardHeader>
                             <CardContent>
                                 <div className="space-y-2">
                                     {models.map(m => (
                                         <div key={m.id} className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-lg">
                                             <div>
                                                 <h4 className="text-white font-medium">{m.name}</h4>
                                                 <p className="text-xs text-slate-500">Type: {m.type} • Created: {m.created}</p>
                                             </div>
                                             <div className="flex items-center gap-4">
                                                 <div className="text-right">
                                                     <p className="text-xs text-slate-400">Accuracy</p>
                                                     <p className="text-emerald-400 font-mono">{(m.accuracy * 100).toFixed(1)}%</p>
                                                 </div>
                                                 <Badge variant="outline" className={m.status === 'active' ? 'text-emerald-400 border-emerald-500/30' : 'text-amber-400 border-amber-500/30'}>
                                                     {m.status}
                                                 </Badge>
                                                 <Button size="sm" variant="ghost">Details</Button>
                                             </div>
                                         </div>
                                     ))}
                                 </div>
                             </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="training" className="flex-1 mt-0 overflow-hidden">
                        <ModelTrainingView />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default AIInsightsTab;