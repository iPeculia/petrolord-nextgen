import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { 
    getWellsByProject, createWell, updateWell, deleteWell, 
    getAnalysesByWell, getWellLogs, getWellDetails,
    uploadFileRecord, getFilesByWell, deleteFileRecord,
    createMarker, getMarkersByWell, updateMarker, deleteMarker,
    getAllWells
} from '@/api/globalDataApi.js';
import useProjectStore from '@/store/projectStore';

export const useGlobalDataStore = create(
  persist(
    (set, get) => ({
      wells: {}, // { wellId: wellData }
      // wellLogs: {}, // REMOVED from initial state here to clarify it's not persisted in LS
      wellLogs: {}, // In-memory cache only
      wellDetails: {}, // { wellId: [ {key, value}, ... ] }
      files: {}, // { wellId: [ fileData, ... ] }
      markers: {}, // { wellId: [ markerData, ... ] }
      analyses: {}, // { analysisId: analysisData }
      activeWell: null,
      activeMarkerId: null, 
      isLoading: false,
      isLogsLoading: false, // New specific loading state
      error: null,
      
      initializeData: async () => {
         const state = get();
         console.log("GlobalDataStore: Initializing...");
         await state.loadWells(null);
         
         // If there is an active well restored from localStorage, ensure we fetch its non-persisted data
         const activeId = get().activeWell;
         if (activeId && get().wells[activeId]) {
             console.log(`GlobalDataStore: Refetching data for restored active well: ${activeId}`);
             state.refreshActiveWellData(activeId);
         }
      },

      loadWells: async (projectId) => {
        set({ isLoading: true, error: null });
        try {
          let wellsArray = [];
          if (projectId) {
             wellsArray = await getWellsByProject(projectId);
          } else {
             wellsArray = await getAllWells();
          }
          
          const newWellsMap = wellsArray.reduce((acc, well) => {
            acc[well.id] = well;
            return acc;
          }, {});
          
          const mergedWells = { ...get().wells, ...newWellsMap };
          set({ wells: mergedWells, isLoading: false });
          
          // Validation: If active well is gone, reset it
          const currentActive = get().activeWell;
          if (currentActive && !mergedWells[currentActive]) {
               console.warn("Active well not found in fresh fetch, resetting.");
               set({ activeWell: null });
          } 
        } catch (error) {
          console.error("Store: Failed to load wells:", error);
          set({ error: error.message, isLoading: false });
        }
      },

      setActiveWell: (wellId) => {
        if (!wellId) {
            set({ activeWell: null });
            return;
        }
        if (!get().wells[wellId]) {
            console.warn(`Store: Attempted to set invalid active well ID: ${wellId}`);
            return;
        }

        set({ activeWell: wellId });
        console.log(`Store: Active well set to: ${wellId}`);
        
        // Trigger data fetch for the new well
        get().refreshActiveWellData(wellId);
      },

      refreshActiveWellData: (wellId) => {
          if (!wellId) return;
          console.log(`Store: Refreshing all data for well ${wellId}...`);
          get().loadLogsForWell(wellId);
          get().loadDetailsForWell(wellId);
          get().loadFilesForWell(wellId);
          get().loadAnalysesForWell(wellId);
          get().loadMarkersForWell(wellId); 
      },

      loadLogsForWell: async (wellId) => {
        set({ isLogsLoading: true });
        try {
          console.log(`Store: Fetching logs for ${wellId} from Supabase...`);
          const logsArray = await getWellLogs(wellId);
          
          const logsMap = logsArray.reduce((acc, log) => {
            acc[log.log_type] = log;
            return acc;
          }, {});
          
          set(state => ({
            wellLogs: { ...state.wellLogs, [wellId]: logsMap },
            isLogsLoading: false
          }));
          console.log(`Store: Loaded ${logsArray.length} logs for ${wellId}.`);
        } catch (error) {
          console.error(`Failed to load logs for well ${wellId}:`, error);
          set(state => ({
            wellLogs: { ...state.wellLogs, [wellId]: {} },
            isLogsLoading: false
          }));
        }
      },

      // ... (Other load functions remain similar) ...

      loadFilesForWell: async (wellId) => {
          try {
              const files = await getFilesByWell(wellId);
              set(state => ({ files: { ...state.files, [wellId]: files } }));
          } catch (error) { console.error(error); }
      },

      loadAnalysesForWell: async (wellId) => {
        try {
          const analysesArray = await getAnalysesByWell(wellId);
          const analysesMap = analysesArray.reduce((acc, analysis) => {
            acc[analysis.id] = analysis;
            return acc;
          }, {});
          set(state => ({ analyses: { ...state.analyses, ...analysesMap } }));
        } catch (error) { console.error(error); }
      },

      loadDetailsForWell: async (wellId) => {
          try {
              const details = await getWellDetails(wellId);
              set(state => ({ wellDetails: { ...state.wellDetails, [wellId]: details } }));
          } catch(e) { console.error(e); }
      },
      
      loadMarkersForWell: async (wellId) => {
        try {
            const markers = await getMarkersByWell(wellId);
            set(state => ({ markers: { ...state.markers, [wellId]: markers } }));
        } catch (error) { console.error(error); }
      },

      // CRUD Actions
      addWell: async (wellData) => {
          let payload = { ...wellData };
          if (!payload.project_id) {
              const currentProject = useProjectStore.getState().currentProject;
              payload.project_id = currentProject?.id || 'demo-project'; 
          }
          const newWell = await createWell(payload);
          set(state => ({ wells: { ...state.wells, [newWell.id]: newWell } }));
          get().setActiveWell(newWell.id);
          return newWell;
      },

      updateWell: async (id, wellData) => {
          const updatedWell = await updateWell(id, wellData);
          set(state => ({ wells: { ...state.wells, [id]: updatedWell } }));
          return updatedWell;
      },

      deleteWell: async (id) => {
          await deleteWell(id);
          set(state => {
              const newWells = { ...state.wells };
              delete newWells[id];
              const newLogs = { ...state.wellLogs };
              delete newLogs[id]; // Clean up memory
              
              let newActive = state.activeWell;
              if (state.activeWell === id) {
                  newActive = null;
                  const remainingIds = Object.keys(newWells);
                  if (remainingIds.length > 0) newActive = remainingIds[0];
              }
              return { wells: newWells, wellLogs: newLogs, activeWell: newActive };
          });
      },

      addLogsToWell: (wellId, logs) => {
        const logsMap = logs.reduce((acc, log) => {
          acc[log.log_type] = log;
          return acc;
        }, {});
        // Optimistic update for UI responsiveness
        set(state => ({
          wellLogs: { ...state.wellLogs, [wellId]: { ...(state.wellLogs[wellId] || {}), ...logsMap } }
        }));
      },
      
      addOrUpdateAnalysis: (analysis) => {
        set(state => ({ analyses: { ...state.analyses, [analysis.id]: analysis } }));
      },
      
      removeAnalysis: (analysisId) => {
        set(state => {
          const newAnalyses = { ...state.analyses };
          delete newAnalyses[analysisId];
          return { analyses: newAnalyses };
        });
      },
      
      // Files & Markers CRUD
      addFile: async (fileData) => {
          const newFile = await uploadFileRecord(fileData);
          const wellId = fileData.well_id;
          set(state => ({ files: { ...state.files, [wellId]: [newFile, ...(state.files[wellId] || [])] } }));
          return newFile;
      },
      removeFile: async (wellId, fileId) => {
          await deleteFileRecord(fileId);
          set(state => ({ files: { ...state.files, [wellId]: state.files[wellId].filter(f => f.id !== fileId) } }));
      },
      addMarker: async (markerData) => {
          const newMarker = await createMarker(markerData);
          const wellId = markerData.well_id;
          set(state => {
              const currentMarkers = state.markers[wellId] || [];
              return { markers: { ...state.markers, [wellId]: [...currentMarkers, newMarker].sort((a,b) => a.depth - b.depth) } };
          });
          return newMarker;
      },
      editMarker: async (markerId, updates) => {
          const updatedMarker = await updateMarker(markerId, updates);
          const wellId = updatedMarker.well_id;
          set(state => {
              const currentMarkers = state.markers[wellId] || [];
              const newMarkers = currentMarkers.map(m => m.id === markerId ? updatedMarker : m).sort((a,b) => a.depth - b.depth);
              return { markers: { ...state.markers, [wellId]: newMarkers } };
          });
          return updatedMarker;
      },
      removeMarker: async (wellId, markerId) => {
          await deleteMarker(markerId);
          set(state => ({ markers: { ...state.markers, [wellId]: (state.markers[wellId] || []).filter(m => m.id !== markerId) } }));
      },
      setActiveMarker: (markerId) => set({ activeMarkerId: markerId }),
    }),
    {
      name: 'petrolord-global-data',
      storage: createJSONStorage(() => localStorage),
      // CRITICAL: Exclude 'wellLogs' from persistence to prevent LocalStorage quota exceeded errors
      partialize: (state) => ({
        wells: state.wells,
        activeWell: state.activeWell,
        // wellLogs: state.wellLogs, // <-- COMMENTED OUT ON PURPOSE
        files: state.files,
        analyses: state.analyses,
        markers: state.markers // Markers are small enough to persist
      }),
    }
  )
);