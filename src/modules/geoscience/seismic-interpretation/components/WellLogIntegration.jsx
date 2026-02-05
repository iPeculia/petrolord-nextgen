import React from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { useSeismicStore } from '../store/seismicStore';

const WellLogIntegration = () => {
  const { toast } = useToast();
  const { wellLogData } = useSeismicStore();

  const handleNotImplemented = () => {
    toast({
      title: "Coming Soon!",
      description: "🚧 Well log visualization and correlation isn't implemented yet. You can upload LAS files via the Data panel. 🚀",
    });
  };

  return (
    <div className="p-4 space-y-4">
      <h3 className="font-semibold text-lg">Well Log Integration</h3>
      {wellLogData ? (
        <div className='text-xs space-y-2'>
            <p className='font-semibold'>Loaded Well: <span className='font-normal'>{wellLogData.wellInfo.WELL || 'Unknown'}</span></p>
            <p className='font-semibold'>Curves Found: <span className='font-normal'>{wellLogData.curveInfo.map(c => c.mnemonic).join(', ')}</span></p>
            <div className="text-sm text-muted-foreground text-center p-4 border border-dashed rounded-md mt-4">
                <p>Well log loaded successfully.</p>
                <p>Visualization is not yet implemented.</p>
            </div>
        </div>
      ) : (
        <div className="text-sm text-muted-foreground text-center p-4 border border-dashed rounded-md">
            <p>Upload a LAS file from the 'Data' panel to see well log information here.</p>
        </div>
      )}

      <Button onClick={handleNotImplemented} className="w-full" variant="outline">
        Correlate with Seismic
      </Button>
    </div>
  );
};

export default WellLogIntegration;