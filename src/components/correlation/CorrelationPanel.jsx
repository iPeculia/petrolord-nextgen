import React, { useRef, useEffect, useState } from 'react';
import { useProject } from '@/hooks/useWellLogCorrelation';
import { useCorrelationPanelStore } from '@/store/correlationPanelStore';
import { useGlobalDataStore } from '@/store/globalDataStore.js';
import { useCorrelationInteraction } from '@/hooks/useCorrelationInteraction';
import { useDepthCursor } from '@/hooks/useDepthCursor';
import DepthAxis from './DepthAxis';
import LogTrack from './LogTrack';
import WellHeader from './WellHeader';
import TopsOverlay from './TopsOverlay';
import { Loader2 } from 'lucide-react';
import CorrelationLineOverlay from './CorrelationLineOverlay';
import { templates } from '@/lib/trackTemplates';
import { useToast } from '@/components/ui/use-toast';

const CorrelationPanel = ({ panelId, projectId }) => {
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const { toast } = useToast();

  const { data: projectData } = useProject(projectId);
  const wells = useGlobalDataStore(state => state.wells);

  const { 
    wellOrder,
    setWellOrder,
    correlationLines,
    wellCurves,
    selectedWellId,
    selectWell
  } = useCorrelationPanelStore();

  useCorrelationInteraction(containerRef);
  useDepthCursor(containerRef);

  useEffect(() => {
    // This effect now correctly uses the projectData and wells from global store
    if (projectData?.wells && Object.keys(wells).length > 0) {
      const panelWells = projectData.wells
        .map((well, index) => ({
            well_id: well.id,
            well_name: wells[well.id]?.name || well.name,
            order_index: index,
            well, // Keep original well data for tops etc.
        }))
        .sort((a, b) => a.order_index - b.order_index);
      setWellOrder(panelWells);
    } else if (projectData && !projectData.wells) {
       setWellOrder([]);
    }
  }, [projectData, wells, setWellOrder]);

  useEffect(() => {
    const observer = new ResizeObserver(entries => {
      if (entries[0]) {
        const { width, height } = entries[0].contentRect;
        setContainerSize({ width, height });
      }
    });
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  if (!projectData) {
    return <div className="flex-grow flex items-center justify-center"><Loader2 className="animate-spin w-8 h-8" /></div>;
  }
  
  const allTops = (wellOrder || []).flatMap(pw => pw.well?.wellbores?.flatMap(wb => wb.well_tops) || []);
  const trackWidth = 120;
  
  const defaultTemplate = templates.TRIPLE_COMBO;

  const wellLayout = (wellOrder || []).map((panelWell, index) => {
      if (!panelWell || !panelWell.well_id) {
          return null;
      }
      
      const wellId = panelWell.well_id;
      const curvesForWell = wellCurves[wellId] || defaultTemplate.curves;
      const wellWidth = curvesForWell.length * trackWidth || trackWidth;
      
      const previousWidths = (wellOrder || []).slice(0, index).reduce((acc, currentPanelWell) => {
          if (!currentPanelWell || !currentPanelWell.well_id) return acc;
          const currentCurves = wellCurves[currentPanelWell.well_id] || defaultTemplate.curves;
          const currentWellWidth = currentCurves.length * trackWidth || trackWidth;
          return acc + currentWellWidth;
      }, 0);

      return { wellId, well: panelWell.well, xOffset: previousWidths, width: wellWidth };
  }).filter(Boolean);

  return (
    <div className="flex-grow flex flex-col" ref={containerRef}>
      <div className="flex h-[60px] flex-shrink-0">
        <div className="w-[60px] h-full bg-slate-100 border-b border-slate-300 flex-shrink-0"></div>
        {wellLayout.map(({ well, wellId, width }) => (
            <WellHeader 
                key={wellId}
                well={well}
                width={width}
                isSelected={selectedWellId === wellId}
                onSelect={() => selectWell(wellId)}
            />
        ))}
      </div>
      <div className="flex-grow flex relative overflow-hidden">
        <DepthAxis height={containerSize.height - 60} />
        <div className="flex-grow flex overflow-x-auto relative">
           <div className="flex relative">
                {wellLayout.map((layout) => {
                    const curves = wellCurves[layout.wellId] || defaultTemplate.curves;
                    return (
                        <div key={layout.wellId} className="flex absolute" style={{ transform: `translateX(${layout.xOffset}px)`}}>
                            {curves.length > 0 ? curves.map((curve, cIdx) => {
                                return <LogTrack key={`${layout.wellId}-${curve.name}-${cIdx}`} curve={curve} wellId={layout.wellId} height={containerSize.height - 60} />;
                            }) : <div style={{width: `${layout.width}px`}} className="h-full bg-white border-x border-slate-300"></div> }
                            {/* TopsOverlay needs to be fixed to work with the new structure */}
                            {/* <TopsOverlay 
                                well={layout.well}
                                wellId={layout.wellId}
                                tops={layout.well.wellbores?.[0]?.well_tops || []}
                                wellXOffset={0}
                                height={containerSize.height - 60}
                                width={layout.width}
                                panelId={panelId}
                                projectData={projectData}
                            /> */}
                        </div>
                    )
                })}
                {/* <CorrelationLineOverlay allTops={allTops} lines={correlationLines} wellLayout={wellLayout} height={containerSize.height - 60} /> */}
           </div>
        </div>
      </div>
    </div>
  );
};

export default CorrelationPanel;