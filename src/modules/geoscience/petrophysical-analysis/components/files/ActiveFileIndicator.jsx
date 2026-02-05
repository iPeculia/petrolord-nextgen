import React from 'react';
import { useGlobalDataStore } from '@/store/globalDataStore.js';
import { Card } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

const ActiveFileIndicator = ({ wellId }) => {
    const { files } = useGlobalDataStore();
    const wellFiles = files[wellId] || [];
    
    // Assuming most recent is "active" contextually for now
    const latestFile = wellFiles.length > 0 ? wellFiles[0] : null;

    if (!latestFile) return null;

    return (
        <Card className="bg-emerald-950/20 border-emerald-900/50 p-4 mt-2">
            <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5" />
                <div>
                    <h4 className="text-sm font-medium text-emerald-100">Latest Import Active</h4>
                    <p className="text-xs text-emerald-200/70 mt-1">
                        Data from <span className="font-mono font-bold">{latestFile.filename}</span> was successfully imported and is available for analysis.
                    </p>
                </div>
            </div>
        </Card>
    );
};

export default ActiveFileIndicator;