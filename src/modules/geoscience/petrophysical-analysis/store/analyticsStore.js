import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAnalyticsStore = create(
  persist(
    (set, get) => ({
      analyses: [],
      customMetrics: [
          { id: 'm1', name: 'Shale Volume (GR)', formula: '(GR - GRmin) / (GRmax - GRmin)', created: '2024-10-15', lastCalc: '2024-12-01' },
          { id: 'm2', name: 'Pay Flag', formula: 'PHI > 0.1 AND SW < 0.5', created: '2024-11-02', lastCalc: '2024-12-04' }
      ],
      reports: [],
      
      // Actions
      runAnalysis: (config) => {
          const newAnalysis = {
              id: crypto.randomUUID(),
              ...config,
              date: new Date().toISOString(),
              status: 'Completed',
              resultSummary: { 
                  min: Math.random() * 10, 
                  max: Math.random() * 100 + 50, 
                  avg: Math.random() * 50 + 20 
              }
          };
          set(state => ({ analyses: [newAnalysis, ...state.analyses] }));
          return newAnalysis;
      },

      addCustomMetric: (metric) => set(state => ({ 
          customMetrics: [...state.customMetrics, { ...metric, id: crypto.randomUUID(), created: new Date().toISOString().split('T')[0], lastCalc: 'Never' }] 
      })),

      deleteCustomMetric: (id) => set(state => ({
          customMetrics: state.customMetrics.filter(m => m.id !== id)
      })),

      generateReport: (config) => {
          const newReport = {
              id: crypto.randomUUID(),
              ...config,
              generatedAt: new Date().toISOString(),
              url: '#' // Mock download link
          };
          set(state => ({ reports: [newReport, ...state.reports] }));
      }
    }),
    {
      name: 'petrolord-analytics-storage',
    }
  )
);