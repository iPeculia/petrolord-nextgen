import { create } from 'zustand';
import { useGlobalDataStore } from './globalDataStore';

export const useCorrelationPanelStore = create((set, get) => ({
  // Core Panel State
  interactionMode: 'pan', // 'pan', 'draw', 'edit'
  zoomLevel: 1,
  panX: 0,
  panY: 0,
  depthMin: 0,
  depthMax: 3000,

  // Well & Curve State
  selectedWellId: null,
  wellOrder: [], // [{ well_id, well_name, order_index, well_data }]
  wellCurves: {}, // { [wellId]: [curveConfig1, curveConfig2] }
  correlationLines: [],

  // Cursor State
  cursorX: null,
  cursorY: null,
  cursorDepth: null,

  // Line Drawing State
  isDrawing: false,
  drawingLine: null, // { from: { wellId, topId, depth, x, y }, to: { x, y } }

  // Actions
  setInteractionMode: (mode) => set({ interactionMode: mode }),
  setZoomLevel: (level) => set((state) => ({ zoomLevel: Math.max(1, level) })),
  setPan: (x, y) => set({ panX: x, panY: y }),
  setDepthRange: (min, max) => set({ depthMin: min, depthMax: max }),

  selectWell: (wellId) => set({ selectedWellId: wellId }),
  setWellOrder: (order) => set({ wellOrder: order }),

  setCursor: (x, y, depth) => set({ cursorX: x, cursorY: y, cursorDepth: depth }),
  clearCursor: () => set({ cursorX: null, cursorY: null, cursorDepth: null }),
  
  startDrawingLine: (from) => set({ isDrawing: true, drawingLine: { from, to: from } }),
  updateDrawingLine: (to) => set(state => ({ drawingLine: { ...state.drawingLine, to } })),
  finishDrawingLine: () => set({ isDrawing: false, drawingLine: null }),

  setWellCurves: (wellId, curves) => set(state => ({
    wellCurves: {
      ...state.wellCurves,
      [wellId]: curves
    }
  })),

  // New action to load logs, delegating to global store
  loadLogsForWell: (wellId) => {
    useGlobalDataStore.getState().loadLogsForWell(wellId);
  },
}));