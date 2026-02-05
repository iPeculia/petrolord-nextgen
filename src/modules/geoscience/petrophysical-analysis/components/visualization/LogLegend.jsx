import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Search, Eye, EyeOff, Settings2 } from 'lucide-react';
import { useLogViewer } from '@/modules/geoscience/petrophysical-analysis/context/LogViewerContext';

const LogLegend = ({ curves }) => {
  const { visibleCurves, toggleCurveVisibility, curveColors, setCurveColor } = useLogViewer();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCurves = curves.filter(c => 
    c.log_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col h-full">
      <div className="p-3 border-b border-slate-800">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <Input 
            placeholder="Filter curves..." 
            className="h-8 pl-8 bg-slate-900 border-slate-800 text-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {filteredCurves.map(curve => {
             const isVisible = visibleCurves[curve.log_name] !== false;
             const color = curveColors[curve.log_name] || '#BFFF00'; // Default color logic fallback

             return (
              <div key={curve.id || curve.log_name} className="flex items-center gap-3 p-2 rounded hover:bg-slate-900/50 group">
                <div 
                    className="cursor-pointer text-slate-400 hover:text-white"
                    onClick={() => toggleCurveVisibility(curve.log_name)}
                >
                    {isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 opacity-50" />}
                </div>
                
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium truncate text-slate-200" title={curve.log_name}>
                            {curve.log_name}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">{curve.unit}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-1 flex-1 bg-slate-800 rounded overflow-hidden">
                            <div className="h-full bg-slate-600/20" />
                        </div>
                        <input 
                            type="color" 
                            value={color}
                            onChange={(e) => setCurveColor(curve.log_name, e.target.value)}
                            className="w-4 h-4 rounded bg-transparent cursor-pointer border-none p-0" 
                        />
                    </div>
                </div>
              </div>
             );
          })}
        </div>
      </ScrollArea>
      
      <div className="p-3 border-t border-slate-800 bg-slate-900/30">
         <div className="flex items-center gap-2 text-xs text-slate-500">
            <Settings2 className="w-3.5 h-3.5" />
            <span>{curves.length} Curves Available</span>
         </div>
      </div>
    </div>
  );
};

export default LogLegend;