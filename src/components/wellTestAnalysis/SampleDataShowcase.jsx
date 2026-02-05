import React from 'react';
import SampleDataLoader from './SampleDataLoader';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Database } from 'lucide-react';

const SampleDataShowcase = () => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="border-slate-700 bg-slate-900/50 text-slate-300 hover:text-white hover:bg-slate-800">
                    <Database className="w-4 h-4 mr-2 text-blue-400" />
                    Load Sample Data
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] bg-slate-950 border-slate-800 text-white flex flex-col">
                <DialogHeader>
                    <DialogTitle>Sample Data Library</DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-hidden mt-4">
                    <SampleDataLoader />
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default SampleDataShowcase;