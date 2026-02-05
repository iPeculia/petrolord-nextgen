import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileJson, Image, FileText } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useSeismicStore } from '@/modules/geoscience/seismic-interpretation/store/seismicStore';
import { exportViewAsImage, exportInterpretationToJson } from '@/modules/geoscience/seismic-interpretation/utils/seismicCalculations';

const ExportPanel = ({ canvasRef, backgroundCanvasRef }) => {
  const { toast } = useToast();
  const { seismicData, horizons, viewSettings, fileName } = useSeismicStore();

  const handleExportImage = () => {
    const success = exportViewAsImage(canvasRef.current, backgroundCanvasRef.current);
    if (success) {
      toast({
        title: "Export Successful",
        description: "Seismic view exported as a PNG image.",
      });
    } else {
      toast({
        title: "Export Failed",
        description: "Could not export the view. Ensure data is loaded.",
        variant: "destructive",
      });
    }
  };

  const handleExportJson = () => {
    if (!seismicData) {
      toast({
        title: "Export Failed",
        description: "No seismic data to export.",
        variant: "destructive",
      });
      return;
    }
    exportInterpretationToJson(seismicData, horizons, viewSettings);
    toast({
      title: "Export Successful",
      description: "Full interpretation exported as a JSON file.",
    });
  };

  const handleExportPdf = () => {
    toast({
      title: "Coming Soon!",
      description: "🚧 PDF Report generation isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  return (
    <div className="p-4 space-y-4">
      <h3 className="font-semibold text-lg">Export</h3>
      <div className="space-y-2">
        <Button onClick={handleExportImage} className="w-full justify-start" variant="outline" disabled={!seismicData}>
          <Image className="w-4 h-4 mr-2" />
          Export View as PNG
        </Button>
        <Button onClick={handleExportJson} className="w-full justify-start" variant="outline" disabled={!seismicData}>
          <FileJson className="w-4 h-4 mr-2" />
          Export Interpretation (JSON)
        </Button>
        <Button onClick={handleExportPdf} className="w-full justify-start" variant="outline" disabled={!seismicData}>
          <FileText className="w-4 h-4 mr-2" />
          Generate PDF Report
        </Button>
      </div>
    </div>
  );
};

export default ExportPanel;