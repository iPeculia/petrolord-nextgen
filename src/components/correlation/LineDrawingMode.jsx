import React from 'react';
import { Button } from '@/components/ui/button';
import { PenLine, X } from 'lucide-react';
import { useCorrelationPanelStore } from '@/store/correlationPanelStore';

const LineDrawingMode = () => {
  const { isDrawingLine, startDrawingLine, cancelDrawingLine, fromTopId } = useCorrelationPanelStore();

  const handleToggle = () => {
    if (isDrawingLine) {
      cancelDrawingLine();
    } else {
      // In the new flow, a top must be selected first to start drawing.
      // This button now primarily acts as a "Cancel" button or an indicator.
      // The drawing starts from handleTopClick in useCorrelationLineDrawing.
      // If no top is selected, we can prompt the user.
      if (!fromTopId) {
          // This simply toggles the mode on. A top click is required to select the start point.
           startDrawingLine(null); 
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={isDrawingLine ? "secondary" : "ghost"}
        size="sm"
        onClick={handleToggle}
        className="flex items-center gap-2"
        title={isDrawingLine ? "Cancel drawing (Esc)" : "Enable line drawing mode (L)"}
      >
        {isDrawingLine ? <X className="h-4 w-4" /> : <PenLine className="h-4 w-4" />}
        {isDrawingLine ? (fromTopId ? 'Drawing...' : 'Select Start') : 'Draw Line'}
      </Button>
    </div>
  );
};

export default LineDrawingMode;