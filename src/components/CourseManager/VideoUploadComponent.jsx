import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { supabase } from '@/lib/supabaseClient';
import { Upload, X, FileVideo, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

const VideoUploadComponent = ({ lessonId, onUploadComplete }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles?.length > 0) {
      setError("Please upload a valid video file (MP4, MOV, WebM) under 2GB.");
      return;
    }
    
    if (acceptedFiles?.length > 0) {
      setFile(acceptedFiles[0]);
      setError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/mp4': ['.mp4'],
      'video/quicktime': ['.mov'],
      'video/webm': ['.webm']
    },
    maxSize: 2147483648, // 2GB
    multiple: false
  });

  const handleUpload = async () => {
    if (!file || !lessonId) return;

    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${lessonId}/${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      // Simulate a realistic upload progress since Supabase JS client 
      // doesn't expose granular progress for single small files easily in this version
      // In a real app with large files, we'd use TUS or XMLHttpRequest to track upload
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + 5;
        });
      }, 200);

      const { data, error: uploadError } = await supabase.storage
        .from('course-content') // Assuming this bucket exists
        .upload(filePath, file);

      clearInterval(interval);

      if (uploadError) throw uploadError;

      setProgress(100);

      // Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('course-content')
        .getPublicUrl(filePath);

      // Create or Update lesson_videos record
      const videoData = {
        lesson_id: lessonId,
        title: file.name,
        video_url: publicUrl,
        storage_path: filePath,
        file_size_bytes: file.size,
        video_format: fileExt,
        is_processed: false,
        processing_status: 'queued'
      };

      const { error: dbError } = await supabase
        .from('lesson_videos')
        .insert([videoData]);

      if (dbError) throw dbError;

      toast({
        title: "Upload Successful",
        description: "Video has been queued for processing.",
        variant: "default",
        className: "bg-emerald-500 border-none text-white"
      });

      if (onUploadComplete) onUploadComplete();
      setFile(null);

    } catch (err) {
      console.error(err);
      setError(err.message || "Upload failed. Please try again.");
      setProgress(0);
      toast({
        title: "Upload Failed",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setProgress(0);
    setError(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <AnimatePresence>
        {!file && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div
              {...getRootProps()}
              className={cn(
                "border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 backdrop-blur-sm",
                isDragActive 
                  ? "border-[#BFFF00] bg-[#BFFF00]/5 scale-[1.02]" 
                  : "border-slate-700 bg-slate-900/50 hover:bg-slate-800/50 hover:border-slate-500"
              )}
            >
              <input {...getInputProps()} />
              <div className="bg-slate-800/80 p-4 rounded-full mb-4 shadow-lg shadow-black/20">
                <Upload className={cn("w-8 h-8", isDragActive ? "text-[#BFFF00]" : "text-slate-400")} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Drag & Drop Video Here
              </h3>
              <p className="text-slate-400 text-sm max-w-sm">
                Supports MP4, MOV, WebM. Max file size 2GB. 
                <br />
                We recommend 1080p resolution for best results.
              </p>
            </div>
          </motion.div>
        )}

        {file && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900/80 border border-slate-700 rounded-xl p-6 shadow-xl relative overflow-hidden"
          >
            {/* Background Gradient */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-50" />

            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="bg-blue-500/20 p-3 rounded-lg text-blue-400">
                    <FileVideo className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-white font-medium truncate max-w-[250px]">{file.name}</h4>
                  <p className="text-slate-400 text-xs">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              
              {!uploading && (
                <button 
                  onClick={removeFile}
                  className="text-slate-500 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 bg-red-500/10 p-3 rounded-md mb-4 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            {uploading ? (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-400 uppercase tracking-wider font-semibold">
                  <span>Uploading...</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2 bg-slate-800" indicatorClassName="bg-gradient-to-r from-[#BFFF00] to-emerald-500" />
              </div>
            ) : (
              <div className="flex gap-3 justify-end mt-4">
                 <Button 
                   variant="outline" 
                   onClick={removeFile}
                   className="border-slate-700 text-slate-300 hover:bg-slate-800"
                 >
                   Cancel
                 </Button>
                 <Button 
                   onClick={handleUpload}
                   className="bg-[#BFFF00] hover:bg-[#a3d900] text-black font-semibold shadow-[0_0_15px_rgba(191,255,0,0.3)] transition-all"
                 >
                   <Upload className="w-4 h-4 mr-2" />
                   Start Upload
                 </Button>
              </div>
            )}
            
            {progress === 100 && !error && (
               <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center z-10 animate-in fade-in duration-300">
                  <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4 animate-bounce" />
                  <h3 className="text-xl font-bold text-white">Upload Complete!</h3>
                  <p className="text-slate-400">Video is now processing.</p>
               </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VideoUploadComponent;