import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useDocumentationStore = create(
  persist(
    (set, get) => ({
      // Mock Data
      docs: [
          { id: 'd1', title: 'Getting Started with Porosity', category: 'Analysis', content: 'To start a porosity analysis, first import your LAS files into the Data Panel. Then navigate to the Porosity Modeling tab...' },
          { id: 'd2', title: 'Importing Well Logs', category: 'Data Management', content: 'Supported formats include LAS 2.0 and DLIS. To import, navigate to the Data Panel...' },
          { id: 'd3', title: 'Running Correlation Workflows', category: 'Workflows', content: 'Select your reference well and target wells. Adjust the correlation window using the slider...' },
          { id: 'd4', title: 'Model Calibration', category: 'Analysis', content: 'Use core data to calibrate your density or sonic logs. Enter core parameters in the Model Builder.' }
      ],
      faqs: [
          { id: 'f1', question: 'How do I reset my password?', answer: 'Go to settings > security > change password.', category: 'Account', votes: 12 },
          { id: 'f2', question: 'Can I export reports to Excel?', answer: 'Yes, all reports support CSV and Excel export formats.', category: 'Reporting', votes: 8 },
          { id: 'f3', question: 'What matrix density should I use for sandstone?', answer: 'Commonly 2.65 g/cc is used for clean quartz sandstone.', category: 'Analysis', votes: 15 }
      ],
      tutorials: [
          { id: 't1', title: 'Petrophysical Analysis 101', duration: '10:45', level: 'Beginner', views: 1240, category: 'Analysis' },
          { id: 't2', title: 'Advanced Seismic Interpretation', duration: '25:30', level: 'Advanced', views: 850, category: 'Seismic' },
          { id: 't3', title: 'Building Custom Workflows', duration: '15:20', level: 'Intermediate', views: 500, category: 'Workflows' }
      ],
      tickets: [],

      // Actions
      addTicket: (ticket) => set(state => ({
          tickets: [{ ...ticket, id: crypto.randomUUID(), status: 'open', created: new Date().toISOString().split('T')[0] }, ...state.tickets]
      })),
      
      voteFaq: (id) => set(state => ({
          faqs: state.faqs.map(f => f.id === id ? { ...f, votes: f.votes + 1 } : f)
      }))
    }),
    { name: 'documentation-store' }
  )
);