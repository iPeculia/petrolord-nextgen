import React from 'react';
import { 
  MousePointer, Move, Ruler, PenTool, PlusSquare, Target, 
  RotateCcw, RotateCw, Save, Grid, Layers, Settings2, Network,
  Circle, Plus, FileClock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';

const ToolButton = ({ icon: Icon, active, onClick, tooltip, badge }) => (
    <div className="relative group">
        <Button 
            variant={active ? "secondary" : "ghost"} 
            size="icon" 
            className={cn(
                "h-8 w-8 rounded transition-all", 
                active ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md" : "text-slate-400 hover:text-white hover:bg-white/10"
            )}
            onClick={onClick}
            title={tooltip}
        >
            <Icon className="w-4 h-4" />
        </Button>
        {badge && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-[8px] text-white animate-pulse">
                {badge}
            </span>
        )}
    </div>
);

export const TOOL_TYPES = {
  SELECT: 'select',
  PAN: 'pan',
  MEASURE: 'measure',
  DRAW_LINE: 'draw_line',
  ADD_EQUIPMENT: 'add_equipment',
  ADD_ZONE: 'add_zone'
};

const DesignerToolbar = ({ 
  activeTool, 
  setActiveTool, 
  snapSettings, 
  toggleSnap, 
  engineeringMode, 
  setEngineeringMode,
  onUndo, 
  onRedo, 
  onSave, 
  isSaving,
  mapStyle,
  setMapStyle,
  onNetworkAnalysis,
  onManualAddEquipment,
  onViewAuditTrail
}) => {
  return (
    <div className="flex items-center gap-2">
       <div className="flex items-center gap-1 bg-[#262626] p-1 rounded-lg border border-[#333333]">
           <ToolButton icon={MousePointer} active={activeTool === TOOL_TYPES.SELECT} onClick={() => setActiveTool(TOOL_TYPES.SELECT)} tooltip="Select (V)" />
           <ToolButton icon={Move} active={activeTool === TOOL_TYPES.PAN} onClick={() => setActiveTool(TOOL_TYPES.PAN)} tooltip="Pan (H)" />
           <Separator orientation="vertical" className="h-6 mx-1 bg-slate-700" />
           <ToolButton icon={PlusSquare} active={activeTool === TOOL_TYPES.ADD_EQUIPMENT} onClick={() => setActiveTool(TOOL_TYPES.ADD_EQUIPMENT)} tooltip="Drag/Drop Equipment" />
           <ToolButton icon={Plus} active={false} onClick={onManualAddEquipment} tooltip="Manual Add Equipment" />
           
           <ToolButton icon={PenTool} active={activeTool === TOOL_TYPES.DRAW_LINE} onClick={() => setActiveTool(TOOL_TYPES.DRAW_LINE)} tooltip="Draw Pipeline (L)" />
           <ToolButton icon={Circle} active={activeTool === TOOL_TYPES.ADD_ZONE} onClick={() => setActiveTool(TOOL_TYPES.ADD_ZONE)} tooltip="Add Buffer Zone (B)" />
           <ToolButton icon={Ruler} active={activeTool === TOOL_TYPES.MEASURE} onClick={() => setActiveTool(TOOL_TYPES.MEASURE)} tooltip="Measure Distance (M)" />
           
           <Separator orientation="vertical" className="h-6 mx-1 bg-slate-700" />
           
           {/* Snapping Menu */}
           <DropdownMenu>
               <DropdownMenuTrigger asChild>
                   <Button variant={Object.values(snapSettings).some(Boolean) ? "secondary" : "ghost"} size="icon" className="h-8 w-8 text-slate-400 hover:text-white" title="Snap Settings">
                       <Target className="w-4 h-4" />
                   </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent className="bg-[#1a1a1a] border-slate-700 text-slate-200">
                   <DropdownMenuLabel>Snapping Options</DropdownMenuLabel>
                   <DropdownMenuSeparator className="bg-slate-700" />
                   <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="flex justify-between cursor-pointer">
                       <span>Grid Snap</span>
                       <Switch checked={snapSettings.grid} onCheckedChange={() => toggleSnap('grid')} size="sm" />
                   </DropdownMenuItem>
                   <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="flex justify-between cursor-pointer">
                       <span>Object Snap</span>
                       <Switch checked={snapSettings.object} onCheckedChange={() => toggleSnap('object')} size="sm" />
                   </DropdownMenuItem>
                   <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="flex justify-between cursor-pointer">
                       <span>Line Endpoint</span>
                       <Switch checked={snapSettings.endpoint} onCheckedChange={() => toggleSnap('endpoint')} size="sm" />
                   </DropdownMenuItem>
               </DropdownMenuContent>
           </DropdownMenu>

           {/* View Options */}
           <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white" title="Map Layers">
                        <Layers className="w-4 h-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[#1a1a1a] border-slate-700 text-slate-200">
                    <DropdownMenuLabel>Base Map</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-slate-700" />
                    <DropdownMenuRadioGroup value={mapStyle} onValueChange={setMapStyle}>
                        <DropdownMenuRadioItem value="Dark Matter" className="cursor-pointer">Dark Mode</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="Satellite" className="cursor-pointer">Satellite</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="Terrain" className="cursor-pointer">Terrain</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
           </DropdownMenu>

           {/* Audit Trail Button */}
           <ToolButton icon={FileClock} active={false} onClick={onViewAuditTrail} tooltip="Audit Logs" />

           {/* Network Analysis Button */}
           <ToolButton icon={Network} active={false} onClick={onNetworkAnalysis} tooltip="Run Network Analysis" />
       </div>

       <div className="flex items-center gap-2 bg-[#262626] p-1 rounded-lg border border-[#333333] px-3">
            <Settings2 className="w-3 h-3 text-slate-500" />
            <span className="text-[10px] uppercase font-bold text-slate-500">Eng. Mode</span>
            <Switch 
                checked={engineeringMode} 
                onCheckedChange={setEngineeringMode} 
                className="data-[state=checked]:bg-blue-600 scale-75"
            />
            {engineeringMode && <Badge variant="outline" className="text-[9px] border-blue-500 text-blue-400 h-4 px-1 animate-in fade-in zoom-in">ACTIVE</Badge>}
       </div>

       <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white" onClick={onUndo} title="Undo">
                <RotateCcw className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white" onClick={onRedo} title="Redo">
                <RotateCw className="w-4 h-4" />
            </Button>
            <Button 
                size="sm" 
                className={cn("h-8 gap-2 ml-2 transition-all", isSaving ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700")}
                onClick={onSave}
                disabled={isSaving}
            >
                <Save className="w-3.5 h-3.5" />
                {isSaving ? 'Saving...' : 'Save'}
            </Button>
       </div>
    </div>
  );
};

export default DesignerToolbar;