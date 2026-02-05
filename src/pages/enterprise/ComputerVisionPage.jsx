import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, Upload, Eye, Maximize } from 'lucide-react';

const ComputerVisionPage = () => {
  const [image, setImage] = useState(null);

  return (
    <div className="p-8 space-y-6 bg-[#0F172A] min-h-screen text-white animate-in fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Camera className="w-8 h-8 text-[#BFFF00]" />
            Computer Vision Analysis
          </h1>
          <p className="text-slate-400 mt-2">Automated analysis of core photos, seismic images, and site surveillance.</p>
        </div>
      </div>

      <Tabs defaultValue="core" className="w-full">
        <TabsList className="bg-slate-900 border-slate-800">
          <TabsTrigger value="core">Core Analysis</TabsTrigger>
          <TabsTrigger value="site">Site Surveillance</TabsTrigger>
          <TabsTrigger value="seismic">Seismic Feature Detect</TabsTrigger>
        </TabsList>

        <TabsContent value="core" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-900 border-slate-800 h-[500px] flex items-center justify-center relative overflow-hidden">
               {image ? (
                 <img src={image} alt="Analysis" className="w-full h-full object-contain" />
               ) : (
                 <div className="text-center p-6 border-2 border-dashed border-slate-700 rounded-lg">
                    <Upload className="w-12 h-12 mx-auto text-slate-500 mb-4" />
                    <p className="text-slate-400">Upload Core Slab Photo</p>
                    <Button variant="outline" className="mt-4 border-slate-600">Select File</Button>
                 </div>
               )}
               <div className="absolute top-4 right-4">
                  <Button size="icon" variant="secondary" className="bg-slate-800 text-white"><Maximize className="w-4 h-4" /></Button>
               </div>
            </Card>
            
            <div className="space-y-6">
              <Card className="bg-slate-900 border-slate-800">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><Eye className="w-5 h-5 text-[#BFFF00]" /> Detected Features</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-slate-800 rounded">
                      <span>Sandstone Layer</span>
                      <span className="text-green-400 font-mono">98% Conf</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-800 rounded">
                      <span>Fracture Trace</span>
                      <span className="text-yellow-400 font-mono">85% Conf</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-800 rounded">
                      <span>Oil Staining</span>
                      <span className="text-blue-400 font-mono">92% Conf</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Button className="w-full h-12 text-lg bg-[#BFFF00] text-black hover:bg-[#a3d900]">Run Analysis</Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComputerVisionPage;