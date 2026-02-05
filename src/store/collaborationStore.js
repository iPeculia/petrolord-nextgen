import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { format } from 'date-fns';

export const useCollaborationStore = create(
  persist(
    (set, get) => ({
      members: [],
      projects: [],
      resources: [],
      messages: [],
      notifications: [],
      activity: [],
      
      initializeStore: (currentUser) => {
          const state = get();
          if (currentUser && state.members.length === 0) {
              set({
                  members: [{
                      id: currentUser.id,
                      name: currentUser.email?.split('@')[0] || 'Me',
                      email: currentUser.email,
                      role: 'Owner',
                      status: 'online',
                      department: 'Management',
                      joined: format(new Date(), 'yyyy-MM-dd')
                  }]
              });
          }
      },

      addMember: (member) => set(state => {
          const newMember = { ...member, id: crypto.randomUUID(), joined: format(new Date(), 'yyyy-MM-dd'), avatar: member.name[0] };
          get().addActivity('create', 'User', member.name, 'New member added');
          return { members: [...state.members, newMember] };
      }),
      deleteMember: (id) => set(state => ({ members: state.members.filter(m => m.id !== id) })),

      addProject: (project) => set(state => {
          const newProj = { ...project, id: crypto.randomUUID(), created: format(new Date(), 'yyyy-MM-dd'), progress: 0 };
          get().addActivity('create', 'Project', project.name, 'New project created');
          return { projects: [...state.projects, newProj] };
      }),
      deleteProject: (id) => set(state => ({ projects: state.projects.filter(p => p.id !== id) })),

      addResource: (res) => set(state => {
          const newRes = { ...res, id: crypto.randomUUID(), date: format(new Date(), 'yyyy-MM-dd') };
          get().addActivity('upload', 'Resource', res.name, 'File shared');
          return { resources: [...state.resources, newRes] };
      }),
      deleteResource: (id) => set(state => ({ resources: state.resources.filter(r => r.id !== id) })),

      sendMessage: (text) => set(state => ({
          messages: [...state.messages, { id: crypto.randomUUID(), sender: 'Me', content: text, timestamp: new Date().toISOString() }]
      })),

      addActivity: (type, user, resource, details) => set(state => ({
        activity: [{ id: crypto.randomUUID(), type, user, resource, details, timestamp: new Date().toISOString() }, ...state.activity]
      }))
    }),
    { name: 'petrolord-collaboration-v2' }
  )
);