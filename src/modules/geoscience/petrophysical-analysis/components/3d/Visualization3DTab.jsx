import React from 'react';
import Scene3D from './Scene3D';
import MediaGallery from './MediaGallery';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Box, Layers, Settings, Video, Camera, RefreshCcw, GalleryHorizontal } from 'lucide-react';
import { useVisualization3DStore } from '@/modules/geoscience/petrophysical-analysis/store/visualization3DStore';
import { useMediaStore } from '@/modules/geoscience/petrophysical-analysis/store/mediaStore';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Visualization3DTab = () => {
  const { settings, toggleSetting, resetView, updateSetting } = useVisualization3DStore();
  const { addSnapshot, addRecording } = useMediaStore();
  const { toast } = useToast();

  const handleScreenshot = () => {
      // In a real production app, use:
      // const canvas = document.querySelector('canvas');
      // const dataUrl = canvas.toDataURL('image/png');
      // For this demo environment, we simulate a capture to demonstrate the storage logic:
      
      // Create a placeholder canvas image
      const canvas = document.createElement('canvas');
      canvas.width = 320;
      canvas.height = 240;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(0,0,320,240);
      ctx.fillStyle = '#BFFF00';
      ctx.font = '20px sans-serif';
      ctx.fillText('3D Snapshot Demo', 80, 120);
      
      const dataUrl = canvas.toDataURL();
      
      addSnapshot({ dataUrl, name: `Snapshot ${new Date().toLocaleTimeString()}` });
      toast({ title: "Snapshot Saved", description: "Added to media gallery." });
  };

  const handleRecord = () => {
      toast({ title: "Recording Started", description: "Simulating 3s clip capture..." });
      setTimeout(() => {
          // Simulating a saved video blob/url
          addRecording({ dataUrl: '', name: `Recording ${new Date().toLocaleTimeString()}` });
           toast({ title: "Recording Saved", description: "Video clip added to gallery." });
      }, 1500);
  };

  return (
    <div className="flex h-full bg-[#0B101B]">
      {/* 3D Viewport */}
      <div className="flex-1 relative flex flex-col">
         <div className="flex-1 relative">
             <Scene3D />
             
             {/* Floating Controls */}
             <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur-md p-2 rounded-full border border-slate-700 flex items-center gap-2 shadow-2xl z-50">
                <Button variant="ghost" size="icon" className="rounded-full text-slate-300 hover:text-white" onClick={resetView} title="Reset View">
                    <RefreshCcw className="w-5 h-5" />
                </Button>
                <div className="w-px h-6 bg-slate-700" />
                <Button variant="ghost" size="icon" onClick={handleScreenshot} className="rounded-full text-slate-300 hover:text-white" title="Take Snapshot">
                    <Camera className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleRecord} className="rounded-full text-slate-300 hover:text-white" title="Record Clip">
                    <Video className="w-5 h-5" />
                </Button>
             </div>
         </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-80 border-l border-slate-800 bg-slate-950 flex flex-col z-10">
         <div className="p-4 border-b border-slate-800 flex items-center gap-2">
             <Box className="w-5 h-5 text-purple-400" />
             <h2 className="text-md font-semibold text-white">Visualization</h2>
         </div>

         <Tabs defaultValue="settings" className="flex-1 flex flex-col overflow-hidden">
             <TabsList className="bg-slate-900 border-b border-slate-800 rounded-none px-2 h-10 justify-start w-full">
                 <TabsTrigger value="settings" className="text-xs">Settings</TabsTrigger>
                 <TabsTrigger value="gallery" className="text-xs">Gallery</TabsTrigger>
             </TabsList>

             <div className="flex-1 overflow-y-auto p-4">
                <TabsContent value="settings" className="space-y-6 m-0">
                     {/* Visibility Controls */}
                     <div className="space-y-4">
                         <h3 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                            <Layers className="w-3 h-3" /> Visibility
                         </h3>
                         <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label className="text-slate-300 text-sm">Trajectory</Label>
                                <Switch checked={settings.showTrajectory} onCheckedChange={() => toggleSetting('showTrajectory')} />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label className="text-slate-300 text-sm">Formation Markers</Label>
                                <Switch checked={settings.showMarkers} onCheckedChange={() => toggleSetting('showMarkers')} />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label className="text-slate-300 text-sm">Stratigraphic Layers</Label>
                                <Switch checked={settings.showLayers} onCheckedChange={() => toggleSetting('showLayers')} />
                            </div>
                         </div>
                     </div>

                     {/* Scene Settings */}
                     <div className="space-y-4">
                         <h3 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                            <Settings className="w-3 h-3" /> Scene
                         </h3>
                         <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label className="text-slate-300 text-sm">Show Grid</Label>
                                <Switch checked={settings.showGrid} onCheckedChange={() => toggleSetting('showGrid')} />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label className="text-slate-300 text-sm">Show Axes</Label>
                                <Switch checked={settings.showAxes} onCheckedChange={() => toggleSetting('showAxes')} />
                            </div>
                            <div className="space-y-2 pt-2">
                                <div className="flex justify-between">
                                    <Label className="text-slate-300 text-xs">Vertical Exaggeration</Label>
                                    <span className="text-xs text-slate-500">{settings.verticalExaggeration}x</span>
                                </div>
                                <Slider 
                                    defaultValue={[settings.verticalExaggeration]} 
                                    min={1} 
                                    max={20} 
                                    step={1}
                                    onValueChange={(v) => updateSetting('verticalExaggeration', v[0])} 
                                />
                            </div>
                         </div>
                     </div>
                </TabsContent>

                <TabsContent value="gallery" className="h-full m-0">
                    <h3 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 mb-4">
                        <GalleryHorizontal className="w-3 h-3" /> Saved Media
                    </h3>
                    <MediaGallery />
                </TabsContent>
             </div>
         </Tabs>
      </div>
    </div>
  );
};

export default Visualization3DTab;