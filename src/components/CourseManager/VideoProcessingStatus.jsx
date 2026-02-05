import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Check, Loader2, AlertTriangle, RefreshCw, Film } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const steps = [
  { id: 'queued', label: 'Queued' },
  { id: 'processing', label: 'Transcoding' },
  { id: 'thumbnails', label: 'Generating Thumbnails' },
  { id: 'completed', label: 'Ready to Stream' }
];

const VideoProcessingStatus = ({ videoId, onProcessingComplete }) => {
  const [status, setStatus] = useState('queued');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!videoId) return;

    // Initial fetch
    const fetchStatus = async () => {
      const { data, error } = await supabase
        .from('lesson_videos')
        .select('processing_status, processing_error')
        .eq('id', videoId)
        .single();
      
      if (data) {
        setStatus(data.processing_status || 'queued');
        if (data.processing_error) setError(data.processing_error);
      }
    };

    fetchStatus();

    // Subscribe to changes
    const channel = supabase
      .channel(`video-status-${videoId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'lesson_videos', filter: `id=eq.${videoId}` },
        (payload) => {
          const newStatus = payload.new.processing_status;
          setStatus(newStatus);
          if (payload.new.processing_error) setError(payload.new.processing_error);
          
          if (newStatus === 'completed' && onProcessingComplete) {
            onProcessingComplete();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [videoId, onProcessingComplete]);

  // Mock simulator for demo purposes since we don't have a real backend worker
  const simulateProcessing = async () => {
     if (status === 'completed') return;
     
     const statuses = ['processing', 'thumbnails', 'completed'];
     
     for (const s of statuses) {
         await new Promise(r => setTimeout(r, 2000)); // wait 2s
         await supabase.from('lesson_videos').update({ processing_status: s }).eq('id', videoId);
         setStatus(s);
     }
  };

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 flex flex-col items-center text-center">
         <div className="bg-red-500/20 p-3 rounded-full mb-3">
            <AlertTriangle className="w-8 h-8 text-red-500" />
         </div>
         <h3 className="text-white font-semibold mb-1">Processing Failed</h3>
         <p className="text-red-400 text-sm mb-4">{error}</p>
         <Button variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry Processing
         </Button>
      </div>
    );
  }

  const currentStepIndex = steps.findIndex(s => s.id === status);
  const isComplete = status === 'completed';

  return (
    <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white font-medium flex items-center gap-2">
          <Film className="w-4 h-4 text-slate-400" />
          Processing Status
        </h3>
        {/* Simulator Button for Demo */}
        {status === 'queued' && (
            <Button 
                onClick={simulateProcessing} 
                variant="ghost" 
                size="sm" 
                className="text-xs text-slate-500 hover:text-[#BFFF00]"
            >
                Simulate Worker
            </Button>
        )}
      </div>

      <div className="relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-800 rounded-full -z-10" />
        <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-[#BFFF00] to-emerald-500 rounded-full -z-10 transition-all duration-500"
            style={{ width: `${Math.max(0, Math.min(100, (currentStepIndex / (steps.length - 1)) * 100))}%` }}
        />

        <div className="flex justify-between">
          {steps.map((step, idx) => {
            const isCompleted = idx <= currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            const isPending = idx > currentStepIndex;

            return (
              <div key={step.id} className="flex flex-col items-center group">
                <div 
                    className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10",
                        isCompleted ? "bg-[#BFFF00] border-[#BFFF00] text-black" : "bg-slate-900 border-slate-700 text-slate-500",
                        isCurrent && !isComplete && "animate-pulse border-[#BFFF00] text-[#BFFF00] bg-slate-900"
                    )}
                >
                    {isCurrent && !isComplete ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : isCompleted ? (
                        <Check className="w-5 h-5" />
                    ) : (
                        <span className="text-xs font-semibold">{idx + 1}</span>
                    )}
                </div>
                <span className={cn(
                    "mt-3 text-xs font-medium transition-colors duration-300",
                    isCurrent || isCompleted ? "text-white" : "text-slate-500"
                )}>
                    {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VideoProcessingStatus;