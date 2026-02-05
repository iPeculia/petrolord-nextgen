import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
    ZoomIn, 
    ZoomOut, 
    Maximize, 
    ArrowUp, 
    ArrowDown, 
    ArrowLeft,
    ArrowRight,
    Settings2, 
    Download, 
    FileText,
    FileSpreadsheet,
    Printer,
    Ruler,
    MessageSquarePlus,
    Palette,
    Grid3X3,
    List,
    Crosshair,
    MoveVertical,
    Eye,
    EyeOff,
    RefreshCw
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

const ToolbarBtn = ({ icon: Icon, label, onClick, disabled, active, variant = "ghost" }) => {
    const { toast } = useToast();
    const handleClick = () => {
        if (!onClick) {
            toast({
                title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
                variant: "default",
            });
            return;
        }
        onClick();
    };

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button 
                        variant={variant}
                        size="icon" 
                        className={cn(
                            "h-8 w-8 transition-colors",
                            active ? "bg-primary text-primary-foreground hover:bg-primary/90" : "text-gray-400 hover:text-white hover:bg-gray-800"
                        )}
                        onClick={handleClick}
                        disabled={disabled}
                    >
                        <Icon className="w-4 h-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs bg-gray-900 text-white border-gray-800">
                    <p>{label}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

const ToolbarGroup = ({ children }) => (
    <div className="flex items-center gap-1 px-2 border-r border-gray-700 last:border-r-0">
        {children}
    </div>
);

const VisualizationToolbar = ({ 
    // Zoom & Pan
    onZoomIn, onZoomOut, onZoomFit, onReset, 
    onPanUp, onPanDown, onPanLeft, onPanRight,
    
    // Export & Print
    onExportPNG, onExportPDF, onExportCSV, onPrint,
    
    // Tools
    onMeasure, onAnnotate,
    toolMode, // 'measure', 'annotate', 'none'
    
    // Toggles / Settings
    onToggleGrid, showGrid,
    onToggleLegend, showLegend,
    onToggleCrosshair, showCrosshair,
    onToggleValues, showValues,
    onChangeDepthScale, // This is now more an info button as zoom handles it
    onColorSettings,
    
    zoomLevel 
}) => {
    return (
        <div className="h-12 bg-[#1e293b] border-b border-gray-800 flex items-center px-2 overflow-x-auto no-scrollbar">
            {/* Navigation Group */}
            <ToolbarGroup>
                <ToolbarBtn icon={ZoomIn} label="Zoom In" onClick={onZoomIn} />
                <ToolbarBtn icon={ZoomOut} label="Zoom Out" onClick={onZoomOut} />
                <ToolbarBtn icon={Maximize} label="Zoom Fit" onClick={onZoomFit} />
                <ToolbarBtn icon={RefreshCw} label="Reset View" onClick={onReset} />
            </ToolbarGroup>

            <ToolbarGroup>
                <ToolbarBtn icon={ArrowUp} label="Pan Up" onClick={onPanUp} />
                <ToolbarBtn icon={ArrowDown} label="Pan Down" onClick={onPanDown} />
                <ToolbarBtn icon={ArrowLeft} label="Pan Left" onClick={onPanLeft} />
                <ToolbarBtn icon={ArrowRight} label="Pan Right" onClick={onPanRight} />
            </ToolbarGroup>

            {/* Tools Group */}
            <ToolbarGroup>
                <ToolbarBtn 
                    icon={Ruler} 
                    label="Measure Tool" 
                    onClick={onMeasure} 
                    active={toolMode === 'measure'}
                />
                <ToolbarBtn 
                    icon={MessageSquarePlus} 
                    label="Annotation Tool" 
                    onClick={onAnnotate}
                    active={toolMode === 'annotate'}
                />
                <ToolbarBtn icon={MoveVertical} label="Depth Scale" onClick={onChangeDepthScale} />
                <ToolbarBtn icon={Palette} label="Color Picker" onClick={onColorSettings} />
            </ToolbarGroup>

            {/* Toggles Group */}
            <ToolbarGroup>
                <ToolbarBtn 
                    icon={Grid3X3} 
                    label={showGrid ? "Hide Grid" : "Show Grid"} 
                    onClick={onToggleGrid} 
                    active={showGrid}
                />
                <ToolbarBtn 
                    icon={List} 
                    label={showLegend ? "Hide Legend" : "Show Legend"} 
                    onClick={onToggleLegend} 
                    active={showLegend}
                />
                <ToolbarBtn 
                    icon={Crosshair} 
                    label={showCrosshair ? "Hide Crosshair" : "Show Crosshair"} 
                    onClick={onToggleCrosshair} 
                    active={showCrosshair}
                />
                <ToolbarBtn 
                    icon={showValues ? Eye : EyeOff} 
                    label={showValues ? "Hide Values" : "Show Values"} 
                    onClick={onToggleValues} 
                    active={showValues}
                />
            </ToolbarGroup>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Export Group */}
            <ToolbarGroup>
                <ToolbarBtn icon={FileSpreadsheet} label="Export CSV" onClick={onExportCSV} />
                <ToolbarBtn icon={FileText} label="Export PDF" onClick={onExportPDF} />
                <ToolbarBtn icon={Download} label="Export PNG" onClick={onExportPNG} />
                <ToolbarBtn icon={Printer} label="Print View" onClick={onPrint} />
            </ToolbarGroup>

            {zoomLevel > 1 && (
                <div className="ml-2 px-2 py-1 bg-blue-900/50 text-blue-200 text-xs rounded border border-blue-800 whitespace-nowrap">
                    {(zoomLevel * 100).toFixed(0)}% Zoom
                </div>
            )}
        </div>
    );
};

export default VisualizationToolbar;