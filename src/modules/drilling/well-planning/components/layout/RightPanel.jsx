import React from 'react';
import { useWellPlanningDesign } from '@/contexts/WellPlanningDesignContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Ruler, Info, Target, Compass, Database, MapPin, Download } from 'lucide-react';
import { exportAsJSON, exportAsCSV, exportAsPDF } from '../../utils/geometryExport';

const PropertyRow = ({ label, value, unit }) => (
  <div className="flex justify-between items-center py-2 border-b border-[#2f2f50] last:border-0">
    <span className="text-xs text-slate-400">{label}</span>
    <div className="flex items-center gap-1">
      <span className="text-sm font-mono text-[#e0e0e0]">{value}</span>
      {unit && <span className="text-[10px] text-slate-500">{unit}</span>}
    </div>
  </div>
);

const RightPanel = () => {
  const { currentWell, currentProject, geometryState } = useWellPlanningDesign();
  const { stats, trajectory } = geometryState;

  if (!currentWell) {
    return (
      <div className="h-full bg-[#1a1a2e] border-l border-[#252541] flex items-center justify-center p-6 text-center text-slate-500">
         <p>Select a well to view properties</p>
      </div>
    );
  }

  const handleExport = (type) => {
      if (type === 'pdf') exportAsPDF(currentWell.name, trajectory, stats);
      if (type === 'csv') exportAsCSV(trajectory, `${currentWell.name}_trajectory.csv`);
      if (type === 'json') exportAsJSON({ well: currentWell, trajectory }, `${currentWell.name}.json`);
  };

  return (
    <div className="flex flex-col h-full bg-[#1a1a2e] border-l border-[#252541] w-full max-w-[320px]">
      <div className="p-4 border-b border-[#252541] flex items-center justify-between">
        <h3 className="font-semibold text-[#e0e0e0] flex items-center gap-2">
          <Info className="h-4 w-4 text-[#FFC107]" />
          Properties
        </h3>
        <Badge variant="outline" className="border-[#2f2f50] text-slate-400 font-normal">
          {currentWell.status}
        </Badge>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          
          {/* Well Stats (New Phase 2 Feature) */}
          <div className="bg-[#252541]/50 p-3 rounded border border-[#2f2f50]">
             <h4 className="text-xs font-bold text-[#FFC107] uppercase tracking-wider mb-2">Calculated Stats</h4>
             <div className="grid grid-cols-2 gap-y-2">
                <div>
                   <div className="text-[10px] text-slate-400">Total MD</div>
                   <div className="font-mono text-sm">{stats.totalMD?.toFixed(0) || 0} ft</div>
                </div>
                <div>
                   <div className="text-[10px] text-slate-400">Total TVD</div>
                   <div className="font-mono text-sm">{stats.totalTVD?.toFixed(0) || 0} ft</div>
                </div>
                <div>
                   <div className="text-[10px] text-slate-400">Max Inclination</div>
                   <div className="font-mono text-sm">{stats.maxInc?.toFixed(1) || 0}°</div>
                </div>
                <div>
                   <div className="text-[10px] text-slate-400">Displacement</div>
                   <div className="font-mono text-sm">{stats.displacement?.toFixed(0) || 0} ft</div>
                </div>
             </div>
          </div>

          {/* Export Actions */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Exports</h4>
            <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 text-[10px] h-7" onClick={() => handleExport('pdf')}>PDF</Button>
                <Button variant="outline" size="sm" className="flex-1 text-[10px] h-7" onClick={() => handleExport('csv')}>CSV</Button>
                <Button variant="outline" size="sm" className="flex-1 text-[10px] h-7" onClick={() => handleExport('json')}>JSON</Button>
            </div>
          </div>

          {/* Well Header Info */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Identification</h4>
            <div className="space-y-1">
              <PropertyRow label="Well Name" value={currentWell.name} />
              <PropertyRow label="Project" value={currentProject?.name} />
              <PropertyRow label="UWI / API" value="42-000-00000" />
            </div>
          </div>

          {/* Location */}
          <div>
             <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
               <MapPin size={12} /> Location
             </h4>
             <div className="space-y-1">
                <PropertyRow label="Latitude" value={currentWell.location.lat.toFixed(6)} />
                <PropertyRow label="Longitude" value={currentWell.location.long.toFixed(6)} />
             </div>
          </div>

        </div>
      </ScrollArea>
    </div>
  );
};

export default RightPanel;