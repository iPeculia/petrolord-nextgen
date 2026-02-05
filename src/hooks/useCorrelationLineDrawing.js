import { useCorrelationPanelStore } from '@/store/correlationPanelStore';
import { useMutationCreateCorrelationLine } from './useWellLogCorrelation';
import { useToast } from '@/components/ui/use-toast';

export function useCorrelationLineDrawing(projectData, panelId) {
  const { toast } = useToast();
  const { 
      isDrawing, 
      drawingLine,
      startDrawingLine,
      finishDrawingLine,
      setInteractionMode 
  } = useCorrelationPanelStore(state => ({
      isDrawing: state.interactionMode === 'draw-line',
      drawingLine: state.drawingLine,
      startDrawingLine: state.startDrawingLine,
      finishDrawingLine: state.finishDrawingLine,
      setInteractionMode: state.setInteractionMode,
  }));
  
  const createLineMutation = useMutationCreateCorrelationLine();

  const findTopData = (topId) => {
    if (!projectData) return null;
    for (const well of projectData.wells) {
      for (const wellbore of well.wellbores) {
        const top = wellbore.well_tops.find(t => t.id === topId);
        if (top) return top;
      }
    }
    return null;
  };

  const handleTopClick = (top) => {
    if (!isDrawing) {
        return;
    }

    if (!drawingLine) {
        startDrawingLine({ from: { topId: top.id, wellboreId: top.wellbore_id } });
        toast({ title: "Line drawing started", description: "Select a top in another well to complete the line." });
    } else {
        const fromTopId = drawingLine.from.topId;
        const fromWellboreId = drawingLine.from.wellboreId;
        const toTopId = top.id;
        const toWellboreId = top.wellbore_id;

        if (fromWellboreId === toWellboreId) {
            toast({ variant: "destructive", title: "Invalid Operation", description: "Cannot draw a correlation line within the same well." });
            return;
        }

        createLineMutation.mutate(
            { panel_id: panelId, from_top_id: fromTopId, to_top_id: toTopId, style: 'solid', color: '#FFFFFF' },
            {
                onSuccess: () => {
                    toast({ title: "Success", description: "Correlation line created." });
                    finishDrawingLine();
                    setInteractionMode('pan');
                },
                onError: (error) => {
                    toast({ variant: "destructive", title: "Error", description: `Could not create line: ${error.message}` });
                    finishDrawingLine();
                    setInteractionMode('pan');
                },
            }
        );
    }
  };

  const cancelDrawing = () => {
    if (isDrawing) {
        finishDrawingLine();
        setInteractionMode('pan');
        toast({ title: "Line drawing cancelled." });
    }
  };


  return {
    isDrawingLine: isDrawing,
    handleTopClick,
    cancelDrawing,
  };
}