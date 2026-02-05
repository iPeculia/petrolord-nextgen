import React from 'react';
import { useSources } from '../../context/SourcesContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ArrowLeft, RotateCw, FileJson, HardDrive, User, Calendar, Activity } from 'lucide-react';
import { format } from 'date-fns';

const SourceDetails = () => {
  const { selectedSource, setSelectedSource, syncSource } = useSources();

  if (!selectedSource) return null;

  return (
    <div className="flex flex-col h-full bg-slate-950/50 animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900">
         <div className="flex items-center gap-3">
             <Button variant="ghost" size="icon" onClick={() => setSelectedSource(null)} className="text-slate-400 hover:text-white">
                 <ArrowLeft className="w-5 h-5" />
             </Button>
             <div>
                 <h2 className="text-lg font-semibold text-white">{selectedSource.name}</h2>
                 <p className="text-xs text-slate-400 flex items-center gap-2">
                     <span className="uppercase">{selectedSource.id}</span> • {selectedSource.type}
                 </p>
             </div>
         </div>
         <div className="flex gap-2">
             <Button size="sm" variant="outline" className="border-slate-700 text-slate-300" onClick={() => syncSource(selectedSource.id)}>
                 <RotateCw className="w-4 h-4 mr-2" /> Sync Data
             </Button>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Stats Column */}
              <div className="lg:col-span-1 space-y-4">
                  <Card className="bg-slate-900 border-slate-800">
                      <CardHeader>
                          <CardTitle className="text-sm font-medium text-slate-400 uppercase tracking-wider">Metadata</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                          <div className="flex items-center justify-between">
                              <span className="text-sm text-slate-500 flex items-center gap-2"><HardDrive className="w-4 h-4" /> Size</span>
                              <span className="text-sm text-slate-200">{selectedSource.size}</span>
                          </div>
                          <div className="flex items-center justify-between">
                              <span className="text-sm text-slate-500 flex items-center gap-2"><FileJson className="w-4 h-4" /> Format</span>
                              <span className="text-sm text-slate-200 font-mono">{selectedSource.format}</span>
                          </div>
                          <div className="flex items-center justify-between">
                              <span className="text-sm text-slate-500 flex items-center gap-2"><User className="w-4 h-4" /> Owner</span>
                              <span className="text-sm text-slate-200">{selectedSource.owner}</span>
                          </div>
                          <div className="flex items-center justify-between">
                              <span className="text-sm text-slate-500 flex items-center gap-2"><Calendar className="w-4 h-4" /> Updated</span>
                              <span className="text-sm text-slate-200">{selectedSource.lastUpdated ? format(new Date(selectedSource.lastUpdated), 'MMM dd, yyyy') : '-'}</span>
                          </div>
                      </CardContent>
                  </Card>

                  <Card className="bg-slate-900 border-slate-800">
                      <CardHeader>
                          <CardTitle className="text-sm font-medium text-slate-400 uppercase tracking-wider">Statistics</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                          <div className="flex items-center justify-between">
                              <span className="text-sm text-slate-500 flex items-center gap-2"><Activity className="w-4 h-4" /> Data Points</span>
                              <span className="text-2xl font-bold text-emerald-400">{selectedSource.dataPoints.toLocaleString()}</span>
                          </div>
                          <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
                              <div className="bg-emerald-500 h-full" style={{ width: '85%' }}></div>
                          </div>
                          <p className="text-xs text-slate-500 text-right">85% Quality Score</p>
                      </CardContent>
                  </Card>
              </div>

              {/* Main Content Column */}
              <div className="lg:col-span-2">
                  <Tabs defaultValue="preview" className="w-full">
                      <TabsList className="bg-slate-900 border border-slate-800 w-full justify-start">
                          <TabsTrigger value="preview">Data Preview</TabsTrigger>
                          <TabsTrigger value="mapping">Field Mapping</TabsTrigger>
                          <TabsTrigger value="validation">Validation Log</TabsTrigger>
                          <TabsTrigger value="settings">Settings</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="preview" className="mt-4">
                          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 min-h-[400px]">
                              <div className="flex items-center justify-center h-full text-slate-500 border border-dashed border-slate-800 rounded-lg">
                                  <p>Data preview table would render here for {selectedSource.format} file.</p>
                              </div>
                          </div>
                      </TabsContent>
                      
                      <TabsContent value="mapping" className="mt-4">
                          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
                              <h3 className="text-lg font-medium text-slate-200 mb-4">Field Mapping Configuration</h3>
                              <div className="space-y-4">
                                  {['DEPTH', 'GR', 'RHOB', 'NPHI'].map(field => (
                                      <div key={field} className="flex items-center gap-4">
                                          <div className="w-1/3 p-2 bg-slate-950 border border-slate-800 rounded text-sm text-slate-400">{field}</div>
                                          <div className="text-slate-600">→</div>
                                          <div className="w-1/3 p-2 bg-slate-800 border border-slate-700 rounded text-sm text-white">{field}_MAPPED</div>
                                      </div>
                                  ))}
                              </div>
                          </div>
                      </TabsContent>

                      <TabsContent value="validation" className="mt-4">
                           <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
                               <h3 className="text-lg font-medium text-slate-200 mb-4">Validation History</h3>
                               <div className="space-y-2">
                                   {[1,2,3].map(i => (
                                       <div key={i} className="flex items-center justify-between p-3 bg-slate-950/50 rounded border border-slate-800">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                                <span className="text-sm text-slate-300">Validation Run #{100+i}</span>
                                            </div>
                                            <span className="text-xs text-slate-500">2 hours ago</span>
                                       </div>
                                   ))}
                               </div>
                           </div>
                      </TabsContent>

                      <TabsContent value="settings" className="mt-4">
                          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
                              <h3 className="text-lg font-medium text-slate-200 mb-4">Connection Settings</h3>
                              <p className="text-sm text-slate-500">Configure auto-sync frequency and credentials.</p>
                          </div>
                      </TabsContent>
                  </Tabs>
              </div>
          </div>
      </div>
    </div>
  );
};

export default SourceDetails;