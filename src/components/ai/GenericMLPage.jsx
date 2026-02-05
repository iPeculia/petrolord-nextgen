import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Save, FileText, Download, Settings, Activity, BarChart2, RefreshCw } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, ScatterChart, Scatter } from 'recharts';
import { useToast } from '@/components/ui/use-toast';

const GenericMLPage = ({ title, description, type, icon: Icon }) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState(null);

  const mockData = [
    { name: 'A', x: 100, y: 200, z: 200 },
    { name: 'B', x: 120, y: 100, z: 260 },
    { name: 'C', x: 170, y: 300, z: 400 },
    { name: 'D', x: 140, y: 250, z: 280 },
    { name: 'E', x: 150, y: 400, z: 500 },
    { name: 'F', x: 110, y: 280, z: 200 },
  ];

  const handleRun = () => {
    setIsProcessing(true);
    toast({ title: "Processing Started", description: `Running ${type} algorithm...` });
    setTimeout(() => {
      setIsProcessing(false);
      setResults(true);
      toast({ title: "Processing Complete", description: `${title} analysis finished successfully.` });
    }, 2000);
  };

  return (
    <div className="p-8 space-y-6 bg-[#0F172A] min-h-screen text-white animate-in fade-in">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            {Icon && <Icon className="w-8 h-8 text-[#BFFF00]" />}
            {title}
          </h1>
          <p className="text-slate-400 mt-2 max-w-2xl">{description}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-slate-600 text-slate-200">
            <Save className="w-4 h-4 mr-2" /> Save Config
          </Button>
          <Button className="bg-[#BFFF00] text-black hover:bg-[#a3d900]" onClick={handleRun} disabled={isProcessing}>
            {isProcessing ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
            Run Analysis
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-3 space-y-6">
           <Card className="bg-slate-900 border-slate-800">
             <CardHeader><CardTitle className="text-white text-lg">Configuration</CardTitle></CardHeader>
             <CardContent className="space-y-4">
               <div className="space-y-2">
                 <label className="text-sm text-slate-400">Algorithm Model</label>
                 <Select defaultValue="default">
                   <SelectTrigger className="bg-slate-800 border-slate-700"><SelectValue /></SelectTrigger>
                   <SelectContent>
                     <SelectItem value="default">Standard {type}</SelectItem>
                     <SelectItem value="advanced">Advanced Deep Learning</SelectItem>
                     <SelectItem value="fast">Fast Approximation</SelectItem>
                   </SelectContent>
                 </Select>
               </div>
               <div className="space-y-2">
                 <label className="text-sm text-slate-400">Data Source</label>
                 <Select defaultValue="well-a">
                   <SelectTrigger className="bg-slate-800 border-slate-700"><SelectValue /></SelectTrigger>
                   <SelectContent>
                     <SelectItem value="well-a">Well A-01 Logs</SelectItem>
                     <SelectItem value="prod-data">Production History</SelectItem>
                     <SelectItem value="seismic">Seismic Attribute Vol</SelectItem>
                   </SelectContent>
                 </Select>
               </div>
             </CardContent>
           </Card>
           
           <Card className="bg-slate-900 border-slate-800">
              <CardHeader><CardTitle className="text-white text-lg">History</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                 {[1,2,3].map(i => (
                   <div key={i} className="p-2 hover:bg-slate-800 rounded cursor-pointer text-sm text-slate-300 flex justify-between">
                      <span>Run #{100+i}</span>
                      <span className="text-slate-500">2h ago</span>
                   </div>
                 ))}
              </CardContent>
           </Card>
        </div>

        <div className="col-span-12 md:col-span-9">
          <Tabs defaultValue="viz" className="w-full">
            <TabsList className="bg-slate-900 border-slate-800">
              <TabsTrigger value="viz">Visualization</TabsTrigger>
              <TabsTrigger value="data">Data View</TabsTrigger>
              <TabsTrigger value="metrics">Performance</TabsTrigger>
            </TabsList>
            
            <TabsContent value="viz" className="mt-4">
              <Card className="bg-slate-900 border-slate-800 h-[500px]">
                 <CardContent className="h-full p-6">
                    {results ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <ScatterChart>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis type="number" dataKey="x" name="stature" stroke="#94a3b8" />
                            <YAxis type="number" dataKey="y" name="weight" stroke="#94a3b8" />
                            <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
                            <Scatter name="A school" data={mockData} fill="#BFFF00" />
                          </ScatterChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500">
                            <Activity className="w-16 h-16 mb-4 opacity-20" />
                            <p>Run analysis to generate visualization</p>
                        </div>
                    )}
                 </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="data" className="mt-4">
               <Card className="bg-slate-900 border-slate-800">
                  <CardContent className="p-6">
                     <p className="text-slate-400">Raw data tables and export options would appear here.</p>
                     <Button variant="outline" className="mt-4 border-slate-700"><Download className="w-4 h-4 mr-2" /> Export CSV</Button>
                  </CardContent>
               </Card>
            </TabsContent>
            
            <TabsContent value="metrics" className="mt-4">
               <Card className="bg-slate-900 border-slate-800">
                  <CardContent className="p-6">
                     <div className="grid grid-cols-3 gap-4">
                        <div className="bg-slate-800 p-4 rounded">
                           <div className="text-slate-400 text-sm">Accuracy</div>
                           <div className="text-2xl text-white font-bold">98.2%</div>
                        </div>
                        <div className="bg-slate-800 p-4 rounded">
                           <div className="text-slate-400 text-sm">Precision</div>
                           <div className="text-2xl text-white font-bold">0.95</div>
                        </div>
                        <div className="bg-slate-800 p-4 rounded">
                           <div className="text-slate-400 text-sm">F1 Score</div>
                           <div className="text-2xl text-white font-bold">0.96</div>
                        </div>
                     </div>
                  </CardContent>
               </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default GenericMLPage;