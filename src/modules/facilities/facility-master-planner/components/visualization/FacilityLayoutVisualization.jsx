import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, Maximize, Move, MousePointer2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import UnitBox from './UnitBox';
import StreamLine from './StreamLine';
import EquipmentIcon from './EquipmentIcon';
import { useFacilityMasterPlanner } from '../../context/FacilityMasterPlannerContext';

const FacilityLayoutVisualization = () => {
  const { currentFacility, processUnits, equipment, streams, setCurrentUnit, setCurrentEquipment } = useFacilityMasterPlanner();
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedId, setSelectedId] = useState(null);
  
  const containerRef = useRef(null);

  // --- Simplified Auto-Layout Logic ---
  const UNIT_WIDTH = 180;
  const UNIT_HEIGHT = 120;
  const GAP_X = 120;
  const GAP_Y = 150;
  const COLS = 4;

  const facilityUnits = processUnits.filter(u => u.facility_id === currentFacility?.facility_id);
  const facilityEquipment = equipment.filter(e => e.facility_id === currentFacility?.facility_id);
  const facilityStreams = streams.filter(s => s.facility_id === currentFacility?.facility_id);

  const getUnitPosition = (index) => {
      const col = index % COLS;
      const row = Math.floor(index / COLS);
      return {
          x: 100 + col * (UNIT_WIDTH + GAP_X),
          y: 100 + row * (UNIT_HEIGHT + GAP_Y)
      };
  };

  // Attach equipment to units (simple visualization logic)
  const getEquipmentPosition = (eq, unitPos) => {
      // Position equipment below the unit
      return {
          x: unitPos.x + 20, // Offset
          y: unitPos.y + UNIT_HEIGHT + 20
      };
  };

  const handleMouseDown = (e) => {
    // Only drag if clicking on background
    if (e.target.tagName === 'svg' || e.target.tagName === 'rect' && e.target.parentNode.tagName === 'svg') {
        setIsDragging(true);
        setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleUnitClick = (unit) => {
      setSelectedId(unit.unit_id);
      setCurrentUnit(unit);
  };

  const handleEquipmentClick = (eq) => {
      setSelectedId(eq.equipment_id);
      setCurrentEquipment(eq);
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#0f172a] select-none">
      {/* Toolbar */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 bg-slate-900/50 p-2 rounded-lg border border-slate-700 backdrop-blur-sm shadow-xl">
        <Button size="icon" variant="ghost" onClick={() => setScale(s => Math.min(s + 0.1, 2))} className="hover:bg-white/10 text-white" title="Zoom In">
            <ZoomIn className="w-4 h-4" />
        </Button>
        <Button size="icon" variant="ghost" onClick={() => setScale(s => Math.max(s - 0.1, 0.5))} className="hover:bg-white/10 text-white" title="Zoom Out">
            <ZoomOut className="w-4 h-4" />
        </Button>
        <Button size="icon" variant="ghost" onClick={() => { setScale(1); setPosition({x:0, y:0}); }} className="hover:bg-white/10 text-white" title="Reset View">
            <Maximize className="w-4 h-4" />
        </Button>
      </div>

      {/* SVG Canvas */}
      <div 
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg width="100%" height="100%">
            <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.5"/>
                </pattern>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            <g transform={`translate(${position.x}, ${position.y}) scale(${scale})`}>
                
                {/* Streams Layer (Bottom) */}
                {facilityStreams.map(stream => {
                    const sourceIdx = facilityUnits.findIndex(u => u.unit_id === stream.source_unit_id);
                    const targetIdx = facilityUnits.findIndex(u => u.unit_id === stream.target_unit_id);
                    if (sourceIdx === -1 || targetIdx === -1) return null;

                    const startPos = getUnitPosition(sourceIdx);
                    const endPos = getUnitPosition(targetIdx);

                    return (
                        <StreamLine 
                            key={stream.stream_id} 
                            stream={stream}
                            start={{ x: startPos.x + UNIT_WIDTH, y: startPos.y + UNIT_HEIGHT/2 }}
                            end={{ x: endPos.x, y: endPos.y + UNIT_HEIGHT/2 }}
                        />
                    );
                })}

                {/* Units Layer */}
                {facilityUnits.map((unit, idx) => {
                    const pos = getUnitPosition(idx);
                    return (
                        <UnitBox 
                            key={unit.unit_id}
                            unit={unit}
                            x={pos.x}
                            y={pos.y}
                            width={UNIT_WIDTH}
                            height={UNIT_HEIGHT}
                            onClick={handleUnitClick}
                            isSelected={selectedId === unit.unit_id}
                        />
                    );
                })}

                {/* Equipment Layer (Associated with units or standalone) */}
                {facilityEquipment.map((eq, idx) => {
                    // Try to find parent unit position
                    const parentIdx = facilityUnits.findIndex(u => u.unit_id === eq.process_unit_id);
                    let pos;
                    if (parentIdx >= 0) {
                        const unitPos = getUnitPosition(parentIdx);
                        pos = getEquipmentPosition(eq, unitPos);
                        // Shift if multiple equipment on same unit (simplified)
                        pos.x += (idx % 3) * 50; 
                    } else {
                        // Standalone equipment
                         pos = { x: 50 + idx * 60, y: 500 }; 
                    }

                    return (
                        <EquipmentIcon 
                            key={eq.equipment_id}
                            equipment={eq}
                            x={pos.x}
                            y={pos.y}
                            onClick={handleEquipmentClick}
                            isSelected={selectedId === eq.equipment_id}
                        />
                    )
                })}

            </g>
        </svg>
      </div>
      
      {/* Legend Overlay */}
      <div className="absolute bottom-4 left-4 bg-slate-900/80 p-3 rounded-lg border border-slate-700 backdrop-blur-sm pointer-events-none shadow-lg">
          <div className="text-xs font-semibold text-white mb-2 uppercase tracking-wider">Utilization Status</div>
          <div className="flex gap-4">
              <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                  <span className="text-xs text-slate-300">Optimal (&lt;85%)</span>
              </div>
              <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
                  <span className="text-xs text-slate-300">High (85-95%)</span>
              </div>
              <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                  <span className="text-xs text-slate-300">Critical (&gt;95%)</span>
              </div>
          </div>
      </div>
    </div>
  );
};

export default FacilityLayoutVisualization;