import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import SeismicDataUpload from '@/modules/geoscience/seismic-interpretation/components/SeismicDataUpload';
import SeismicTraceViewer from '@/modules/geoscience/seismic-interpretation/components/SeismicTraceViewer';
import HorizonPicker from '@/modules/geoscience/seismic-interpretation/components/HorizonPicker';
import SegyMetadataPanel from '@/modules/geoscience/seismic-interpretation/components/SegyMetadataPanel';
import TraceHeaderInspector from '@/modules/geoscience/seismic-interpretation/components/TraceHeaderInspector';
import WellLogIntegration from '@/modules/geoscience/seismic-interpretation/components/WellLogIntegration';
import ProjectManager from '@/modules/geoscience/seismic-interpretation/components/ProjectManager';
import ExportPanel from '@/modules/geoscience/seismic-interpretation/components/ExportPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import '@/modules/geoscience/seismic-interpretation/styles/seismic.css';
import { useSeismicStore } from '../store/seismicStore';

const SeismicInterpretationPage = () => {
  const [activeHorizon, setActiveHorizon] = useState(null);
  const viewerCanvasRef = useRef(null);
  const viewerBgCanvasRef = useRef(null);
  const fileName = useSeismicStore(state => state.fileName);

  const handleHorizonPickerClick = (horizonName) => {
    setActiveHorizon(prev => prev === horizonName ? null : horizonName);
  };

  return (
    <>
      <Helmet>
        <title>Seismic Interpretation</title>
        <meta name="description" content="Interpret SEG-Y seismic data, pick horizons, and analyze subsurface structures." />
      </Helmet>
      <div className="flex h-[calc(100vh-4rem)] seismic-container">
        {/* Left Panel */}
        <div className="w-1/4 min-w-[350px] flex flex-col seismic-panel overflow-y-auto">
          <Tabs defaultValue="data" className="flex flex-col h-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="data">Data</TabsTrigger>
              <TabsTrigger value="metadata">Metadata</TabsTrigger>
            </TabsList>
            <TabsContent value="data" className="flex-grow">
              <SeismicDataUpload />
              <Separator />
              <ProjectManager />
              <Separator />
              <ExportPanel canvasRef={viewerCanvasRef} backgroundCanvasRef={viewerBgCanvasRef} />
            </TabsContent>
            <TabsContent value="metadata" className="flex-grow">
              <SegyMetadataPanel />
            </TabsContent>
          </Tabs>
        </div>

        {/* Center Panel */}
        <div className="flex-grow seismic-viewer-wrapper">
          <SeismicTraceViewer 
            activeHorizon={activeHorizon} 
            canvasRef={viewerCanvasRef} 
            backgroundCanvasRef={viewerBgCanvasRef} 
          />
        </div>

        {/* Right Panel */}
        <div className="w-1/4 min-w-[350px] flex flex-col seismic-panel overflow-y-auto">
           <Tabs defaultValue="horizons" className="flex flex-col h-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="horizons">Horizons</TabsTrigger>
              <TabsTrigger value="inspector">Inspector</TabsTrigger>
              <TabsTrigger value="wells">Well Tie</TabsTrigger>
            </TabsList>
            <TabsContent value="horizons" className="flex-grow">
               <HorizonPicker activeHorizon={activeHorizon} setActiveHorizon={handleHorizonPickerClick} />
            </TabsContent>
            <TabsContent value="inspector" className="flex-grow">
              <TraceHeaderInspector />
            </TabsContent>
            <TabsContent value="wells" className="flex-grow">
              <WellLogIntegration />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default SeismicInterpretationPage;