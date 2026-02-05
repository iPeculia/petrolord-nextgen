import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Upload, FileText, X, AlertCircle, Download, Loader2 } from 'lucide-react';
import { CSVValidator } from '@/services/CSVValidator';
import { CSVTemplateService } from '@/lib/csvTemplate';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';

const CSVUploadForm = ({ onValidationComplete }) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setLoading(true);
    try {
      const result = await CSVValidator.validateFile(file);
      onValidationComplete(result, file.name);
      toast({
        title: "File Processed",
        description: `Analyzed ${result.total} rows. found ${result.valid.length} valid entries.`,
        className: "bg-emerald-600 text-white border-none"
      });
    } catch (error) {
      toast({
        title: "Validation Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [onValidationComplete, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.csv']
    },
    maxFiles: 1,
    maxSize: 5242880 // 5MB
  });

  return (
    <div className="space-y-6">
      <div 
        {...getRootProps()} 
        className={`
          border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300
          ${isDragActive 
            ? 'border-[#BFFF00] bg-[#BFFF00]/5 scale-[1.02]' 
            : 'border-slate-700 bg-[#1E293B]/50 hover:border-slate-500 hover:bg-[#1E293B]'}
        `}
      >
        <input {...getInputProps()} />
        
        <div className={`p-4 rounded-full mb-4 ${isDragActive ? 'bg-[#BFFF00]/20' : 'bg-slate-800'}`}>
          {loading ? (
             <Loader2 className="w-10 h-10 text-[#BFFF00] animate-spin" />
          ) : (
             <Upload className={`w-10 h-10 ${isDragActive ? 'text-[#BFFF00]' : 'text-slate-400'}`} />
          )}
        </div>

        <h3 className="text-xl font-semibold text-white mb-2">
          {isDragActive ? 'Drop CSV file here' : 'Drag & Drop CSV file'}
        </h3>
        <p className="text-slate-400 mb-6 max-w-sm">
          Or click to browse from your computer. Max file size 5MB.
        </p>

        <div className="flex gap-4 text-xs text-slate-500 font-mono">
          <span className="flex items-center gap-1 bg-slate-800/50 px-2 py-1 rounded">
            <FileText className="w-3 h-3" /> .CSV only
          </span>
          <span className="flex items-center gap-1 bg-slate-800/50 px-2 py-1 rounded">
            <AlertCircle className="w-3 h-3" /> UTF-8 Encoded
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center bg-[#1E293B] p-4 rounded-lg border border-slate-800">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
                <h4 className="text-sm font-medium text-white">Need the format?</h4>
                <p className="text-xs text-slate-400">Download the pre-formatted CSV template.</p>
            </div>
        </div>
        <Button 
            variant="outline" 
            onClick={() => CSVTemplateService.downloadTemplate()}
            className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800"
        >
            <Download className="w-4 h-4 mr-2" /> Download Template
        </Button>
      </div>
    </div>
  );
};

export default CSVUploadForm;