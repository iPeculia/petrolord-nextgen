/**
 * Service for managing Volumetrics Projects
 */
import { supabase } from "@/lib/customSupabaseClient";

export const ProjectManager = {
    saveProject: async (user, state) => {
        try {
            if (!user) return false;
            
            const projectData = {
                name: state.project.name,
                description: state.project.description,
                status: state.project.status,
                data: state.data,
                updated_at: new Date().toISOString(),
                owner_id: user.id
            };

            // If project exists, update
            if (state.project.id) {
                const { error } = await supabase
                    .from('projects')
                    .update(projectData)
                    .eq('id', state.project.id);
                
                if (error) throw error;
            } else {
                // Create new
                const { data, error } = await supabase
                    .from('projects')
                    .insert([projectData])
                    .select()
                    .single();
                
                if (error) throw error;
                return data;
            }

            return true;
        } catch (error) {
            console.error("Project Save Error:", error);
            return false;
        }
    },

    loadProject: async (projectId) => {
        try {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .eq('id', projectId)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error("Project Load Error:", error);
            return null;
        }
    }
};