import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAIStore = create(
  persist(
    (set, get) => ({
      models: [
        { id: 'mdl-1', name: 'Litho-Facies Classifier v2', type: 'Classification', accuracy: 0.94, status: 'active', created: '2024-10-15' },
        { id: 'mdl-2', name: 'Permeability Estimator (Log-derived)', type: 'Regression', accuracy: 0.88, status: 'active', created: '2024-11-02' },
        { id: 'mdl-3', name: 'Synthetic Sonic Generator', type: 'Regression', accuracy: 0.91, status: 'training', created: '2024-12-01' }
      ],
      predictions: [],
      recommendations: [
          { id: 'rec-1', title: 'Density Correction Spike', description: 'Abnormal DRHO spikes detected at 2450m. Suggest reviewing washout correction.', type: 'Data Quality', priority: 'High', impact: 'High' },
          { id: 'rec-2', title: 'Water Saturation Model', description: 'Archie parameters (m=2.0) might be underestimating Sw in shaly zones. Try Simandoux.', type: 'Analysis', priority: 'Medium', impact: 'Medium' },
          { id: 'rec-3', title: 'Missing Sonic Log', description: 'DT log missing in interval 3000-3500m. Recommended synthetic generation.', type: 'Data Completeness', priority: 'Low', impact: 'Low' }
      ],
      trainingJobs: [],

      // Actions
      addPrediction: (prediction) => set(state => ({
          predictions: [prediction, ...state.predictions]
      })),

      addModel: (model) => set(state => ({
          models: [...state.models, { ...model, id: crypto.randomUUID(), status: 'idle' }]
      })),

      updateModelStatus: (id, status) => set(state => ({
          models: state.models.map(m => m.id === id ? { ...m, status } : m)
      })),

      removeRecommendation: (id) => set(state => ({
          recommendations: state.recommendations.filter(r => r.id !== id)
      }))
    }),
    {
      name: 'ai-insights-store'
    }
  )
);