import React, { useRef, useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Layers, RotateCw, ZoomIn, Share2, Maximize2, Box, Eye, Settings } from 'lucide-react';

const Visualisation3DPage = () => {
  const canvasRef = useRef(null);
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [showLayers, setShowLayers] = useState(true);
  
  // Simple animation loop for "3D" effect on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let angle = rotation * 0.01;

    const draw = () => {
      if (!canvas) return;
      const w = canvas.width;
      const h = canvas.height;
      
      // Clear
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, w, h);
      
      // Center grid (Fake 3D floor)
      ctx.save();
      ctx.translate(w/2, h/2 + 100);
      ctx.scale(1, 0.5); // Flatten to look 3D
      ctx.rotate(angle);
      
      // Draw Grid
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      const gridSize = 400 * zoom;
      const step = 40;
      
      ctx.beginPath();
      for(let i = -gridSize; i <= gridSize; i += step) {
        ctx.moveTo(i, -gridSize);
        ctx.lineTo(i, gridSize);
        ctx.moveTo(-gridSize, i);
        ctx.lineTo(gridSize, i);
      }
      ctx.stroke();

      // Draw "Well Trajectory" (Simple Helix)
      ctx.beginPath();
      ctx.strokeStyle = '#BFFF00';
      ctx.lineWidth = 3;
      for(let t = 0; t < Math.PI * 4; t += 0.1) {
        const r = 50 + t * 10;
        const x = Math.cos(t + angle) * r;
        const y = Math.sin(t + angle) * r;
        // Fake Z height by offsetting y in 2D before flatten
        // Actually, just drawing planar spiral for demo
        if (t===0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Draw "Layers"
      if (showLayers) {
        ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
        ctx.fillRect(-200, -200, 400, 400);
      }

      ctx.restore();
      
      angle += 0.002;
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [rotation, zoom, showLayers]);

  return (
    <div className="flex h-[calc(100vh-64px)] flex-col">
      {/* Toolbar */}
      <div className="h-14 border-b border-slate-800 bg-slate-900 px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 text-white font-semibold">
              <Box className="text-[#BFFF00]" /> 3D Reservoir Viewer
           </div>
           <Badge variant="outline" className="text-blue-400 border-blue-900 bg-blue-900/10">WebGL Mode</Badge>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="ghost" size="icon" className="text-slate-400"><Share2 className="w-4 h-4" /></Button>
           <Button variant="ghost" size="icon" className="text-slate-400"><Settings className="w-4 h-4" /></Button>
           <Button variant="ghost" size="icon" className="text-slate-400"><Maximize2 className="w-4 h-4" /></Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Controls Sidebar */}
        <div className="w-64 bg-slate-900 border-r border-slate-800 p-4 space-y-6 overflow-y-auto">
           <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase">View Controls</h4>
              <div className="space-y-2">
                 <label className="text-xs text-slate-400 flex items-center gap-2"><RotateCw className="w-3 h-3" /> Rotation</label>
                 <Slider defaultValue={[0]} max={100} step={1} onValueChange={(v) => setRotation(v[0])} />
              </div>
              <div className="space-y-2">
                 <label className="text-xs text-slate-400 flex items-center gap-2"><ZoomIn className="w-3 h-3" /> Zoom</label>
                 <Slider defaultValue={[1]} min={0.5} max={2} step={0.1} onValueChange={(v) => setZoom(v[0])} />
              </div>
           </div>

           <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase">Layers</h4>
              <div className="flex items-center justify-between">
                 <span className="text-sm text-slate-300">Formation Tops</span>
                 <Switch checked={showLayers} onCheckedChange={setShowLayers} />
              </div>
              <div className="flex items-center justify-between">
                 <span className="text-sm text-slate-300">Well Trajectories</span>
                 <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                 <span className="text-sm text-slate-300">Fault Planes</span>
                 <Switch />
              </div>
           </div>

           <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase">Object Properties</h4>
              <Card className="bg-slate-800 border-slate-700 p-3">
                 <div className="text-xs text-slate-400 mb-1">Selected Object</div>
                 <div className="text-sm text-white font-medium">Well A-01</div>
                 <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="bg-slate-900 p-1 rounded text-xs text-center text-slate-300">X: 1240</div>
                    <div className="bg-slate-900 p-1 rounded text-xs text-center text-slate-300">Y: 4050</div>
                    <div className="bg-slate-900 p-1 rounded text-xs text-center text-slate-300">Z: -2500</div>
                    <div className="bg-slate-900 p-1 rounded text-xs text-center text-slate-300">TVD: 2450</div>
                 </div>
              </Card>
           </div>
        </div>

        {/* 3D Canvas Area */}
        <div className="flex-1 bg-[#0F172A] relative cursor-move">
           <canvas 
             ref={canvasRef} 
             width={1200} 
             height={800} 
             className="w-full h-full block"
           />
           <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur p-2 rounded border border-slate-700 text-xs text-slate-400">
              <div className="flex gap-4">
                 <span>FPS: 60</span>
                 <span>Vertices: 12,405</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Visualisation3DPage;