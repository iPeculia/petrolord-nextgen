import React from 'react';
import { useMaterialBalance } from '@/hooks/useMaterialBalance';
import { Info, Activity, Box, Gauge, PanelRightClose } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

const MBRightSidebar = () => {
  const { currentTank, ui, toggleRightSidebar } = useMaterialBalance();

  // Safe UI Access
  const isOpen = ui?.rightSidebarOpen ?? true;
  const sidebarWidth = isOpen ? 'w-72' : 'w-0';
  const sidebarOpacity = isOpen ? 'opacity-100' : 'opacity-0';

  return (
    <div className={`${sidebarWidth} bg-slate-950 border-l border-slate-800 flex flex-col transition-all duration-300 ease-in-out overflow-hidden h-full flex-shrink-0 relative`}>
      {/* Collapse Toggle - Positioned Absolute Top Left */}
      <div className={`absolute top-2 left-2 z-10 ${!isOpen ? 'hidden' : ''}`}>
           <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0 text-slate-500 hover:text-white hover:bg-slate-800"
            onClick={toggleRightSidebar}
            title="Collapse Sidebar"
          >
              <PanelRightClose className="h-4 w-4" />
          </Button>
      </div>

      <div className={`${sidebarOpacity} transition-opacity duration-300 flex flex-col h-full w-72 pt-8`}>
        
        <div className="p-4 border-b border-slate-800 bg-slate-950">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Properties Inspector</h3>
        </div>

        <ScrollArea className="flex-1">
            {currentTank ? (
                <div className="p-4 space-y-6">
                    {/* Tank Identity */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                             <h2 className="text-lg font-bold text-white truncate">{currentTank.name}</h2>
                             <span className="text-[10px] bg-[#BFFF00]/10 text-[#BFFF00] px-2 py-0.5 rounded border border-[#BFFF00]/20 uppercase">
                                {currentTank.type}
                             </span>
                        </div>
                        <p className="text-xs text-slate-500">
                             ID: <span className="font-mono text-slate-600">{currentTank.id.substring(0,8)}...</span>
                        </p>
                    </div>

                    <Separator className="bg-slate-800" />

                    {/* Reservoir Properties */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center">
                            <Activity className="w-3.5 h-3.5 mr-2 text-blue-400" /> Reservoir Data
                        </h4>
                        
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-slate-900 p-2 rounded border border-slate-800">
                                <span className="text-[10px] text-slate-500 block uppercase mb-1">Pressure</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-sm font-mono text-white">{currentTank.parameters.initialPressure || '-'}</span>
                                    <span className="text-[10px] text-slate-600">psi</span>
                                </div>
                            </div>
                            <div className="bg-slate-900 p-2 rounded border border-slate-800">
                                <span className="text-[10px] text-slate-500 block uppercase mb-1">Temp</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-sm font-mono text-white">{currentTank.parameters.temperature || '-'}</span>
                                    <span className="text-[10px] text-slate-600">°F</span>
                                </div>
                            </div>
                            <div className="bg-slate-900 p-2 rounded border border-slate-800">
                                <span className="text-[10px] text-slate-500 block uppercase mb-1">Porosity</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-sm font-mono text-white">{currentTank.parameters.porosity || '-'}</span>
                                    <span className="text-[10px] text-slate-600">frac</span>
                                </div>
                            </div>
                            <div className="bg-slate-900 p-2 rounded border border-slate-800">
                                <span className="text-[10px] text-slate-500 block uppercase mb-1">Swi</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-sm font-mono text-white">{currentTank.parameters.swi || '-'}</span>
                                    <span className="text-[10px] text-slate-600">frac</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator className="bg-slate-800" />

                    {/* Geometry */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center">
                            <Box className="w-3.5 h-3.5 mr-2 text-orange-400" /> Geometry
                        </h4>
                        <div className="space-y-2 text-xs">
                             <div className="flex justify-between items-center py-1">
                                <span className="text-slate-500">Drive Type</span>
                                <span className="text-white font-medium">{currentTank.parameters.driveType || 'Unknown'}</span>
                             </div>
                             <div className="flex justify-between items-center py-1">
                                <span className="text-slate-500">Area</span>
                                <span className="text-white font-mono">{currentTank.parameters.area || '-'} <span className="text-slate-600">ac</span></span>
                             </div>
                             <div className="flex justify-between items-center py-1">
                                <span className="text-slate-500">Thickness</span>
                                <span className="text-white font-mono">{currentTank.parameters.thickness || '-'} <span className="text-slate-600">ft</span></span>
                             </div>
                        </div>
                    </div>

                    <Separator className="bg-slate-800" />

                    {/* Compressibility */}
                    <div className="space-y-3">
                         <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center">
                            <Gauge className="w-3.5 h-3.5 mr-2 text-green-400" /> Compressibility
                        </h4>
                        <div className="space-y-2 text-xs">
                             <div className="flex justify-between items-center py-1">
                                <span className="text-slate-500">Formation (cf)</span>
                                <span className="text-white font-mono">{currentTank.parameters.cf || '-'} <span className="text-slate-600">psi⁻¹</span></span>
                             </div>
                             <div className="flex justify-between items-center py-1">
                                <span className="text-slate-500">Water (cw)</span>
                                <span className="text-white font-mono">{currentTank.parameters.cw || '-'} <span className="text-slate-600">psi⁻¹</span></span>
                             </div>
                        </div>
                    </div>

                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-64 px-8 text-center mt-12">
                    <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center mb-4">
                        <Info className="w-6 h-6 text-slate-600" />
                    </div>
                    <h3 className="text-sm font-medium text-slate-300">No Selection</h3>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                        Select a tank from the project explorer to view and edit its properties.
                    </p>
                </div>
            )}
        </ScrollArea>
      </div>
    </div>
  );
};

export default MBRightSidebar;