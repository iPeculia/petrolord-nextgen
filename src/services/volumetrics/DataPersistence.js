import { LoggingService } from "@/services/common/LoggingService";

const STORAGE_KEY_PREFIX = 'volumetrics_project_';
const INDEX_KEY = 'volumetrics_projects_index';

/**
 * DataPersistence Service
 * Handles low-level storage operations (LocalStorage for Phase 5, extendable to Supabase)
 */
export const DataPersistence = {
    saveProject: async (projectData) => {
        try {
            const id = projectData.project.id;
            const key = `${STORAGE_KEY_PREFIX}${id}`;
            const serialized = JSON.stringify({
                ...projectData,
                lastModified: new Date().toISOString()
            });

            localStorage.setItem(key, serialized);
            
            // Update Index
            DataPersistence._updateIndex(id, projectData.project.name);
            
            LoggingService.info(`Project saved locally: ${id}`);
            return true;
        } catch (error) {
            LoggingService.error("Failed to save project", error);
            throw error;
        }
    },

    loadProject: async (id) => {
        try {
            const key = `${STORAGE_KEY_PREFIX}${id}`;
            const data = localStorage.getItem(key);
            if (!data) throw new Error("Project not found");
            return JSON.parse(data);
        } catch (error) {
            LoggingService.error("Failed to load project", error);
            throw error;
        }
    },

    deleteProject: async (id) => {
        try {
            const key = `${STORAGE_KEY_PREFIX}${id}`;
            localStorage.removeItem(key);
            
            // Remove from Index
            const index = DataPersistence._getIndex();
            const newIndex = index.filter(p => p.id !== id);
            localStorage.setItem(INDEX_KEY, JSON.stringify(newIndex));
            
            LoggingService.info(`Project deleted locally: ${id}`);
            return true;
        } catch (error) {
            LoggingService.error("Failed to delete project", error);
            throw error;
        }
    },

    listProjects: () => {
        return DataPersistence._getIndex();
    },

    _getIndex: () => {
        try {
            return JSON.parse(localStorage.getItem(INDEX_KEY) || '[]');
        } catch {
            return [];
        }
    },

    _updateIndex: (id, name) => {
        const index = DataPersistence._getIndex();
        const existing = index.findIndex(p => p.id === id);
        const entry = { id, name, lastModified: new Date().toISOString() };
        
        if (existing >= 0) {
            index[existing] = entry;
        } else {
            index.push(entry);
        }
        localStorage.setItem(INDEX_KEY, JSON.stringify(index));
    }
};