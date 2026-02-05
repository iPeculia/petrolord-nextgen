// Utility for safely handling local storage for the well planning module

const STORAGE_KEY_PREFIX = 'well_planning_';

export const geometryStorage = {
  // Save well geometry sections
  saveSections: (wellId, sections) => {
    if (!wellId) return;
    try {
      const key = `${STORAGE_KEY_PREFIX}${wellId}_sections`;
      localStorage.setItem(key, JSON.stringify(sections));
    } catch (e) {
      console.error("Failed to save sections to local storage", e);
    }
  },

  // Load well geometry sections
  getSections: (wellId) => {
    if (!wellId) return [];
    try {
      const key = `${STORAGE_KEY_PREFIX}${wellId}_sections`;
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error("Failed to load sections from local storage", e);
      return [];
    }
  },

  // Save full project state backup
  saveProjectState: (projectId, state) => {
    if (!projectId) return;
    try {
      const key = `${STORAGE_KEY_PREFIX}project_${projectId}`;
      localStorage.setItem(key, JSON.stringify(state));
    } catch (e) {
      console.error("Failed to save project state", e);
    }
  },

  // Get full project state backup
  getProjectState: (projectId) => {
    if (!projectId) return null;
    try {
      const key = `${STORAGE_KEY_PREFIX}project_${projectId}`;
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      console.error("Failed to load project state", e);
      return null;
    }
  }
};