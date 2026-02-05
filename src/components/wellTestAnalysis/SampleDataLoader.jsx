import React from 'react';
import { useWellTestAnalysisContext } from '@/contexts/WellTestAnalysisContext';
import { loadSampleDataset, getSampleDatasetList } from '@/utils/wellTestAnalysis/sampleDataUtils';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlayCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const SampleDataLoader = ({ onClose }) => {
    const { dispatch, log } = useWellTestAnalysisContext();
    const datasets = getSampleDatasetList();

    const handleLoad = (datasetId) => {
        try {
            const { data, meta } = loadSampleDataset(datasetId);
            dispatch({ type: 'SET_RAW_IMPORT', payload: { data: data, columns: ['time', 'pressure', 'rate'] } });
            dispatch({ type: 'SET_COLUMN_MAPPING', payload: { time: 'time', pressure: 'pressure', rate: 'rate' } });
            dispatch({ type: 'SET_STANDARDIZED_DATA', payload: data });
            dispatch({ type: 'UPDATE_TEST_CONFIG', payload: { type: meta.type, wellName: meta.meta.well, porosity: 0.2, compressibility: 3e-6, rw: 0.35, h: 50 } });
            dispatch({ type: 'RUN_DIAGNOSTICS' });
            log(`Loaded sample dataset: ${meta.title}`, 'success');
            if (onClose) onClose();
        } catch (error) {
            console.error(error);
            log('Failed to load sample data', 'error');
        }
    };

    return (
        <ScrollArea className="h-[400px] pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {datasets.map((ds) => (
                    <Card key={ds.id} className="bg-slate-900 border-slate-800 hover:border-slate-600 transition-colors flex flex-col">
                        <CardHeader className="pb-2">
                            <Badge variant="outline" className="mb-2 w-fit border-blue-500/30 text-blue-400">{ds.type.toUpperCase()}</Badge>
                            <CardTitle className="text-white text-base">{ds.title}</CardTitle>
                            <CardDescription className="text-slate-400 text-xs">{ds.description}</CardDescription>
                        </CardHeader>
                        <CardFooter className="pt-2 mt-auto">
                            <Button className="w-full bg-slate-800 hover:bg-[#BFFF00] hover:text-black text-slate-300 transition-colors" onClick={() => handleLoad(ds.id)}>
                                <PlayCircle className="w-4 h-4 mr-2" /> Load Data
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </ScrollArea>
    );
};

export default SampleDataLoader;