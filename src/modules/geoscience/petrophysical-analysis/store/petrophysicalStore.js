import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { produce } from 'immer';
import { saveAnalysis } from '@/api/globalDataApi.js';
import { useGlobalDataStore } from '@/store/globalDataStore.js';

export const usePetrophysicalStore = create(
  persist(
    (set, get) => ({
      activeAnalysisId: null,
      localChanges: {}, 
      unsavedChanges: false,
      
      // Visualization State
      visualSettings: {
          tracks: [], // Configuration for tracks
          zoomLevel: 1,
          panOffset: 0,
          showCalculated: true,
          showOriginal: true,
      },

      // Actions
      setActiveAnalysis: (analysisId) => {
        const globalAnalyses = useGlobalDataStore.getState().analyses;
        if (get().activeAnalysisId === analysisId) return;

        const analysisData = globalAnalyses[analysisId];
        
        let initialState = {
          parameters: {
            matrixDensity: 2.65,
            fluidDensity: 1.0,
            grClean: 20,
            grClay: 120,
            archieA: 1,
            archieM: 2,
            archieN: 2,
            rw: 0.1,
            depthTop: 0,
            depthBottom: 0, // 0 means auto/max
          },
          calculations: {},
          logInputs: {},
        };

        // If existing analysis from DB, map from DB schema (data/results columns) to store schema
        if (analysisData) {
            const data = analysisData.data || {};
            const results = analysisData.results || {};
            
            initialState = {
                ...initialState,
                parameters: { ...initialState.parameters, ...(data.parameters || {}) },
                logInputs: { ...initialState.logInputs, ...(data.logInputs || {}) },
                calculations: { ...initialState.calculations, ...(results.calculations || {}) },
            };
        }
        
        set({
          activeAnalysisId: analysisId,
          localChanges: initialState,
          unsavedChanges: false,
        });
      },

      updateLocalChanges: (updates) => {
        set(produce((draft) => {
            Object.keys(updates).forEach(key => {
                if (typeof updates[key] === 'object' && updates[key] !== null && !Array.isArray(updates[key])) {
                    draft.localChanges[key] = { ...draft.localChanges[key], ...updates[key] };
                } else {
                    draft.localChanges[key] = updates[key];
                }
            });
            draft.unsavedChanges = true;
        }));
      },
      
      setVisualSettings: (settings) => {
          set(produce((draft) => {
              draft.visualSettings = { ...draft.visualSettings, ...settings };
          }));
      },

      saveActiveAnalysis: async () => {
        const { activeAnalysisId, localChanges } = get();
        const { activeWell, addOrUpdateAnalysis, removeAnalysis } = useGlobalDataStore.getState();

        if (!activeAnalysisId || !activeWell) {
          throw new Error("No active analysis or well selected.");
        }
        
        const isTempId = activeAnalysisId.startsWith('petro_');
        
        // FIX: Map store schema back to DB schema strictly
        // DB has columns: data (jsonb), results (jsonb)
        const payload = {
          well_id: activeWell,
          module_id: 'petrophysical-analysis',
          analysis_type: 'basic_petrophysics',
          name: `Petrophysical Analysis for ${useGlobalDataStore.getState().wells[activeWell]?.name}`,
          data: {
              parameters: localChanges.parameters,
              logInputs: localChanges.logInputs
          },
          results: {
              calculations: localChanges.calculations
          }
        };

        if (!isTempId) {
            payload.id = activeAnalysisId;
        }

        try {
          const savedAnalysis = await saveAnalysis(payload);
          
          addOrUpdateAnalysis(savedAnalysis);
          
          if (isTempId) {
            removeAnalysis(activeAnalysisId); 
            set({ activeAnalysisId: savedAnalysis.id }); 
          }
          set({ unsavedChanges: false });
          return savedAnalysis;
        } catch(e) {
          console.error("Error in saveActiveAnalysis:", e);
          throw e;
        }
      },
    }),
    {
      name: 'petrophysical-storage', 
      partialize: (state) => ({ localChanges: state.localChanges, activeAnalysisId: state.activeAnalysisId, visualSettings: state.visualSettings }),
    }
  )
);