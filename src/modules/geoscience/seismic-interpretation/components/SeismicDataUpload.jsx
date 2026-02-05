import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useSeismicStore } from '@/modules/geoscience/seismic-interpretation/store/seismicStore';
import { parseSeismicCSV, generateSampleSeismicData } from '@/modules/geoscience/seismic-interpretation/utils/dataParser';
import { parseSegy } from '@/modules/geoscience/seismic-interpretation/utils/segyParser';
import { parseLAS } from '@/modules/geoscience/seismic-interpretation/utils/lasParser';
import { Button } from '@/components/ui/button';
import { UploadCloud, FileText, Loader2, FileWarning } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';

const SeismicDataUpload = () => {
  const { setSegyData, setLoading, setError, fileName, loading, resetState: resetStore, setWellLogData } = useSeismicStore();
  const [progress, setProgress] = useState({ percent: 0, message: '' });
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    
    setLoading(true);
    setProgress({ percent: 0, message: 'Starting...' });

    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        if (['sgy', 'segy'].includes(fileExtension)) {
          const arrayBuffer = e.target.result;
          const data = await parseSegy(arrayBuffer, setProgress);
          setSegyData(data, file.name);
          toast({ title: "Success", description: `Loaded SEG-Y file: ${file.name}` });
        } else if (fileExtension === 'csv') {
          const text = e.target.result;
          const data = await parseSeismicCSV(text);
          setSegyData(data, file.name); // Using setSegyData for simplicity, though it's CSV
          toast({ title: "Success", description: `Loaded CSV file: ${file.name}` });
        } else if (fileExtension === 'las') {
            const text = e.target.result;
            const wellData = await parseLAS(text);
            setWellLogData(wellData);
            toast({ title: "Success", description: `Loaded LAS file: ${file.name}` });
            setLoading(false); // LAS load is separate from main seismic data
        } else {
            throw new Error(`Unsupported file type: .${fileExtension}`);
        }
      } catch (error) {
        setError(error.message);
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } finally {
        setProgress({ percent: 0, message: '' });
      }
    };
    
    reader.onerror = () => {
        setError('Failed to read file.');
        toast({ title: "Error", description: 'Failed to read file.', variant: "destructive" });
        setLoading(false);
    };

    if (['sgy', 'segy'].includes(fileExtension)) {
        reader.readAsArrayBuffer(file);
    } else if (['csv', 'las'].includes(fileExtension)) {
        reader.readAsText(file);
    } else {
        setError(`Unsupported file type: .${fileExtension}`);
        toast({ title: "Error", description: `Unsupported file type: .${fileExtension}`, variant: "destructive" });
        setLoading(false);
    }

  }, [setSegyData, setLoading, setError, toast, setWellLogData]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 
      'application/octet-stream': ['.sgy', '.segy'],
      'text/csv': ['.csv'],
      'text/plain': ['.las']
    },
    multiple: false,
  });

  const handleLoadSampleData = () => {
    setLoading(true);
    try {
      const data = generateSampleSeismicData();
      setSegyData(data, 'sample_seismic_data.csv');
      toast({ title: "Success", description: "Loaded sample seismic data." });
    } catch (error) {
      setError(error.message);
      toast({ title: "Error", description: "Failed to generate sample data.", variant: "destructive" });
    }
  };

  const handleReset = () => {
      resetStore();
      toast({ title: "Data Cleared", description: "All seismic and well data has been reset."});
  };

  if (loading) {
      return (
          <div className="p-4 space-y-4">
              <h3 className="font-semibold text-lg">Loading Data</h3>
              <div className="flex items-center gap-2 p-3">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  <span className="text-sm truncate">{progress.message}</span>
              </div>
              <Progress value={progress.percent} className="w-full"/>
          </div>
      );
  }

  if (fileName) {
    return (
      <div className="p-4 space-y-4">
        <h3 className="font-semibold text-lg">Current Dataset</h3>
        <div className="flex items-center gap-2 p-3 bg-slate-800 rounded-md">
          <FileText className="w-5 h-5 text-primary" />
          <span className="text-sm truncate">{fileName}</span>
        </div>
        <Button onClick={handleReset} className="w-full" variant="destructive" size="sm">
            <FileWarning className="w-4 h-4 mr-2" />
            Clear Data
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <h3 className="font-semibold text-lg">Load Data</h3>
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? 'dropzone-active' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2 text-center">
            <UploadCloud className="w-8 h-8 text-muted-foreground" />
            <p className="font-semibold">Drop SEG-Y, CSV, or LAS file</p>
            <p className="text-xs text-muted-foreground">or click to select</p>
        </div>
      </div>
      <div className="relative flex items-center">
        <div className="flex-grow border-t border-slate-700"></div>
        <span className="flex-shrink mx-4 text-muted-foreground text-sm">OR</span>
        <div className="flex-grow border-t border-slate-700"></div>
      </div>
      <Button onClick={handleLoadSampleData} className="w-full" variant="outline">
        Load Sample CSV Data
      </Button>
    </div>
  );
};

export default SeismicDataUpload;