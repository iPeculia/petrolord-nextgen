import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useMediaStore = create(
  persist(
    (set) => ({
      snapshots: [],
      recordings: [],
      
      addSnapshot: (snapshot) => set((state) => ({
        snapshots: [
          {
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            ...snapshot,
          },
          ...state.snapshots,
        ],
      })),

      deleteSnapshot: (id) => set((state) => ({
        snapshots: state.snapshots.filter((s) => s.id !== id),
      })),
      
      addRecording: (recording) => set((state) => ({
        recordings: [
             {
                id: crypto.randomUUID(),
                createdAt: new Date().toISOString(),
                ...recording
             },
             ...state.recordings
        ]
      })),

      deleteRecording: (id) => set((state) => ({
        recordings: state.recordings.filter((r) => r.id !== id),
      })),
      
      clearAll: () => set({ snapshots: [], recordings: [] }),
    }),
    {
      name: 'petrolord-media-storage', // LocalStorage key
    }
  )
);