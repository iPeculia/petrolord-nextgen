import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const usePorosityStore = create(
  persist(
    (set, get) => ({
      models: [
        { 
            id: 'pm1', 
            name: 'Sandstone Density', 
            type: 'density', 
            wellId: 'w1', 
            curve: 'RHOB', 
            params: { rhoMatrix: 2.65, rhoFluid: 1.0 },
            created: '2023-10-15',
            metrics: { r2: 0.85, rmse: 0.04 } 
        },
        { 
            id: 'pm2', 
            name: 'Carbonate Sonic', 
            type: 'sonic', 
            wellId: 'w1', 
            curve: 'DT', 
            params: { dtMatrix: 47.6, dtFluid: 189, compaction: 1.0 },
            created: '2023-11-02',
            metrics: { r2: 0.78, rmse: 0.06 } 
        }
      ],
      activeAnalysis: null,

      addModel: (model) => set(state => ({ 
          models: [{ 
              ...model, 
              id: crypto.randomUUID(), 
              created: new Date().toISOString().split('T')[0] 
          }, ...state.models] 
      })),

      updateModel: (id, updates) => set(state => ({
          models: state.models.map(m => m.id === id ? { ...m, ...updates } : m)
      })),

      deleteModel: (id) => set(state => ({
          models: state.models.filter(m => m.id !== id)
      })),

      duplicateModel: (id) => {
          const model = get().models.find(m => m.id === id);
          if (model) {
              get().addModel({ ...model, name: `${model.name} (Copy)` });
          }
      },

      setActiveAnalysis: (analysis) => set({ activeAnalysis: analysis })
    }),
    { name: 'petrolord-porosity-storage' }
  )
);