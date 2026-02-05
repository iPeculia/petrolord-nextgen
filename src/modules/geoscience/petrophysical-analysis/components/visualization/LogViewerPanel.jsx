import React, { useRef, useEffect, useMemo } from 'react';
import { useLogViewer } from '@/modules/geoscience/petrophysical-analysis/context/LogViewerContext';
import { useGlobalDataStore } from '@/store/globalDataStore';
import LogControls from './LogControls';
import LogLegend from './LogLegend';
import DepthTrack from './DepthTrack';
import LogTrack from './LogTrack';
import { AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LogViewerPanelContent = () => {
  const { activeWell, wellLogs, markers, isLogsLoading, wells, loadLogsForWell } = useGlobalDataStore();
  const { setScrollPosition, scrollPosition, zoom } = useLogViewer();
  
  const activeLogs = activeWell ? wellLogs[activeWell] : null;
  const activeMarkers = activeWell ? markers[activeWell] : [];
  const scrollContainerRef = useRef(null);
  const curves = useMemo(() => activeLogs ? Object.values(activeLogs) : [], [activeLogs]);
  
  const masterDepthCurve = useMemo(() => {
      if (curves.length === 0) return null;
      return curves.reduce((prev, current) => {
          const prevLen = prev?.depth_array?.length || 0;
          const currLen = current?.depth_array?.length || 0;
          return currLen > prevLen ? current : prev;
      }, curves[0]);
  }, [curves]);

  const depthArray = masterDepthCurve ? masterDepthCurve.depth_array : [];
  const minDepth = depthArray.length ? depthArray[0] : 0;
  const maxDepth = depthArray.length ? depthArray[depthArray.length - 1] : 1000;
  const depthRange = Math.abs(maxDepth - minDepth);
  const totalHeight = Math.max(depthRange * zoom, 500); 

  useEffect(() => {
      if (scrollContainerRef.current) {
         if (scrollPosition > minDepth) {
            const targetScroll = (scrollPosition - minDepth) * zoom;
            if (Math.abs(scrollContainerRef.current.scrollTop - targetScroll) > 10) {
                scrollContainerRef.current.scrollTop = targetScroll;
            }
         } else {
             scrollContainerRef.current.scrollTop = 0;
         }
      }
  }, [zoom, minDepth]);

  const handleScroll = (e) => {
      if (!e.target) return;
      const scrollTop = e.target.scrollTop;
      const newDepth = (scrollTop / zoom) + minDepth;
      setScrollPosition(newDepth);
  };

  const handleRefresh = () => {
      if (activeWell) loadLogsForWell(activeWell);
  };

  if (!activeWell) {
      return (
        <div className="flex flex-col h-full bg-[#0B101B] text-white">
            <div className="flex-1 flex items-center justify-center text-slate-500 p-8 text-center">
                <div>
                    <p className="mb-2 text-lg font-medium text-slate-400">No Well Selected</p>
                    <p className="text-sm">Select or activate a well from the list to view logs.</p>
                </div>
            </div>
        </div>
      );
  }

  // Specific loading state handling
  if (isLogsLoading) {
      return (
        <div className="flex flex-col h-full bg-[#0B101B] text-white">
            <LogControls onExport={() => {}} />
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="flex flex-col items-center">
                    <Loader2 className="w-8 h-8 animate-spin text-[#BFFF00] mb-3" />
                    <p className="text-slate-400">Fetching logs from database...</p>
                </div>
            </div>
        </div>
      );
  }

  if (!activeLogs || curves.length === 0) {
      return (
        <div className="flex flex-col h-full bg-[#0B101B] text-white">
             <LogControls onExport={() => {}} />
            <div className="flex-1 flex items-center justify-center text-slate-500 p-8 text-center">
                <div>
                    <AlertCircle className="w-10 h-10 mx-auto mb-3 text-slate-600" />
                    <p className="mb-2 text-lg font-medium text-slate-400">No Log Data Available</p>
                    <p className="text-sm max-w-md mx-auto mb-4">
                        The well "{wells[activeWell]?.name}" does not have any logs. 
                        Import an LAS file to visualize data.
                    </p>
                    <Button variant="outline" size="sm" onClick={handleRefresh} className="border-slate-700 text-slate-300 hover:bg-slate-800">
                        <RefreshCw className="w-3 h-3 mr-2" /> Check Again
                    </Button>
                </div>
            </div>
        </div>
      );
  }
  
  const chunkCurves = (arr, size) => {
      const chunks = [];
      for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size));
      return chunks;
  };
  
  const tracks = chunkCurves(curves, 3);

  return (
    <div className="flex flex-col h-full bg-[#0B101B] text-white overflow-hidden">
        <LogControls onExport={() => {}} />
        <div className="flex-1 flex min-h-0">
            <LogLegend curves={curves} />
            <div className="flex-1 relative overflow-hidden flex flex-col bg-[#0B101B]">
                <div 
                    ref={scrollContainerRef}
                    className="flex-1 overflow-y-auto overflow-x-auto relative scrollbar-hide"
                    onScroll={handleScroll}
                >
                    <div style={{ height: `${totalHeight}px`, position: 'relative', minWidth: '100%' }}></div>
                    <div className="sticky top-0 left-0 h-full flex min-w-max bg-[#0B101B]">
                        <DepthTrack minDepth={minDepth} maxDepth={maxDepth} height={scrollContainerRef.current?.clientHeight || 800} />
                        {tracks.map((trackCurves, idx) => (
                            <LogTrack 
                                key={idx}
                                curves={trackCurves}
                                markers={activeMarkers}
                                depthArray={depthArray}
                                height={scrollContainerRef.current?.clientHeight || 800}
                                width={250}
                            />
                        ))}
                        <div className="w-20 bg-[#0B101B] h-full border-l border-slate-900" />
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

const LogViewerPanel = () => {
    return (
        <div className="h-full w-full">
            <LogViewerPanelContent />
        </div>
    );
};

export default LogViewerPanel;