import React from 'react';
import { useSeismicStore } from '@/modules/geoscience/seismic-interpretation/store/seismicStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const SegyMetadataPanel = () => {
  const { textHeader, binaryHeader } = useSeismicStore();

  if (!textHeader && !binaryHeader) {
    return (
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">SEG-Y Metadata</h3>
        <p className="text-sm text-muted-foreground">Load a SEG-Y file to view its metadata.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h3 className="font-semibold text-lg mb-4">SEG-Y Metadata</h3>
      <Tabs defaultValue="text" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="text">Text Header</TabsTrigger>
          <TabsTrigger value="binary">Binary Header</TabsTrigger>
        </TabsList>
        <TabsContent value="text" className="mt-4">
          <pre className="text-xs whitespace-pre-wrap bg-slate-800 p-2 rounded-md h-64 overflow-y-auto">
            {textHeader || 'No Text Header found.'}
          </pre>
        </TabsContent>
        <TabsContent value="binary" className="mt-4 text-xs space-y-1 h-64 overflow-y-auto">
          {binaryHeader ? (
            Object.entries(binaryHeader).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="font-mono text-muted-foreground">{key}:</span>
                <span className="font-semibold">{value.toString()}</span>
              </div>
            ))
          ) : (
            <p>No Binary Header found.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SegyMetadataPanel;