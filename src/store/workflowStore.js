import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useWorkflowStore = create(
  persist(
    (set, get) => ({
      workflows: [
        {
            id: 'wf-demo-1',
            name: 'Standard Log Normalization',
            description: 'Normalizes raw log curves using histograms relative to a baseline well.',
            status: 'active',
            lastRun: '2024-12-01T10:30:00Z',
            runCount: 12,
            successRate: 100,
            steps: [
                { id: 1, name: 'Load LAS File', type: 'input', params: { source: 'database' } },
                { id: 2, name: 'Detect Outliers', type: 'process', params: { method: 'z-score', threshold: 3 } },
                { id: 3, name: 'Apply Histogram Shift', type: 'process', params: { reference: 'well-001' } },
                { id: 4, name: 'Save Normalized Curves', type: 'output', params: { format: 'las' } }
            ],
            type: 'Data Processing',
            category: 'Preprocessing'
        },
        {
            id: 'wf-demo-2',
            name: 'Lithology Prediction (Auto)',
            description: 'Runs ML classifier on GR, RES, NPHI, RHOB logs to predict lithofacies.',
            status: 'idle',
            lastRun: '2024-11-28T14:15:00Z',
            runCount: 5,
            successRate: 80,
            steps: [
                { id: 1, name: 'Input Logs', type: 'input', params: { curves: ['GR', 'RES', 'NPHI', 'RHOB'] } },
                { id: 2, name: 'Feature Scaling', type: 'process', params: { method: 'min-max' } },
                { id: 3, name: 'Random Forest Classifier', type: 'analysis', params: { model_id: 'rf-v2' } },
                { id: 4, name: 'Export Facies Track', type: 'output', params: { track_name: 'FACIES_PRED' } }
            ],
            type: 'Analysis',
            category: 'Interpretation'
        }
      ],
      executionHistory: [],
      templates: [
          { 
              id: 'tpl-1', 
              name: 'Basic QC Workflow', 
              description: 'Standard quality control checks for new well data (Gaps, Spikes, Limits).', 
              category: 'QC', 
              author: 'Petrolord Team', 
              rating: 4.8, 
              usageCount: 154, 
              steps: [
                  { id: 101, name: 'Import LAS', type: 'input', params: {} },
                  { id: 102, name: 'Check Nulls', type: 'process', params: { threshold: 0.1 } },
                  { id: 103, name: 'Check Spikes', type: 'process', params: { window: 5 } },
                  { id: 104, name: 'Generate QC Report', type: 'output', params: { format: 'pdf' } }
              ] 
          },
          { 
              id: 'tpl-2', 
              name: 'Porosity-Permeability Modeling', 
              description: 'Calculate phi-k relationships and derived curves based on core calibration.', 
              category: 'Petrophysics', 
              author: 'Reservoir Team', 
              rating: 4.5, 
              usageCount: 89, 
              steps: [
                   { id: 201, name: 'Load Core Data', type: 'input', params: {} },
                   { id: 202, name: 'Load Log Data', type: 'input', params: {} },
                   { id: 203, name: 'Depth Shift', type: 'process', params: { method: 'auto' } },
                   { id: 204, name: 'Regression Analysis', type: 'analysis', params: { type: 'exponential' } },
                   { id: 205, name: 'Export Model', type: 'output', params: {} }
              ] 
          },
      ],
      scheduledWorkflows: [],
      activeWorkflowId: null,

      // Workflow Actions
      addWorkflow: (workflow) => set((state) => ({ 
          workflows: [...state.workflows, { ...workflow, id: workflow.id || crypto.randomUUID(), status: 'idle', runCount: 0, successRate: 0 }] 
      })),
      
      updateWorkflow: (id, updates) => set((state) => ({
          workflows: state.workflows.map(w => w.id === id ? { ...w, ...updates } : w)
      })),

      deleteWorkflow: (id) => set((state) => ({
          workflows: state.workflows.filter(w => w.id !== id)
      })),

      setActiveWorkflow: (id) => set({ activeWorkflowId: id }),

      // Template Actions
      saveAsTemplate: (workflow, templateMeta) => set(state => ({
          templates: [...state.templates, {
              id: crypto.randomUUID(),
              name: templateMeta.name || workflow.name,
              description: templateMeta.description || workflow.description,
              category: templateMeta.category || 'Custom',
              steps: workflow.steps,
              author: 'User',
              rating: 0,
              usageCount: 0
          }]
      })),

      // Execution Actions
      runWorkflow: (id) => {
          const workflow = get().workflows.find(w => w.id === id);
          if (!workflow) return;

          const executionId = crypto.randomUUID();
          const newExecution = {
              id: executionId,
              workflowId: id,
              workflowName: workflow.name,
              startTime: new Date().toISOString(),
              status: 'running',
              executedBy: 'Current User',
              logs: []
          };

          set(state => ({
              executionHistory: [newExecution, ...state.executionHistory]
          }));

          return executionId;
      },

      completeExecution: (executionId, status, logs) => set(state => ({
          executionHistory: state.executionHistory.map(ex => 
              ex.id === executionId 
                ? { ...ex, status, endTime: new Date().toISOString(), logs, duration: '45s', result: status === 'completed' ? 'Success' : 'Failed' } 
                : ex
          )
      })),

      // Scheduling Actions
      addSchedule: (schedule) => set((state) => {
          const newSchedule = { ...schedule, id: crypto.randomUUID(), status: 'active' };
          return {
             scheduledWorkflows: [...state.scheduledWorkflows, newSchedule]
          };
      }),
      
      updateSchedule: (id, updates) => set(state => ({
          scheduledWorkflows: state.scheduledWorkflows.map(s => s.id === id ? { ...s, ...updates } : s)
      })),

      toggleSchedule: (id) => set(state => ({
          scheduledWorkflows: state.scheduledWorkflows.map(s => 
              s.id === id ? { ...s, status: s.status === 'active' ? 'paused' : 'active' } : s
          )
      })),

      deleteSchedule: (id) => set(state => ({
          scheduledWorkflows: state.scheduledWorkflows.filter(s => s.id !== id)
      }))
    }),
    {
      name: 'workflow-store',
    }
  )
);