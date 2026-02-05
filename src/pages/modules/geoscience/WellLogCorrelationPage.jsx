import React from 'react';
import { Helmet } from 'react-helmet';
import CorrelationWorkspace from '@/components/correlation/CorrelationWorkspace.jsx';
import { useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const WellLogCorrelationPage = () => {
    const [searchParams] = useSearchParams();
    // The demo project ID is hardcoded for now. This could come from user preferences or another source.
    const projectId = searchParams.get('project') || '00000000-0000-0000-0000-000000000001';

    if (!projectId) {
        return (
            <div className="h-full w-full flex flex-col items-center justify-center bg-background text-foreground">
                <Loader2 className="w-8 h-8 animate-spin mb-4" />
                <h1 className="text-xl font-semibold">Loading Correlation Module</h1>
                <p className="text-slate-400">Initializing workspace...</p>
            </div>
        );
    }
    
    return (
        <>
            <Helmet>
                <title>Well Log Correlation</title>
                <meta name="description" content="Correlate well logs to understand subsurface geology." />
            </Helmet>
            <div className="flex flex-col h-full bg-background text-foreground">
                <CorrelationWorkspace projectId={projectId} />
            </div>
        </>
    );
};

export default WellLogCorrelationPage;