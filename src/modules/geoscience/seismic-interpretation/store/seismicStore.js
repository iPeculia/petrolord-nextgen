import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export const useSeismicStore = create(immer((set, get) => ({
  // Core data
  seismicData: null, // { traces: [[]], time: [], traceCount, sampleCount }
  fileName: null,
  
  // SEG-Y specific data
  textHeader: null,
  binaryHeader: null,
  traceHeaders: [],
  
  // Well Log Data
  wellLogData: null, // { wellInfo, curveInfo, data }

  // Interpretation data
  horizons: [], // { name: string, picks: [{trace: int, time: float}], color: string }
  
  // UI State
  loading: false,
  error: null,
  selectedTraceIndex: null,

  viewSettings: {
    zoom: 1,
    pan: { x: 0, y: 0 },
    gain: 1,
    wiggleColor: '#FFFFFF',
    positiveFill: 'rgba(0, 0, 0, 0.7)',
    negativeFill: 'rgba(255, 0, 0, 0.7)',
  },

  setSegyData: (data, fileName) => set(state => {
    state.seismicData = {
      traces: data.traces,
      time: data.time,
      traceCount: data.traceCount,
      sampleCount: data.sampleCount,
    };
    state.textHeader = data.textHeader || null;
    state.binaryHeader = data.binaryHeader || null;
    state.traceHeaders = data.traceHeaders || [];
    state.fileName = fileName;
    state.horizons = [];
    state.loading = false;
    state.error = null;
    state.selectedTraceIndex = null;
  }),
  
  setWellLogData: (data) => set(state => {
      state.wellLogData = data;
  }),

  setLoading: (loading) => set(state => { state.loading = loading; }),
  setError: (error) => set(state => { state.error = error; state.loading = false; }),

  addHorizon: (name, color) => set(state => {
    if (!state.horizons.find(h => h.name === name)) {
      state.horizons.push({ name, color, picks: [] });
    }
  }),

  addPick: (horizonName, traceIndex, time) => set(state => {
    const horizon = state.horizons.find(h => h.name === horizonName);
    if (horizon) {
      const existingPickIndex = horizon.picks.findIndex(p => p.trace === traceIndex);
      if (existingPickIndex > -1) {
        horizon.picks[existingPickIndex].time = time;
      } else {
        horizon.picks.push({ trace: traceIndex, time });
      }
      horizon.picks.sort((a, b) => a.trace - b.trace);
    }
  }),
  
  selectTrace: (traceIndex) => set(state => {
      if(traceIndex >= 0 && traceIndex < get().seismicData?.traceCount){
          state.selectedTraceIndex = traceIndex;
      }
  }),

  setViewSettings: (settings) => set(state => {
    state.viewSettings = { ...state.viewSettings, ...settings };
  }),
  
  resetState: () => set(state => {
    state.seismicData = null;
    state.fileName = null;
    state.textHeader = null;
    state.binaryHeader = null;
    state.traceHeaders = [];
    state.wellLogData = null;
    state.horizons = [];
    state.loading = false;
    state.error = null;
    state.selectedTraceIndex = null;
  }),
})));