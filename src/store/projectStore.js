import { create } from 'zustand';
import { projectService } from '@/services/projectService';
import { toast } from '@/components/ui/use-toast';

const useProjectStore = create((set, get) => ({
  projects: [],
  currentProject: null,
  members: [],
  metadata: [],
  loading: false,
  error: null,

  fetchProjects: async () => {
    set({ loading: true, error: null });
    try {
      const data = await projectService.getProjects();
      set({ projects: data || [], loading: false });
      
      // Restore active project
      const savedId = localStorage.getItem('activeProjectId');
      if (savedId && data) {
          const saved = data.find(p => p.id === savedId);
          if (saved) {
              set({ currentProject: saved });
              get().fetchProjectDetails(savedId);
          } else if (data.length > 0 && !get().currentProject) {
              set({ currentProject: data[0] });
              get().fetchProjectDetails(data[0].id);
          }
      } else if (data && data.length > 0 && !get().currentProject) {
         set({ currentProject: data[0] });
         get().fetchProjectDetails(data[0].id);
      }
    } catch (error) {
      set({ error: error.message, loading: false });
      console.error("Fetch projects error:", error);
    }
  },

  fetchProjectDetails: async (projectId) => {
      try {
          const { members, metadata } = await projectService.getProjectDetails(projectId);
          set({ members, metadata });
      } catch (e) {
          console.error("Error fetching project details", e);
      }
  },

  setCurrentProject: (project) => {
    if (!project) {
        localStorage.removeItem('activeProjectId');
        set({ currentProject: null, members: [], metadata: [] });
        return;
    }
    localStorage.setItem('activeProjectId', project.id);
    set({ currentProject: project });
    get().fetchProjectDetails(project.id);
  },

  createProject: async (formData) => {
    set({ loading: true });
    try {
        const newProject = await projectService.createProject(formData);
        set(state => ({ 
            projects: [newProject, ...state.projects],
            currentProject: newProject,
            loading: false 
        }));
        get().fetchProjectDetails(newProject.id);
        toast({ title: "Project created", description: `"${newProject.name}" is now active.` });
        return newProject;
    } catch (error) {
        set({ loading: false });
        toast({ title: "Creation failed", description: error.message, variant: "destructive" });
        throw error;
    }
  },

  updateProject: async (id, updates) => {
      set({ loading: true });
      try {
          const updated = await projectService.updateProject(id, updates);
          set(state => ({
              projects: state.projects.map(p => p.id === id ? updated : p),
              currentProject: state.currentProject?.id === id ? updated : state.currentProject,
              loading: false
          }));
          toast({ title: "Project updated" });
      } catch (error) {
          set({ loading: false });
          toast({ title: "Update failed", description: error.message, variant: "destructive" });
      }
  },

  deleteProject: async (id) => {
      set({ loading: true });
      try {
          await projectService.deleteProject(id);
          set(state => {
              const newProjects = state.projects.filter(p => p.id !== id);
              const nextProject = state.currentProject?.id === id ? (newProjects[0] || null) : state.currentProject;
              if(nextProject) localStorage.setItem('activeProjectId', nextProject.id);
              else localStorage.removeItem('activeProjectId');
              
              return {
                  projects: newProjects,
                  currentProject: nextProject,
                  loading: false
              };
          });
          toast({ title: "Project deleted" });
      } catch (error) {
          set({ loading: false });
          toast({ title: "Delete failed", description: error.message, variant: "destructive" });
      }
  },

  addMember: async (projectId, email, role = 'viewer') => {
      try {
          await projectService.addMember(projectId, email, role);
          get().fetchProjectDetails(projectId);
          toast({ title: "Member added" });
      } catch (e) {
          toast({ title: "Failed to add member", description: e.message, variant: "destructive" });
      }
  },

  removeMember: async (projectId, userId) => {
      try {
          await projectService.removeMember(projectId, userId);
          set(state => ({ members: state.members.filter(m => m.user_id !== userId) }));
          toast({ title: "Member removed" });
      } catch (e) {
          toast({ title: "Failed to remove member", variant: "destructive" });
      }
  },

  updateMemberRole: async (projectId, userId, role) => {
      try {
          await projectService.updateMemberRole(projectId, userId, role);
          set(state => ({ members: state.members.map(m => m.user_id === userId ? { ...m, role } : m) }));
          toast({ title: "Role updated" });
      } catch (e) {
          toast({ title: "Failed to update role", variant: "destructive" });
      }
  },

  setMetadata: async (projectId, key, value) => {
      try {
          const data = await projectService.setMetadata(projectId, key, value);
          if (get().currentProject?.id === projectId) {
              const current = get().metadata;
              const exists = current.find(m => m.key === key);
              set({ metadata: exists ? current.map(m => m.key === key ? data : m) : [...current, data] });
          }
          toast({ title: "Metadata saved" });
      } catch (e) {
          toast({ title: "Error saving metadata", variant: "destructive" });
      }
  },

  deleteMetadata: async (projectId, key) => {
      try {
          await projectService.deleteMetadata(projectId, key);
          if (get().currentProject?.id === projectId) {
              set({ metadata: get().metadata.filter(m => m.key !== key) });
          }
      } catch (e) {
          console.error(e);
      }
  }
}));

export default useProjectStore;