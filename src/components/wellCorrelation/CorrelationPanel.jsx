import React, { useRef } from 'react';
import { useWellCorrelation } from '@/contexts/WellCorrelationContext';
import WellLogViewer from './WellLogViewer';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Maximize, MoveVertical } from 'lucide-react';
import { validateWellData } from '@/utils/wellCorrelation/ValidationHelpers';

const CorrelationPanel = () => {
    const { state, actions } = useWellCorrelation();
    const wells = state?.wells || [];
    const selectedWellIds = state?.selectedWellIds || [];
    const settings = state?.settings || {};
    const markers = state?.markers || [];
    const horizons = state?.horizons || [];
    
    // Robust filtering using validation helper
    const activeWells = wells.filter(w => {
        const validation = validateWellData(w);
        return validation.valid && selectedWellIds.includes(w.id);
    });
    
    const containerRef = useRef(null);

    const handleZoomIn = () => actions?.updateSettings && actions.updateSettings({ verticalScale: Math.min(50, (settings?.verticalScale || 5) + 1) });
    const handleZoomOut = () => actions?.updateSettings && actions.updateSettings({ verticalScale: Math.max(1, (settings?.verticalScale || 5) - 1) });

    if (activeWells.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 bg-[#0F172A] border-2 border-dashed border-slate-800 rounded-xl m-8">
                <div className="p-8 text-center">
                    <MoveVertical className="w-16 h-16 mx-auto mb-4 opacity-20 text-slate-400" />
                    <h3 className="text-xl font-semibold text-slate-300">Correlation Canvas Empty</h3>
                    <p className="mb-6 max-w-sm mx-auto text-slate-500 mt-2">Select valid wells from the left panel to begin correlation.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-[#0F172A]">
            {/* Toolbar */}
            <div className="h-12 bg-[#1E293B] border-b border-slate-800 flex items-center px-4 justify-between shrink-0 shadow-sm z-10">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 uppercase mr-2">Correlation View</span>
                    <div className="h-4 w-px bg-slate-700 mx-2" />
                    <span className="text-xs text-[#CCFF00]">{activeWells.length} Wells Active</span>
                </div>
                <div className="flex items-center gap-1 text-slate-300">
                    <Button variant="ghost" size="sm" onClick={handleZoomOut} className="hover:text-white hover:bg-slate-800"><ZoomOut className="w-4 h-4" /></Button>
                    <span className="text-xs w-12 text-center font-mono text-slate-400">{settings?.verticalScale || 5} px/m</span>
                    <Button variant="ghost" size="sm" onClick={handleZoomIn} className="hover:text-white hover:bg-slate-800"><ZoomIn className="w-4 h-4" /></Button>
                    <div className="h-4 w-px bg-slate-700 mx-2" />
                    <Button variant="ghost" size="sm" className="hover:text-white hover:bg-slate-800"><Maximize className="w-4 h-4" /></Button>
                </div>
            </div>

            {/* Main Correlation Area */}
            <ScrollArea className="flex-1 bg-[#0F172A]" ref={containerRef} id="correlation-panel-scroll-area">
                {/* Use an ID here for image export targeting */}
                <div id="correlation-panel-root" className="flex h-full min-w-max p-4 gap-4 bg-[#0F172A]">
                    {activeWells.map((well) => (
                        <div 
                            key={well.id} 
                            className="flex-shrink-0 w-[300px] border border-slate-800 shadow-lg bg-[#1E293B] flex flex-col rounded-sm overflow-hidden"
                        >
                            {/* Header */}
                            <div className="h-24 border-b border-slate-800 bg-[#1E293B] p-3 flex flex-col justify-between">
                                <div>
                                    <h4 className="font-bold text-sm text-slate-100 truncate flex items-center gap-2" title={well.name}>
                                        <div className="w-2 h-2 rounded-full bg-[#CCFF00]"></div>
                                        {well.name}
                                    </h4>
                                    <p className="text-[10px] text-slate-500 truncate pl-4 mt-1">{well.uwi || 'No UWI'}</p>
                                </div>
                                <div className="flex justify-between text-[10px] text-slate-400 bg-[#0F172A] p-1.5 rounded border border-slate-800 font-mono">
                                    {/* Safe access ensured by validateWellData in filter */}
                                    <span>Start: <span className="text-slate-200">{well.depthRange.start.toFixed(1)}</span></span>
                                    <span>Stop: <span className="text-slate-200">{well.depthRange.stop.toFixed(1)}</span></span>
                                </div>
                            </div>

                            {/* Logs */}
                            <div className="flex-1 relative min-h-[500px] bg-white">
                                <WellLogViewer 
                                    well={well} 
                                    settings={settings}
                                    markers={markers.filter(m => m.wellId === well.id)}
                                    horizons={horizons}
                                    interactive={true}
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" className="bg-slate-900" />
            </ScrollArea>
        </div>
    );
};

export default CorrelationPanel;