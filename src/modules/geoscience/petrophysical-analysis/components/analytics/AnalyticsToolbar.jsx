import React from 'react';
import { useAnalytics } from '@/modules/geoscience/petrophysical-analysis/context/AnalyticsContext';
import { Button } from '@/components/ui/button';
import { 
  Settings, Download, Filter, 
  BarChart2, Activity, Grid, Zap,
  Layers
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';

const AnalyticsToolbar = () => {
  const { 
    activeWidgets, toggleWidget, 
    activeLogs, selectedCurves, setSelectedCurves,
    depthRange
  } = useAnalytics();

  const availableCurves = Object.keys(activeLogs);

  const handleExport = () => {
    // Placeholder for export functionality
    console.log("Exporting dashboard...");
  };

  return (
    <div className="h-14 border-b border-slate-800 bg-slate-950/50 flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 mr-4 border-r border-slate-800 pr-4">
           <Badge variant="outline" className="bg-[#BFFF00]/10 text-[#BFFF00] border-[#BFFF00]/20">
             Analytics Mode
           </Badge>
           <span className="text-xs text-slate-500">
             Depth: {depthRange.min.toFixed(0)} - {depthRange.max.toFixed(0)}m
           </span>
        </div>

        {/* Widget Toggles */}
        <div className="flex gap-1">
           <Button 
             variant={activeWidgets.stats ? "secondary" : "ghost"} 
             size="sm"
             onClick={() => toggleWidget('stats')}
             className="h-8 text-xs"
           >
             <BarChart2 className="w-3.5 h-3.5 mr-1.5" /> Stats
           </Button>
           <Button 
             variant={activeWidgets.correlation ? "secondary" : "ghost"} 
             size="sm"
             onClick={() => toggleWidget('correlation')}
             className="h-8 text-xs"
           >
             <Grid className="w-3.5 h-3.5 mr-1.5" /> Correlation
           </Button>
           <Button 
             variant={activeWidgets.petrophysics ? "secondary" : "ghost"} 
             size="sm"
             onClick={() => toggleWidget('petrophysics')}
             className="h-8 text-xs"
           >
             <Layers className="w-3.5 h-3.5 mr-1.5" /> PetroEval
           </Button>
           <Button 
             variant={activeWidgets.anomalies ? "secondary" : "ghost"} 
             size="sm"
             onClick={() => toggleWidget('anomalies')}
             className="h-8 text-xs"
           >
             <Zap className="w-3.5 h-3.5 mr-1.5" /> Anomalies
           </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Curve Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800">
              <Filter className="w-3.5 h-3.5 mr-1.5" /> 
              Curves ({selectedCurves.length})
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-slate-950 border-slate-800 text-slate-200 w-56">
            <DropdownMenuLabel>Select Curves to Analyze</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-800" />
            {availableCurves.map(curve => (
              <DropdownMenuCheckboxItem
                key={curve}
                checked={selectedCurves.includes(curve)}
                onCheckedChange={(checked) => {
                   if (checked) setSelectedCurves([...selectedCurves, curve]);
                   else setSelectedCurves(selectedCurves.filter(c => c !== curve));
                }}
                className="focus:bg-slate-900"
              >
                {curve}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white">
          <Settings className="w-4 h-4" />
        </Button>
        <Button 
            variant="outline" 
            size="sm" 
            className="h-8 border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white"
            onClick={handleExport}
        >
          <Download className="w-3.5 h-3.5 mr-1.5" /> Export
        </Button>
      </div>
    </div>
  );
};

export default AnalyticsToolbar;