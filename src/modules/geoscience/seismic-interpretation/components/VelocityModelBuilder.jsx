import React from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

const VelocityModelBuilder = () => {
  const { toast } = useToast();

  const handleNotImplemented = () => {
    toast({
      title: "Coming Soon!",
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  return (
    <div className="p-4 space-y-4">
      <h3 className="font-semibold text-lg">Velocity Model</h3>
      <div className="text-sm text-muted-foreground text-center p-4 border border-dashed rounded-md">
        <p>Velocity model builder will be available here.</p>
      </div>
      <Button onClick={handleNotImplemented} className="w-full" variant="outline">
        Build Velocity Model
      </Button>
    </div>
  );
};

export default VelocityModelBuilder;