import React, { useState, useMemo, useRef, memo } from 'react';
import { useReservoirSimulation } from '@/context/ReservoirSimulationContext.jsx';
import { Slider } from '@/components/ui/slider';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Droplets, Flame, Activity, AlertCircle } from 'lucide-react';
import { 
    extractSectionCells, 
    getPropertyColor, 
    findWellsOnSection,
    SECTION_TYPES 
} from '@/utils/sectionViewUtils.js';
import SectionMiniMap from './SectionMiniMap.jsx';
import SectionLegend from './SectionLegend.jsx';
import SectionTooltip from './SectionTooltip.jsx';

const GeologicalSectionView = memo(() => {
    const { state } = useReservoirSimulation();
    const { selectedModel, simulationState } = state || {};
    const { currentTimeStep = 0 } = simulationState || {};

    const [sectionType, setSectionType] = useState(SECTION_TYPES.INLINE);
    const [sectionIndex, setSectionIndex] = useState(9); // Default center
    const [activeProperty, setActiveProperty] = useState('sw');
    const [hoverInfo, setHoverInfo] = useState({ visible: false, cell: null, x: 0, y: 0 });
    
    const containerRef = useRef(null);

    const currentData = useMemo(() => {
        if (!selectedModel || !selectedModel.grid) return null;
        
        // Check availability of data
        const has3DSnapshots = selectedModel.data?.snapshots?.length > 0;
        const has2DData = selectedModel.data?.[activeProperty];

        if (!has3DSnapshots && !has2DData) return null;

        const { nx, ny, nz = 1 } = selectedModel.grid || selectedModel.gridSize || { nx:20, ny:20, nz:1 };
        const maxIndex = sectionType === SECTION_TYPES.INLINE ? nx - 1 : ny - 1;
        const safeIndex = Math.min(Math.max(0, sectionIndex), maxIndex);

        let cells = [];

        if (has3DSnapshots) {
             const snapshot = selectedModel.data.snapshots[currentTimeStep];
             if (snapshot) {
                cells = extractSectionCells(snapshot, sectionType, safeIndex, selectedModel.grid);
             }
        } else if (has2DData) {
            const stepData = selectedModel.data[activeProperty][currentTimeStep];
            if (stepData) {
                if (sectionType === SECTION_TYPES.INLINE) {
                     for (let j = 0; j < ny; j++) {
                         const val = stepData[safeIndex]?.[j];
                         if (val !== undefined) {
                             cells.push({ 
                                 i: safeIndex, j, k: 0, 
                                 [activeProperty]: val, 
                                 tvd: 50,
                                 plotX: j, 
                                 plotY: 50,
                                 facies: 'Sand',
                                 sw: activeProperty === 'sw' ? val : 0,
                                 so: activeProperty === 'so' ? val : 0,
                                 sg: activeProperty === 'sg' ? val : 0,
                                 pressure: activeProperty === 'pressure' ? val : 0,
                             });
                         }
                     }
                } else {
                     for (let i = 0; i < nx; i++) {
                         const val = stepData[i]?.[safeIndex];
                         if (val !== undefined) {
                             cells.push({ 
                                 i, j: safeIndex, k: 0, 
                                 [activeProperty]: val, 
                                 tvd: 50,
                                 plotX: i, 
                                 plotY: 50,
                                 facies: 'Sand',
                                 sw: activeProperty === 'sw' ? val : 0,
                                 so: activeProperty === 'so' ? val : 0,
                                 sg: activeProperty === 'sg' ? val : 0,
                                 pressure: activeProperty === 'pressure' ? val : 0,
                             });
                         }
                     }
                }
            }
        }

        const wells = findWellsOnSection(selectedModel.wells, sectionType, safeIndex, 2);

        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        cells.forEach(c => {
            if (c.plotX < minX) minX = c.plotX;
            if (c.plotX > maxX) maxX = c.plotX;
            if (c.tvd < minY) minY = c.tvd;
            if ((c.tvd + 15) > maxY) maxY = c.tvd + 15;
        });

        if (minX === Infinity) { minX = 0; maxX = Math.max(10, (sectionType === SECTION_TYPES.INLINE ? ny : nx)); }
        if (minY === Infinity) { minY = 0; maxY = 100; }

        return { cells, wells, bounds: { minX, maxX, minY, maxY }, gridDims: { nx, ny, nz } };
    }, [selectedModel, currentTimeStep, sectionType, sectionIndex, activeProperty]);

    if (!currentData) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 bg-slate-950/20 gap-3">
                <AlertCircle className="w-8 h-8 text-slate-600" /> 
                <div className="text-center">
                    <p>Geological section not available.</p>
                </div>
            </div>
        );
    }

    const { cells, wells, bounds, gridDims } = currentData;
    const padding = 40;
    const width = 800;
    const height = 500;
    
    const plotWidth = width - padding * 2;
    const plotHeight = height - padding * 2;
    
    const scaleX = plotWidth / (Math.max(1, bounds.maxX - bounds.minX + 1));
    const scaleY = plotHeight / (Math.max(1, bounds.maxY - bounds.minY));

    return (
        <div className="flex flex-col h-full bg-[#0B1120] relative" ref={containerRef}>
            <div className="h-12 border-b border-slate-800 bg-slate-900/80 flex items-center px-4 justify-between gap-4 z-20">
                <div className="flex items-center gap-2">
                    <Select value={sectionType} onValueChange={setSectionType}>
                        <SelectTrigger className="w-[120px] h-8 text-xs bg-slate-800 border-slate-700">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={SECTION_TYPES.INLINE}>Inline (I)</SelectItem>
                            <SelectItem value={SECTION_TYPES.CROSSLINE}>Crossline (J)</SelectItem>
                        </SelectContent>
                    </Select>
                    
                    <div className="flex items-center gap-2 bg-slate-800/50 rounded px-2 py-1 border border-slate-700">
                        <span className="text-xs text-slate-400 font-mono w-4">{sectionType.toUpperCase()}:</span>
                        <Slider 
                            value={[sectionIndex]} 
                            min={0} 
                            max={sectionType === SECTION_TYPES.INLINE ? (gridDims.nx - 1) : (gridDims.ny - 1)} 
                            step={1}
                            className="w-32"
                            onValueChange={(val) => setSectionIndex(val[0])}
                        />
                        <span className="text-xs font-mono text-emerald-400 w-6 text-right">{sectionIndex}</span>
                    </div>
                </div>

                <ToggleGroup type="single" value={activeProperty} onValueChange={(v) => v && setActiveProperty(v)} className="bg-slate-800 p-0.5 rounded-lg border border-slate-700">
                    <ToggleGroupItem value="sw" size="sm" className="h-7 px-2 text-[10px] data-[state=on]:bg-slate-700 text-blue-400"><Droplets className="w-3 h-3 mr-1" /> Sw</ToggleGroupItem>
                    <ToggleGroupItem value="so" size="sm" className="h-7 px-2 text-[10px] data-[state=on]:bg-slate-700 text-emerald-400"><Droplets className="w-3 h-3 mr-1" /> So</ToggleGroupItem>
                    <ToggleGroupItem value="sg" size="sm" className="h-7 px-2 text-[10px] data-[state=on]:bg-slate-700 text-red-400"><Flame className="w-3 h-3 mr-1" /> Sg</ToggleGroupItem>
                    <ToggleGroupItem value="pressure" size="sm" className="h-7 px-2 text-[10px] data-[state=on]:bg-slate-700 text-indigo-400"><Activity className="w-3 h-3 mr-1" /> Pres</ToggleGroupItem>
                </ToggleGroup>
            </div>

            <div className="flex-1 relative overflow-hidden cursor-crosshair group">
                <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="absolute inset-0">
                    <g transform={`translate(${padding}, ${padding})`}>
                        {cells.map((cell, idx) => {
                            const x = (cell.plotX - bounds.minX) * scaleX;
                            const y = (cell.tvd - bounds.minY) * scaleY;
                            const w = scaleX * 1.02;
                            const h = Math.max(15 * scaleY, 20);

                            return (
                                <rect 
                                    key={`${cell.i}-${cell.j}-${cell.k}-${idx}`}
                                    x={x} y={y} width={w} height={h}
                                    fill={getPropertyColor(cell[activeProperty], activeProperty, cell.facies)}
                                    stroke="none"
                                    onMouseEnter={(e) => {
                                        setHoverInfo({
                                            visible: true,
                                            cell: cell,
                                            x: e.clientX,
                                            y: e.clientY
                                        });
                                    }}
                                    onMouseLeave={() => setHoverInfo({ ...hoverInfo, visible: false })}
                                />
                            );
                        })}

                        {wells.map((well) => {
                            const wx = (well.plotX - bounds.minX) * scaleX + scaleX/2;
                            return (
                                <g key={well.id}>
                                    <line x1={wx} y1={0} x2={wx} y2={plotHeight} stroke="white" strokeWidth={1} strokeOpacity={0.5} />
                                    <line x1={wx} y1={0} x2={wx} y2={plotHeight * 0.8} stroke={well.type === 'Injector' ? '#3b82f6' : '#ef4444'} strokeWidth={3} />
                                    <text x={wx} y={-10} fill="white" fontSize={10} textAnchor="middle">{well.id}</text>
                                </g>
                            );
                        })}
                    </g>
                    
                    <text x={padding/2} y={height/2} transform={`rotate(-90, ${padding/2}, ${height/2})`} fill="#64748b" fontSize={10} textAnchor="middle">TVD [m]</text>
                    <text x={width/2} y={height - 10} fill="#64748b" fontSize={10} textAnchor="middle">Distance along section</text>
                </svg>

                <div className="absolute top-4 right-4 flex flex-col gap-4 items-end">
                    <SectionMiniMap 
                        gridDims={gridDims}
                        currentType={sectionType}
                        currentIndex={sectionIndex}
                        onSectionChange={setSectionIndex}
                        wells={selectedModel.wells}
                    />
                    <SectionLegend 
                        property={activeProperty}
                        min={activeProperty === 'pressure' ? 100 : 0}
                        max={activeProperty === 'pressure' ? 350 : 1}
                    />
                </div>
            </div>

            <SectionTooltip visible={hoverInfo.visible} cell={hoverInfo.cell} x={hoverInfo.x} y={hoverInfo.y} />
        </div>
    );
});

export default GeologicalSectionView;