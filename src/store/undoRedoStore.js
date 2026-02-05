import { useCorrelationPanelStore } from './correlationPanelStore';

export const useUndoRedo = () => {
    const { undo, redo, canUndo, canRedo } = useCorrelationPanelStore(state => ({
        undo: state.undo,
        redo: state.redo,
        canUndo: state.canUndo(),
        canRedo: state.canRedo(),
    }));
    return { undo, redo, canUndo, canRedo };
};