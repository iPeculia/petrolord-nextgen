import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useVisualization3DStore = create(
  persist(
    (set, get) => ({
      settings: {
        showGrid: true,
        showAxes: true,
        showTrajectory: true,
        showMarkers: true,
        showLayers: true,
        showSeismic: false,
        verticalExaggeration: 5,
        backgroundColor: '#0F172A',
      },
      
      activeObjects: [], // IDs of objects to render
      selectedObject: null,

      // Camera State (optional, for restoring views)
      cameraPosition: [100, 100, 100],
      cameraTarget: [0, 0, 0],

      // Actions
      toggleSetting: (setting) => set((state) => ({
        settings: { ...state.settings, [setting]: !state.settings[setting] }
      })),
      
      updateSetting: (setting, value) => set((state) => ({
        settings: { ...state.settings, [setting]: value }
      })),

      selectObject: (object) => set({ selectedObject: object }),
      
      resetView: () => set({ 
        cameraPosition: [200, 200, 200], 
        cameraTarget: [0, 0, 0],
        settings: { ...get().settings, verticalExaggeration: 5 } 
      }),
    }),
    {
      name: 'petrolord-3d-viz-store',
    }
  )
);