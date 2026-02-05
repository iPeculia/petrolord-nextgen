import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const LoadingIndicator = ({ message = "Loading...", fullScreen = false, className }) => {
    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm text-slate-200">
                <Loader2 className="w-10 h-10 animate-spin text-[#BFFF00] mb-4" />
                <div className="font-medium text-lg">{message}</div>
            </div>
        );
    }

    return (
        <div className={cn("flex flex-col items-center justify-center p-6 text-slate-400", className)}>
            <Loader2 className="w-6 h-6 animate-spin text-[#BFFF00] mb-2" />
            <div className="text-xs font-medium">{message}</div>
        </div>
    );
};

export default LoadingIndicator;