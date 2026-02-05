import React from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WellCorrelationLoading = ({ message = "Initializing Project...", error, onRetry }) => {
    return (
        <div className="flex flex-col items-center justify-center h-full w-full bg-slate-950 text-slate-300 z-50 fixed inset-0">
            {error ? (
                <div className="text-center max-w-md p-6 bg-slate-900 rounded-lg border border-red-900/50">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">Initialization Failed</h3>
                    <p className="text-slate-400 mb-6">{error}</p>
                    <Button onClick={onRetry} variant="destructive">Retry Initialization</Button>
                </div>
            ) : (
                <div className="flex flex-col items-center">
                    <Loader2 className="h-12 w-12 animate-spin mb-6 text-[#BFFF00]" />
                    <h3 className="text-xl font-medium text-white mb-2">{message}</h3>
                    <p className="text-sm text-slate-500">This may take a few moments...</p>
                </div>
            )}
        </div>
    );
};

export default WellCorrelationLoading;