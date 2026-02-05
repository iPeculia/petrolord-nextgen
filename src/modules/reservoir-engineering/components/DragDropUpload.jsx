import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileCheck, FileX, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DragDropUpload = ({ onFileUpload, dataType, isLoading, maxFileSize = 10 * 1024 * 1024 }) => {
  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    if (fileRejections.length > 0) {
      // Handle rejections (e.g., show toast)
      console.error("File rejected:", fileRejections[0].errors[0].message);
      return;
    }
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    maxSize: maxFileSize,
    multiple: false,
  });

  const baseStyle = "p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors duration-200 ease-in-out";
  const activeStyle = "border-primary bg-primary/10";
  const acceptStyle = "border-green-500 bg-green-500/10";
  const rejectStyle = "border-destructive bg-destructive/10";

  const style = `${baseStyle} ${isDragActive ? activeStyle : ''} ${isDragAccept ? acceptStyle : ''} ${isDragReject ? rejectStyle : ''}`;

  return (
    <div className="space-y-4">
      <div {...getRootProps({ className: style })}>
        <input {...getInputProps()} />
        {isLoading ? (
          <div className="flex flex-col items-center justify-center text-gray-400">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <p className="mt-4">Parsing {dataType} data...</p>
          </div>
        ) : isDragAccept ? (
          <div className="flex flex-col items-center justify-center text-green-500">
            <FileCheck className="w-12 h-12" />
            <p className="mt-4">Drop the file to upload</p>
          </div>
        ) : isDragReject ? (
          <div className="flex flex-col items-center justify-center text-destructive">
            <FileX className="w-12 h-12" />
            <p className="mt-4">Invalid file type. Please upload a CSV.</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400">
            <UploadCloud className="w-12 h-12" />
            <p className="mt-4">Drag & drop {dataType} CSV file here</p>
            <p className="text-sm text-gray-500">or click to select a file</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DragDropUpload;