import React, { useState } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, Database, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useWellTestAnalysisContext } from '@/contexts/WellTestAnalysisContext';
import { parseCSV } from '@/utils/wellTestAnalysis/csvParser';
import { 
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { SAMPLE_DATASETS } from '@/data/wellTestAnalysis/sampleDataDescriptions';
import { loadSampleDataset } from '@/utils/wellTestAnalysis/sampleDataUtils';

const DataImport = () => {
  const { dispatch, log } = useWellTestAnalysisContext();
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);

  const handleFile = async (file) => {
    try {
        setError(null);
        if (!file) return;
        
        const text = await file.text();
        const { data, columns } = parseCSV(text);
        
        dispatch({ type: 'SET_RAW_IMPORT', payload: { data, columns } });
        log(`Successfully loaded ${file.name} (${data.length} rows)`, 'success');
    } catch (err) {
        setError("Failed to parse file. Please ensure it is a valid CSV/TXT file.");
        log('File import failed', 'error');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleSampleLoad = (datasetId) => {
      try {
          log(`Loading sample dataset...`, 'info');
          const { data, meta } = loadSampleDataset(datasetId);
          
          if (!data || data.length === 0) throw new Error("Empty dataset");

          dispatch({ type: 'SET_RAW_IMPORT', payload: { data: data, columns: ['time', 'pressure', 'rate'] } });
          dispatch({ type: 'SET_COLUMN_MAPPING', payload: { time: 'time', pressure: 'pressure', rate: 'rate' } });
          dispatch({ type: 'SET_STANDARDIZED_DATA', payload: data });
          dispatch({ 
            type: 'UPDATE_TEST_CONFIG', 
            payload: { 
                type: meta.type, 
                wellName: meta.meta.well, 
                porosity: 0.2,
                initialPressure: data[0].pressure + 50 
            } 
          });
          
          log(`Loaded sample: ${meta.title}`, 'success');
      } catch (e) {
          log("Failed to load sample data", "error");
          setError("Could not load sample dataset.");
      }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto mt-10">
      <div 
        className={`
            border-2 border-dashed rounded-xl p-10 text-center transition-all duration-200
            flex flex-col items-center justify-center gap-4
            ${dragActive ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 bg-slate-900/50 hover:border-slate-600'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="p-4 rounded-full bg-slate-800">
            <Upload className="w-8 h-8 text-blue-400" />
        </div>
        
        <div>
            <h3 className="text-lg font-semibold text-white">Upload Test Data</h3>
            <p className="text-slate-400 text-sm mt-1">
                Drag and drop your CSV, TXT, or LAS files here, or click to browse.
            </p>
            <p className="text-slate-500 text-xs mt-2">
                Supported formats: standard ASCII text files with headers.
            </p>
        </div>

        <div className="flex gap-3 mt-2">
            <Button variant="secondary" className="relative">
                Browse Files
                <input 
                    type="file" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept=".csv,.txt,.las"
                    onChange={(e) => handleFile(e.target.files[0])}
                />
            </Button>
            
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border-blue-500/30 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10">
                        <Database className="w-4 h-4 mr-2" />
                        Load Sample Data
                        <ChevronDown className="w-3 h-3 ml-2 opacity-50" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 bg-slate-900 border-slate-800 text-slate-200 max-h-80 overflow-y-auto">
                    <DropdownMenuLabel>Standard Datasets</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-slate-800" />
                    {SAMPLE_DATASETS.map((ds) => (
                        <DropdownMenuItem 
                            key={ds.id} 
                            onClick={() => handleSampleLoad(ds.id)}
                            className="cursor-pointer focus:bg-slate-800 focus:text-white"
                        >
                            <div className="flex flex-col">
                                <span className="font-medium">{ds.title}</span>
                                <span className="text-xs text-slate-500">{ds.type} • {ds.data.length} pts</span>
                            </div>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="bg-red-900/20 border-red-900">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Upload Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800 flex items-start gap-3">
            <FileText className="w-5 h-5 text-emerald-400 mt-0.5" />
            <div>
                <h4 className="text-sm font-medium text-white">Data Requirements</h4>
                <ul className="text-xs text-slate-400 mt-1 space-y-1 list-disc list-inside">
                    <li>Time column (hours)</li>
                    <li>Pressure column (psia or kpa)</li>
                    <li>Optional: Rate column</li>
                </ul>
            </div>
        </div>
        <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5" />
            <div>
                <h4 className="text-sm font-medium text-white">Auto-Detection</h4>
                <p className="text-xs text-slate-400 mt-1">
                    The system will automatically attempt to identify headers and units. You can adjust mappings in the next step.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DataImport;